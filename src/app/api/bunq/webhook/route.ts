import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { parseDossierFromDescription } from '@/lib/bunq';
import { sendEmail } from '@/lib/resend';
import { getPaymentReceivedEmail } from '@/lib/emailTemplates';
import { withdrawCase } from '@/lib/justusCollect';
import { CVOrder } from '@/types/admin';

/**
 * bunq webhook notification types
 */
interface BunqNotification {
  NotificationUrl: {
    category: 'MUTATION' | 'BUNQME_TAB' | 'PAYMENT';
    event_type: string;
    object: {
      BunqMeTab?: {
        id: number;
        bunqme_tab_entry: {
          uuid: string;
          amount_inquired: {
            value: string;
            currency: string;
          };
          description: string;
          status: 'WAITING_FOR_PAYMENT' | 'CANCELLED' | 'EXPIRED' | 'PAID';
        };
      };
      Payment?: {
        id: number;
        amount: {
          value: string;
          currency: string;
        };
        description: string;
        type: string;
        created: string;
      };
      Mutation?: {
        id: number;
        amount: {
          value: string;
          currency: string;
        };
        description: string;
        type: string;
        created: string;
      };
    };
  };
}

/**
 * POST /api/bunq/webhook
 *
 * bunq sends JSON notifications for:
 * - BUNQME_TAB: tab status changes (check for PAID)
 * - MUTATION: transaction received (positive amount = incoming)
 * - PAYMENT: payment received (positive amount = incoming)
 *
 * We extract the dossier number from the description,
 * then mark the order as paid.
 */
export async function POST(request: NextRequest) {
  try {
    let notification: BunqNotification;
    try {
      notification = await request.json();
    } catch {
      console.error('[bunq Webhook] Failed to parse JSON body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const category = notification.NotificationUrl?.category;
    const eventType = notification.NotificationUrl?.event_type;
    const object = notification.NotificationUrl?.object;

    console.log(`[bunq Webhook] Received ${category} notification, event: ${eventType}`);

    if (!object) {
      return NextResponse.json({ message: 'No object in notification' });
    }

    // Extract description and amount based on notification type
    let description = '';
    let amount = 0;
    let status = '';
    let notificationId = '';

    if (category === 'BUNQME_TAB' && object.BunqMeTab) {
      const tab = object.BunqMeTab;
      description = tab.bunqme_tab_entry.description;
      amount = parseFloat(tab.bunqme_tab_entry.amount_inquired.value);
      status = tab.bunqme_tab_entry.status;
      notificationId = String(tab.id);

      console.log(`[bunq Webhook] BunqMeTab ${tab.id} status: ${status}`);

      if (status !== 'PAID') {
        return NextResponse.json({ message: 'Tab not yet paid', status });
      }
    } else if (category === 'MUTATION' && object.Mutation) {
      const mutation = object.Mutation;
      description = mutation.description;
      amount = parseFloat(mutation.amount.value);
      status = 'PAID';
      notificationId = String(mutation.id);

      if (amount <= 0) {
        return NextResponse.json({ message: 'Outgoing mutation, ignoring' });
      }
    } else if (category === 'PAYMENT' && object.Payment) {
      const payment = object.Payment;
      description = payment.description;
      amount = parseFloat(payment.amount.value);
      status = 'PAID';
      notificationId = String(payment.id);

      if (amount <= 0) {
        return NextResponse.json({ message: 'Outgoing payment, ignoring' });
      }
    } else {
      return NextResponse.json({ message: `Unhandled category: ${category}` });
    }

    // Parse dossier number from description
    const dossierNummer = parseDossierFromDescription(description);

    if (!dossierNummer) {
      console.log(`[bunq Webhook] Could not extract dossier from: "${description}"`);
      return NextResponse.json({
        message: 'Could not extract dossier from description',
        description,
        notificationId,
      });
    }

    console.log(`[bunq Webhook] Dossier: ${dossierNummer}, Amount: ${amount}`);

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Find order by dossier number
    const { data: order, error: orderError } = await supabase
      .from('cv_orders')
      .select('*')
      .eq('dossier_number', dossierNummer)
      .single();

    if (orderError || !order) {
      console.log(`[bunq Webhook] No order found for dossier: ${dossierNummer}`);
      return NextResponse.json({
        message: 'No order found for this dossier',
        dossierNummer,
      });
    }

    // Already paid?
    if (order.status === 'betaald') {
      console.log(`[bunq Webhook] Order already paid: ${order.id}`);
      return NextResponse.json({ message: 'Order already paid' });
    }

    const typedOrder = order as CVOrder;
    const wasIncasso = typedOrder.status === 'incasso_overgedragen';

    // Mark as paid
    await supabase
      .from('cv_orders')
      .update({
        status: 'betaald',
        bunq_payment_status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    // Log action
    await supabase.from('order_actions').insert({
      order_id: order.id,
      action_type: 'payment_received',
      action_description: `Betaling ontvangen via bunq (${notificationId}) - ${amount} EUR`,
      performed_by: 'bunq',
      metadata: { notificationId, amount, category },
    });

    // Send payment confirmation email
    const emailTemplate = getPaymentReceivedEmail(typedOrder);
    await sendEmail({
      to: typedOrder.customer_email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    await supabase.from('order_actions').insert({
      order_id: order.id,
      action_type: 'email_sent',
      action_description: 'Betalingsbevestiging email verstuurd',
      performed_by: 'system',
    });

    // If order was in incasso, withdraw the Justus case
    if (wasIncasso && typedOrder.justus_case_id) {
      const withdrawResult = await withdrawCase(typedOrder.justus_case_id);

      await supabase.from('order_actions').insert({
        order_id: order.id,
        action_type: 'manual_action',
        action_description: withdrawResult.success
          ? 'Incassodossier ingetrokken na directe betaling'
          : `Fout bij intrekken incassodossier: ${withdrawResult.error}`,
        performed_by: 'system',
        metadata: { justus_case_id: typedOrder.justus_case_id },
      });
    }

    console.log(`[bunq Webhook] Successfully processed payment for ${dossierNummer}`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      dossierNummer,
      amount,
    });
  } catch (error) {
    console.error('[bunq Webhook] Error:', error);
    // Always return 200 to prevent bunq retries on our errors
    return NextResponse.json({ received: true });
  }
}

/**
 * GET /api/bunq/webhook - Health check
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', provider: 'bunq' });
}
