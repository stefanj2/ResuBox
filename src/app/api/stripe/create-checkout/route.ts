import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction, getOrder, updateOrder } from '@/lib/orders';
import { createCheckoutSession } from '@/lib/stripe';
import { localizedPath, type Locale } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { orderId, locale } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID ontbreekt' },
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

    if (order.status === 'betaald') {
      return NextResponse.json(
        { error: 'Order is al betaald' },
        { status: 400 }
      );
    }

    const effectiveLocale = (locale ?? order.locale ?? order.cv_data?.meta?.locale ?? request.headers.get('x-locale') ?? 'nl') as Locale;

    const result = await createCheckoutSession({
      orderId: order.id,
      amount: order.amount,
      description: `ResuBox - ${order.dossier_number}`,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      dossierNumber: order.dossier_number ?? order.id,
      successUrl: `${siteUrl}${localizedPath('/betaald/[id]', effectiveLocale, { id: order.id })}`,
      cancelUrl: `${siteUrl}${localizedPath('/betalen/[id]', effectiveLocale, { id: order.id })}`,
      locale: effectiveLocale,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Betaling aanmaken mislukt' },
        { status: 500 }
      );
    }

    await updateOrder(orderId, {
      stripe_session_id: result.sessionId,
      payment_link: result.checkoutUrl,
    });

    await addOrderAction(
      orderId,
      'payment_created',
      'Betaallink aangemaakt via Stripe',
      'system',
      {
        sessionId: result.sessionId,
        checkoutUrl: result.checkoutUrl,
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error) {
    console.error('Stripe create-checkout error:', error);
    return NextResponse.json(
      { error: 'Interne serverfout' },
      { status: 500 }
    );
  }
}
