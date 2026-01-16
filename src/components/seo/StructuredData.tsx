// JSON-LD Structured Data Components for SEO
// Note: dangerouslySetInnerHTML is safe here as we're using hardcoded schema data, not user input

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ResuBox',
    url: 'https://resubox.nl',
    logo: 'https://resubox.nl/resubox-logo.jpeg',
    description: 'ResuBox is een online CV-builder waarmee je snel en eenvoudig een professioneel CV kunt maken.',
    email: 'info@resubox.nl',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ResuBox CV Builder',
    url: 'https://resubox.nl/builder',
    description: 'Maak gratis een professioneel CV met ResuBox. ATS-geoptimaliseerd met 6 moderne templates.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '42.00',
      priceCurrency: 'EUR',
      description: 'Eenmalige betaling voor CV download',
    },
    featureList: [
      'ATS-geoptimaliseerde CV templates',
      '6 professionele designs',
      'PDF export',
      'Realtime preview',
      'Geen account nodig',
      'Nederlandse taal',
    ],
    screenshot: 'https://resubox.nl/og-image.png',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
