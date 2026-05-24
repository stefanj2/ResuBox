import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, findOrCreateUser } from '@/lib/user-auth';
import { vacanciesEnabled, subscriptionMarketSupported } from '@/lib/vacancies-flag';
import { createEmbeddedVacancySubscription, isVacancySubscriptionConfigured } from '@/lib/stripe';
import { localizedPath, type Locale } from '@/i18n/routing';

export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * POST /api/vacancies/subscribe
 * Creates an embedded Stripe Checkout session for the €1 + 7-day trial +
 * €17,25/mo subscription. The visitor is identified by their session, or by
 * the email they confirmed (prefilled from their CV). Returns a client_secret
 * for Stripe's <EmbeddedCheckout/>.
 */
export async function POST(request: NextRequest) {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }
  if (!isVacancySubscriptionConfigured()) {
    return NextResponse.json({ error: 'Abonnement is nog niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { email, locale } = (await request.json().catch(() => ({}))) as {
      email?: string;
      locale?: Locale;
    };
    const effectiveLocale = (locale ?? 'nl') as Locale;

    if (!subscriptionMarketSupported(effectiveLocale)) {
      return NextResponse.json(
        { error: 'Het abonnement is nog niet beschikbaar in jouw regio' },
        { status: 403 }
      );
    }

    // Identify the user: prefer the logged-in session, otherwise the confirmed
    // email. The subscription is tied to this user; access is granted after the
    // payment is verified in /complete.
    let user = await getCurrentUser();
    if (!user) {
      const normalized = (email ?? '').toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
      }
      user = await findOrCreateUser(normalized);
    }

    const returnUrl = `${siteUrl}${localizedPath('/vacatures', effectiveLocale)}?vac_checkout={CHECKOUT_SESSION_ID}`;

    const result = await createEmbeddedVacancySubscription({
      userId: user.id,
      customerEmail: user.email,
      returnUrl,
      locale: effectiveLocale,
    });

    if (!result.success || !result.clientSecret) {
      return NextResponse.json({ error: result.error ?? 'Checkout aanmaken mislukt' }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: result.clientSecret });
  } catch (err) {
    console.error('[vacancies/subscribe] error:', err);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
