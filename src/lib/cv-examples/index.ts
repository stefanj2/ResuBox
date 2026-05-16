import EXAMPLES_NL, { EXAMPLE_BY_SLUG as EXAMPLE_BY_SLUG_NL, EXAMPLE_SLUGS as EXAMPLE_SLUGS_NL } from './data';
import EXAMPLES_EN, { EXAMPLE_BY_SLUG_EN, EXAMPLE_SLUGS_EN } from './data-en';
import EXAMPLES_DE, { EXAMPLE_BY_SLUG_DE, EXAMPLE_SLUGS_DE } from './data-de';
import EXAMPLES_SV, { EXAMPLE_BY_SLUG_SV, EXAMPLE_SLUGS_SV } from './data-sv';
import EXAMPLES_DA, { EXAMPLE_BY_SLUG_DA, EXAMPLE_SLUGS_DA } from './data-da';
import type { FunctieExample } from './types';

const BY_LOCALE: Record<string, FunctieExample[]> = {
  nl: EXAMPLES_NL,
  en: EXAMPLES_EN,
  de: EXAMPLES_DE,
  sv: EXAMPLES_SV,
  da: EXAMPLES_DA,
};

const BY_SLUG_LOCALE: Record<string, Record<string, FunctieExample>> = {
  nl: EXAMPLE_BY_SLUG_NL,
  en: EXAMPLE_BY_SLUG_EN,
  de: EXAMPLE_BY_SLUG_DE,
  sv: EXAMPLE_BY_SLUG_SV,
  da: EXAMPLE_BY_SLUG_DA,
};

const SLUGS_LOCALE: Record<string, string[]> = {
  nl: EXAMPLE_SLUGS_NL,
  en: EXAMPLE_SLUGS_EN,
  de: EXAMPLE_SLUGS_DE,
  sv: EXAMPLE_SLUGS_SV,
  da: EXAMPLE_SLUGS_DA,
};

/**
 * Resolve the locale-appropriate CV examples set. Slugs are identical across
 * locales — only the persona/content differs — so URLs stay stable regardless
 * of the user's language.
 */
export function getExamplesForLocale(locale: string): FunctieExample[] {
  return BY_LOCALE[locale] ?? BY_LOCALE.nl;
}

export function getExampleBySlug(slug: string, locale: string): FunctieExample | undefined {
  return (BY_SLUG_LOCALE[locale] ?? BY_SLUG_LOCALE.nl)[slug];
}

export function getExampleSlugs(locale: string): string[] {
  return SLUGS_LOCALE[locale] ?? SLUGS_LOCALE.nl;
}

// Union of slugs across all locales (slug sets match, so NL is canonical).
export const ALL_SLUGS: string[] = EXAMPLE_SLUGS_NL;
