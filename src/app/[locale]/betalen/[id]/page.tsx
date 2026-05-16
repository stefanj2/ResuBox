import { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ShieldCheck, CheckCircle, FileText, Mail, Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getOrder } from '@/lib/orders';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import FaqAccordion from './FaqAccordion';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const DATE_LOCALES: Record<string, string> = {
  nl: 'nl-NL',
  de: 'de-DE',
  en: 'en-GB',
  sv: 'sv-SE',
  da: 'da-DK',
};

const CURRENCY_FORMAT: Record<string, (a: number) => string> = {
  nl: (a) => `€${a.toFixed(2).replace('.', ',')}`,
  de: (a) => `${a.toFixed(2).replace('.', ',')} €`,
  en: (a) => `£${a.toFixed(2)}`,
  sv: (a) => `${Math.round(a)} kr`,
  da: (a) => `${Math.round(a)} kr`,
};

const VAT_LABEL: Record<string, string> = {
  nl: 'incl. BTW',
  de: 'inkl. MwSt.',
  en: 'incl. VAT',
  sv: 'inkl. moms',
  da: 'inkl. moms',
};

const LATE_FEE_LABEL: Record<string, string> = {
  nl: '€40+',
  de: '40 €+',
  en: '£40+',
  sv: '180 kr+',
  da: '100 kr+',
};

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Payment' });
  return {
    title: `${t('pageTitle')} - ResuBox`,
    description: t('pageDescription'),
  };
}

