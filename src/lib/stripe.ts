/**
 * Stripe Payment Client for ResuBox
 *
 * Uses Stripe Checkout Sessions with iDEAL, creditcard, and Bancontact.
 * Orders are linked via metadata.orderId on the Checkout Session.
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  stripeInstance = new Stripe(secretKey, {
    typescript: true,
  });

  return stripeInstance;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export interface CreateCheckoutParams {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  dossierNumber: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  success: boolean;
  sessionId?: string;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Create a Stripe Checkout Session with iDEAL, card, and Bancontact
 */
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return {
      success: false,
      error: 'Stripe is niet geconfigureerd',
    };
  }

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card', 'bancontact'],
      mode: 'payment',
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'CV Download — ResuBox',
              description: params.description,
            },
            unit_amount: Math.round(params.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: params.orderId,
        dossierNumber: params.dossierNumber,
        customerName: params.customerName,
      },
      // Propagate orderId to the underlying PaymentIntent (and therefore to
      // every Charge). That way refund / dispute / fraud webhooks can find
      // the order without an extra Stripe API lookup.
      payment_intent_data: {
        metadata: {
          orderId: params.orderId,
          dossierNumber: params.dossierNumber,
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      locale: 'nl',
      expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
    });

    console.log(`[Stripe] Created checkout session ${session.id}: ${session.url}`);

    return {
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url ?? undefined,
    };
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken betaling',
    };
  }
}

/**
 * Get payment status by Stripe Checkout Session ID
 */
export async function getPaymentStatus(sessionId: string): Promise<'open' | 'paid' | 'expired' | null> {
  if (!isStripeConfigured()) return null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    switch (session.payment_status) {
      case 'paid':
        return 'paid';
      case 'unpaid':
        return session.status === 'expired' ? 'expired' : 'open';
      case 'no_payment_required':
        return 'paid';
      default:
        return null;
    }
  } catch (error) {
    console.error('[Stripe] Error fetching payment status:', error);
    return null;
  }
}

/**
 * Construct and verify a Stripe webhook event from the raw request body
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
