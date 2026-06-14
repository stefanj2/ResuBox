import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { cvSubscriptions, type CvSubscriptionRow } from '@/db/schema';

/**
 * Subscription state + access checks for CV downloads. Source of truth is the
 * `cv_subscriptions` row, synced by the Stripe webhook. Access is granted
 * while status is 'trialing' or 'active' and current_period_end is in the
 * future.
 */

const ACTIVE_STATUSES = new Set(['trialing', 'active']);

export interface CVAccessState {
  hasAccess: boolean;
  status: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

export function rowToAccess(row: CvSubscriptionRow | undefined | null): CVAccessState {
  if (!row) {
    return {
      hasAccess: false,
      status: null,
      trialEnd: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
    };
  }

  const periodOk = !row.current_period_end || new Date(row.current_period_end).getTime() > Date.now();
  const hasAccess = ACTIVE_STATUSES.has(row.status) && periodOk;

  return {
    hasAccess,
    status: row.status,
    trialEnd: row.trial_end,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end === 'true',
    stripeCustomerId: row.stripe_customer_id,
  };
}

export async function getCVSubscription(userId: string): Promise<CvSubscriptionRow | null> {
  const rows = await db
    .select()
    .from(cvSubscriptions)
    .where(eq(cvSubscriptions.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getCVAccessState(userId: string): Promise<CVAccessState> {
  return rowToAccess(await getCVSubscription(userId));
}

export interface UpsertCVSubscriptionInput {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status?: string;
  trialEnd?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

export async function upsertCVSubscription(input: UpsertCVSubscriptionInput): Promise<void> {
  const now = new Date().toISOString();
  const existing = await getCVSubscription(input.userId);

  const patch = {
    ...(input.stripeCustomerId !== undefined ? { stripe_customer_id: input.stripeCustomerId } : {}),
    ...(input.stripeSubscriptionId !== undefined ? { stripe_subscription_id: input.stripeSubscriptionId } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.trialEnd !== undefined ? { trial_end: input.trialEnd } : {}),
    ...(input.currentPeriodEnd !== undefined ? { current_period_end: input.currentPeriodEnd } : {}),
    ...(input.cancelAtPeriodEnd !== undefined ? { cancel_at_period_end: String(input.cancelAtPeriodEnd) } : {}),
    updated_at: now,
  };

  if (existing) {
    await db.update(cvSubscriptions).set(patch).where(eq(cvSubscriptions.user_id, input.userId));
  } else {
    await db.insert(cvSubscriptions).values({
      user_id: input.userId,
      stripe_customer_id: input.stripeCustomerId ?? null,
      stripe_subscription_id: input.stripeSubscriptionId ?? null,
      status: input.status ?? 'incomplete',
      trial_end: input.trialEnd ?? null,
      current_period_end: input.currentPeriodEnd ?? null,
      cancel_at_period_end: input.cancelAtPeriodEnd !== undefined ? String(input.cancelAtPeriodEnd) : null,
    });
  }
}
