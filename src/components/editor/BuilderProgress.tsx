'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { getCvProgress } from '@/lib/cvProgress';

/**
 * Always-visible progress strip at the top of the editor pane.
 * Tells the user how far they are and how many sections remain.
 */
export function BuilderProgress() {
  const { cvData } = useCVData();
  const t = useTranslations('BuilderProgress');
  const progress = getCvProgress(cvData);

  const labelKey = progress.isComplete
    ? 'allDone'
    : progress.completed === 0
      ? 'getStarted'
      : 'progress';

  return (
    <div className="px-6 pt-4 pb-3 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between mb-2 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {progress.isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          <p className="text-sm font-medium text-slate-700 truncate">
            {t(labelKey, { completed: progress.completed, total: progress.total, remaining: progress.remaining })}
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 tabular-nums flex-shrink-0">
          {progress.percent}%
        </span>
      </div>
      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
            progress.isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
          }`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
