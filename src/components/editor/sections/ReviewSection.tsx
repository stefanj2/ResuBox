'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, AlertCircle, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { TEMPLATES } from '@/components/preview/templates';
import { TemplateCard } from '@/components/templateSelector';
import { COLOR_SCHEME_LIST } from '@/lib/colorSchemes';
import { getCvProgress } from '@/lib/cvProgress';

/**
 * Final step of the funnel. Surfaces all six templates as thumbnails and
 * the colour palette as a compact swatch row, then a trust strip just
 * above the sticky Download CTA.
 */
export function ReviewSection() {
  const { cvData, setTemplate, setColorScheme } = useCVData();
  const t = useTranslations('Builder.reviewSection');
  const tColor = useTranslations('ColorPicker');
  const progress = getCvProgress(cvData);

  const selectedTemplateId = cvData.meta.selectedTemplate ?? 'modern';
  const selectedColor = cvData.meta.selectedColorScheme ?? 'emerald';
  const templateList = Object.values(TEMPLATES);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{t('title')}</h2>
        <p className="text-slate-600 text-sm">{t('subtitle')}</p>
      </div>

      {!progress.isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900">
            <span className="font-medium">{t('incompleteTitle', { remaining: progress.remaining })}</span>
            <span className="text-amber-800"> — {t('incompleteHint')}</span>
          </p>
        </div>
      )}

      {/* Inline preview — mobile/tablet only. On lg+ the side panel already shows it. */}
      <div className="lg:hidden bg-slate-100 rounded-xl border border-slate-200 p-4 overflow-hidden">
        <div className="flex justify-center overflow-x-auto">
          <div
            className="origin-top shadow-2xl scale-[0.45] sm:scale-[0.55] md:scale-[0.6] mb-[-200pt] sm:mb-[-160pt] md:mb-[-130pt]"
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            <CVPreview />
          </div>
        </div>
      </div>

      {/* Templates — all six visible as thumbnails so the user can switch in one click */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
          {t('templateLabel')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onSelect={setTemplate}
              compact
              showPopularBadge={template.id === 'modern'}
            />
          ))}
        </div>
      </section>

      {/* Colour scheme — single tight row of swatches */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
          {tColor('heading')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_SCHEME_LIST.map((scheme) => {
            const active = selectedColor === scheme.id;
            return (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setColorScheme(scheme.id)}
                className={`relative inline-flex items-center gap-1.5 rounded-full border transition-all px-2.5 py-1 ${
                  active
                    ? 'border-slate-900 bg-slate-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                title={tColor(`names.${scheme.id}`)}
              >
                <span
                  className="w-4 h-4 rounded-full ring-1 ring-inset ring-black/5 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${scheme.gradient.from}, ${scheme.gradient.to})`,
                  }}
                />
                <span className="text-xs font-medium text-slate-700">
                  {tColor(`names.${scheme.id}`)}
                </span>
                {active && (
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Trust strip — small icon row reinforcing the value before download */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-600 pt-1">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          {t('trustInstant')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {t('trustSecure')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          {t('trustPrivate')}
        </span>
      </div>
    </div>
  );
}
