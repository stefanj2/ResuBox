import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CoverLetterProvider } from '@/context/CoverLetterContext';
import CoverLetterEditor from './CoverLetterEditor';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CoverLetterBuilder' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/motivatiebrief' },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    },
  };
}

export default function MotivatiebriefPage() {
  return (
    <CoverLetterProvider>
      <CoverLetterEditor />
    </CoverLetterProvider>
  );
}
