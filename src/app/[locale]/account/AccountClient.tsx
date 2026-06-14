'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import type { CVAccessState } from '@/lib/cv-access';

const STATUS_LABEL: Record<string, string> = {
  trialing: 'Proefperiode',
  active: 'Actief',
  past_due: 'Betaling mislukt',
  canceled: 'Opgezegd',
  incomplete: 'In afwachting',
  incomplete_expired: 'Verlopen',
  unpaid: 'Onbetaald',
  paused: 'Gepauzeerd',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function AccountClient({
  email,
  access,
}: {
  email: string;
  access: CVAccessState;
}) {
  const locale = useLocale();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  const openPortal = async () => {
    setError('');
    setOpening(true);
    try {
      const res = await fetch('/api/cv/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      const j = await res.json();
      if (!res.ok || !j.url) {
        throw new Error(j.error || 'Kon portaal niet openen');
      }
      window.location.href = j.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
      setOpening(false);
    }
  };

  const statusLabel = access.status ? STATUS_LABEL[access.status] ?? access.status : 'Geen abonnement';
  const isActive = access.hasAccess;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mijn account</h1>
        <p className="text-sm text-slate-500 mb-8">{email}</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Abonnement
              </p>
              <h2 className="text-lg font-bold text-slate-900">CV-download — €39/maand</h2>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {statusLabel}
            </span>
          </div>

          <dl className="space-y-2 text-sm">
            {access.status === 'trialing' && access.trialEnd && (
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Proefperiode eindigt</dt>
                <dd className="font-medium text-slate-900">{formatDate(access.trialEnd)}</dd>
              </div>
            )}
            {access.currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">
                  {access.cancelAtPeriodEnd ? 'Toegang tot' : 'Volgende afschrijving'}
                </dt>
                <dd className="font-medium text-slate-900">{formatDate(access.currentPeriodEnd)}</dd>
              </div>
            )}
          </dl>

          {access.cancelAtPeriodEnd && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Je abonnement is opgezegd. Je houdt toegang tot{' '}
              <strong>{formatDate(access.currentPeriodEnd)}</strong>; daarna wordt er niets meer
              afgeschreven.
            </div>
          )}
        </div>

        {access.stripeCustomerId ? (
          <button
            onClick={openPortal}
            disabled={opening}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
          >
            {opening ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
            Beheer abonnement of zeg op
          </button>
        ) : (
          <p className="text-sm text-slate-500 text-center">
            Er is nog geen actief abonnement op dit account.
          </p>
        )}

        {error && <p className="text-sm text-rose-600 mt-3 text-center">{error}</p>}

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          Opzeggen kan op elk moment. Tot het einde van de huidige betaalperiode houd je toegang.
          Terugbetalingen kun je binnen 8 weken na een afschrijving bij je bank claimen.
        </p>
      </div>
    </div>
  );
}
