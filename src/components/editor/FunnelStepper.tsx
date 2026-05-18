'use client';

import React, { useEffect, useRef, useState } from 'react';
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
 * Compact dots-and-connectors stepper. Designed to sit inline inside the
 * editor header — no nav wrapper, no labels-below-dots, no meta row. The
 * caller is expected to render the "Stap X / Y · label" text elsewhere.
 */
export function FunnelStepper({ steps, currentStep, perStepComplete, onStepChange }: FunnelStepperProps) {
  // Celebrate when a step flips from incomplete → complete
  const prevCompleteRef = useRef<boolean[]>(perStepComplete);
  const [celebrateIdx, setCelebrateIdx] = useState<number | null>(null);

  useEffect(() => {
    const prev = prevCompleteRef.current;
    const flipped = perStepComplete.findIndex((c, i) => c && !prev[i]);
    prevCompleteRef.current = perStepComplete;
    if (flipped !== -1) {
      setCelebrateIdx(flipped);
      const t = setTimeout(() => setCelebrateIdx(null), 750);
      return () => clearTimeout(t);
    }
  }, [perStepComplete]);

  return (
    <ol
      className="flex items-start gap-0 w-full min-w-0"
      aria-label="CV builder voortgang"
    >
      {steps.map((step, index) => {
        const isComplete = perStepComplete[index];
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        const isClickable = isComplete || isPast || isActive;
        const connectorActive = index < currentStep || (index === currentStep && isComplete);

        return (
          <li key={step.id} className="flex-1 flex items-start min-w-0 first:flex-initial last:flex-initial">
            <div className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0">
              <button
                type="button"
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${step.label} (stap ${index + 1} van ${steps.length})`}
                className={`relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm'
                    : isComplete || isPast
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'} ${
                  celebrateIdx === index ? 'animate-step-celebrate' : ''
                }`}
              >
                {isComplete && !isActive ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <span
                className={`hidden xl:block text-[10px] leading-none font-medium tracking-tight whitespace-nowrap ${
                  isActive ? 'text-emerald-700' : isComplete || isPast ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.shortLabel}
              </span>
            </div>

            {index < steps.length - 1 && (
              <span
                className={`flex-1 h-px sm:h-0.5 mt-[10px] sm:mt-3 mx-1 sm:mx-1.5 transition-colors duration-300 ${
                  connectorActive ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