export default async function BetalenPage({ params }: PageProps) {
  const { locale, id } = await params;
  const order = await getOrder(id);
  const t = await getTranslations({ locale, namespace: 'Payment' });

  if (order?.status === 'betaald') {
    redirect(locale === 'nl' ? `/betaald/${id}` : `/${locale}/betaald/${id}`);
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">{t('notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('notFoundBody')}</p>
          <Link href="/" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            {t('backHome')}
          </Link>
        </div>
      </main>
    );
  }

  const orderLocale = order.locale ?? order.cv_data?.meta?.locale ?? locale;
  const dateLocale = DATE_LOCALES[orderLocale] ?? 'en-GB';
  const formatPrice = CURRENCY_FORMAT[orderLocale] ?? CURRENCY_FORMAT.nl;
  const vatLabel = VAT_LABEL[orderLocale] ?? VAT_LABEL.nl;
  const lateFee = LATE_FEE_LABEL[orderLocale] ?? LATE_FEE_LABEL.nl;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

  const paymentDeadline = addDays(order.created_at, 14);
  const isOverdue = new Date() > new Date(paymentDeadline);
  const pi = order.cv_data?.personal;
  const cvName = pi ? `${pi.firstName} ${pi.lastName}`.trim() : order.customer_name;
  const street = order.customer_address || pi?.address || '';
  const houseNumber = order.customer_house_number || pi?.houseNumber || '';
  const postalCode = order.customer_postal_code || pi?.postalCode || '';
  const city = order.customer_city || pi?.city || '';

  const templateLabels: Record<string, string> = {
    modern: 'Modern',
    zakelijk: 'Zakelijk',
    creatief: 'Creatief',
    minimalist: 'Minimalist',
    executive: 'Executive',
    tech: 'Tech',
  };

  const useIdeal = orderLocale === 'nl';

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/resubox-logo.svg" alt="ResuBox" width={130} height={32} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>{t('securePayment')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          <div className="bg-white rounded-lg border border-[#e0e0e0]">
            <div className="px-8 pt-7 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-slate-500">{t('invoiceFrom')}</p>
                  <p className="text-[14px] font-medium text-slate-700 mt-0.5">{t('cvDownload')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[38px] font-bold text-slate-900 leading-none">{formatPrice(order.amount)}</p>
                  <p className="text-[12px] text-slate-400 mt-1">{vatLabel}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            <div className="px-8 pt-5 pb-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">{t('contactDetails')}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">{t('name')}</span>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-slate-800">{order.customer_name}</p>
                    {street && <p className="text-[13px] text-slate-600">{street} {houseNumber}</p>}
                    {(postalCode || city) && <p className="text-[13px] text-slate-600">{postalCode} {city}</p>}
                    {!street && !postalCode && !city && <p className="text-[13px] text-slate-400 italic">{t('noAddress')}</p>}
                  </div>
                </div>
                {order.customer_phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">{t('phone')}</span>
                    <span className="text-[13px] font-semibold text-slate-800">{order.customer_phone}</span>
                  </div>
                )}
                {pi?.dateOfBirth && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">{t('dateOfBirth')}</span>
                    <span className="text-[13px] font-semibold text-slate-800">{formatDate(pi.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            <div className="px-8 pt-5 pb-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">{t('cvDetails')}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">{t('cvFor')}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{cvName}</span>
                </div>
                {order.template_used && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">{t('template')}</span>
                    <span className="text-[13px] font-semibold text-slate-800">{templateLabels[order.template_used] ?? order.template_used}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">{t('downloadedOn')}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{formatDate(order.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            <div className="px-8 pt-5 pb-5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">{t('invoiceTab')}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">{t('reference')}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{order.dossier_number ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">{t('paymentDeadline')}</span>
                  <span className={`text-[13px] font-semibold ${isOverdue ? 'text-red-600' : 'text-red-500'}`}>
                    {formatDate(paymentDeadline)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#f0f0f0]">
                  <span className="text-[14px] font-bold text-slate-800">{t('total')}</span>
                  <span className="text-[14px] font-bold text-slate-800">{formatPrice(order.amount)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            <div className="px-8 py-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">{t('paymentMethod')}</p>

              <div className="space-y-2">
                {useIdeal ? (
                  <>
                    <div className="border border-emerald-500 rounded-lg px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <Image src="/ideal-logo.svg" alt="iDEAL" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">iDEAL</p>
                          <p className="text-[12px] text-slate-500">{t('idealHint')}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 bg-white">
                        <span className="text-[13px] text-slate-600">{t('card')}</span>
                      </div>
                      <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 bg-white">
                        <span className="text-[13px] text-slate-600">Bancontact</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="border border-emerald-500 rounded-lg px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{t('card')}</p>
                        <p className="text-[12px] text-slate-500">{t('cardHint')}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  </div>
                )}
              </div>

              {order.payment_link ? (
                <a
                  href={order.payment_link}
                  className="mt-3 flex items-center justify-center w-full py-3.5 bg-emerald-600 text-white font-semibold text-[15px] rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {t('payNow', { amount: formatPrice(order.amount) })}
                </a>
              ) : (
                <div className="mt-3 flex items-center justify-center w-full py-3.5 bg-slate-200 text-slate-400 font-semibold text-[15px] rounded-lg cursor-not-allowed">
                  {t('linkBeingCreated')}
                </div>
              )}

              <div className="mt-2.5 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t('sslSecure')}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Stripe
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-600 rounded-lg px-4 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{t('cvReadyTitle')}</p>
                <p className="text-[12px] text-emerald-100 mt-0.5">{t('cvReadyBody')}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-3 flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-[13px] text-slate-700">{t.rich('socialProof', { strong: (c) => <strong>{c}</strong> })}</p>
            </div>

            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[14px] font-semibold text-slate-800 mb-1">{t('faqTitle')}</p>
              <FaqAccordion locale={orderLocale} />
            </div>

            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[12px] text-slate-500 font-medium mb-3 flex items-center gap-1">
                <span className="text-slate-400">↗</span> {t('ifNotPay')}
              </p>
              <div className="space-y-3">
                {[
                  { n: 1, title: t('step1Title'), desc: t('step1Body') },
                  { n: 2, title: t('step2Title'), desc: t('step2Body') },
                  { n: 3, title: t('step3Title'), desc: t('step3Body', { fee: lateFee }) },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-slate-500 mt-0.5">{n}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{title}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-slate-50 rounded px-3 py-2">
                <p className="text-[11px] text-slate-500">
                  {t('payNowAvoid', { amount: formatPrice(order.amount) })}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[14px] font-semibold text-slate-800 mb-3">{t('helpTitle')}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{t('emailLabel')}</p>
                    <a href="mailto:info@resubox.com" className="text-[13px] text-emerald-600 font-medium hover:underline">info@resubox.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{t('hoursLabel')}</p>
                    <p className="text-[13px] text-slate-700 font-medium">{t('hoursValue')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#e8e8e8] py-5 mt-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-400">
          <Image src="/resubox-logo.svg" alt="ResuBox" width={70} height={18} className="h-3.5 w-auto opacity-30" />
          <span className="hidden sm:inline">·</span>
          <span>&copy; {new Date().getFullYear()} ResuBox</span>
        </div>
      </footer>
    </main>
  );
}
