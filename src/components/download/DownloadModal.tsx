'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Download, CheckCircle, AlertCircle, FileText, Loader2, FileType } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { createOrder } from '@/lib/api/orders';

type Format = 'pdf' | 'docx';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_BY_LOCALE: Record<string, { value: number; currency: string; display: string }> = {
  nl: { value: 42, currency: 'EUR', display: '€42' },
  de: { value: 42, currency: 'EUR', display: '42 €' },
  en: { value: 42, currency: 'GBP', display: '£42' },
  sv: { value: 449, currency: 'SEK', display: '449 kr' },
  da: { value: 315, currency: 'DKK', display: '315 kr' },
};

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { cvData } = useCVData();
  const locale = useLocale();
  const t = useTranslations('Download');
  const [agreed, setAgreed] = useState(false);
  const [format, setFormat] = useState<Format>('pdf');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const price = PRICE_BY_LOCALE[locale] ?? PRICE_BY_LOCALE.nl;

  const handleDownload = async () => {
    if (!agreed) {
      setErrorMessage(t('mustAgree'));
      return;
    }

    setStatus('processing');
    setErrorMessage('');

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
    setAgreed(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" mobileFullScreen title={t('modalTitle')}>
      <div className="p-4 sm:p-6">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('successTitle')}</h2>
            <p className="text-slate-600 mb-6">
              {t('successSubtitle')}
            </p>
            <div className="bg-emerald-50 rounded-lg p-4 text-left mb-6">
              <h4 className="font-medium text-emerald-800 mb-2">{t('tipsTitle')}</h4>
              <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
                <li>{t('tip1')}</li>
                <li>{t('tip2')}</li>
                <li>{t('tip3')}</li>
              </ul>
            </div>
            <Button variant="primary" onClick={handleClose}>
              {t('close')}
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-3 sm:mb-6">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{t('title')}</h2>
              <p className="text-slate-600 text-sm sm:text-base hidden sm:block">
                {t('subtitle', { email: cvData.personal.email || '—' })}
              </p>
            </div>

            <div className="flex justify-center bg-slate-50 rounded-xl p-2 pb-1 sm:p-4 sm:pb-2 mb-2 sm:mb-6">
              <div className="origin-top scale-[0.55] sm:scale-100 -mb-[126px] sm:mb-0">
                <div
                  className="relative overflow-hidden bg-white rounded-lg shadow-md border border-slate-200"
                  style={{ width: '52.5mm', height: '74.25mm' }}
                >
                  <div
                    className="pointer-events-none origin-top-left"
                    style={{ transform: 'scale(0.25)', width: '210mm', height: '297mm' }}
                  >
                    <CVPreview dataOverride={cvData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {t('formatLabel')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                    format === 'pdf'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-5 h-5 flex-shrink-0 ${format === 'pdf' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{t('formatPdf')}</p>
                    <p className="text-xs text-slate-500">{t('formatPdfHint')}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('docx')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                    format === 'docx'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileType className={`w-5 h-5 flex-shrink-0 ${format === 'docx' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{t('formatDocx')}</p>
                    <p className="text-xs text-slate-500">{t('formatDocxHint')}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
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
                <span className="text-sm text-slate-700 leading-relaxed">
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
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!agreed || status === 'processing'}
              className={`w-full flex flex-col items-center justify-center gap-0.5 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
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

            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('secureConnection')}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
