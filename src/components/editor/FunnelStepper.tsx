'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

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
}

/**
 * Minimal funnel progress bar. A single emerald-gradient fill that
 * advances as the user moves through the steps — no dots, no labels,
 * no per-step text. The section title rendered inside each form page
 * carries the contextual "where am I" labelling.
 */
export function FunnelStepper({ steps, currentStep, perStepComplete }: FunnelStepperProps) {
  // Position-based fill that bumps when the current step is complete so
  // the bar reflects "I'm done with this step" before the user clicks Next.
  const total = steps.length;
  const isCurrentComplete = perStepComplete[currentStep] ?? false;
  const effectiveStep = currentStep + (isCurrentComplete ? 1 : 0);
  const fillPct = total <= 1 ? 0 : Math.min(100, (effectiveStep / (total - 1)) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(fillPct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`CV-voortgang: ${Math.round(fillPct)}%`}
      className="h-1 sm:h-1.5 w-full bg-slate-200 rounded-full overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${fillPct}%` }}
      />
    </div>
  );
}
