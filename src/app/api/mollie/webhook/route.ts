import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { getPayment, isPaymentPaid, isPaymentFailed } from '@/lib/mollie';
import { sendEmail } from '@/lib/resend';
import { getPaymentReceivedEmail } from '@/lib/emailTemplates';
import { CVOrder } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get('id') as string;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID ontbreekt' },
        { status: 400 }
      );
    }

    // Get payment from Mollie
    const payment = await getPayment(paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: 'Betaling niet gevonden' },
        { status: 404 }
      );
    }

    // Get order ID from payment metadata
    const orderId = (payment.metadata as { orderId?: string })?.orderId;

    if (!orderId) {
      console.error('No orderId in payment metadata:', paymentId);
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database niet geconfigureerd' },
        { status: 500 }
      );
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('cv_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderId);
      return NextResponse.json({ received: true });
    }

    // Update order based on payment status
    if (isPaymentPaid(payment)) {
      // Payment successful
      await supabase
        .from('cv_orders')
        .update({
          status: 'betaald',
          mollie_payment_status: payment.status,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      // Log action
      await supabase.from('order_actions').insert({
        order_id: orderId,
        action_type: 'payment_received',
        action_description: `Betaling ontvangen via Mollie (${paymentId})`,
        performed_by: 'mollie',
        metadata: { paymentId, amount: payment.amount.value },
      });

      // Send payment confirmation email
      const typedOrder = order as CVOrder;
      const emailTemplate = getPaymentReceivedEmail(typedOrder);
      await sendEmail({
        to: typedOrder.customer_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      // Log email action
      await supabase.from('order_actions').insert({
        order_id: orderId,
        action_type: 'email_sent',
        action_description: 'Betalingsbevestiging email verstuurd',
        performed_by: 'system',
      });
    } else if (isPaymentFailed(payment)) {
      // Payment failed
      await supabase
        .from('cv_orders')
        .update({
          mollie_payment_status: payment.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      // Log action
      await supabase.from('order_actions').insert({
        order_id: orderId,
        action_type: 'payment_failed',
        action_description: `Betaling mislukt: ${payment.status}`,
        performed_by: 'mollie',
        metadata: { paymentId, status: payment.status },
      });
    } else {
      // Payment pending or other status
      await supabase
        .from('cv_orders')
        .update({
          mollie_payment_status: payment.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Mollie webhook error:', error);
    // Always return 200 to Mollie to prevent retries on our errors
    return NextResponse.json({ received: true });
  }
}
