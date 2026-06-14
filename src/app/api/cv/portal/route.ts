import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { getCVAccessState } from '@/lib/cv-access';
import { cvSubscriptionEnabled } from '@/lib/cv-subscription-flag';
import { createBillingPortalSession } from '@/lib/stripe';
import { localizedPath, type Locale } from '@/i18n/routing';

export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * POST /api/cv/portal
 * Opens the Stripe Billing Portal so the CV-subscription holder can manage
 * payment method or cancel.
 */
export async function POST(request: NextRequest) {
  if (!cvSubscriptionEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const access = await getCVAccessState(user.id);
  if (!access.stripeCustomerId) {
    return NextResponse.json({ error: 'Geen abonnement gevonden' }, { status: 404 });
  }

  try {
    const { locale } = (await request.json().catch(() => ({}))) as { locale?: Locale };
    const returnUrl = `${siteUrl}${localizedPath('/account', (locale ?? 'nl') as Locale)}`;
    const result = await createBillingPortalSession(access.stripeCustomerId, returnUrl);

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Kon portaal niet openen' }, { status: 500 });
    }
    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('[cv/portal] error:', err);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
