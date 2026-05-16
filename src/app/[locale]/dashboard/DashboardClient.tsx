'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FileText, Plus, Trash2, LogOut, Calendar, Loader2 } from 'lucide-react';
import { CVData } from '@/types/cv';

interface ClientCv {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  cv_data: CVData;
}

interface Props {
  cvs: ClientCv[];
}

const DATE_LOCALES: Record<string, string> = {
  nl: 'nl-NL',
  de: 'de-DE',
  en: 'en-GB',
  sv: 'sv-SE',
  da: 'da-DK',
};

export default function DashboardClient({ cvs: initialCvs }: Props) {
  const router = useRouter();
  const t = useTranslations('DashboardClient');
  const locale = useLocale();
  const [cvs, setCvs] = useState(initialCvs);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const formatRelative = (iso: string): string => {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t('justNow');
    if (minutes < 60) return t('minutesAgo', { n: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('hoursAgo', { n: hours });
    const days = Math.floor(hours / 24);
    if (days < 30) return t('daysAgo', { n: days });
    return date.toLocaleDateString(DATE_LOCALES[locale] ?? 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/user/cvs/${id}`, { method: 'DELETE' });
      if (res.ok) setCvs((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const handleImportLocal = async () => {
    setImporting(true);
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('cv-builder-session') : null;
      if (!stored) {
        alert(t('noLocalCv'));
        return;
      }
      const cvData = JSON.parse(stored);
      const name = `${cvData?.personal?.firstName || t('untitled')} ${cvData?.personal?.lastName || ''}`.trim() || 'CV';
      const res = await fetch('/api/user/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cv_data: cvData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('importFailed'));
      setCvs((prev) => [json.cv, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : t('importFailed'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('title')}</h1>
          <p className="text-slate-600 text-sm">
            {cvs.length === 0 ? t('noCvsSaved') : t('cvsSaved', { count: cvs.length })}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg"
        >
          <LogOut className="w-4 h-4" /> {t('logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link
          href="/builder"
          className="group flex flex-col items-center justify-center gap-3 p-8 bg-white border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Plus className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="font-semibold text-slate-900">{t('newCv')}</span>
          <span className="text-xs text-slate-500 text-center">{t('newCvHint')}</span>
        </Link>

        {cvs.map((cv) => {
          const fullName = `${cv.cv_data?.personal?.firstName || ''} ${cv.cv_data?.personal?.lastName || ''}`.trim();
          const template = cv.cv_data?.meta?.selectedTemplate || 'modern';
          return (
            <div key={cv.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col group relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(cv.id);
                }}
                disabled={busyId === cv.id}
                className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={t('deleteCv')}
              >
                {busyId === cv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <Link href={{ pathname: '/builder', query: { cvId: cv.id } }} className="flex-1 flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mb-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{cv.name}</h3>
                {fullName && <p className="text-sm text-slate-500 mb-3 line-clamp-1">{fullName}</p>}
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
                  <span className="capitalize">{template}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatRelative(cv.updated_at)}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-semibold text-slate-900 mb-2">{t('importTitle')}</h2>
        <p className="text-sm text-slate-600 mb-4">
          {t('importBody')}
        </p>
        <button
          onClick={handleImportLocal}
          disabled={importing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-60"
        >
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {t('importButton')}
        </button>
      </div>
    </>
  );
}
