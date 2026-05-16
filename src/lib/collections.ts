/**
 * Per-country collections registry.
 *
 * NL orders go to Justus Collect (already integrated).
 * Other markets: no partner configured yet, so the cron marks the order
 * `incasso_manual_review` and stops auto-escalation. Admin then handles those
 * manually (or wires up a local partner here).
 */

import 'server-only';
import type { Locale } from '@/i18n/routing';

export type CollectionsProvider = 'justus_collect' | 'manual_review';

interface CountryConfig {
  provider: CollectionsProvider;
  /** Statutory collection-fee surcharge added on transfer, in customer's currency. */
  surcharge: number;
}

const COLLECTIONS_BY_LOCALE: Record<Locale, CountryConfig> = {
  nl: { provider: 'justus_collect', surcharge: 40 }, // WIK €40
  // TODO: wire UK/DE/SE/DK partners when contracts are in place.
  // Until then we collect manually — orders enter `incasso_manual_review` so
  // ops can decide per case (small-claims, in-house chasing, or write-off).
  en: { provider: 'manual_review', surcharge: 40 }, // £40 (Late Payment of Commercial Debts Regulations)
  de: { provider: 'manual_review', surcharge: 40 }, // €40 (BGB § 288 Abs. 5)
  sv: { provider: 'manual_review', surcharge: 180 }, // 180 kr (inkassolagen)
  da: { provider: 'manual_review', surcharge: 100 }, // 100 kr (rentelovens)
};

export function getCollectionsConfig(locale: Locale): CountryConfig {
  return COLLECTIONS_BY_LOCALE[locale] ?? COLLECTIONS_BY_LOCALE.nl;
}

export function shouldUseJustus(locale: Locale): boolean {
  return getCollectionsConfig(locale).provider === 'justus_collect';
}

/**
 * Total amount after collections surcharge — used when the order escalates
 * past the WIK grace period and incurs statutory fees.
 */
export function amountWithSurcharge(baseAmount: number, locale: Locale): number {
  return baseAmount + getCollectionsConfig(locale).surcharge;
}
