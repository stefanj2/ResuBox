'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Loader2, CheckCircle, AlertCircle, AlertTriangle, FileText, ArrowRight, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface AtsCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  description: string;
}

interface AtsResult {
  score: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  metadata: {
    wordCount: number;
    pageCountEstimate: number;
    hasEmail: boolean;
    hasPhone: boolean;
    detectedSections: string[];
  };
  checks: AtsCheck[];
  keywordMatch?: {
    matched: string[];
    missing: string[];
    matchPercentage: number;
  };
}

export default function AtsCheckClient() {
  const t = useTranslations('AtsCheck');
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<AtsResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!file) return;
    setStatus('checking');
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription.trim()) formData.append('jobDescription', jobDescription);
      const res = await fetch('/api/ats-check', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus('error');
        setError(json.error ?? 'Check failed');
        return;
      }
      setStatus('done');
      setResult(json.result);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unexpected error');
    }
  };

  const reset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setStatus('idle');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  if (status === 'done' && result) {
    return <ResultView result={result} onReset={reset} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {t('uploadLabel')}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {!file ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full px-6 py-12 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors flex flex-col items-center gap-3"
            >
              <Upload className="w-10 h-10 text-slate-400" />
              <div>
                <span className="text-base font-medium text-slate-900">{t('chooseFile')}</span>
                <p className="text-sm text-slate-500 mt-1">{t('fileHint')}</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label={t('removeFile')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {t('vacancyLabel')} <span className="font-normal text-slate-500">{t('vacancyHintLabel')}</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t('vacancyPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px] resize-y"
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('vacancyHint')}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || status === 'checking'}
          className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
            !file || status === 'checking'
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {status === 'checking' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> {t('checking')}
            </>
          ) : (
            <>{t('checkButton')}</>
          )}
        </button>
      </div>
    </div>
  );
}

function ResultView({ result, onReset }: { result: AtsResult; onReset: () => void }) {
  const t = useTranslations('AtsCheck');
  const tScore = useTranslations('Score');
  const gradeColor = {
    excellent: 'text-emerald-600 bg-emerald-50',
    good: 'text-emerald-600 bg-emerald-50',
    fair: 'text-amber-600 bg-amber-50',
    poor: 'text-red-600 bg-red-50',
  }[result.grade];
  const gradeLabel = tScore(result.grade);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{t('scoreLabel')}</p>
            <h2 className="text-5xl font-bold text-slate-900">{result.score}<span className="text-2xl text-slate-400">{t('outOf')}</span></h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${gradeColor}`}>
              {gradeLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg"
          >
            {t('newCheck')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('metaWords')}</p>
            <p className="font-semibold text-slate-900">{result.metadata.wordCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('metaPages')}</p>
            <p className="font-semibold text-slate-900">~{result.metadata.pageCountEstimate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('metaEmail')}</p>
            <p className="font-semibold text-slate-900">{result.metadata.hasEmail ? t('metaYes') : t('metaNo')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('metaPhone')}</p>
            <p className="font-semibold text-slate-900">{result.metadata.hasPhone ? t('metaYes') : t('metaNo')}</p>
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 mb-3">{t('detailChecks')}</h3>
        <ul className="space-y-3">
          {result.checks.map((check) => (
            <li key={check.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {check.status === 'pass' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {check.status === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {check.status === 'fail' && <AlertCircle className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{check.label}</p>
                <p className="text-sm text-slate-600">{check.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {result.keywordMatch && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('vacancyMatch')}</h3>
          <p className="text-sm text-slate-600 mb-4">
            {t('matchPercent', { percent: result.keywordMatch.matchPercentage })}
          </p>
          {result.keywordMatch.missing.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
                {t('matchKeywords')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywordMatch.missing.slice(0, 30).map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-red-50 border border-red-100 text-red-700 text-xs rounded-md"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {t('newCvCta')}
        </h3>
        <p className="text-slate-700 mb-5">
          {t('newCvSubtitle')}
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
        >
          {t('startFree')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
