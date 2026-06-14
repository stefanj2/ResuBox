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
  de: { currency: 'eur', amount: 42, paymentMethods: ['card', 'sepa_debit', 'sofort'], stripeLocale: 'de' },
  en: { currency: 'gbp', amount: 42, paymentMethods: ['card'], stripeLocale: 'en-GB' },
  sv: { currency: 'sek', amount: 449, paymentMethods: ['card'], stripeLocale: 'sv' },
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

// ───────────────────────────────────────────────────────────────────
// Vacaturematch subscription — €1 activation now + 7-day trial + €18.95/mo
//
// Implemented as a Checkout Session in `subscription` mode:
//   • line item = the recurring €18.95/mo price (STRIPE_PRICE_VACANCY_SUB)
//   • line item = a one-time €1 price (STRIPE_PRICE_VACANCY_ACTIVATION)
//   • subscription_data.trial_period_days = 7
// The one-time price creates an amount due at checkout, so the card is
// charged €1 immediately while the recurring price is trialed for 7 days;
// after the trial the subscription bills €18.95/mo. Verify the immediate €1
// charge in Stripe test mode before going live.

export interface VacancySubscriptionParams {
  userId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  /** Drives Stripe Checkout UI language. */
  locale?: string;
}

// Subscription-capable payment methods per EUR market. iDEAL/Bancontact start
// the subscription by setting up a SEPA Direct Debit mandate for the recurring
// charges; card and SEPA are native. We list them explicitly because the
// account's automatic selection skipped iDEAL/Bancontact.
const RECURRING_PAYMENT_METHODS: Record<string, StripePaymentMethod[]> = {
  nl: ['card', 'ideal', 'bancontact', 'sepa_debit'],
  de: ['card', 'sepa_debit', 'paypal'],
};

function recurringPaymentMethods(locale?: string): StripePaymentMethod[] {
  return RECURRING_PAYMENT_METHODS[locale ?? 'nl'] ?? RECURRING_PAYMENT_METHODS.nl;
}

export function isVacancySubscriptionConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_VACANCY_SUB &&
      process.env.STRIPE_PRICE_VACANCY_ACTIVATION
  );
}

export async function createVacancySubscriptionCheckout(
  params: VacancySubscriptionParams
): Promise<CheckoutResult> {
  if (!isVacancySubscriptionConfigured()) {
    return { success: false, error: 'Vacature-abonnement is niet geconfigureerd' };
  }

  try {
    const stripe = getStripe();
    const stripeLocale = (getMarketConfig(params.locale).stripeLocale) as StripeCheckoutLocale;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: params.customerEmail,
      line_items: [
        { price: process.env.STRIPE_PRICE_VACANCY_SUB!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_VACANCY_ACTIVATION!, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: params.userId,
          kind: 'vacancy_sub',
        },
      },
      // Force a payment method up front so the €1 is collected and the
      // subscription can auto-bill after the trial.
      payment_method_collection: 'always',
      metadata: {
        userId: params.userId,
        kind: 'vacancy_sub',
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      locale: stripeLocale,
      allow_promotion_codes: true,
    });

    console.log(`[Stripe] Created vacancy subscription session ${session.id}`);

    return { success: true, sessionId: session.id, checkoutUrl: session.url ?? undefined };
  } catch (error) {
    console.error('[Stripe] Error creating vacancy subscription session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken abonnement',
    };
  }
}

/**
 * Create an EMBEDDED Checkout Session for the vacancy subscription. Returns a
 * client_secret that the frontend mounts with Stripe's <EmbeddedCheckout/>, so
 * the payment form lives inside our own modal (no redirect to a Stripe page).
 * Redirect-based methods (iDEAL) still bounce to the bank and back to returnUrl.
 */
export async function createEmbeddedVacancySubscription(params: {
  userId: string;
  customerEmail: string;
  returnUrl: string;
  locale?: string;
}): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
  if (!isVacancySubscriptionConfigured()) {
    return { success: false, error: 'Vacature-abonnement is niet geconfigureerd' };
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      // 'elements' = custom UI mode (formerly 'custom'): Stripe manages the
      // subscription/trial/€1 logic while we render our own fully styled form
      // with <PaymentElement> + checkout.confirm(). Verified against the API.
      ui_mode: 'elements',
      mode: 'subscription',
      customer_email: params.customerEmail,
      payment_method_types: recurringPaymentMethods(params.locale),
      line_items: [
        { price: process.env.STRIPE_PRICE_VACANCY_SUB!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_VACANCY_ACTIVATION!, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: params.userId, kind: 'vacancy_sub' },
      },
      payment_method_collection: 'always',
      metadata: { userId: params.userId, kind: 'vacancy_sub' },
      return_url: params.returnUrl,
      allow_promotion_codes: true,
    });

    return { success: true, clientSecret: session.client_secret ?? undefined };
  } catch (error) {
    console.error('[Stripe] Error creating embedded subscription session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken abonnement',
    };
  }
}

