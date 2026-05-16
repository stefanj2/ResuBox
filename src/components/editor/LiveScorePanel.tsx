'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Gauge, CheckCircle, AlertCircle, AlertTriangle, X, ChevronUp } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { computeScore } from '@/lib/cv-score';

export function LiveScorePanel() {
  const { cvData } = useCVData();
  const t = useTranslations('LiveScore');
  const tScore = useTranslations('Score');
  const tCommon = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const score = useMemo(() => computeScore(cvData), [cvData]);

  const gradeColor = {
    excellent: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', soft: 'bg-emerald-50' },
    good: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', soft: 'bg-emerald-50' },
    fair: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', soft: 'bg-amber-50' },
    poor: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', soft: 'bg-red-50' },
  }[score.grade];

  const gradeLabel = tScore(score.grade);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:flex fixed bottom-5 right-5 z-40 items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all"
        aria-label={t('label')}
        title={t('clickForDetails')}
      >
        <div
          className={`w-7 h-7 rounded-full ${gradeColor.bg} flex items-center justify-center text-white text-xs font-bold tabular-nums`}
        >
          {score.overall}
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 leading-none mb-0.5">{t('label')}</p>
          <p className={`text-xs font-semibold leading-none ${gradeColor.text}`}>{gradeLabel}</p>
        </div>
        <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div
            className="hidden sm:block fixed inset-0 z-30 bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div className="hidden sm:flex flex-col fixed bottom-20 right-5 z-40 w-[380px] max-h-[70vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className={`px-5 py-4 ${gradeColor.soft} border-b ${gradeColor.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                    {t('label')}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${gradeColor.text}`}>{score.overall}</span>
                    <span className="text-base text-slate-400">/100</span>
                    <span className={`text-xs font-semibold ${gradeColor.text} ml-2`}>{gradeLabel}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {t('meta', {
                      words: score.metadata.wordCount,
                      bullets: score.metadata.bulletCount,
                      withNumbers: score.metadata.quantifiedBullets,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
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

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
              {t('disclaimer')}
            </div>
          </div>
        </>
      )}
    </>
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

void Gauge;
