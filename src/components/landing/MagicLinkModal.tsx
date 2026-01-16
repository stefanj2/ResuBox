'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, Input, Button } from '@/components/ui';

interface MagicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MagicLinkModal({ isOpen, onClose }: MagicLinkModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Vul een geldig emailadres in');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      // Check of er een sessie is met dit emailadres
      const sessionsData = localStorage.getItem('cv-builder-sessions');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        // Zoek sessie met dit emailadres
        const sessionToken = Object.keys(sessions).find(
          token => sessions[token].personal?.email === email
        );
        
        if (sessionToken) {
          // Sessie gevonden - navigeer naar builder met token
          setStatus('success');
          setTimeout(() => {
            router.push(`/builder?token=${sessionToken}`);
          }, 1500);
          return;
        }
      }

      // Geen sessie gevonden - simuleer dat we een email sturen
      // In productie zou dit een API call zijn
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      // Na 2 seconden sluit modal (in echt zou user email checken)
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 3000);
      
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.');
      setStatus('error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ga verder met je CV">
      <div className="p-6">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Check je inbox!
            </h3>
            <p className="text-slate-600">
              We hebben een link gestuurd naar <strong>{email}</strong>. 
              Klik op de link om verder te gaan met je CV.
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              Vul je emailadres in waarmee je eerder bent begonnen. 
              We sturen je een link om direct verder te gaan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Emailadres"
                placeholder="jouw@email.nl"
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
                {status === 'loading' ? 'Even geduld...' : 'Stuur herstel-link'}
              </Button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-4">
              Nog geen CV begonnen?{' '}
              <button
                onClick={() => {
                  onClose();
                  router.push('/builder');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Start nu gratis
              </button>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
