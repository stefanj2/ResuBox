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

const fromEmailIncasso = process.env.FROM_EMAIL_INCASSO || 'Incasso Afdeling <incasso@resubox.nl>';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
  const results: {
    processed: number;
    errors: string[];
    actions: string[];
  } = {
    processed: 0,
    errors: [],
    actions: [],
  };

  try {
    const orders = await getOrdersDueForAction();

    for (const order of orders) {
      const orderAge = now - new Date(order.created_at).getTime();

      try {
        switch (order.status) {
          case 'nieuw':
            if (orderAge >= timing.invoice && !order.invoice_sent_at) {
              if (!order.stripe_session_id) {
                const paymentResult = await createCheckoutSession({
                  orderId: order.id,
                  amount: order.amount,
                  description: `ResuBox by Dune Legal - ${order.dossier_number}`,
                  customerEmail: order.customer_email,
                  customerName: order.customer_name,
                  dossierNumber: order.dossier_number || order.id,
                  successUrl: `${siteUrl}/betaald/${order.id}`,
                  cancelUrl: `${siteUrl}/betalen/${order.id}`,
                });

                if (paymentResult.success && paymentResult.sessionId && paymentResult.checkoutUrl) {
                  await updateOrder(order.id, {
                    stripe_session_id: paymentResult.sessionId,
                    payment_link: paymentResult.checkoutUrl,
                  });
                  order.payment_link = paymentResult.checkoutUrl;
                  await addOrderAction(order.id, 'payment_created', 'Betaallink aangemaakt via Stripe', 'cron');
                }
              }

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
                await addOrderAction(order.id, 'email_sent', 'Factuur met betaallink automatisch verstuurd', 'cron');
                results.actions.push(`${order.dossier_number}: Factuur verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen factuur`);
              }
            }
            break;

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
                await addOrderAction(order.id, 'email_sent', '1e herinnering automatisch verstuurd', 'cron');
                results.actions.push(`${order.dossier_number}: 1e herinnering verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen 1e herinnering`);
              }
            }
            break;

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
                await addOrderAction(order.id, 'email_sent', 'WIK-brief (2e herinnering) automatisch verstuurd', 'cron');
                results.actions.push(`${order.dossier_number}: WIK-brief verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen WIK-brief`);
              }
            }
            break;

          case 'herinnering_2':
            if (orderAge >= timing.incasso && !order.incasso_sent_at) {
              const incassoPayment = await createCheckoutSession({
                orderId: order.id,
                amount: 42.0,
                description: `ResuBox by Dune Legal - ${order.dossier_number}`,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                dossierNumber: order.dossier_number || order.id,
                successUrl: `${siteUrl}/betaald/${order.id}`,
                cancelUrl: `${siteUrl}/betalen/${order.id}`,
              });

              if (incassoPayment.success && incassoPayment.sessionId && incassoPayment.checkoutUrl) {
                await updateOrder(order.id, {
                  stripe_session_id: incassoPayment.sessionId,
                  payment_link: incassoPayment.checkoutUrl,
                });
                order.payment_link = incassoPayment.checkoutUrl;
                await addOrderAction(order.id, 'payment_created', 'Nieuwe betaallink aangemaakt voor €42,00', 'cron');
              }

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

              const template = getEmailTemplate(order, 'incasso');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
                from: fromEmailIncasso,
              });

              if (result.success) {
                await updateOrder(order.id, {
                  status: 'incasso_overgedragen',
                  incasso_sent_at: new Date().toISOString(),
                });
                await addOrderAction(order.id, 'email_sent', 'Incasso-notificatie email verstuurd', 'cron');
                await addOrderAction(
                  order.id,
                  'status_changed',
                  'Status gewijzigd naar incasso_overgedragen - dossier overgedragen aan Justus Collect',
                  'cron'
                );
                results.actions.push(`${order.dossier_number}: Incasso overgedragen`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen incasso-notificatie`);
              }
            }
            break;
        }

        results.processed++;
      } catch (orderError) {
        console.error(`Error processing order ${order.id}:`, orderError);
        results.errors.push(`${order.dossier_number}: Onbekende fout`);
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
