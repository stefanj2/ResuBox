import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactMeta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/contact' },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: '/contact',
    },
  };
}

export default function ContactLayout({ children }: Props) {
  return children;
}
