import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { vacancySubscriptions, type VacancySubscriptionRow } from '@/db/schema';

/**
 * Subscription state + access checks for the "Vacaturematch" feature.
 *
 * Source of truth is the `vacancy_subscriptions` row, which is kept in sync by
 * the Stripe webhook. Access is granted while the subscription is `trialing`
 * or `active` and the current period hasn't elapsed.
 */

const ACTIVE_STATUSES = new Set(['trialing', 'active']);

export interface AccessState {
  hasAccess: boolean;
  status: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

export function rowToAccess(row: VacancySubscriptionRow | undefined | null): AccessState {
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

export async function getSubscription(userId: string): Promise<VacancySubscriptionRow | null> {
  const rows = await db
    .select()
    .from(vacancySubscriptions)
    .where(eq(vacancySubscriptions.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAccessState(userId: string): Promise<AccessState> {
  return rowToAccess(await getSubscription(userId));
}

export interface UpsertSubscriptionInput {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status?: string;
  trialEnd?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Insert or update the user's subscription row. Only provided fields are
 * written, so partial events (e.g. just a status change) don't clobber data
 * set by an earlier event.
 */
export async function upsertSubscription(input: UpsertSubscriptionInput): Promise<void> {
  const now = new Date().toISOString();
  const existing = await getSubscription(input.userId);

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
    await db.update(vacancySubscriptions).set(patch).where(eq(vacancySubscriptions.user_id, input.userId));
  } else {
    await db.insert(vacancySubscriptions).values({
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
