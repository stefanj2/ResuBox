import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BuilderMeta' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(','),
    alternates: { canonical: '/builder' },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: '/builder',
    },
  };
}

export default async function BuilderLayout({ children }: Props) {
  return children;
}
