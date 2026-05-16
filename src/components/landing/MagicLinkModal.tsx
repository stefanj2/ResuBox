'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, Input, Button } from '@/components/ui';

interface MagicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MagicLinkModal({ isOpen, onClose }: MagicLinkModalProps) {
  const t = useTranslations('MagicLinkModal');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError(t('invalidEmail'));
      return;
    }

    setStatus('loading');
    setError('');

    try {
      // Check of er een sessie is met dit emailadres
      const sessionsData = localStorage.getItem('cv-builder-sessions');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        const sessionToken = Object.keys(sessions).find(
          (token) => sessions[token].personal?.email === email
        );

        if (sessionToken) {
          setStatus('success');
          setTimeout(() => {
            router.push({ pathname: '/builder', query: { token: sessionToken } });
          }, 1500);
          return;
        }
      }

      // Geen sessie gevonden - simuleer dat we een email sturen
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 3000);
    } catch {
      setError(t('error'));
      setStatus('error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className="p-6">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t('successTitle')}
            </h3>
            <p className="text-slate-600">
              {t('successBody')} <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              {t('subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                icon={status === 'loading' ? Loader2 : ArrowRight}
                iconPosition="right"
                loading={status === 'loading'}
              >
                {status === 'loading' ? t('sending') : t('sendButton')}
              </Button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-4">
              {t('notStarted')}{' '}
              <button
                onClick={() => {
                  onClose();
                  router.push('/builder');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t('startNow')}
              </button>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
