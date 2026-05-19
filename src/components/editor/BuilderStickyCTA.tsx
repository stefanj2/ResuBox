'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';

interface BuilderStickyCTAProps {
  currentStep: number;
  totalSteps: number;
  /** How many fillable steps the user has completed so far */
  completedCount: number;
  isLastStep: boolean;
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
  completedCount,
  isLastStep,
  onPrev,
  onNext,
  onDownload,
}: BuilderStickyCTAProps) {
  const t = useTranslations('SectionFooter');
  const tUi = useTranslations('Builder.ui');
  const tProgress = useTranslations('BuilderProgress');
  const tDownload = useTranslations('Download');
  const isFirstStep = currentStep === 0;

  // Pick an encouragement message that matches progress phase
  const fillable = totalSteps - 1;
  const remaining = Math.max(0, fillable - completedCount);
  const ratio = fillable === 0 ? 0 : completedCount / fillable;
  const encouragementKey =
    completedCount === 0
      ? null
      : completedCount === fillable
        ? 'allDone'
        : ratio < 0.4
          ? 'encourageEarly'
          : ratio < 0.75
            ? 'encourageMid'
            : 'encourageLate';
  const encouragement = encouragementKey
    ? tProgress(encouragementKey, { completed: completedCount, total: fillable, remaining })
    : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:right-auto lg:w-3/5 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_12px_-4px_rgba(15,23,42,0.08)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
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

        {/* Center: encouragement microcopy (desktop) or step counter fallback */}
        <p className="hidden md:block text-xs text-slate-500 text-center truncate px-2">
          {encouragement ?? tUi('stepOf', { n: currentStep + 1, total: totalSteps })}
        </p>

        {/* Next / Download button — always clickable, never gates the funnel */}
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
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl px-5 sm:px-6 py-3 shadow-lg shadow-emerald-500/25 transition-all duration-150 active:scale-[0.98]"
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
