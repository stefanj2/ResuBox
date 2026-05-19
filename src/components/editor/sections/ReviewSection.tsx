'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, AlertCircle, Zap, Lock } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { TEMPLATES } from '@/components/preview/templates';
import { TemplateThumbnail } from '@/components/preview/thumbnails';
import { COLOR_SCHEME_LIST } from '@/lib/colorSchemes';
import { getCvProgress } from '@/lib/cvProgress';
import type { TemplateId } from '@/types/cv';

/**
 * Final step of the funnel. Wraps the template grid and colour picker in a
 * single white "Customise" card so the choices feel like one cohesive control,
 * not a stack of loose sections.
 */
export function ReviewSection() {
  const { cvData, setTemplate, setColorScheme } = useCVData();
  const t = useTranslations('Builder.reviewSection');
  const tColor = useTranslations('ColorPicker');
  const tTemplate = useTranslations('TemplateSelector');
  const progress = getCvProgress(cvData);

  const selectedTemplateId = cvData.meta.selectedTemplate ?? 'modern';
  const selectedColor = cvData.meta.selectedColorScheme ?? 'emerald';
  const templateList = Object.values(TEMPLATES);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{t('title')}</h2>
        <p className="text-slate-600 text-sm">{t('subtitle')}</p>
      </div>

      {!progress.isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-900">
            <span className="font-semibold">{t('incompleteTitle', { remaining: progress.remaining })}</span>
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

      {/* Unified customise panel — template + colour in one card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Template */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[11px] uppercase tracking-[0.08em] text-slate-500 font-semibold">
              {t('templateLabel')}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {tTemplate(`templateNames.${selectedTemplateId}`)}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {templateList.map((template) => (
              <ReviewTemplateCard
                key={template.id}
                id={template.id}
                name={tTemplate(`templateNames.${template.id}`)}
                popularLabel={tTemplate('popular')}
                isSelected={selectedTemplateId === template.id}
                isPopular={template.id === 'modern'}
                onClick={() => setTemplate(template.id)}
              />
            ))}
          </div>
        </div>

        {/* Colour */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[11px] uppercase tracking-[0.08em] text-slate-500 font-semibold">
              {tColor('heading')}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {tColor(`names.${selectedColor}`)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_SCHEME_LIST.map((scheme) => {
              const active = selectedColor === scheme.id;
              return (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setColorScheme(scheme.id)}
                  className={`relative inline-flex items-center gap-2 rounded-lg border bg-white transition-all px-2.5 py-1.5 ${
                    active
                      ? 'border-slate-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-pressed={active}
                  title={tColor(`names.${scheme.id}`)}
                >
                  <span
                    className="w-4 h-4 rounded-full ring-1 ring-inset ring-black/10 flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${scheme.gradient.from}, ${scheme.gradient.to})`,
                    }}
                  />
                  <span className="text-xs font-medium text-slate-700 truncate flex-1 text-left">
                    {tColor(`names.${scheme.id}`)}
                  </span>
                  {active && (
                    <Check className="w-3 h-3 text-slate-900 flex-shrink-0" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust strip — small icon row reinforcing the value before download */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 pt-1">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          {t('trustInstant')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          {t('trustPrivate')}
        </span>
      </div>
    </div>
  );
}

interface ReviewTemplateCardProps {
  id: TemplateId;
  name: string;
  popularLabel: string;
  isSelected: boolean;
  isPopular: boolean;
  onClick: () => void;
}

function ReviewTemplateCard({ id, name, popularLabel, isSelected, isPopular, onClick }: ReviewTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`group relative flex flex-col rounded-xl border bg-white p-1.5 sm:p-2 transition-all ${
        isSelected
          ? 'border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail framed in a subtle ring so dark templates don't overpower light ones */}
      <div className="relative overflow-hidden rounded-md ring-1 ring-slate-200/70 bg-white flex items-center justify-center mb-1.5 sm:mb-2">
        <div className="sm:hidden">
          <TemplateThumbnail templateId={id} scale={0.09} />
        </div>
        <div className="hidden sm:block">
          <TemplateThumbnail templateId={id} scale={0.12} />
        </div>

        {isPopular && !isSelected && (
          <span className="absolute top-1 left-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/95 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {popularLabel}
          </span>
        )}

        {isSelected && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </span>
        )}
      </div>

      <span
        className={`text-[10px] sm:text-xs font-semibold text-center truncate ${
          isSelected ? 'text-emerald-700' : 'text-slate-800'
        }`}
      >
        {name}
      </span>
    </button>
  );
}
