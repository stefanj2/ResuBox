import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/landing';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import { Link } from '@/i18n/navigation';
import AtsCheckClient from './AtsCheckClient';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AtsCheck' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: '/ats-check' },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      type: 'website',
    },
  };
}

export default async function AtsCheckPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AtsCheck' });
  const tHeader = await getTranslations({ locale, namespace: 'Header' });

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
              >
                {tHeader('ctaPrimary')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
            {t('badge')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AtsCheckClient />
        </div>
      </section>

      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('whatWeCheck')}</h2>
          <div className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('checkTextTitle')}</h3>
              <p>{t('checkTextBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('checkSectionsTitle')}</h3>
              <p>{t('checkSectionsBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('checkContactTitle')}</h3>
              <p>{t('checkContactBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('checkLengthTitle')}</h3>
              <p>{t('checkLengthBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('checkMatchTitle')}</h3>
              <p>{t('checkMatchBody')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
