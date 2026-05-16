'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, Loader2, ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { ModernCoverLetterTemplate } from '@/components/cover-letter/ModernCoverLetterTemplate';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';

export default function CoverLetterEditor() {
  const t = useTranslations('CoverLetterBuilder');
  const tHeader = useTranslations('Header');
  const locale = useLocale();
  const { data, updateSender, updateRecipient, updateField } = useCoverLetter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-cover-letter-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({ data, locale }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || t('pdfError', { status: res.status }));
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${t('fileNamePrefix')}_${data.sender.firstName || 'Name'}_${data.sender.lastName || ''}.pdf`.replace(/[^\w-]/g, '_');
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('unexpectedError'));
    } finally {
      setDownloading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  const labelCls = 'block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/builder" className="text-sm text-slate-600 hover:text-slate-900">
                {tHeader('createCv')}
              </Link>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? t('downloading') : t('downloadPdf')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('pageTitle')}</h1>
          <p className="text-slate-600">
            {t('pageSubtitle')}
          </p>
          {error && <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('yourDetails')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t('firstName')}</label>
                  <input className={inputCls} value={data.sender.firstName} onChange={(e) => updateSender('firstName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('lastName')}</label>
                  <input className={inputCls} value={data.sender.lastName} onChange={(e) => updateSender('lastName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('email')}</label>
                  <input className={inputCls} type="email" value={data.sender.email} onChange={(e) => updateSender('email', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('phone')}</label>
                  <input className={inputCls} value={data.sender.phone} onChange={(e) => updateSender('phone', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>{t('address')}</label>
                  <input className={inputCls} value={data.sender.address} onChange={(e) => updateSender('address', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('postalCode')}</label>
                  <input className={inputCls} value={data.sender.postalCode} onChange={(e) => updateSender('postalCode', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('city')}</label>
                  <input className={inputCls} value={data.sender.city} onChange={(e) => updateSender('city', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('recipient')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>{t('contactName')}</label>
                  <input
                    className={inputCls}
                    placeholder={t('contactNamePlaceholder')}
                    value={data.recipient.contactName}
                    onChange={(e) => updateRecipient('contactName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('contactTitle')}</label>
                  <input
                    className={inputCls}
                    placeholder={t('contactTitlePlaceholder')}
                    value={data.recipient.contactTitle}
                    onChange={(e) => updateRecipient('contactTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('company')}</label>
                  <input className={inputCls} value={data.recipient.company} onChange={(e) => updateRecipient('company', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>{t('companyCity')}</label>
                  <input className={inputCls} value={data.recipient.city} onChange={(e) => updateRecipient('city', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('vacancy')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>{t('vacancyTitle')}</label>
                  <input
                    className={inputCls}
                    placeholder={t('vacancyTitlePlaceholder')}
                    value={data.vacancyTitle}
                    onChange={(e) => updateField('vacancyTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('vacancyRef')}</label>
                  <input className={inputCls} placeholder={t('optional')} value={data.vacancyReference} onChange={(e) => updateField('vacancyReference', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t('date')}</label>
                  <input className={inputCls} type="date" value={data.date} onChange={(e) => updateField('date', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>{t('letterCity')}</label>
                  <input className={inputCls} value={data.letterCity} onChange={(e) => updateField('letterCity', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('letter')}</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>{t('greeting')}</label>
                  <input
                    className={inputCls}
                    placeholder={t('greetingPlaceholder')}
                    value={data.greeting}
                    onChange={(e) => updateField('greeting', e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">{t('greetingHint')}</p>
                </div>
                <div>
                  <label className={labelCls}>{t('opening')}</label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-y`}
                    placeholder={t('openingPlaceholder')}
                    value={data.opening}
                    onChange={(e) => updateField('opening', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('body')}</label>
                  <textarea
                    className={`${inputCls} min-h-[140px] resize-y`}
                    placeholder={t('bodyPlaceholder')}
                    value={data.body}
                    onChange={(e) => updateField('body', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('closing')}</label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-y`}
                    placeholder={t('closingPlaceholder')}
                    value={data.closing}
                    onChange={(e) => updateField('closing', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('signature')}</label>
                  <input className={inputCls} value={data.signature} onChange={(e) => updateField('signature', e.target.value)} />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-slate-100 rounded-2xl p-4 sm:p-6">
              <div className="flex justify-center">
                <div className="origin-top scale-[0.45] sm:scale-[0.6] -mb-[180px] sm:-mb-[110px]">
                  <ModernCoverLetterTemplate data={data} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
              <span>{t('livePreview')}</span>
              <Link href="/builder" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                {t('alsoCv')} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
