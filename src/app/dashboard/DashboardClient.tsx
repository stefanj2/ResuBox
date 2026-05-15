'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'zojuist';
  if (minutes < 60) return `${minutes}m geleden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}u geleden`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} dag${days > 1 ? 'en' : ''} geleden`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardClient({ cvs: initialCvs }: Props) {
  const router = useRouter();
  const [cvs, setCvs] = useState(initialCvs);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit CV wilt verwijderen?')) return;
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
        alert('Geen lokale CV gevonden om te importeren.');
        return;
      }
      const cvData = JSON.parse(stored);
      const name = `${cvData?.personal?.firstName || 'Naamloos'} ${cvData?.personal?.lastName || ''}`.trim() || 'CV';
      const res = await fetch('/api/user/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cv_data: cvData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Import mislukt');
      setCvs((prev) => [json.cv, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import mislukt');
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Mijn CV&apos;s</h1>
          <p className="text-slate-600 text-sm">
            {cvs.length === 0 ? 'Nog geen CV opgeslagen.' : `${cvs.length} CV${cvs.length > 1 ? "'s" : ''} opgeslagen.`}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg"
        >
          <LogOut className="w-4 h-4" /> Uitloggen
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
          <span className="font-semibold text-slate-900">Nieuw CV maken</span>
          <span className="text-xs text-slate-500 text-center">Vanaf scratch beginnen</span>
        </Link>

        {cvs.map((cv) => {
          const fullName = `${cv.cv_data?.personal?.firstName || ''} ${cv.cv_data?.personal?.lastName || ''}`.trim();
          const template = cv.cv_data?.meta?.selectedTemplate || 'modern';
          return (
            <div key={cv.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <button
                  onClick={() => handleDelete(cv.id)}
                  disabled={busyId === cv.id}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  aria-label="Verwijder CV"
                >
                  {busyId === cv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{cv.name}</h3>
              {fullName && <p className="text-sm text-slate-500 mb-3 line-clamp-1">{fullName}</p>}
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto mb-4">
                <span className="capitalize">{template}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {formatRelative(cv.updated_at)}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                CV-editor opent dit CV nog niet automatisch — kopieer naar de builder via &quot;Importeer&quot; (TODO).
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-semibold text-slate-900 mb-2">Lokaal CV importeren</h2>
        <p className="text-sm text-slate-600 mb-4">
          Werk je nu in de CV-builder zonder account? Importeer je huidige werk naar je account zodat het bewaard blijft.
        </p>
        <button
          onClick={handleImportLocal}
          disabled={importing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-60"
        >
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Importeer huidige CV uit browser
        </button>
      </div>
    </>
  );
}
