'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, AlertCircle, AlertTriangle, X, ChevronDown } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { computeScore } from '@/lib/cv-score';

/**
 * Compact CV-score pill that lives in the editor header. Click opens a
 * popover with the full checklist. No fixed-position floating button —
 * the score is now part of the header chrome.
 */
export function LiveScorePanel() {
  const { cvData } = useCVData();
  const t = useTranslations('LiveScore');
  const tScore = useTranslations('Score');
  const tCommon = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const score = useMemo(() => computeScore(cvData), [cvData]);

  const gradeColor = {
    excellent: { bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-200', soft: 'bg-emerald-50' },
    good: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', soft: 'bg-emerald-50' },
    fair: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', soft: 'bg-amber-50' },
    poor: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', soft: 'bg-red-50' },
  }[score.grade];

  const gradeLabel = tScore(score.grade);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 pl-1 pr-2 sm:pr-2.5 py-1 rounded-full border bg-white hover:bg-slate-50 transition-colors ${
          open ? 'border-slate-300 shadow-sm' : 'border-slate-200'
        }`}
        aria-label={t('label')}
        aria-expanded={open}
        title={t('clickForDetails')}
      >
        <span
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${gradeColor.bg} flex items-center justify-center text-white text-[10px] sm:text-xs font-bold tabular-nums`}
        >
          {score.overall}
        </span>
        <span className={`hidden md:inline text-xs font-semibold ${gradeColor.text}`}>
          {gradeLabel}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform hidden md:inline ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[360px] max-w-[92vw] max-h-[70vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          <div className={`px-4 py-3 ${gradeColor.soft} border-b ${gradeColor.border}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
                  {t('label')}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${gradeColor.text}`}>{score.overall}</span>
                  <span className="text-sm text-slate-400">/100</span>
                  <span className={`text-xs font-semibold ${gradeColor.text} ml-1`}>{gradeLabel}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  {t('meta', {
                    words: score.metadata.wordCount,
                    bullets: score.metadata.bulletCount,
                    withNumbers: score.metadata.quantifiedBullets,
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 -mt-1 -mr-1"
                aria-label={tCommon('close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto px-2 py-2">
            {score.checks.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
            {t('disclaimer')}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckRow({ check }: { check: ReturnType<typeof computeScore>['checks'][number] }) {
  const Icon = check.status === 'pass' ? CheckCircle : check.status === 'warn' ? AlertTriangle : AlertCircle;
  const iconColor = check.status === 'pass' ? 'text-emerald-600' : check.status === 'warn' ? 'text-amber-500' : 'text-red-600';

  return (
    <div className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50">
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{check.label}</p>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{check.description}</p>
        {check.tip && check.status !== 'pass' && (
          <p className="text-xs text-slate-500 mt-1 italic">💡 {check.tip}</p>
        )}
      </div>
    </div>
  );
}
