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
  /** Locale of the buyer (nl, en, de, sv, da). Drives currency, price, payment methods, Stripe Checkout UI language. */
  locale?: string;
}

type Currency = 'eur' | 'gbp' | 'sek' | 'dkk';
type StripePaymentMethod = NonNullable<
  Stripe.Checkout.SessionCreateParams['payment_method_types']
>[number];
type StripeCheckoutLocale = NonNullable<Stripe.Checkout.SessionCreateParams['locale']>;

interface MarketConfig {
  currency: Currency;
  amount: number; // headline price in major currency units
  paymentMethods: StripePaymentMethod[];
  stripeLocale: StripeCheckoutLocale;
}

const MARKET_BY_LOCALE: Record<string, MarketConfig> = {
  nl: { currency: 'eur', amount: 42, paymentMethods: ['ideal', 'card', 'bancontact'], stripeLocale: 'nl' },
  de: { currency: 'eur', amount: 42, paymentMethods: ['card', 'klarna', 'sepa_debit', 'sofort'], stripeLocale: 'de' },
  en: { currency: 'gbp', amount: 42, paymentMethods: ['card'], stripeLocale: 'en-GB' },
  sv: { currency: 'sek', amount: 449, paymentMethods: ['card', 'klarna'], stripeLocale: 'sv' },
  da: { currency: 'dkk', amount: 315, paymentMethods: ['card', 'mobilepay'], stripeLocale: 'da' },
};

export function getMarketConfig(locale?: string): MarketConfig {
  return MARKET_BY_LOCALE[locale ?? 'nl'] ?? MARKET_BY_LOCALE.nl;
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
    const market = getMarketConfig(params.locale);
    // Caller may pass a market-adjusted amount; otherwise use the market default
    const unitAmount = Math.round((params.amount || market.amount) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: market.paymentMethods,
      mode: 'payment',
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: market.currency,
            product_data: {
              name: 'CV Download — ResuBox',
              description: params.description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: params.orderId,
        dossierNumber: params.dossierNumber,
        customerName: params.customerName,
        locale: params.locale ?? 'nl',
        currency: market.currency,
      },
      payment_intent_data: {
        metadata: {
          orderId: params.orderId,
          dossierNumber: params.dossierNumber,
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      locale: market.stripeLocale,
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
