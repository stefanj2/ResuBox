import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getExamplesForLocale } from '@/lib/cv-examples';
import { Footer } from '@/components/landing';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CvExamples' });
  return {
    title: `${t('pageTitle')} | ResuBox`,
    description: t('pageDescription'),
    alternates: { canonical: '/cv-voorbeelden' },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
    },
  };
}

export default async function CvVoorbeeldenIndex({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CvExamples' });
  const tHeader = await getTranslations({ locale, namespace: 'Header' });
  const examples = getExamplesForLocale(locale);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {tHeader('ctaPrimary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('badgeAts')}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> {t('badgeDownload')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((ex) => (
              <Link
                key={ex.slug}
                href={{ pathname: '/cv-voorbeelden/[functie]', params: { functie: ex.slug } }}
                className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                    {t('cardLabel')}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {ex.functie}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {ex.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  {t('viewExample')} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-slate-600 mb-8">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {t('ctaButton')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
