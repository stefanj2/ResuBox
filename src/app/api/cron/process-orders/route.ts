import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { getEmailTemplate } from '@/lib/emailTemplates';
import { createPayment } from '@/lib/mollie';
import { CVOrder, OrderStatus } from '@/types/admin';
import { EMAIL_FLOW_TIMING, EMAIL_FLOW_TIMING_TEST } from '@/lib/orderStatusConfig';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  // Verify cron secret via Authorization header (Vercel Cron) or query param (manual)
  const authHeader = request.headers.get('Authorization');
  const secretFromQuery = request.nextUrl.searchParams.get('secret');
  const testMode = request.nextUrl.searchParams.get('testMode') === 'true';

  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretFromQuery === process.env.CRON_SECRET;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database niet geconfigureerd' },
      { status: 500 }
    );
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
    // Get all orders that are not paid or afgeboekt
    const { data: orders, error } = await supabase
      .from('cv_orders')
      .select('*')
      .not('status', 'in', '("betaald","afgeboekt")');

    if (error || !orders) {
      return NextResponse.json({ error: 'Fout bij ophalen orders' }, { status: 500 });
    }

    for (const orderData of orders) {
      const order = orderData as CVOrder;
      const orderAge = now - new Date(order.created_at).getTime();

      try {
        // Process based on current status
        switch (order.status) {
          case 'nieuw':
            // Send confirmation email after 4 hours (or 10s in test mode)
            if (orderAge >= timing.confirmation && !order.confirmation_sent_at) {
              const template = getEmailTemplate(order, 'confirmation');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await supabase
                  .from('cv_orders')
                  .update({
                    status: 'bevestigd' as OrderStatus,
                    confirmation_sent_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', order.id);

                await logAction(supabase, order.id, 'email_sent', 'Bevestigingsmail automatisch verstuurd');
                results.actions.push(`${order.dossier_number}: Bevestigingsmail verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen bevestigingsmail`);
              }
            }
            break;

          case 'bevestigd':
            // Send invoice after 24 hours (or 30s in test mode)
            if (orderAge >= timing.invoice && !order.invoice_sent_at) {
              // Create Mollie payment if not exists
              if (!order.mollie_payment_id) {
                const paymentResult = await createPayment({
                  orderId: order.id,
                  amount: order.amount,
                  description: `ResuBox CV Download - ${order.dossier_number}`,
                  customerEmail: order.customer_email,
                  customerName: order.customer_name,
                  redirectUrl: `${siteUrl}/betaald/${order.id}`,
                  webhookUrl: `${siteUrl}/api/mollie/webhook`,
                });

                if (paymentResult.success && paymentResult.paymentId && paymentResult.paymentUrl) {
                  await supabase
                    .from('cv_orders')
                    .update({
                      mollie_payment_id: paymentResult.paymentId,
                      payment_link: paymentResult.paymentUrl,
                    })
                    .eq('id', order.id);

                  order.payment_link = paymentResult.paymentUrl;
                  await logAction(supabase, order.id, 'payment_created', 'Betaallink aangemaakt via Mollie');
                }
              }

              const template = getEmailTemplate(order, 'invoice');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await supabase
                  .from('cv_orders')
                  .update({
                    status: 'factuur_verstuurd' as OrderStatus,
                    invoice_sent_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', order.id);

                await logAction(supabase, order.id, 'email_sent', 'Factuur automatisch verstuurd');
                results.actions.push(`${order.dossier_number}: Factuur verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen factuur`);
              }
            }
            break;

          case 'factuur_verstuurd':
            // Send reminder 1 after 7 days (or 1m in test mode)
            if (orderAge >= timing.reminder_1 && !order.reminder_1_sent_at) {
              const template = getEmailTemplate(order, 'reminder_1');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await supabase
                  .from('cv_orders')
                  .update({
                    status: 'herinnering_1' as OrderStatus,
                    reminder_1_sent_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', order.id);

                await logAction(supabase, order.id, 'email_sent', '1e herinnering automatisch verstuurd');
                results.actions.push(`${order.dossier_number}: 1e herinnering verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen 1e herinnering`);
              }
            }
            break;

          case 'herinnering_1':
            // Send reminder 2 (WIK) after 14 days (or 2m in test mode)
            if (orderAge >= timing.reminder_2 && !order.reminder_2_sent_at) {
              const template = getEmailTemplate(order, 'reminder_2');
              const result = await sendEmail({
                to: order.customer_email,
                subject: template.subject,
                html: template.html,
              });

              if (result.success) {
                await supabase
                  .from('cv_orders')
                  .update({
                    status: 'herinnering_2' as OrderStatus,
                    reminder_2_sent_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', order.id);

                await logAction(supabase, order.id, 'email_sent', 'WIK-brief (2e herinnering) automatisch verstuurd');
                results.actions.push(`${order.dossier_number}: WIK-brief verstuurd`);
              } else {
                results.errors.push(`${order.dossier_number}: Fout bij versturen WIK-brief`);
              }
            }
            break;

          // herinnering_2 status: No automatic action, wait for payment or manual intervention
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

async function logAction(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  orderId: string,
  actionType: string,
  description: string
) {
  if (!supabase) return;

  await supabase.from('order_actions').insert({
    order_id: orderId,
    action_type: actionType,
    action_description: description,
    performed_by: 'cron',
  });
}
