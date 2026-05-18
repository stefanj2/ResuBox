'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Pencil, Palette, FileText, AlertCircle } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { TEMPLATES } from '@/components/preview/templates';
import { ColorPicker, TemplateSelector } from '@/components/templateSelector';
import { Modal } from '@/components/ui';
import { isSectionComplete, getCvProgress } from '@/lib/cvProgress';

// Review jump-back grid. Index in this array maps to a stepper id (0-6).
const REVIEW_LINKS: Array<{ stepId: number; key: string }> = [
  { stepId: 0, key: 'personalBasics' },
  { stepId: 1, key: 'personalContact' },
  { stepId: 2, key: 'personalExtra' },
  { stepId: 3, key: 'work' },
  { stepId: 4, key: 'education' },
  { stepId: 5, key: 'skills' },
  { stepId: 6, key: 'profile' },
];

/**
 * Final step of the funnel. Shows a large preview, lets the user adjust
 * template + color one last time, jump back to fix any section, and finally
 * surfaces the download CTA at the bottom (handled by BuilderStickyCTA).
 */
export function ReviewSection() {
  const { cvData, setCurrentSection } = useCVData();
  const t = useTranslations('Builder.reviewSection');
  const tSections = useTranslations('Builder.sections');
  const progress = getCvProgress(cvData);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const selectedTemplateId = cvData.meta.selectedTemplate ?? 'modern';
  const currentTemplate = TEMPLATES[selectedTemplateId];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      {/* Incomplete-sections warning */}
      {!progress.isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 mb-1">
                {t('incompleteTitle', { remaining: progress.remaining })}
              </p>
              <p className="text-xs text-amber-800">
                {t('incompleteHint')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 sm:p-6 overflow-hidden">
        <div className="flex justify-center overflow-x-auto">
          <div
            className="origin-top shadow-2xl scale-[0.45] sm:scale-[0.55] md:scale-[0.6] mb-[-200pt] sm:mb-[-160pt] md:mb-[-130pt]"
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            <CVPreview />
          </div>
        </div>
      </div>

      {/* Template + Color row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setShowTemplateModal(true)}
          className="text-left bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm rounded-xl p-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">{t('templateLabel')}</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {currentTemplate?.nameNL ?? selectedTemplateId}
              </p>
            </div>
            <Palette className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <ColorPicker compact />
        </div>
      </div>

      {/* Per-section edit grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          {t('reviewSections')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REVIEW_LINKS.map(({ stepId, key }) => {
            const done = isSectionComplete(stepId, cvData);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentSection(stepId)}
                className="flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-emerald-400 rounded-lg px-3 py-2.5 transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    {done ? (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {tSections(key)}
                  </span>
                </span>
                <Pencil className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
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
