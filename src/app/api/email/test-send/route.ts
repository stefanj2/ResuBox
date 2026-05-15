import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orders';
import { sendEmail } from '@/lib/resend';
import { getEmailTemplate, EmailType } from '@/lib/emailTemplates';

// Temporary test endpoint – only allowed in non-production
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { orderId, emailType, overrideEmail } = await request.json();

    if (!orderId || !emailType || !overrideEmail) {
      return NextResponse.json({ error: 'orderId, emailType en overrideEmail zijn vereist' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 });
    }

    const validTypes = ['confirmation', 'invoice', 'reminder_1', 'reminder_2', 'incasso', 'payment_received'];
    if (!validTypes.includes(emailType)) {
      return NextResponse.json({ error: 'Ongeldig email type' }, { status: 400 });
    }

    const template = getEmailTemplate(order, emailType as EmailType);

    const result = await sendEmail({
      to: overrideEmail,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Fout bij versturen' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentTo: overrideEmail,
      originalRecipient: order.customer_email,
      emailType,
      dossier: order.dossier_number,
      name: order.customer_name,
    });
  } catch (error) {
    console.error('Test email send error:', error);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
