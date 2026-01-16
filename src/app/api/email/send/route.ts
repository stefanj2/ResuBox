import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { getEmailTemplate } from '@/lib/emailTemplates';
import { CVOrder } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const { orderId, emailType } = await request.json();

    if (!orderId || !emailType) {
      return NextResponse.json(
        { error: 'orderId en emailType zijn vereist' },
        { status: 400 }
      );
    }

    // Get order from database
    const supabase = getSupabaseServerClient();
    let order: CVOrder | null = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('cv_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Order niet gevonden' },
          { status: 404 }
        );
      }

      order = data as CVOrder;
    } else {
      // For development without Supabase, try to get from request body
      return NextResponse.json(
        { error: 'Database niet geconfigureerd' },
        { status: 500 }
      );
    }

    // Get email template
    const validTypes = ['confirmation', 'invoice', 'reminder_1', 'reminder_2', 'payment_received'];
    if (!validTypes.includes(emailType)) {
      return NextResponse.json(
        { error: 'Ongeldig email type' },
        { status: 400 }
      );
    }

    const template = getEmailTemplate(order, emailType as 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2' | 'payment_received');

    // Send email
    const result = await sendEmail({
      to: order.customer_email,
      subject: template.subject,
      html: template.html,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Fout bij versturen email' },
        { status: 500 }
      );
    }

    // Update order with email sent timestamp
    const timestampField = `${emailType}_sent_at`;
    if (supabase) {
      await supabase
        .from('cv_orders')
        .update({ [timestampField]: new Date().toISOString() })
        .eq('id', orderId);

      // Add action to history
      await supabase.from('order_actions').insert({
        order_id: orderId,
        action_type: 'email_sent',
        action_description: `${emailType} email verstuurd`,
        performed_by: 'system',
        metadata: { messageId: result.messageId },
      });
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Interne serverfout' },
      { status: 500 }
    );
  }
}
