import { NextRequest, NextResponse } from 'next/server';
import { issueSessionForUser } from '@/lib/user-auth';
import { cvSubscriptionEnabled } from '@/lib/cv-subscription-flag';
import { getCVCheckoutResult } from '@/lib/stripe';
import { upsertCVSubscription } from '@/lib/cv-access';

export const runtime = 'nodejs';

/**
 * POST /api/cv/subscribe/complete
 * Called when the visitor returns from the embedded checkout. Verifies the
 * completed session, logs the buyer in (ownership proven by the paid
 * checkout), and records the subscription so PDF/DOCX downloads are unlocked
 * immediately without waiting for the webhook.
 */
export async function POST(request: NextRequest) {
  if (!cvSubscriptionEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId ontbreekt' }, { status: 400 });
    }

    const result = await getCVCheckoutResult(sessionId);
    if (!result.complete || !result.userId) {
      return NextResponse.json({ ok: false });
    }

    await upsertCVSubscription({
      userId: result.userId,
      stripeCustomerId: result.customerId,
      stripeSubscriptionId: result.subscriptionId,
      status: result.status ?? 'trialing',
      trialEnd: result.trialEnd,
      currentPeriodEnd: result.currentPeriodEnd,
    });

    await issueSessionForUser(result.userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cv/subscribe/complete] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
