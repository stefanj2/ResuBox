'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowLeft, Check, Loader2, ShieldCheck } from 'lucide-react';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  PaymentElement,
} from '@stripe/react-stripe-js/checkout';
import { Link } from '@/i18n/navigation';

/**
 * Paywall + embedded Stripe checkout for the CV-download subscription
 * (€0,50 verification + 14-day trial + €39/mo). After Stripe.confirm() Stripe
 * redirects to the return_url configured server-side
 * (/builder?cv_checkout={CHECKOUT_SESSION_ID}); the builder's mount effect
 * verifies the session and re-opens the download modal with access granted.
 */

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const BUSINESS_NAME = 'ResuBox';

const CTA_CLASS =
  'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

const STRIPE_APPEARANCE: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#059669',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorDanger: '#e11d48',
    colorBackground: '#ffffff',
    borderRadius: '12px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSizeBase: '15px',
    spacingUnit: '4px',
    spacingGridRow: '14px',
  },
  rules: {
    '.Input': { border: '1px solid #e2e8f0', boxShadow: 'none', padding: '11px 12px' },
    '.Input:focus': { border: '1px solid #059669', boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.12)' },
    '.Tab': { border: '1px solid #e2e8f0', boxShadow: 'none' },
    '.Tab:hover': { border: '1px solid #cbd5e1' },
    '.Tab--selected': { border: '1px solid #059669', boxShadow: '0 0 0 1px #059669' },
    '.Label': { fontWeight: '600', color: '#334155' },
  },
};

function CheckoutForm() {
  const result = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  if (result.type === 'loading') {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (result.type === 'error') {
    return <p className="text-sm text-rose-600 py-4">{result.error.message}</p>;
  }

  const checkout = result.checkout;
  const pay = async () => {
    setSubmitting(true);
    setErr('');
    const r = await checkout.confirm();
    if (r.type === 'error') {
      setErr(r.error.message);
      setSubmitting(false);
    }
    // On success Stripe redirects to the session's return_url (?cv_checkout=…).
  };

  return (
    <div>
      <PaymentElement
        options={{
          layout: 'tabs',
          terms: {
            card: 'never',
            ideal: 'never',
            bancontact: 'never',
            sepaDebit: 'never',
            paypal: 'never',
          },
        }}
      />
      {err && <p className="text-sm text-rose-600 mt-3">{err}</p>}
      <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
        Door op &ldquo;Bevestig verificatie&rdquo; te klikken betaal je nu €0,50 en machtig je{' '}
        {BUSINESS_NAME} en Stripe om na de gratis proefperiode van 14 dagen €39 per maand van je
        rekening af te schrijven, totdat je opzegt. Je kunt op elk moment opzeggen in je account.
        Een SEPA-incasso kun je binnen 8 weken zonder opgaaf van reden bij je bank terugvragen.{' '}
        <Link href="/voorwaarden" className="underline">
          Voorwaarden
        </Link>
        .
      </p>

      <div className="mt-4">
        <button onClick={pay} disabled={submitting} className={CTA_CLASS}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          Bevestig verificatie
        </button>
      </div>
    </div>
  );
}

export interface CVPaywallProps {
  /** Email from the CV (prefilled, asked again only if missing). */
  initialEmail: string;
  /** True when the visitor already has a logged-in session — skip the email step. */
  loggedIn: boolean;
}

export function CVPaywall({ initialEmail, loggedIn }: CVPaywallProps) {
  const locale = useLocale();
  const [email, setEmail] = useState(initialEmail);
  const [editingEmail, setEditingEmail] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const knownEmail = Boolean(initialEmail);

  const startSubscription = async () => {
    setError('');
    if (!loggedIn && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Vul een geldig e-mailadres in.');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch('/api/cv/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const j = await res.json();
      if (!res.ok || !j.clientSecret) {
        throw new Error(j.error || 'Kon de afrekening niet starten.');
      }
      setClientSecret(j.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis.');
    } finally {
      setStarting(false);
    }
  };

  if (clientSecret) {
    return (
      <div>
        <button
          onClick={() => setClientSecret(null)}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Terug
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Bevestig je verificatie</h2>
            <p className="text-xs text-slate-500">Eenmalig €0,50.</p>
          </div>
        </div>

        {stripePromise ? (
          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{ clientSecret, elementsOptions: { appearance: STRIPE_APPEARANCE } }}
          >
            <CheckoutForm />
          </CheckoutElementsProvider>
        ) : (
          <p className="text-sm text-rose-600">Betalingen zijn nog niet geconfigureerd.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Verification hero */}
      <div className="text-center mb-5">
        <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-600/25">
          <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Eén keer verifiëren, daarna onbeperkt downloaden
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 leading-snug mx-auto max-w-md">
          We vragen een eenmalige verificatie van <strong className="text-slate-900">€0,50</strong> om
          misbruik tegen te gaan. Daarna kun je je CV 14 dagen gratis downloaden en bijwerken.
        </p>
      </div>

      {/* What's included */}
      <ul className="space-y-2.5 mb-5">
        {[
          'Onbeperkt CV\'s downloaden (PDF en Word)',
          'Alle templates en kleurschema\'s',
          '14 dagen gratis proberen',
        ].map((line) => (
          <li key={line} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {!loggedIn && (
        <div className="mb-3">
          {knownEmail && !editingEmail ? (
            <p className="text-sm text-slate-500 text-center">
              We gebruiken het e-mailadres van je CV: <strong className="text-slate-700">{email}</strong>
              {' · '}
              <button
                type="button"
                onClick={() => setEditingEmail(true)}
                className="text-emerald-700 hover:underline"
              >
                wijzig
              </button>
            </p>
          ) : (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-1">Je e-mailadres</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-rose-600 mt-3 mb-2">{error}</p>}

      <button
        onClick={startSubscription}
        disabled={starting}
        className={CTA_CLASS}
      >
        {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
        Verifieer voor €0,50
      </button>

      {/* Payment methods — onder de knop */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Verifiëren via Stripe met</span>
        <div className="flex items-center gap-1.5">
          {[
            { src: '/payment/ideal.svg', alt: 'iDEAL' },
            { src: '/payment/bancontact.svg', alt: 'Bancontact' },
            { src: '/payment/visa.svg', alt: 'Visa' },
            { src: '/payment/mastercard.svg', alt: 'Mastercard' },
          ].map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={40}
              height={30}
              unoptimized
              className="h-5 w-auto rounded-[4px] ring-1 ring-slate-200/70"
            />
          ))}
        </div>
      </div>

      {/* Compliance disclosure — verplaatst onder knop */}
      <p className="mt-3 text-center text-[11px] text-slate-500 leading-relaxed">
        Je betaalt nu €0,50. Na 14 dagen wordt automatisch €39 per maand afgeschreven, tenzij
        je opzegt. Twee dagen vóór de afschrijving krijg je nog een herinnering per e-mail.
        Je kunt op elk moment opzeggen in je account.
      </p>
      <p className="text-center text-xs text-slate-400 mt-2">
        Door te starten ga je akkoord met de{' '}
        <Link href="/voorwaarden" className="underline">
          voorwaarden
        </Link>
        .
      </p>
    </div>
  );
}