/**
 * Retrieve a completed Checkout Session for the vacancy subscription, returning
 * the userId (from metadata) and the subscription state so we can grant access
 * immediately after payment without waiting for the webhook.
 */
export async function getVacancyCheckoutResult(sessionId: string): Promise<{
  complete: boolean;
  userId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  status: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
}> {
  const empty = {
    complete: false,
    userId: null,
    customerId: null,
    subscriptionId: null,
    status: null,
    trialEnd: null,
    currentPeriodEnd: null,
  };
  if (!isStripeConfigured()) return empty;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });
    if (session.status !== 'complete' || session.metadata?.kind !== 'vacancy_sub') return empty;

    const sub = session.subscription as Stripe.Subscription | null;
    const subAny = sub as unknown as Record<string, unknown> | null;
    const itemEnd = sub?.items?.data?.[0]
      ? (sub.items.data[0] as unknown as Record<string, unknown>).current_period_end
      : undefined;
    const toIso = (v: unknown) => (typeof v === 'number' ? new Date(v * 1000).toISOString() : null);

    return {
      complete: true,
      userId: session.metadata?.userId ?? null,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
      subscriptionId: sub?.id ?? null,
      status: sub?.status ?? 'trialing',
      trialEnd: toIso(subAny?.trial_end),
      currentPeriodEnd: toIso(subAny?.current_period_end ?? itemEnd),
    };
  } catch (error) {
    console.error('[Stripe] Error retrieving checkout result:', error);
    return empty;
  }
}

// ───────────────────────────────────────────────────────────────────
// CV-download subscription — €0,50 verification + 14-day trial + €39/mo
//
// Same shape as the Vacaturematch subscription helpers above, separate
// Stripe price IDs and a 14-day trial (vs. 7 for Vacaturematch). The
// metadata.kind = 'cv_sub' lets the webhook + complete-route route to the
// cv_subscriptions table instead of vacancy_subscriptions.

export function isCVSubscriptionConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_CV_SUB &&
      process.env.STRIPE_PRICE_CV_ACTIVATION
  );
}

export async function createEmbeddedCVSubscription(params: {
  userId: string;
  customerEmail: string;
  returnUrl: string;
  locale?: string;
}): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
  if (!isCVSubscriptionConfigured()) {
    return { success: false, error: 'CV-abonnement is niet geconfigureerd' };
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'elements',
      mode: 'subscription',
      customer_email: params.customerEmail,
      payment_method_types: recurringPaymentMethods(params.locale),
      line_items: [
        { price: process.env.STRIPE_PRICE_CV_SUB!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_CV_ACTIVATION!, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId: params.userId, kind: 'cv_sub' },
      },
      payment_method_collection: 'always',
      metadata: { userId: params.userId, kind: 'cv_sub' },
      return_url: params.returnUrl,
      allow_promotion_codes: true,
    });

    return { success: true, clientSecret: session.client_secret ?? undefined };
  } catch (error) {
    console.error('[Stripe] Error creating embedded CV subscription session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken abonnement',
    };
  }
}

export async function getCVCheckoutResult(sessionId: string): Promise<{
  complete: boolean;
  userId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  status: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
}> {
  const empty = {
    complete: false,
    userId: null,
    customerId: null,
    subscriptionId: null,
    status: null,
    trialEnd: null,
    currentPeriodEnd: null,
  };
  if (!isStripeConfigured()) return empty;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });
    if (session.status !== 'complete' || session.metadata?.kind !== 'cv_sub') return empty;

    const sub = session.subscription as Stripe.Subscription | null;
    const subAny = sub as unknown as Record<string, unknown> | null;
    const itemEnd = sub?.items?.data?.[0]
      ? (sub.items.data[0] as unknown as Record<string, unknown>).current_period_end
      : undefined;
    const toIso = (v: unknown) => (typeof v === 'number' ? new Date(v * 1000).toISOString() : null);

    return {
      complete: true,
      userId: session.metadata?.userId ?? null,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
      subscriptionId: sub?.id ?? null,
      status: sub?.status ?? 'trialing',
      trialEnd: toIso(subAny?.trial_end),
      currentPeriodEnd: toIso(subAny?.current_period_end ?? itemEnd),
    };
  } catch (error) {
    console.error('[Stripe] Error retrieving CV checkout result:', error);
    return empty;
  }
}

/**
 * Create a Stripe Billing Portal session so the subscriber can manage or
 * cancel their subscription. Returns the portal URL to redirect to.
 */
export async function createBillingPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isStripeConfigured()) {
    return { success: false, error: 'Stripe is niet geconfigureerd' };
  }
  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return { success: true, url: portal.url };
  } catch (error) {
    console.error('[Stripe] Error creating billing portal session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Kon klantportaal niet openen',
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
