import { MetadataRoute } from 'next';
import { EXAMPLE_SLUGS } from '@/lib/cv-examples/data';
import { hasLetterContext } from '@/lib/cover-letter-examples/data';
import { routing } from '@/i18n/routing';

/**
 * Multilingual sitemap with hreflang alternates.
 *
 * Each user-facing path is emitted once per locale. NL (default) has no
 * URL prefix (e.g. /builder); other locales are prefixed (/en/builder,
 * /de/builder, ...). The `alternates.languages` map gives Google the
 * full hreflang graph per URL.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.resubox.com';

  // Paths that should appear in every locale. Each entry becomes 5 URLs.
  const localizedPaths: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/builder', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/cv-voorbeelden', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/motivatiebrief', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/motivatiebrief-voorbeeld', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/ats-check', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/voorwaarden', priority: 0.3, changeFrequency: 'monthly' },
    ...EXAMPLE_SLUGS.map((slug) => ({ path: `/cv-voorbeelden/${slug}`, priority: 0.7 as number, changeFrequency: 'monthly' as const })),
    ...EXAMPLE_SLUGS.filter(hasLetterContext).map((slug) => ({
      path: `/motivatiebrief-voorbeeld/${slug}`,
      priority: 0.65,
      changeFrequency: 'monthly' as const,
    })),
  ];

  const urlFor = (locale: string, path: string) => {
    if (locale === routing.defaultLocale) return `${baseUrl}${path}`;
    return `${baseUrl}/${locale}${path}`;
  };

  const entries: MetadataRoute.Sitemap = [];
  for (const { path, priority, changeFrequency } of localizedPaths) {
    // alternates.languages maps every locale → its URL, plus x-default for unspecified
    const languages: Record<string, string> = { 'x-default': urlFor(routing.defaultLocale, path) };
    for (const loc of routing.locales) languages[loc] = urlFor(loc, path);

    for (const locale of routing.locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
