import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['nl', 'en', 'de', 'sv', 'da'] as const,
  defaultLocale: 'nl',
  // NL gets no URL prefix (preserves existing /cv-voorbeelden URLs);
  // other locales prefixed: /en/..., /de/..., /sv/..., /da/...
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  sv: 'Svenska',
  da: 'Dansk',
};

export const LOCALE_COUNTRIES: Record<Locale, string> = {
  nl: '🇳🇱',
  en: '🇬🇧',
  de: '🇩🇪',
  sv: '🇸🇪',
  da: '🇩🇰',
};
