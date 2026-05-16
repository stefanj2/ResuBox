import EXAMPLES_NL, { EXAMPLE_BY_SLUG as EXAMPLE_BY_SLUG_NL, EXAMPLE_SLUGS as EXAMPLE_SLUGS_NL } from './data';
import EXAMPLES_EN, { EXAMPLE_BY_SLUG_EN, EXAMPLE_SLUGS_EN } from './data-en';
import type { FunctieExample } from './types';

/**
 * Resolve the locale-appropriate CV examples set. The slugs are identical
 * across locales — only the persona/content differs — so URLs stay stable
 * regardless of the user's language.
 */
export function getExamplesForLocale(locale: string): FunctieExample[] {
  return locale === 'nl' ? EXAMPLES_NL : EXAMPLES_EN;
}

export function getExampleBySlug(slug: string, locale: string): FunctieExample | undefined {
  const map = locale === 'nl' ? EXAMPLE_BY_SLUG_NL : EXAMPLE_BY_SLUG_EN;
  return map[slug];
}

export function getExampleSlugs(locale: string): string[] {
  return locale === 'nl' ? EXAMPLE_SLUGS_NL : EXAMPLE_SLUGS_EN;
}

// Re-export for callers that only need the union of slugs (e.g. generateStaticParams)
export const ALL_SLUGS: string[] = EXAMPLE_SLUGS_NL;
