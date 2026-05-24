import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { vacanciesEnabled, subscriptionMarketSupported } from '@/lib/vacancies-flag';
import { createVacancySubscriptionCheckout, isVacancySubscriptionConfigured } from '@/lib/stripe';
import { localizedPath, type Locale } from '@/i18n/routing';

export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * POST /api/vacancies/checkout
 * Starts the €1 + 7-day trial + €17.25/mo subscription checkout for the
 * logged-in user. Requires a session so the subscription is tied to a userId.
 */
export async function POST(request: NextRequest) {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Log eerst in om je abonnement te starten' }, { status: 401 });
  }

  if (!isVacancySubscriptionConfigured()) {
    return NextResponse.json({ error: 'Abonnement is nog niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { locale } = (await request.json().catch(() => ({}))) as { locale?: Locale };
    const effectiveLocale = (locale ?? 'nl') as Locale;

    // EUR-markets first: the subscription is EUR-priced, so only allow it in
    // euro markets. The one-time €42 download is not gated here.
    if (!subscriptionMarketSupported(effectiveLocale)) {
      return NextResponse.json(
        { error: 'Het abonnement is nog niet beschikbaar in jouw regio' },
        { status: 403 }
      );
    }

    const vacaturesUrl = `${siteUrl}${localizedPath('/vacatures', effectiveLocale)}`;

    const result = await createVacancySubscriptionCheckout({
      userId: user.id,
      customerEmail: user.email,
      successUrl: `${vacaturesUrl}?welkom=1`,
      cancelUrl: vacaturesUrl,
      locale: effectiveLocale,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Checkout aanmaken mislukt' }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: result.checkoutUrl });
  } catch (err) {
    console.error('[vacancies/checkout] error:', err);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
