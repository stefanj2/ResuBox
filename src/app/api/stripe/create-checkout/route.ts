import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction, getOrder, updateOrder } from '@/lib/orders';
import { createCheckoutSession } from '@/lib/stripe';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

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

    const result = await createCheckoutSession({
      orderId: order.id,
      amount: order.amount,
      description: `ResuBox by Dune Legal - ${order.dossier_number}`,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      dossierNumber: order.dossier_number ?? order.id,
      successUrl: `${siteUrl}/betaald/${order.id}`,
      cancelUrl: `${siteUrl}/betalen/${order.id}`,
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
