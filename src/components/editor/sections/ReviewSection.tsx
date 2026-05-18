'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Palette, FileText, AlertCircle, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { TEMPLATES } from '@/components/preview/templates';
import { ColorPicker, TemplateSelector } from '@/components/templateSelector';
import { Modal } from '@/components/ui';
import { getCvProgress } from '@/lib/cvProgress';

/**
 * Final step of the funnel. A clean preview-first layout: large preview,
 * sleek template + color controls, trust strip just above the sticky
 * Download CTA. No more per-section jump-back grid — users can simply
 * click Vorige or any earlier stepper position to revisit a section.
 */
export function ReviewSection() {
  const { cvData } = useCVData();
  const t = useTranslations('Builder.reviewSection');
  const progress = getCvProgress(cvData);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const selectedTemplateId = cvData.meta.selectedTemplate ?? 'modern';
  const currentTemplate = TEMPLATES[selectedTemplateId];

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

      {/* Style controls — one tight card with template + colour side by side */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 sm:divide-y-0 sm:divide-x sm:flex">
        <button
          type="button"
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left sm:flex-1 min-w-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium leading-none mb-1">
              {t('templateLabel')}
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {currentTemplate?.nameNL ?? selectedTemplateId}
            </p>
          </div>
          <Palette className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </button>

        <div className="px-4 py-3 sm:flex-1">
          <ColorPicker compact />
        </div>
      </div>

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

      {/* Template selector modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title={t('templateLabel')}
        size="xl"
        mobileFullScreen
      >
        <TemplateSelector mode="inline" onSelect={() => setShowTemplateModal(false)} />
      </Modal>
    </div>
  );
}
