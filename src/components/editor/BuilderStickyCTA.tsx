'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Download, AlertCircle } from 'lucide-react';

interface BuilderStickyCTAProps {
  currentStep: number;
  totalSteps: number;
  isCurrentStepComplete: boolean;
  isLastStep: boolean;
  /** Hint shown when user clicks Next while step is incomplete */
  showValidationHint?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDownload: () => void;
}

/**
 * Sticky bottom CTA shared between desktop and mobile. Replaces the inline
 * SectionFooter on desktop and StickyMobileCTA on mobile. Renders Prev/Next
 * on desktop and a single big Next on mobile (Prev moves to the top stepper
 * via click-back). On the last step the Next becomes the Download CTA.
 */
export function BuilderStickyCTA({
  currentStep,
  totalSteps,
  isCurrentStepComplete,
  isLastStep,
  showValidationHint = false,
  onPrev,
  onNext,
  onDownload,
}: BuilderStickyCTAProps) {
  const t = useTranslations('SectionFooter');
  const tUi = useTranslations('Builder.ui');
  const tDownload = useTranslations('Download');
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_12px_-4px_rgba(15,23,42,0.08)]">
      {/* Validation hint above bar */}
      {showValidationHint && !isCurrentStepComplete && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-xs text-amber-800 inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {t('incompleteHint')}
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Prev button — hidden on first step */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstStep}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isFirstStep
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('previous')}</span>
        </button>

        {/* Center: step counter (desktop only) */}
        <p className="hidden md:block text-xs text-slate-500 tabular-nums">
          {tUi('stepOf', { n: currentStep + 1, total: totalSteps })}
        </p>

        {/* Next / Download button */}
        {isLastStep ? (
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl px-5 sm:px-6 py-3 shadow-lg shadow-emerald-500/25 transition-all duration-150 active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            <span>{tDownload('downloadButton')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className={`inline-flex items-center gap-2 font-semibold rounded-xl px-5 sm:px-6 py-3 transition-all duration-150 ${
              isCurrentStepComplete
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98]'
                : 'bg-slate-200 text-slate-500 cursor-pointer hover:bg-slate-300'
            }`}
            aria-disabled={!isCurrentStepComplete}
            title={!isCurrentStepComplete ? t('incompleteHint') : undefined}
          >
            <span>{tUi('nextSection')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Safe-area spacer for mobile (iOS home indicator) */}
      <div className="h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
