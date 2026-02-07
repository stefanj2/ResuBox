import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { createPayment } from '@/lib/bunq';

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
      return NextResponse.json(
        { error: 'Order niet gevonden' },
        { status: 404 }
      );
    }

    // Don't create payment if already paid
    if (order.status === 'betaald') {
      return NextResponse.json(
        { error: 'Order is al betaald' },
        { status: 400 }
      );
    }

    // Create bunq.me tab
    const paymentResult = await createPayment({
      orderId: order.id,
      amount: order.amount,
      description: `ResuBox by Dune Legal - ${order.dossier_number}`,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      redirectUrl: `${siteUrl}/betaald/${order.id}`,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Betaling aanmaken mislukt' },
        { status: 500 }
      );
    }

    // Store payment ID and link
    await supabase
      .from('cv_orders')
      .update({
        bunq_payment_id: paymentResult.paymentId,
        payment_link: paymentResult.paymentUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Log action
    await supabase.from('order_actions').insert({
      order_id: orderId,
      action_type: 'payment_created',
      action_description: 'Betaallink aangemaakt via bunq',
      performed_by: 'system',
      metadata: {
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      checkoutUrl: paymentResult.paymentUrl,
    });
  } catch (error) {
    console.error('bunq create-payment error:', error);
    return NextResponse.json(
      { error: 'Interne serverfout' },
      { status: 500 }
    );
  }
}
