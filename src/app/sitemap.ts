import { MetadataRoute } from 'next';
import { EXAMPLE_SLUGS } from '@/lib/cv-examples/data';
import { hasLetterContext } from '@/lib/cover-letter-examples/data';
import { routing, localizedPath, type Locale } from '@/i18n/routing';

/**
 * Multilingual sitemap with hreflang alternates and per-locale slugs.
 *
 * Each internal path is emitted once per locale with that locale's URL slug.
 * Example: /cv-voorbeelden → /cv-voorbeelden (nl), /en/cv-examples,
 * /de/lebenslauf-beispiele, /sv/cv-exempel, /da/cv-eksempler.
 */

type PathName = keyof typeof routing.pathnames;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.resubox.com';

  const staticPaths: Array<{
    internal: PathName;
    params?: Record<string, string>;
    priority: number;
    changeFrequency: 'weekly' | 'monthly';
  }> = [
    { internal: '/', priority: 1.0, changeFrequency: 'weekly' },
    { internal: '/builder', priority: 0.9, changeFrequency: 'weekly' },
    { internal: '/cv-voorbeelden', priority: 0.85, changeFrequency: 'weekly' },
    { internal: '/motivatiebrief', priority: 0.85, changeFrequency: 'monthly' },
    { internal: '/motivatiebrief-voorbeeld', priority: 0.8, changeFrequency: 'weekly' },
    { internal: '/ats-check', priority: 0.85, changeFrequency: 'monthly' },
    { internal: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { internal: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { internal: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { internal: '/voorwaarden', priority: 0.3, changeFrequency: 'monthly' },
  ];

  const dynamicPaths = [
    ...EXAMPLE_SLUGS.map((slug) => ({
      internal: '/cv-voorbeelden/[functie]' as PathName,
      params: { functie: slug },
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    })),
    ...EXAMPLE_SLUGS.filter(hasLetterContext).map((slug) => ({
      internal: '/motivatiebrief-voorbeeld/[functie]' as PathName,
      params: { functie: slug },
      priority: 0.65,
      changeFrequency: 'monthly' as const,
    })),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];

  const entries: MetadataRoute.Sitemap = [];
  for (const { internal, params, priority, changeFrequency } of allPaths) {
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
      languages[loc] = `${baseUrl}${localizedPath(internal, loc as Locale, params ?? {})}`;
    }
    languages['x-default'] = `${baseUrl}${localizedPath(internal, routing.defaultLocale as Locale, params ?? {})}`;

    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}${localizedPath(internal, locale as Locale, params ?? {})}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
