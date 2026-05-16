import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction, getOrder, markEmailSent } from '@/lib/orders';
import { sendEmail } from '@/lib/resend';
import { getEmailTemplate, EmailType } from '@/lib/emailTemplates';
import { rateLimiter } from '@/lib/rate-limit';

const fromEmailIncasso = process.env.FROM_EMAIL_INCASSO || 'Incasso Afdeling <incasso@resubox.nl>';

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

const TIMESTAMP_FIELDS: Record<string, 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2' | 'reminder_3' | 'wik' | 'incasso'> = {
  confirmation: 'confirmation',
  invoice: 'invoice',
  reminder_1: 'reminder_1',
  reminder_2: 'reminder_2',
  reminder_3: 'reminder_3',
  wik: 'wik',
  incasso: 'incasso',
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { orderId, emailType } = await request.json();

    if (!orderId || !emailType) {
      return NextResponse.json(
        { error: 'orderId en emailType zijn vereist' },
        { status: 400 }
      );
    }

    const validTypes = ['confirmation', 'invoice', 'reminder_1', 'reminder_2', 'reminder_3', 'wik', 'incasso', 'payment_received'];
    if (!validTypes.includes(emailType)) {
      return NextResponse.json(
        { error: 'Ongeldig email type' },
        { status: 400 }
      );
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order niet gevonden' },
        { status: 404 }
      );
    }

    const template = getEmailTemplate(order, emailType as EmailType);

    const result = await sendEmail({
      to: order.customer_email,
      subject: template.subject,
      html: template.html,
      from: emailType === 'incasso' ? fromEmailIncasso : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Fout bij versturen email' },
        { status: 500 }
      );
    }

    const markType = TIMESTAMP_FIELDS[emailType];
    if (markType) {
      await markEmailSent(orderId, markType);
    }

    await addOrderAction(orderId, 'email_sent', `${emailType} email verstuurd`, 'system', {
      messageId: result.messageId,
    });

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
