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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('aiTitle')}</h3>
            <p className="text-xs text-slate-600 mb-3">{t('aiSubtitle')}</p>
            <Button
              variant="outline"
              icon={isGenerating ? Loader2 : Sparkles}
              onClick={handleGenerateProfile}
              disabled={isGenerating || !canGenerate}
              className={isGenerating ? '[&>svg]:animate-spin' : ''}
            >
              {isGenerating ? t('aiButtonLoading') : t('aiButton')}
            </Button>
            {error && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TextArea
        label={t('label')}
        placeholder={t('placeholder')}
        value={cvData.profile.summary}
        onChange={(e) => updateProfile(e.target.value)}
        rows={6}
        hint={t('charCounter', { count: cvData.profile.summary.length })}
      />

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-2">{t('tipsTitle')}</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </div>
    </div>
  );
}
