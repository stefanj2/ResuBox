/**
 * Kill-switch for the CV-download subscription model (€0,50 verification →
 * 14-day trial → €39/mo). When OFF the builder falls back to the legacy €42
 * one-time download flow. Mirrors the EMAILS_ENABLED / VACANCIES_ENABLED
 * safety pattern: explicit opt-in via NEXT_PUBLIC_CV_SUB_ENABLED=true.
 *
 * NEXT_PUBLIC_ so the same flag gates both server routes and the download
 * modal in the client — one switch, no drift.
 */
export function cvSubscriptionEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CV_SUB_ENABLED === 'true';
}

/**
 * Locales whose market we offer the CV subscription in. Same constraint as
 * the Vacaturematch subscription: EUR-only because the €0,50/€39 prices are
 * in EUR and recurring auth works via card + iDEAL/Bancontact (SEPA mandate)
 * in NL/DE. Other markets keep the legacy one-time download flow.
 */
export const CV_SUBSCRIPTION_LOCALES = ['nl', 'de'] as const;

export function cvSubscriptionMarketSupported(locale: string | undefined): boolean {
  return CV_SUBSCRIPTION_LOCALES.includes(
    (locale ?? 'nl') as (typeof CV_SUBSCRIPTION_LOCALES)[number]
  );
}
