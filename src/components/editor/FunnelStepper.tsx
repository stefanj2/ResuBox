'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, LucideIcon } from 'lucide-react';

export interface StepperStep {
  id: number;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

interface FunnelStepperProps {
  steps: StepperStep[];
  currentStep: number;
  perStepComplete: boolean[];
  onStepChange: (id: number) => void;
}

/**
 * Adaptive top stepper for the builder funnel. One row of dots with labels,
 * connectors that fill emerald as the user advances, and click-back support
 * for already-completed steps. On mobile the labels shrink to icons + active
 * label; on desktop full labels are visible inline.
 */
export function FunnelStepper({ steps, currentStep, perStepComplete, onStepChange }: FunnelStepperProps) {
  const t = useTranslations('Builder.ui');
  const tProgress = useTranslations('BuilderProgress');

  const completedCount = perStepComplete.filter((v, i) => v && i < steps.length - 1).length;

  return (
    <nav
      aria-label="CV builder voortgang"
      className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
    >
      {/* Top meta row */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <p className="text-xs sm:text-sm font-medium text-slate-700">
          {t('stepOf', { n: currentStep + 1, total: steps.length })}
          <span className="hidden sm:inline text-slate-400 font-normal">
            {' · '}{steps[currentStep]?.label}
          </span>
        </p>
        <p className="text-xs font-semibold text-emerald-700 tabular-nums">
          {Math.round((completedCount / (steps.length - 1)) * 100)}%
        </p>
      </div>

      {/* Stepper row */}
      <ol className="flex items-center gap-0 sm:gap-1">
        {steps.map((step, index) => {
          const isComplete = perStepComplete[index];
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          const isClickable = isComplete || isPast || isActive;
          const Icon = step.icon;

          // Connector colour: filled if next dot is reached/done
          const connectorActive = index < currentStep || (index === currentStep && isComplete);

          return (
            <li key={step.id} className="flex-1 flex items-center min-w-0">
              <button
                type="button"
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${step.label} (stap ${index + 1} van ${steps.length})`}
                className={`group flex flex-col items-center gap-1 min-w-0 flex-shrink-0 ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <span
                  className={`relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm'
                      : isComplete || isPast
                        ? 'bg-emerald-500 text-white group-hover:bg-emerald-600'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isComplete && !isActive ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : isActive ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span
                  className={`hidden md:block text-[11px] font-medium leading-tight text-center max-w-[80px] truncate ${
                    isActive
                      ? 'text-emerald-700'
                      : isComplete || isPast
                        ? 'text-slate-700'
                        : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>

              {index < steps.length - 1 && (
                <span
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${
                    connectorActive ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Affirmation microcopy — varies per progress phase to keep momentum */}
      {(() => {
        const fillableTotal = steps.length - 1; // exclude review step
        const remainingFill = Math.max(0, fillableTotal - completedCount);
        if (completedCount === 0 && currentStep === 0) return null;
        const ratio = completedCount / fillableTotal;
        const key =
          completedCount === fillableTotal
            ? 'allDone'
            : ratio < 0.4
              ? 'encourageEarly'
              : ratio < 0.75
                ? 'encourageMid'
                : 'encourageLate';
        return (
          <p className="text-[11px] sm:text-xs text-slate-500 mt-2 sm:mt-3 text-center">
            {tProgress(key, {
              completed: completedCount,
              total: fillableTotal,
              remaining: remainingFill,
            })}
          </p>
        );
      })()}
    </nav>
  );
}
