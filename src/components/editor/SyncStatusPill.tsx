'use client';

import React, { useState } from 'react';
import { Cloud, CloudOff, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { useUser } from '@/hooks/useUser';

export function SyncStatusPill() {
  const { serverCvId, syncStatus, saveToAccount, cvData } = useCVData();
  const { user, loading: userLoading } = useUser();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  if (userLoading) return null;

  // Logged-in user with this CV synced to account
  if (user && serverCvId) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-xs">
        {syncStatus === 'saving' ? (
          <>
            <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
            <span className="text-emerald-700 font-medium">Opslaan…</span>
          </>
        ) : syncStatus === 'error' ? (
          <>
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span className="text-red-700 font-medium">Sync mislukt</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">In account</span>
          </>
        )}
      </div>
    );
  }

  // Logged-in user editing local-only CV → offer to save
  if (user && !serverCvId) {
    const handleSave = async () => {
      const defaultName = [cvData.personal.firstName, cvData.personal.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
      const useName = name.trim() || defaultName || 'Naamloos CV';
      setSaving(true);
      const id = await saveToAccount(useName);
      setSaving(false);
      if (id) {
        setShowSaveDialog(false);
        setName('');
      }
    };

    return (
      <>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-800 font-medium transition-colors"
          title="Sla deze CV op in je account zodat hij bewaard blijft"
        >
          <Cloud className="w-3 h-3" />
          <span>Opslaan in account</span>
        </button>

        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSaveDialog(false)}>
            <div
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Sla CV op in account</h2>
                <button onClick={() => setShowSaveDialog(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Geef je CV een naam zodat je 'm later kunt vinden in je dashboard.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  [cvData.personal.firstName, cvData.personal.lastName].filter(Boolean).join(' ') || 'Bijv. CV voor Booking.com'
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Annuleer
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Anonymous user — subtle hint that they could create an account
  return (
    <a
      href="/login"
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-500 hover:text-slate-700 transition-colors"
      title="Maak een account om je CV te bewaren"
    >
      <CloudOff className="w-3 h-3" />
      <span>Lokaal opgeslagen</span>
    </a>
  );
}
