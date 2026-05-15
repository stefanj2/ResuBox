import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction, getOrderByJustusCaseId, updateOrder } from '@/lib/orders';
import { sendEmail } from '@/lib/resend';
import { getPaymentReceivedEmail } from '@/lib/emailTemplates';

export async function POST(request: NextRequest) {
  try {
    const apiKeyHeader = request.headers.get('x-api-key');
    const expectedKey = process.env.JUSTUS_API_KEY;

    if (!expectedKey || apiKeyHeader !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event, case_id, data } = body;

    if (!event || !case_id) {
      return NextResponse.json({ error: 'Missing event or case_id' }, { status: 400 });
    }

    const order = await getOrderByJustusCaseId(case_id);

    if (!order) {
      console.error('Order not found for Justus case:', case_id);
      return NextResponse.json({ received: true });
    }

    switch (event) {
      case 'case.payment_received': {
        await updateOrder(order.id, {
          status: 'betaald',
          paid_at: new Date().toISOString(),
        });

        await addOrderAction(
          order.id,
          'payment_received',
          `Betaling ontvangen via Justus Collect (case: ${case_id})`,
          'justus',
          { case_id, event, data }
        );

        const emailTemplate = getPaymentReceivedEmail(order);
        await sendEmail({
          to: order.customer_email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        await addOrderAction(
          order.id,
          'email_sent',
          'Betalingsbevestiging email verstuurd (via Justus betaling)',
          'system'
        );
        break;
      }

      case 'case.status_changed': {
        await addOrderAction(
          order.id,
          'manual_action',
          `Justus case status gewijzigd: ${data?.status || 'onbekend'}`,
          'justus',
          { case_id, event, data }
        );
        break;
      }

      case 'case.payment_plan_requested': {
        await addOrderAction(
          order.id,
          'manual_action',
          'Betalingsregeling aangevraagd via Justus Collect',
          'justus',
          { case_id, event, data }
        );
        break;
      }

      default: {
        await addOrderAction(
          order.id,
          'manual_action',
          `Justus webhook event: ${event}`,
          'justus',
          { case_id, event, data }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Justus webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
