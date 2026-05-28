import { NextRequest, NextResponse } from 'next/server';
import {
  addOrderAction,
  getOrdersDueForAction,
  updateOrder,
} from '@/lib/orders';
import { sendEmail } from '@/lib/resend';
import { getEmailTemplate } from '@/lib/emailTemplates';
import { createCheckoutSession } from '@/lib/stripe';
import { createCase } from '@/lib/justusCollect';
import { EMAIL_FLOW_TIMING, EMAIL_FLOW_TIMING_TEST } from '@/lib/orderStatusConfig';
import { sendSmsReminder1, sendSmsReminder2 } from '@/lib/sms';
import { shouldUseJustus, amountWithSurcharge } from '@/lib/collections';
import { localizedPath, type Locale } from '@/i18n/routing';

const fromEmailIncasso = process.env.FROM_EMAIL_INCASSO || 'Incasso Afdeling <incasso@resubox.com>';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Debt-collection flow per order:
 *
 *  T+0     download → status `nieuw`
 *  T+24h   invoice email             → status `factuur_verstuurd`
 *  T+3d    reminder_1 (friendly)     → status `herinnering_1`
 *  T+7d    reminder_2 (firm) + SMS1  → status `herinnering_2`
 *  T+10d   reminder_3 (pre-aanmaning)→ status `herinnering_3`
 *  T+14d   wik (formal WIK) + SMS2   → status keeps `herinnering_3`,
 *                                       wik_sent_at recorded in reminder_3 column
 *  T+28d   NL → Justus Collect       → status `incasso_overgedragen`
 *          non-NL → manual review    → status `incasso_manual_review`
 *
 * Each step is idempotent (guarded by a `*_sent_at` timestamp) and locale-aware
 * (email / SMS templates dispatch on `order.cv_data.meta.locale`).
 */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const secretFromQuery = request.nextUrl.searchParams.get('secret');
  const testMode = request.nextUrl.searchParams.get('testMode') === 'true';

  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretFromQuery === process.env.CRON_SECRET;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timing = testMode ? EMAIL_FLOW_TIMING_TEST : EMAIL_FLOW_TIMING;
  const now = Date.now();
  const results = {
    processed: 0,
    errors: [] as string[],
    actions: [] as string[],
  };

  try {
    const orders = await getOrdersDueForAction();

    for (const order of orders) {
      const orderAge = now - new Date(order.created_at).getTime();
      const orderLocale = (order.locale ?? order.cv_data?.meta?.locale ?? 'nl') as Locale;
      const paymentUrl = `${siteUrl}${localizedPath('/betalen/[id]', orderLocale, { id: order.id })}`;

      const ensurePaymentLink = async (): Promise<string | null> => {
        if (order.payment_link) return order.payment_link;
        const checkout = await createCheckoutSession({
          orderId: order.id,
          amount: order.amount,
          description: `ResuBox - ${order.dossier_number}`,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          dossierNumber: order.dossier_number || order.id,
          successUrl: `${siteUrl}${localizedPath('/betaald/[id]', orderLocale, { id: order.id })}`,
          cancelUrl: paymentUrl,
          locale: orderLocale,
        });
        if (!checkout.success || !checkout.sessionId || !checkout.checkoutUrl) return null;
        await updateOrder(order.id, {
          stripe_session_id: checkout.sessionId,
          payment_link: checkout.checkoutUrl,
        });
        order.payment_link = checkout.checkoutUrl;
        await addOrderAction(order.id, 'payment_created', 'Betaallink aangemaakt via Stripe', 'cron');
        return checkout.checkoutUrl;
      };

      const sendSmsIfPossible = async (
        kind: 'reminder_1' | 'reminder_2',
        timestampField: 'sms_1_sent_at' | 'sms_2_sent_at'
      ) => {
        if (!order.customer_phone) {
          // No phone on file — skip silently but log so it shows up in admin.
          await addOrderAction(
            order.id,
            'manual_action',
            `SMS overgeslagen (geen telefoonnummer): ${kind}`,
            'cron'
          );
          return;
        }
        // Link to the payment page (mints a fresh session on click), not a raw
        // Stripe session URL that expires after 24h.
        const sms = kind === 'reminder_1'
          ? await sendSmsReminder1(order, paymentUrl)
          : await sendSmsReminder2(order, paymentUrl);
        await updateOrder(order.id, { [timestampField]: new Date().toISOString() });
        if (sms.success) {
          await addOrderAction(order.id, 'sms_sent', `SMS ${kind} verstuurd (${sms.messageId ?? 'no-id'})`, 'cron');
          results.actions.push(`${order.dossier_number}: SMS ${kind} verstuurd`);
        } else {
          await addOrderAction(order.id, 'sms_failed', `SMS ${kind} mislukt: ${sms.error}`, 'cron');
          results.errors.push(`${order.dossier_number}: SMS ${kind} mislukt`);
        }
      };

      try {
        switch (order.status) {
          // ─── T+24h: factuur ─────────────────────────────────────────
          case 'nieuw':
            if (orderAge >= timing.invoice && !order.invoice_sent_at) {
              await ensurePaymentLink();
              const template = getEmailTemplate(order, 'invoice');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await updateOrder(order.id, {
                  status: 'factuur_verstuurd',
                  invoice_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', `Factuur verstuurd (${orderLocale})`, 'cron');
                results.actions.push(`${order.dossier_number}: Factuur verstuurd (${orderLocale})`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen factuur`);
              }
            }
            break;

          // ─── T+3d: reminder 1 (friendly) ───────────────────────────
          case 'factuur_verstuurd':
            if (orderAge >= timing.reminder_1 && !order.reminder_1_sent_at) {
              const template = getEmailTemplate(order, 'reminder_1');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await updateOrder(order.id, {
                  status: 'herinnering_1',
                  reminder_1_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', `1e herinnering verstuurd (${orderLocale})`, 'cron');
                results.actions.push(`${order.dossier_number}: 1e herinnering verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen 1e herinnering`);
              }
            }
            break;

          // ─── T+7d: reminder 2 (firm) + SMS 1 ───────────────────────
          case 'herinnering_1':
            if (orderAge >= timing.reminder_2 && !order.reminder_2_sent_at) {
              const template = getEmailTemplate(order, 'reminder_2');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await updateOrder(order.id, {
                  status: 'herinnering_2',
                  reminder_2_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', `2e herinnering verstuurd (${orderLocale})`, 'cron');
                results.actions.push(`${order.dossier_number}: 2e herinnering verstuurd`);

                // SMS 1 fires in parallel with the firm email
                if (orderAge >= timing.sms_1 && !order.sms_1_sent_at) {
                  await sendSmsIfPossible('reminder_1', 'sms_1_sent_at');
                }
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen 2e herinnering`);
              }
            }
            break;

          // ─── T+10d: pre-aanmaning ──────────────────────────────────
          case 'herinnering_2':
            if (orderAge >= timing.reminder_3 && !order.reminder_3_sent_at) {
              const template = getEmailTemplate(order, 'reminder_3');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await updateOrder(order.id, {
                  status: 'herinnering_3',
                  reminder_3_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', `Pre-aanmaning verstuurd (${orderLocale})`, 'cron');
                results.actions.push(`${order.dossier_number}: Pre-aanmaning verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen pre-aanmaning`);
              }
            }
            break;

          // ─── T+14d: formal WIK aanmaning + SMS 2 ───────────────────
          //          + T+28d: collections (Justus NL, manual review elsewhere)
          case 'herinnering_3':
            // Step 4b: WIK email (T+14d). reminder_3_sent_at is set, so we
            // detect WIK by checking the order is in herinnering_3 status AND
            // we haven't sent SMS 2 yet (which fires alongside WIK).
            if (orderAge >= timing.wik && !order.sms_2_sent_at) {
              const template = getEmailTemplate(order, 'wik');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await addOrderAction(order.id, 'email_sent', `WIK-aanmaning verstuurd (${orderLocale})`, 'cron');
                results.actions.push(`${order.dossier_number}: WIK-aanmaning verstuurd`);

                // SMS 2 fires in parallel with WIK email
                await sendSmsIfPossible('reminder_2', 'sms_2_sent_at');
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen WIK`);
              }
            }

            // Step 5: incasso at T+28d (= 14d grace after WIK).
            if (orderAge >= timing.incasso && !order.incasso_sent_at) {
              const surchargedAmount = amountWithSurcharge(42.0, orderLocale);

              // Refresh the payment link with the higher (surcharged) amount.
              const incassoCheckout = await createCheckoutSession({
                orderId: order.id,
                amount: surchargedAmount,
                description: `ResuBox - ${order.dossier_number}`,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                dossierNumber: order.dossier_number || order.id,
                successUrl: `${siteUrl}${localizedPath('/betaald/[id]', orderLocale, { id: order.id })}`,
                cancelUrl: paymentUrl,
                locale: orderLocale,
              });

              if (incassoCheckout.success && incassoCheckout.sessionId && incassoCheckout.checkoutUrl) {
                await updateOrder(order.id, {
                  stripe_session_id: incassoCheckout.sessionId,
                  payment_link: incassoCheckout.checkoutUrl,
                  amount: surchargedAmount,
                });
                order.payment_link = incassoCheckout.checkoutUrl;
                order.amount = surchargedAmount;
                await addOrderAction(
                  order.id,
                  'payment_created',
                  `Betaallink bijgewerkt naar incassobedrag (${surchargedAmount})`,
                  'cron'
                );
              }

              if (shouldUseJustus(orderLocale)) {
                const justusResult = await createCase(order);
                if (justusResult.success) {
                  await updateOrder(order.id, {
                    justus_case_id: justusResult.caseId,
                    justus_case_number: justusResult.caseNumber,
                  });
                  await addOrderAction(
                    order.id,
                    'manual_action',
                    `Incassodossier aangemaakt bij Justus Collect (${justusResult.caseNumber})`,
                    'cron'
                  );
                } else {
                  await addOrderAction(
                    order.id,
                    'manual_action',
                    `Justus Collect aanmelding mislukt: ${justusResult.error}`,
                    'cron'
                  );
                }
              } else {
                await addOrderAction(
                  order.id,
                  'manual_action',
                  `Geen incassopartner geconfigureerd voor locale ${orderLocale} — handmatige review nodig`,
                  'cron'
                );
              }

              const template = getEmailTemplate(order, 'incasso');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
                from: fromEmailIncasso,
              });

              const newStatus = shouldUseJustus(orderLocale)
                ? 'incasso_overgedragen'
                : 'incasso_manual_review';

              if (result.success) {
                await updateOrder(order.id, {
                  status: newStatus,
                  incasso_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', `Incasso-notificatie verstuurd (${orderLocale})`, 'cron');
                await addOrderAction(
                  order.id,
                  'status_changed',
                  `Status → ${newStatus}`,
                  'cron'
                );
                results.actions.push(`${order.dossier_number}: ${newStatus}`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen incasso-notificatie`);
              }
            }
            break;
        }

        results.processed++;
      } catch (orderError) {
        console.error(`Error processing order ${order.id}:`, orderError);
        results.errors.push(`${order.dossier_number}: ${orderError instanceof Error ? orderError.message : 'Onbekende fout'}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      testMode,
    });
  } catch (error) {
    console.error('Cron process error:', error);
    return NextResponse.json(
      { error: 'Interne serverfout', details: String(error) },
      { status: 500 }
    );
  }
}
