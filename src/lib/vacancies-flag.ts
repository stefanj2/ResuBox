/**
 * Kill-switch for the Vacaturematch feature. Default OFF (mirrors the
 * EMAILS_ENABLED safety pattern): the feature only goes live when
 * NEXT_PUBLIC_VACANCIES_ENABLED is explicitly set to "true".
 *
 * It's a NEXT_PUBLIC_ var so the same flag controls both the server routes and
 * the client-side entry points (post-download CTAs) — one switch, no drift.
 */
export function vacanciesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VACANCIES_ENABLED === 'true';
}

/**
 * Locales whose market we offer the subscription in. EUR-markets first: the
 * €1/€18.95 prices are EUR-only and recurring works via card + iDEAL/Bancontact
 * (SEPA mandate) in these markets. SEK/DKK/GBP markets follow once we add
 * localized pricing. The one-time €42 CV download is unaffected — it keeps
 * running in every market.
 */
export const SUBSCRIPTION_LOCALES = ['nl', 'de'] as const;

export function subscriptionMarketSupported(locale: string | undefined): boolean {
  return SUBSCRIPTION_LOCALES.includes((locale ?? 'nl') as (typeof SUBSCRIPTION_LOCALES)[number]);
}
