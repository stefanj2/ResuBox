import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, findOrCreateUser } from '@/lib/user-auth';
import { cvSubscriptionEnabled, cvSubscriptionMarketSupported } from '@/lib/cv-subscription-flag';
import { createEmbeddedCVSubscription, isCVSubscriptionConfigured } from '@/lib/stripe';
import { localizedPath, type Locale } from '@/i18n/routing';

export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * POST /api/cv/subscribe
 * Creates an embedded Stripe Checkout session for the €0,50 verification +
 * 14-day trial + €39/mo CV-download subscription. Identifies the visitor via
 * session cookie or the email entered in the builder; access to the PDF/DOCX
 * is unlocked after /api/cv/subscribe/complete verifies the session.
 */
export async function POST(request: NextRequest) {
  if (!cvSubscriptionEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }
  if (!isCVSubscriptionConfigured()) {
    return NextResponse.json({ error: 'Abonnement is nog niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { email, locale } = (await request.json().catch(() => ({}))) as {
      email?: string;
      locale?: Locale;
    };
    const effectiveLocale = (locale ?? 'nl') as Locale;

    if (!cvSubscriptionMarketSupported(effectiveLocale)) {
      return NextResponse.json(
        { error: 'Het abonnement is nog niet beschikbaar in jouw regio' },
        { status: 403 }
      );
    }

    let user = await getCurrentUser();
    if (!user) {
      const normalized = (email ?? '').toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
      }
      user = await findOrCreateUser(normalized);
    }

    const returnUrl = `${siteUrl}${localizedPath('/builder', effectiveLocale)}?cv_checkout={CHECKOUT_SESSION_ID}`;

    const result = await createEmbeddedCVSubscription({
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
    console.error('[cv/subscribe] error:', err);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
