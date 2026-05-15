import { MetadataRoute } from 'next';
import { EXAMPLE_SLUGS } from '@/lib/cv-examples/data';
import { hasLetterContext } from '@/lib/cover-letter-examples/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resubox.nl';

  const examplePages: MetadataRoute.Sitemap = EXAMPLE_SLUGS.map((slug) => ({
    url: `${baseUrl}/cv-voorbeelden/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const letterExamplePages: MetadataRoute.Sitemap = EXAMPLE_SLUGS.filter(hasLetterContext).map((slug) => ({
    url: `${baseUrl}/motivatiebrief-voorbeeld/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cv-voorbeelden`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ats-check`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/motivatiebrief`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/motivatiebrief-voorbeeld`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...letterExamplePages,
    ...examplePages,
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
