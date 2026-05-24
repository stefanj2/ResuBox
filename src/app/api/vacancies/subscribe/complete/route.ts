import { NextRequest, NextResponse } from 'next/server';
import { issueSessionForUser } from '@/lib/user-auth';
import { vacanciesEnabled } from '@/lib/vacancies-flag';
import { getVacancyCheckoutResult } from '@/lib/stripe';
import { upsertSubscription } from '@/lib/vacancy-access';

export const runtime = 'nodejs';

/**
 * POST /api/vacancies/subscribe/complete
 * Called when the visitor returns from the embedded checkout. Verifies the
 * completed Checkout Session, logs the buyer in (ownership proven by the paid
 * checkout), and records the subscription so access is granted immediately —
 * without waiting for the webhook.
 */
export async function POST(request: NextRequest) {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId ontbreekt' }, { status: 400 });
    }

    const result = await getVacancyCheckoutResult(sessionId);
    if (!result.complete || !result.userId) {
      return NextResponse.json({ ok: false });
    }

    await upsertSubscription({
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
    console.error('[vacancies/subscribe/complete] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
