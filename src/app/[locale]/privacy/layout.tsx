import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyMeta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/privacy' },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: '/privacy',
    },
  };
}

export default function PrivacyLayout({ children }: Props) {
  return children;
}
