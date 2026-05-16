'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const t = useTranslations('Login');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus('error');
        setError(json.error || t('sendError'));
        return;
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('unexpectedError'));
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('sentTitle')}</h2>
        <p className="text-sm text-slate-600">
          {t('sentBody', { email })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {t('emailLabel')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            autoFocus
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !email}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
          status === 'sending' || !email
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}
          </>
        ) : (
          t('submitButton')
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        {t('agreementPrefix')}{' '}
        <Link href="/voorwaarden" className="underline hover:text-slate-700">{t('termsLink')}</Link>{' '}
        {t('agreementAnd')}{' '}
        <Link href="/privacy" className="underline hover:text-slate-700">{t('privacyLink')}</Link>.
      </p>
    </form>
  );
}
