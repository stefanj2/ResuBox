import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { getPaymentReceivedEmail } from '@/lib/emailTemplates';
import { CVOrder } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    // Verify API key from Justus
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

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 500 });
    }

    // Find order by justus_case_id
    const { data: order, error: orderError } = await supabase
      .from('cv_orders')
      .select('*')
      .eq('justus_case_id', case_id)
      .single();

    if (orderError || !order) {
      console.error('Order not found for Justus case:', case_id);
      return NextResponse.json({ received: true });
    }

    const typedOrder = order as CVOrder;

    switch (event) {
      case 'case.payment_received': {
        // Payment received via Justus
        await supabase
          .from('cv_orders')
          .update({
            status: 'betaald',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', typedOrder.id);

        await supabase.from('order_actions').insert({
          order_id: typedOrder.id,
          action_type: 'payment_received',
          action_description: `Betaling ontvangen via Justus Collect (case: ${case_id})`,
          performed_by: 'justus',
          metadata: { case_id, event, data },
        });

        // Send payment confirmation
        const emailTemplate = getPaymentReceivedEmail(typedOrder);
        await sendEmail({
          to: typedOrder.customer_email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        await supabase.from('order_actions').insert({
          order_id: typedOrder.id,
          action_type: 'email_sent',
          action_description: 'Betalingsbevestiging email verstuurd (via Justus betaling)',
          performed_by: 'system',
        });
        break;
      }

      case 'case.status_changed': {
        await supabase.from('order_actions').insert({
          order_id: typedOrder.id,
          action_type: 'manual_action',
          action_description: `Justus case status gewijzigd: ${data?.status || 'onbekend'}`,
          performed_by: 'justus',
          metadata: { case_id, event, data },
        });
        break;
      }

      case 'case.payment_plan_requested': {
        await supabase.from('order_actions').insert({
          order_id: typedOrder.id,
          action_type: 'manual_action',
          action_description: 'Betalingsregeling aangevraagd via Justus Collect',
          performed_by: 'justus',
          metadata: { case_id, event, data },
        });
        break;
      }

      default: {
        // Log unknown events
        await supabase.from('order_actions').insert({
          order_id: typedOrder.id,
          action_type: 'manual_action',
          action_description: `Justus webhook event: ${event}`,
          performed_by: 'justus',
          metadata: { case_id, event, data },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Justus webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
