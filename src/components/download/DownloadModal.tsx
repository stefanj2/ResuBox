'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
  FileType,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { createOrder } from '@/lib/api/orders';
import { Link } from '@/i18n/navigation';
import { vacanciesEnabled, subscriptionMarketSupported } from '@/lib/vacancies-flag';

type Format = 'pdf' | 'docx';

interface VacancyTeaser {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

function teaserSalary(v: VacancyTeaser): string | null {
  if (!v.salaryMin && !v.salaryMax) return null;
  const n = v.salaryMax || v.salaryMin || 0;
  return `€${Math.round(n).toLocaleString('nl-NL')} p/j`;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_BY_LOCALE: Record<string, { value: number; currency: string; display: string }> = {
  nl: { value: 42, currency: 'EUR', display: '42 eur' },
  de: { value: 42, currency: 'EUR', display: '42 eur' },
  en: { value: 42, currency: 'GBP', display: '42 gbp' },
  sv: { value: 449, currency: 'SEK', display: '449 sek' },
  da: { value: 315, currency: 'DKK', display: '315 dkk' },
};

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { cvData } = useCVData();
  const locale = useLocale();
  const t = useTranslations('Download');
  const [agreed, setAgreed] = useState(true);
  const [format, setFormat] = useState<Format>('pdf');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Live teaser of real matching vacancies, shown on the success screen.
  const showVacancyTeaser = vacanciesEnabled() && subscriptionMarketSupported(locale);
  const [matches, setMatches] = useState<VacancyTeaser[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [matchState, setMatchState] = useState<'idle' | 'loading' | 'done' | 'empty'>('idle');

  const price = PRICE_BY_LOCALE[locale] ?? PRICE_BY_LOCALE.nl;

  // When the download succeeds, fetch a few real vacancies derived from the CV
  // so the user immediately sees what's out there for them.
  useEffect(() => {
    if (status !== 'success' || !showVacancyTeaser || matchState !== 'idle') return;
    setMatchState('loading');
    (async () => {
      try {
        const res = await fetch('/api/vacancies/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvData, sortBy: 'relevance' }),
        });
        const j = await res.json();
        const list: VacancyTeaser[] = res.ok ? (j.vacancies ?? []) : [];
        if (list.length > 0) {
          setMatches(list.slice(0, 3));
          setMatchCount(j.count ?? list.length);
          setMatchState('done');
        } else {
          setMatchState('empty');
        }
      } catch {
        setMatchState('empty');
      }
    })();
  }, [status, showVacancyTeaser, matchState, cvData]);

  const handleDownload = async () => {
    if (!agreed) {
      setErrorMessage(t('mustAgree'));
      return;
    }

    setStatus('processing');
    setErrorMessage('');
    setMatchState('idle');
    setMatches([]);

    try {
      const filename = `CV_${cvData.personal.firstName || 'Name'}_${cvData.personal.lastName || 'Surname'}`;
      const endpoint = format === 'pdf' ? '/api/generate-pdf' : '/api/generate-docx';
      const payload =
        format === 'pdf'
          ? {
              cvData,
              templateId: cvData.meta.selectedTemplate,
              colorSchemeId: cvData.meta.selectedColorScheme,
              filename,
              locale,
            }
          : {
              cvData,
              colorSchemeId: cvData.meta.selectedColorScheme,
              filename,
              locale,
            };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let detail = '';
        try {
          const j = await response.json();
          detail = j?.error || j?.details || '';
        } catch {
          // ignore
        }
        throw new Error(detail || `${format.toUpperCase()} (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const customerName = `${cvData.personal.firstName || ''} ${cvData.personal.lastName || ''}`.trim() || '—';
      const customerEmail = cvData.personal.email || 'unknown@email.com';

      // Persist the locale active at download time so emails and follow-ups
      // are sent in the language the customer was actually using.
      const cvDataForOrder = {
        ...cvData,
        meta: { ...cvData.meta, locale },
      };

      try {
        await createOrder({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: cvData.personal.phone,
          customer_address: cvData.personal.address,
          customer_house_number: cvData.personal.houseNumber,
          customer_postal_code: cvData.personal.postalCode,
          customer_city: cvData.personal.city,
          cv_id: cvData.id,
          template_used: cvData.meta.selectedTemplate,
          cv_data: cvDataForOrder,
        });
      } catch (orderError) {
        console.error('Order creation error:', orderError);
      }

      // Conversion tracking
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', 'purchase', {
          transaction_id: cvData.id,
          value: price.value,
          currency: price.currency,
          items: [
            {
              item_name: 'CV Download',
              item_category: cvData.meta.selectedTemplate,
              price: price.value,
              quantity: 1,
            },
          ],
        });
        gtag('event', 'manual_event_PURCHASE', {
          value: price.value,
          currency: price.currency,
          transaction_id: cvData.id,
        });
      }

      setStatus('success');
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage(error instanceof Error ? error.message : t('errorGeneric'));
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'processing') return;
    setStatus('idle');
    setAgreed(true);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" mobileFullScreen title={t('modalTitle')}>
      <div className="p-4 sm:p-6">
        {status === 'success' ? (
          <div className="text-center py-2 sm:py-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">{t('successTitle')}</h2>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              {t('successSubtitle')}
            </p>
            {(!showVacancyTeaser || matchState === 'empty') && (
              <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 text-left mb-4 sm:mb-6">
                <h4 className="font-medium text-emerald-800 mb-2 text-sm sm:text-base">{t('tipsTitle')}</h4>
                <ul className="text-xs sm:text-sm text-emerald-700 space-y-1 list-disc list-inside">
                  <li>{t('tip1')}</li>
                  <li>{t('tip2')}</li>
                  <li>{t('tip3')}</li>
                </ul>
              </div>
            )}
            {showVacancyTeaser && matchState !== 'empty' && (
              <div className="bg-white border border-emerald-200 rounded-xl p-4 text-left mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                    {matchState === 'done' && matchCount > 0
                      ? `${matchCount.toLocaleString('nl-NL')}+ vacatures die passen bij jouw CV`
                      : 'Vacatures die passen bij jouw CV'}
                  </h4>
                </div>

                {matchState === 'loading' && (
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                )}

                {matchState === 'done' && (
                  <ul className="space-y-2 mb-3">
                    {matches.map((v) => {
                      const salary = teaserSalary(v);
                      return (
                        <li
                          key={v.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{v.title}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> {v.company}
                              </span>
                              {v.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {v.location}
                                </span>
                              )}
                            </p>
                          </div>
                          {salary && (
                            <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">{salary}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p className="text-xs text-slate-500 mb-3">
                  + per vacature een motivatiebrief automatisch afgestemd op jouw CV.
                </p>
                <Link
                  href="/vacatures"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Bekijk alle vacatures
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
            <Button variant="primary" onClick={handleClose}>
              {t('close')}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 leading-tight">{t('title')}</h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-snug">
                  {t('subtitle', { email: cvData.personal.email || '—' })}
                </p>
              </div>

              {/* Mini CV preview — visual reassurance of what's about to be downloaded */}
              <div className="flex-shrink-0" aria-hidden="true">
                {/* Mobile size */}
                <div
                  className="sm:hidden relative overflow-hidden bg-white rounded-lg shadow-md border border-slate-200"
                  style={{ width: '24mm', height: '33.9mm' }}
                >
                  <div
                    className="pointer-events-none origin-top-left"
                    style={{ width: '210mm', height: '297mm', transform: 'scale(0.114)' }}
                  >
                    <CVPreview dataOverride={cvData} />
                  </div>
                </div>
                {/* Desktop size */}
                <div
                  className="hidden sm:block relative overflow-hidden bg-white rounded-lg shadow-md border border-slate-200"
                  style={{ width: '35mm', height: '49.5mm' }}
                >
                  <div
                    className="pointer-events-none origin-top-left"
                    style={{ width: '210mm', height: '297mm', transform: 'scale(0.167)' }}
                  >
                    <CVPreview dataOverride={cvData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {t('formatLabel')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                    format === 'pdf'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-5 h-5 flex-shrink-0 ${format === 'pdf' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{t('formatPdf')}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{t('formatPdfHint')}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('docx')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                    format === 'docx'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileType className={`w-5 h-5 flex-shrink-0 ${format === 'docx' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{t('formatDocx')}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{t('formatDocxHint')}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setErrorMessage('');
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                      agreed
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong>{t('agreementPrefix')}</strong>.{' '}
                  <a href="/voorwaarden" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">
                    {t('termsLink')}
                  </a>{' '}
                  &amp;{' '}
                  <a href="/privacy" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">
                    {t('privacyLink')}
                  </a>
                  . {t('agreementSuffix', { price: price.display })}
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm mb-3 p-2.5 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!agreed || status === 'processing'}
              className={`w-full flex flex-col items-center justify-center gap-0.5 px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 ${
                !agreed || status === 'processing'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/25'
              }`}
            >
              <span className="flex items-center gap-2">
                {status === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {status === 'processing' ? t('downloading') : t('downloadButton')}
              </span>
              <span className="text-[10px] font-normal opacity-40">{t('paymentObligation')}</span>
            </button>

            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-3 text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('secureConnection')}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('secure100')}
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
