'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { TextArea, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

export function ProfileSection() {
  const { cvData, updateProfile } = useCVData();
  const t = useTranslations('Builder.profileSection');
  const locale = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const canGenerate =
    cvData.experience.length > 0 || cvData.education.length > 0 || cvData.skills.length > 0;

  const handleGenerateProfile = async () => {
    if (!canGenerate) {
      setError(t('errorEmpty'));
      return;
    }
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ai/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({ cvData, locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || t('errorGeneration'));
        return;
      }
      if (json.profile && typeof json.profile === 'string') {
        updateProfile(json.profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneration'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 mb-1">{t('title')}</h2>
          <p className="text-sm text-slate-600">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={handleGenerateProfile}
          disabled={isGenerating || !canGenerate}
          title={canGenerate ? t('aiSubtitle') : t('errorEmpty')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="whitespace-nowrap">{isGenerating ? t('aiButtonLoading') : t('aiButton')}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <TextArea
        label={t('label')}
        placeholder={t('placeholder')}
        value={cvData.profile.summary}
        onChange={(e) => updateProfile(e.target.value)}
        rows={5}
        hint={t('charCounter', { count: cvData.profile.summary.length })}
        tooltip={t('summaryTooltip')}
      />

      <details className="text-sm">
        <summary className="cursor-pointer text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('tipsTitle')}
        </summary>
        <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-5">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </details>
    </div>
  );
}
