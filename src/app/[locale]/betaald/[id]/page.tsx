import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle, ArrowRight, FileText, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getOrder } from '@/lib/orders';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import { vacanciesEnabled, subscriptionMarketSupported } from '@/lib/vacancies-flag';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const CURRENCY_FORMAT: Record<string, (a: number) => string> = {
  nl: (a) => `€${a.toFixed(2).replace('.', ',')}`,
  de: (a) => `${a.toFixed(2).replace('.', ',')} €`,
  en: (a) => `£${a.toFixed(2)}`,
  sv: (a) => `${Math.round(a)} kr`,
  da: (a) => `${Math.round(a)} kr`,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PaymentSuccess' });
  return {
    title: `${t('pageTitle')} - ResuBox`,
    description: t('pageDescription'),
  };
}

export default async function BetaaldPage({ params }: PageProps) {
  const { locale, id } = await params;
  const order = await getOrder(id);
  const t = await getTranslations({ locale, namespace: 'PaymentSuccess' });
  const orderLocale = order?.locale ?? order?.cv_data?.meta?.locale ?? locale;
  const formatPrice = CURRENCY_FORMAT[orderLocale] ?? CURRENCY_FORMAT.nl;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={160} height={40} className="h-8 sm:h-10 w-auto" priority />
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            {t('subtitle')}
          </p>

          {order && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-8 text-left">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {t('detailsTitle')}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">{t('invoiceNumber')}</span>
                  <span className="font-medium text-slate-900">{order.dossier_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">{t('name')}</span>
                  <span className="font-medium text-slate-900">{order.customer_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">{t('amount')}</span>
                  <span className="font-medium text-emerald-600">{formatPrice(order.amount)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">{t('status')}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {t('statusPaid')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              {order
                ? t('confirmationEmail', { email: order.customer_email })
                : t('confirmationEmailGeneric')}
            </p>
          </div>

          {vacanciesEnabled() && subscriptionMarketSupported(orderLocale) && (
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 sm:p-8 mb-8 text-left">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Solliciteer direct op echte vacatures
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Blader gratis door actuele vacatures die bij jouw CV passen. Wil
                je solliciteren? Stem je motivatiebrief met één klik af op de
                vacature — 7 dagen voor €1, daarna €17,25/mnd.
              </p>
              <Link
                href="/vacatures"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Bekijk vacatures
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {t('newCv')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ResuBox. {t('rightsReserved')}</p>
        </div>
      </footer>
    </main>
  );
}
