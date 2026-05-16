import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FAQMeta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/faq' },
    openGraph: {
      title: `${t('title')} | ResuBox`,
      description: t('description'),
      url: '/faq',
    },
  };
}

export default function FAQLayout({ children }: Props) {
  return children;
}
