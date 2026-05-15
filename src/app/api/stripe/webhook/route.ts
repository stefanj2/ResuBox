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
 * Single endpoint for all Stripe events. Configure in Stripe dashboard:
 *   • checkout.session.completed              — primary payment success
 *   • checkout.session.async_payment_succeeded — iDEAL/Bancontact async OK
 *   • checkout.session.async_payment_failed    — iDEAL/Bancontact rejected
 *   • checkout.session.expired                 — abandoned checkout
 *   • charge.refunded                          — operator-issued refund
 *   • charge.dispute.created                   — chargeback from cardholder
 *
 * Orders are matched via metadata.orderId on the Checkout Session and via
 * payment_intent_data.metadata.orderId on the Charge.
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

    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        return await handlePaymentSuccess(event.data.object as Stripe.Checkout.Session);

      case 'checkout.session.async_payment_failed':
        return await handleAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);

      case 'checkout.session.expired':
        return await handleSessionExpired(event.data.object as Stripe.Checkout.Session);

      case 'charge.refunded':
        return await handleChargeRefunded(event.data.object as Stripe.Charge);

      case 'charge.dispute.created':
        return await handleDisputeCreated(event.data.object as Stripe.Dispute);

      default:
        return NextResponse.json({ message: `Unhandled event type: ${event.type}` });
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

// ───────────────────────────────────────────────────────────────────
// checkout.session.completed + async_payment_succeeded

async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
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
    `Betaling ontvangen via Stripe (${session.id}) — ${amountPaid.toFixed(2)} EUR`,
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

  return NextResponse.json({ success: true, orderId, dossierNumber, amount: amountPaid });
}

// ───────────────────────────────────────────────────────────────────
// checkout.session.async_payment_failed — iDEAL/Bancontact rejected

async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ message: 'No orderId' });

  await updateOrder(orderId, { stripe_payment_status: 'failed' });
  await addOrderAction(
    orderId,
    'payment_failed',
    `Async betaling mislukt — bank weigerde iDEAL/Bancontact (${session.id})`,
    'stripe',
    {
      sessionId: session.id,
      paymentIntent: session.payment_intent,
      paymentMethod: session.payment_method_types?.[0],
    }
  );

  console.log(`[Stripe Webhook] Async payment failed for order ${orderId}`);
  return NextResponse.json({ message: 'Failed payment logged' });
}

// ───────────────────────────────────────────────────────────────────
// checkout.session.expired

async function handleSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ message: 'No orderId' });

  await updateOrder(orderId, { stripe_payment_status: 'expired' });
  console.log(`[Stripe Webhook] Checkout session expired for order ${orderId}`);
  return NextResponse.json({ message: 'Session expiry processed' });
}

// ───────────────────────────────────────────────────────────────────
// charge.refunded — operator issued a refund in Stripe dashboard

async function handleChargeRefunded(charge: Stripe.Charge) {
  const orderId = charge.metadata?.orderId;
  if (!orderId) {
    console.log(`[Stripe Webhook] Refund without orderId in metadata: ${charge.id}`);
    return NextResponse.json({ message: 'No orderId in charge metadata' });
  }

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ message: 'Order not found' });

  const refunded = (charge.amount_refunded ?? 0) / 100;
  const total = (charge.amount ?? 0) / 100;
  const isFullRefund = refunded >= total;

  // Mark stripe_payment_status, but keep the human-decided order status
  // intact. Operator chooses whether to set the order to 'afgeboekt'.
  await updateOrder(orderId, {
    stripe_payment_status: isFullRefund ? 'refunded' : 'partially_refunded',
  });

  await addOrderAction(
    orderId,
    'manual_action',
    isFullRefund
      ? `Volledige refund verwerkt — ${refunded.toFixed(2)} EUR teruggestort (${charge.id})`
      : `Gedeeltelijke refund verwerkt — ${refunded.toFixed(2)} van ${total.toFixed(2)} EUR (${charge.id})`,
    'stripe',
    {
      chargeId: charge.id,
      paymentIntent: charge.payment_intent,
      amountRefunded: refunded,
      amountTotal: total,
      isFullRefund,
    }
  );

  console.log(`[Stripe Webhook] Refund processed for order ${orderId}: ${refunded.toFixed(2)} EUR`);
  return NextResponse.json({ message: 'Refund logged', orderId, refunded });
}

// ───────────────────────────────────────────────────────────────────
// charge.dispute.created — cardholder filed a chargeback. URGENT.

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  // dispute has charge id; fetch charge to get our metadata
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id;
  const orderId =
    typeof dispute.charge === 'object' && dispute.charge.metadata?.orderId
      ? dispute.charge.metadata.orderId
      : undefined;

  if (!orderId) {
    // Fallback: we don't have an order. Log without one — operator can correlate via charge ID.
    console.error(`[Stripe Webhook] CHARGEBACK on charge ${chargeId} without orderId metadata!`);
    return NextResponse.json({ message: 'Dispute without orderId — logged in server logs' });
  }

  const amount = (dispute.amount ?? 0) / 100;
  const reason = dispute.reason ?? 'unknown';
  const evidenceDeadline = dispute.evidence_details?.due_by
    ? new Date(dispute.evidence_details.due_by * 1000).toISOString()
    : null;

  await addOrderAction(
    orderId,
    'manual_action',
    `⚠ CHARGEBACK ingediend — ${amount.toFixed(2)} EUR (reason: ${reason}). ${
      evidenceDeadline ? `Bewijs aanleveren vóór ${evidenceDeadline}.` : ''
    }`,
    'stripe',
    {
      disputeId: dispute.id,
      chargeId,
      amount,
      reason,
      status: dispute.status,
      evidenceDeadline,
    }
  );

  console.error(
    `[Stripe Webhook] CHARGEBACK on order ${orderId}: ${amount.toFixed(2)} EUR (${reason}). Deadline: ${evidenceDeadline ?? 'unknown'}`
  );
  return NextResponse.json({ message: 'Dispute logged', orderId, amount });
}

/**
 * GET /api/stripe/webhook — health check
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', provider: 'stripe' });
}
