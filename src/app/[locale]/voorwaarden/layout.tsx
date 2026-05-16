import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsMeta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/voorwaarden' },
    openGraph: {
      title: `${t('title')} | ResuBox`,
      description: t('description'),
      url: '/voorwaarden',
    },
  };
}

export default function VoorwaardenLayout({ children }: Props) {
  return children;
}
