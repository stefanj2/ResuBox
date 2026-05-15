import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction, getOrder, updateOrder } from '@/lib/orders';
import { constructWebhookEvent } from '@/lib/stripe';
import { sendEmail } from '@/lib/resend';
import { getPaymentReceivedEmail } from '@/lib/emailTemplates';
import { withdrawCase } from '@/lib/justusCollect';
import Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events, primarily checkout.session.completed.
 * Orders are matched via metadata.orderId on the Checkout Session.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== 'paid') {
        console.log(`[Stripe Webhook] Session ${session.id} not yet paid (status: ${session.payment_status})`);
        return NextResponse.json({ message: 'Payment not yet completed' });
      }

      const orderId = session.metadata?.orderId;
      const dossierNumber = session.metadata?.dossierNumber;

      if (!orderId) {
        console.log(`[Stripe Webhook] No orderId in session metadata: ${session.id}`);
        return NextResponse.json({ message: 'No orderId in metadata' });
      }

      console.log(`[Stripe Webhook] Processing payment for order ${orderId} (${dossierNumber})`);

      const order = await getOrder(orderId);
      if (!order) {
        console.log(`[Stripe Webhook] No order found for ID: ${orderId}`);
        return NextResponse.json({ message: 'Order not found' });
      }

      if (order.status === 'betaald') {
        console.log(`[Stripe Webhook] Order already paid: ${orderId}`);
        return NextResponse.json({ message: 'Order already paid' });
      }

      const wasIncasso = order.status === 'incasso_overgedragen';
      const amountPaid = (session.amount_total ?? 0) / 100;

      await updateOrder(orderId, {
        status: 'betaald',
        stripe_payment_status: 'paid',
        paid_at: new Date().toISOString(),
      });

      await addOrderAction(
        orderId,
        'payment_received',
        `Betaling ontvangen via Stripe (${session.id}) - ${amountPaid.toFixed(2)} EUR`,
        'stripe',
        {
          sessionId: session.id,
          paymentIntent: session.payment_intent,
          amount: amountPaid,
          paymentMethod: session.payment_method_types?.[0],
        }
      );

      const emailTemplate = getPaymentReceivedEmail(order);
      await sendEmail({
        to: order.customer_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      await addOrderAction(orderId, 'email_sent', 'Betalingsbevestiging email verstuurd', 'system');

      if (wasIncasso && order.justus_case_id) {
        const withdrawResult = await withdrawCase(order.justus_case_id);

        await addOrderAction(
          orderId,
          'manual_action',
          withdrawResult.success
            ? 'Incassodossier ingetrokken na directe betaling'
            : `Fout bij intrekken incassodossier: ${withdrawResult.error}`,
          'system',
          { justus_case_id: order.justus_case_id }
        );
      }

      console.log(`[Stripe Webhook] Successfully processed payment for ${dossierNumber}`);

      return NextResponse.json({
        success: true,
        orderId,
        dossierNumber,
        amount: amountPaid,
      });
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await updateOrder(orderId, { stripe_payment_status: 'expired' });
        console.log(`[Stripe Webhook] Checkout session expired for order ${orderId}`);
      }

      return NextResponse.json({ message: 'Session expiry processed' });
    }

    return NextResponse.json({ message: `Unhandled event type: ${event.type}` });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

/**
 * GET /api/stripe/webhook - Health check
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', provider: 'stripe' });
}
