import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['nl', 'en', 'de', 'sv', 'da'] as const,
  defaultLocale: 'nl',
  // NL gets no URL prefix (preserves existing /cv-voorbeelden URLs);
  // other locales prefixed: /en/..., /de/..., /sv/..., /da/...
  localePrefix: 'as-needed',
  // Per-locale URL slugs for proper local SEO. Internal Next.js paths stay
  // Dutch (the source of truth); next-intl rewrites them at the URL layer.
  pathnames: {
    '/': '/',
    '/builder': {
      nl: '/builder',
      en: '/builder',
      de: '/lebenslauf-erstellen',
      sv: '/cv-byggare',
      da: '/cv-bygger',
    },
    '/cv-voorbeelden': {
      nl: '/cv-voorbeelden',
      en: '/cv-examples',
      de: '/lebenslauf-beispiele',
      sv: '/cv-exempel',
      da: '/cv-eksempler',
    },
    '/cv-voorbeelden/[functie]': {
      nl: '/cv-voorbeelden/[functie]',
      en: '/cv-examples/[functie]',
      de: '/lebenslauf-beispiele/[functie]',
      sv: '/cv-exempel/[functie]',
      da: '/cv-eksempler/[functie]',
    },
    '/motivatiebrief': {
      nl: '/motivatiebrief',
      en: '/cover-letter',
      de: '/anschreiben',
      sv: '/personligt-brev',
      da: '/ansoegning',
    },
    '/motivatiebrief-voorbeeld': {
      nl: '/motivatiebrief-voorbeeld',
      en: '/cover-letter-examples',
      de: '/anschreiben-beispiele',
      sv: '/personligt-brev-exempel',
      da: '/ansoegning-eksempler',
    },
    '/motivatiebrief-voorbeeld/[functie]': {
      nl: '/motivatiebrief-voorbeeld/[functie]',
      en: '/cover-letter-examples/[functie]',
      de: '/anschreiben-beispiele/[functie]',
      sv: '/personligt-brev-exempel/[functie]',
      da: '/ansoegning-eksempler/[functie]',
    },
    '/ats-check': {
      nl: '/ats-check',
      en: '/ats-check',
      de: '/ats-pruefung',
      sv: '/ats-test',
      da: '/ats-test',
    },
    '/faq': {
      nl: '/faq',
      en: '/faq',
      de: '/faq',
      sv: '/vanliga-fragor',
      da: '/faq',
    },
    '/contact': '/contact',
    '/privacy': {
      nl: '/privacy',
      en: '/privacy',
      de: '/datenschutz',
      sv: '/integritet',
      da: '/privatliv',
    },
    '/voorwaarden': {
      nl: '/voorwaarden',
      en: '/terms',
      de: '/agb',
      sv: '/villkor',
      da: '/vilkaar',
    },
    '/login': {
      nl: '/login',
      en: '/sign-in',
      de: '/anmelden',
      sv: '/logga-in',
      da: '/log-ind',
    },
    '/dashboard': {
      nl: '/dashboard',
      en: '/dashboard',
      de: '/uebersicht',
      sv: '/dashboard',
      da: '/oversigt',
    },
    '/auth/verify': '/auth/verify',
    '/betalen/[id]': {
      nl: '/betalen/[id]',
      en: '/pay/[id]',
      de: '/bezahlen/[id]',
      sv: '/betala/[id]',
      da: '/betal/[id]',
    },
    '/betaald/[id]': {
      nl: '/betaald/[id]',
      en: '/paid/[id]',
      de: '/bezahlt/[id]',
      sv: '/betald/[id]',
      da: '/betalt/[id]',
    },
  },
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

/**
 * Build a public-facing URL for the given internal path and locale, with the
 * locale-specific slug substituted in. Used by server-side code (Stripe
 * checkout, e-mail templates, cron job) that needs to construct absolute URLs.
 *
 * Example: localizedPath('/betaald/[id]', 'en', { id: 'abc' }) → '/en/paid/abc'
 */
export function localizedPath(
  internalPath: keyof typeof routing.pathnames,
  locale: Locale,
  params: Record<string, string> = {}
): string {
  const entry = routing.pathnames[internalPath];
  const slugTemplate: string = typeof entry === 'string' ? entry : entry[locale];
  let filled = slugTemplate;
  for (const [key, value] of Object.entries(params)) {
    filled = filled.replace(`[${key}]`, value);
  }
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${prefix}${filled}`;
}
