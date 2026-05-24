import {
  pgTable,
  text,
  uuid,
  numeric,
  timestamp,
  jsonb,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { CVData } from '@/types/cv';
import type { OrderStatus, ActionType, AnalyticsEventType } from '@/types/admin';

export const cvOrders = pgTable(
  'cv_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    status: text('status').$type<OrderStatus>().notNull().default('nieuw'),

    customer_name: text('customer_name').notNull(),
    customer_email: text('customer_email').notNull(),
    customer_phone: text('customer_phone'),

    customer_address: text('customer_address'),
    customer_house_number: text('customer_house_number'),
    customer_postal_code: text('customer_postal_code'),
    customer_city: text('customer_city'),

    cv_id: text('cv_id'),
    template_used: text('template_used'),
    cv_data: jsonb('cv_data').$type<CVData>(),

    /**
     * Locale captured at download time. Drives email language, SMS language,
     * Stripe checkout language, currency, and per-country collections routing.
     * Mirror of `cv_data.meta.locale` but promoted to a queryable column so
     * admin can filter and the cron doesn't have to dig into JSONB.
     */
    locale: text('locale').notNull().default('nl'),

    amount: numeric('amount', { precision: 10, scale: 2 }).notNull().default('42.00'),
    dossier_number: text('dossier_number'),

    stripe_session_id: text('stripe_session_id'),
    stripe_payment_status: text('stripe_payment_status'),
    payment_link: text('payment_link'),
    paid_at: timestamp('paid_at', { withTimezone: true, mode: 'string' }),

    confirmation_sent_at: timestamp('confirmation_sent_at', { withTimezone: true, mode: 'string' }),
    invoice_sent_at: timestamp('invoice_sent_at', { withTimezone: true, mode: 'string' }),
    reminder_1_sent_at: timestamp('reminder_1_sent_at', { withTimezone: true, mode: 'string' }),
    reminder_2_sent_at: timestamp('reminder_2_sent_at', { withTimezone: true, mode: 'string' }),
    reminder_3_sent_at: timestamp('reminder_3_sent_at', { withTimezone: true, mode: 'string' }),
    incasso_sent_at: timestamp('incasso_sent_at', { withTimezone: true, mode: 'string' }),
    sms_1_sent_at: timestamp('sms_1_sent_at', { withTimezone: true, mode: 'string' }),
    sms_2_sent_at: timestamp('sms_2_sent_at', { withTimezone: true, mode: 'string' }),

    justus_case_id: text('justus_case_id'),
    justus_case_number: text('justus_case_number'),

    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('cv_orders_customer_email_idx').on(t.customer_email),
    index('cv_orders_status_idx').on(t.status),
    index('cv_orders_justus_case_id_idx').on(t.justus_case_id),
    index('cv_orders_created_at_idx').on(t.created_at),
  ]
);

export const orderActions = pgTable(
  'order_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    order_id: uuid('order_id')
      .notNull()
      .references(() => cvOrders.id, { onDelete: 'cascade' }),
    action_type: text('action_type').$type<ActionType>().notNull(),
    action_description: text('action_description').notNull(),
    performed_by: text('performed_by').notNull().default('system'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('order_actions_order_id_idx').on(t.order_id),
    index('order_actions_created_at_idx').on(t.created_at),
  ]
);

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    session_id: text('session_id').notNull(),
    event_type: text('event_type').$type<AnalyticsEventType>().notNull(),
    section_id: integer('section_id'),
    section_name: text('section_name'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('analytics_events_session_id_idx').on(t.session_id),
    index('analytics_events_created_at_idx').on(t.created_at),
  ]
);

// ───────────────────────────────────────────────────────────────
// Accounts + multi-CV

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
    last_login_at: timestamp('last_login_at', { withTimezone: true, mode: 'string' }),
  },
  (t) => [index('users_email_idx').on(t.email)]
);

export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    // Magic-link tokens are short-lived (15 min); session cookies live longer (30 days).
    kind: text('kind').$type<'magic_link' | 'session'>().notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
    used_at: timestamp('used_at', { withTimezone: true, mode: 'string' }),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('user_sessions_token_idx').on(t.token),
    index('user_sessions_user_id_idx').on(t.user_id),
  ]
);

export const userCvs = pgTable(
  'user_cvs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    cv_data: jsonb('cv_data').$type<CVData>().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index('user_cvs_user_id_idx').on(t.user_id)]
);

// ───────────────────────────────────────────────────────────────
// Vacancy match — subscription + applied vacancies

/**
 * One row per user holding the state of their "Vacaturematch" subscription.
 * Driven entirely by Stripe webhooks (checkout.session.completed in
 * subscription mode + customer.subscription.* + invoice.*). Access is granted
 * while `status` is 'trialing' or 'active' and `current_period_end` is in the
 * future. Mirrors the relevant Stripe fields so the app never has to call
 * Stripe on a read path.
 */
export const vacancySubscriptions = pgTable(
  'vacancy_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),

    stripe_customer_id: text('stripe_customer_id'),
    stripe_subscription_id: text('stripe_subscription_id'),

    // Mirror of Stripe subscription.status: trialing | active | past_due |
    // canceled | incomplete | incomplete_expired | unpaid | paused.
    status: text('status').notNull().default('incomplete'),

    trial_end: timestamp('trial_end', { withTimezone: true, mode: 'string' }),
    current_period_end: timestamp('current_period_end', { withTimezone: true, mode: 'string' }),
    cancel_at_period_end: text('cancel_at_period_end'),

    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('vacancy_subscriptions_user_id_idx').on(t.user_id),
    index('vacancy_subscriptions_stripe_customer_id_idx').on(t.stripe_customer_id),
    index('vacancy_subscriptions_stripe_subscription_id_idx').on(t.stripe_subscription_id),
  ]
);

/**
 * Audit + history of vacancies a user generated a tailored motivatiebrief for.
 * Doubles as a "what did I already apply to" list in the UI.
 */
export const vacancyApplications = pgTable(
  'vacancy_applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    vacancy_external_id: text('vacancy_external_id'),
    vacancy_title: text('vacancy_title'),
    vacancy_company: text('vacancy_company'),
    vacancy_url: text('vacancy_url'),

    // Generated CoverLetterData (or its body parts) so the user can re-open it.
    cover_letter: jsonb('cover_letter').$type<Record<string, unknown>>(),

    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index('vacancy_applications_user_id_idx').on(t.user_id)]
);

export type CvOrderRow = typeof cvOrders.$inferSelect;
export type CvOrderInsert = typeof cvOrders.$inferInsert;
export type OrderActionRow = typeof orderActions.$inferSelect;
export type OrderActionInsert = typeof orderActions.$inferInsert;
export type AnalyticsEventRow = typeof analyticsEvents.$inferSelect;
export type AnalyticsEventInsert = typeof analyticsEvents.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type UserSessionRow = typeof userSessions.$inferSelect;
export type UserCvRow = typeof userCvs.$inferSelect;
export type UserCvInsert = typeof userCvs.$inferInsert;
export type VacancySubscriptionRow = typeof vacancySubscriptions.$inferSelect;
export type VacancySubscriptionInsert = typeof vacancySubscriptions.$inferInsert;
export type VacancyApplicationRow = typeof vacancyApplications.$inferSelect;
export type VacancyApplicationInsert = typeof vacancyApplications.$inferInsert;
