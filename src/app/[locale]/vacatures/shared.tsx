'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  CheckCircle,
  Check,
  ShieldCheck,
  Send,
  ArrowLeft,
  MapPin,
  Banknote,
  Clock,
  FileText,
} from 'lucide-react';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { CheckoutElementsProvider, useCheckoutElements, PaymentElement } from '@stripe/react-stripe-js/checkout';
import { Link } from '@/i18n/navigation';
import { CVPreview } from '@/components/preview';
import type { CVData } from '@/types/cv';
import { createEmptyCoverLetter, type CoverLetterData } from '@/types/cover-letter';

// Scale for the first-page CV thumbnail shown alongside the letter.
const CV_THUMB_SCALE = 0.19;

// Load Stripe.js once. Null when the publishable key isn't configured yet.
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// Legal/business name shown in the SEPA Direct Debit mandate under the pay
// button. Keep this in sync with your Stripe account's business name.
const BUSINESS_NAME = 'ResuBox';

// Shared premium primary CTA + soft sticky footer (always-visible action).
const CTA_CLASS =
  'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
const STICKY_FOOTER =
  'sticky bottom-0 -mx-5 sm:-mx-6 mt-4 px-5 sm:px-6 pt-3 pb-1 bg-white/90 backdrop-blur-sm shadow-[0_-14px_24px_-18px_rgba(15,23,42,0.22)]';

// Brand styling for the Stripe Payment Element (emerald) — refined to match
// the rest of the modal: soft inputs, emerald focus ring, calm spacing.
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
    '.Input': {
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
      padding: '11px 12px',
    },
    '.Input:focus': {
      border: '1px solid #059669',
      boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.12)',
    },
    '.Tab': {
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
    },
    '.Tab:hover': {
      border: '1px solid #cbd5e1',
    },
    '.Tab--selected': {
      border: '1px solid #059669',
      boxShadow: '0 0 0 1px #059669',
    },
    '.Label': {
      fontWeight: '600',
      color: '#334155',
    },
  },
};

// Our own fully styled checkout: Stripe's PaymentElement for the fields, our
// own button + copy. checkout.confirm() submits and redirects to return_url.
function CustomCheckoutForm() {
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
    // On success Stripe redirects to the session's return_url (?vac_checkout=…).
  };

  return (
    <div>
      <PaymentElement
        options={{
          layout: 'tabs',
          // Suppress Stripe's built-in mandate/terms text above our button —
          // we show our own consolidated authorization below the button.
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
        Door op &ldquo;Start verificatie&rdquo; te klikken betaal je nu €1 en machtig je{' '}
        {BUSINESS_NAME} en Stripe om na de gratis proefperiode €17,25/mnd van je rekening af te
        schrijven, tot je opzegt. Terugbetaling kun je binnen 8 weken bij je bank claimen.{' '}
        <Link href="/voorwaarden" className="underline">
          Voorwaarden
        </Link>
        .
      </p>

      {/* Sticky action — always visible without scrolling */}
      <div className={STICKY_FOOTER}>
        <button onClick={pay} disabled={submitting} className={CTA_CLASS}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          Start verificatie
        </button>
      </div>
    </div>
  );
}

export const CV_STORAGE_KEY = 'cv-builder-session';
export const COVER_LETTER_STORAGE_KEY = 'cover-letter-session';
export const PENDING_SEND_KEY = 'vacancy-pending-send';

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryIsPredicted: boolean;
  url: string;
  description: string;
  category: string | null;
  contractType: string | null;
  contractTime: string | null;
  created: string | null;
}

export interface CoverLetterDraft {
  greeting: string;
  opening: string;
  body: string;
  closing: string;
  signature: string;
  vacancyTitle: string;
  contactName: string;
}

export interface AccessState {
  hasAccess: boolean;
  status: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

export interface StatusResponse {
  enabled: boolean;
  loggedIn: boolean;
  email?: string;
  access: AccessState | null;
}

export function loadCV(): CVData | null {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CVData) : null;
  } catch {
    return null;
  }
}

export function formatSalary(v: Pick<Vacancy, 'salaryMin' | 'salaryMax' | 'salaryIsPredicted'>): string | null {
  if (!v.salaryMin && !v.salaryMax) return null;
  const fmt = (n: number) => `€${Math.round(n).toLocaleString('nl-NL')}`;
  const range =
    v.salaryMin && v.salaryMax && v.salaryMin !== v.salaryMax
      ? `${fmt(v.salaryMin)} – ${fmt(v.salaryMax)}`
      : fmt((v.salaryMax || v.salaryMin)!);
  return `${range}${v.salaryIsPredicted ? ' (schatting)' : ''} p/j`;
}

/** Map a generated draft + vacancy + CV into a full CoverLetterData object. */
export function buildLetter(cv: CVData | null, draft: CoverLetterDraft, v: Vacancy): CoverLetterData {
  const letter = createEmptyCoverLetter();
  letter.id = crypto.randomUUID();
  letter.sender = {
    firstName: cv?.personal?.firstName ?? '',
    lastName: cv?.personal?.lastName ?? '',
    email: cv?.personal?.email ?? '',
    phone: cv?.personal?.phone ?? '',
    city: cv?.personal?.city ?? '',
    address: cv?.personal?.address ?? '',
    postalCode: cv?.personal?.postalCode ?? '',
  };
  letter.recipient = {
    contactName: draft.contactName ?? '',
    contactTitle: '',
    company: v.company,
    city: v.location ?? '',
  };
  letter.vacancyTitle = draft.vacancyTitle || v.title;
  letter.letterCity = cv?.personal?.city ?? '';
  letter.greeting = draft.greeting ?? '';
  letter.opening = draft.opening ?? '';
  letter.body = draft.body ?? '';
  letter.closing = draft.closing ?? '';
  letter.signature = draft.signature || 'Met vriendelijke groet,';
  return letter;
}

/**
 * Fire-and-forget: email the applicant their application package (cover letter
 * + CV as PDFs, plus which vacancy). Called right after a successful send.
 */
export function fireApplicationEmail(
  vacancy: Vacancy,
  coverLetter: CoverLetterData,
  cv: CVData | null,
  locale: string
) {
  if (!cv) return;
  fetch('/api/vacancies/application-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vacancy: {
        title: vacancy.title,
        company: vacancy.company,
        location: vacancy.location,
        url: vacancy.url,
      },
      coverLetter,
      cvData: cv,
      locale,
    }),
  }).catch(() => {
    // best-effort; the user still gets the letter in the editor
  });
}

// ───────────────────────────────────────────────────────────────────
// Letter preview — free; the send button is the paywall trigger

export function LetterPreview({
  draft,
  vacancy,
  onSend,
  onBack,
}: {
  draft: CoverLetterDraft;
  vacancy: Vacancy | null;
  onSend: () => void;
  onBack: () => void;
}) {
  const cv = loadCV();
  const cvName = `${cv?.personal?.firstName ?? ''} ${cv?.personal?.lastName ?? ''}`.trim();
  const salary = vacancy ? formatSalary(vacancy) : null;
  const hours =
    vacancy?.contractTime === 'full_time' || vacancy?.contractTime === 'FULL_TIME'
      ? 'Fulltime'
      : vacancy?.contractTime === 'part_time' || vacancy?.contractTime === 'PART_TIME'
      ? 'Parttime'
      : null;
  const contract =
    vacancy?.contractType === 'permanent' ? 'Vast' : vacancy?.contractType === 'contract' ? 'Tijdelijk' : null;

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-3"
      >
        <ArrowLeft className="w-4 h-4" /> Terug naar vacature
      </button>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: the tailored letter */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 mb-1.5 inline-flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Je motivatiebrief op maat
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-h-[38vh] overflow-y-auto text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {draft.greeting}
            {'\n\n'}
            {draft.opening}
            {'\n\n'}
            {draft.body}
            {'\n\n'}
            {draft.closing}
            {'\n\n'}
            {draft.signature}
          </div>
        </div>

        {/* Right: vacancy facts + CV thumbnail */}
        <div className="md:w-48 flex-shrink-0 space-y-4">
          {vacancy && (
            <div>
              <p className="font-semibold text-slate-900 text-sm leading-snug">
                {draft.vacancyTitle || vacancy.title}
              </p>
              {vacancy.company && <p className="text-xs text-slate-500">{vacancy.company}</p>}
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                {vacancy.location && (
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {vacancy.location}
                  </p>
                )}
                {salary && (
                  <p className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Banknote className="w-3.5 h-3.5 flex-shrink-0" /> {salary}
                  </p>
                )}
                {hours && (
                  <p className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" /> {hours}
                  </p>
                )}
                {contract && (
                  <p className="inline-flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" /> {contract} contract
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-slate-700 mb-1.5">Je CV wordt meegestuurd</p>
            {cv ? (
              <div
                className="overflow-hidden rounded-md border border-slate-200 shadow-sm bg-white"
                style={{ width: `${210 * CV_THUMB_SCALE}mm`, height: `${297 * CV_THUMB_SCALE}mm` }}
                aria-hidden="true"
              >
                <div
                  className="pointer-events-none origin-top-left overflow-hidden"
                  style={{ width: '210mm', height: '297mm', transform: `scale(${CV_THUMB_SCALE})` }}
                >
                  <CVPreview dataOverride={cv} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Geen CV gevonden.</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">
              {cvName ? `${cvName} · ` : ''}alleen 1e pagina
            </p>
          </div>
        </div>
      </div>

      <div className={STICKY_FOOTER}>
        <button onClick={onSend} className={CTA_CLASS}>
          <Send className="w-5 h-5" />
          Solliciteer direct
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Paywall — shown when sending without a subscription

export function Paywall({
  status,
  locale,
}: {
  status: StatusResponse;
  locale: string;
}) {
  const [email, setEmail] = useState('');
  const [knowEmail, setKnowEmail] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Reuse the email from the CV the visitor already made — don't ask again.
  useEffect(() => {
    const cvEmail = loadCV()?.personal?.email?.trim();
    if (cvEmail) {
      setEmail(cvEmail);
      setKnowEmail(true);
    }
  }, []);

  // Create the embedded checkout session and reveal Stripe's payment form
  // inline (no redirect to a hosted Stripe page).
  const startSubscription = async () => {
    setError('');
    if (!status.loggedIn && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Vul een geldig e-mailadres in.');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch('/api/vacancies/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const j = await res.json();
      if (!res.ok || !j.clientSecret) {
        throw new Error(j.error || 'Kon afrekenen niet starten.');
      }
      setClientSecret(j.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis.');
    } finally {
      setStarting(false);
    }
  };

  // Custom Stripe payment view (our own UI around Stripe's PaymentElement).
  if (clientSecret) {
    return (
      <div>
        <button
          onClick={() => setClientSecret(null)}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Terug
        </button>

        {/* Verification header — matches the previous screen */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Bevestig je verificatie</h2>
            <p className="text-xs text-slate-500">Eenmalige €1-betaling — bevestig dat je echt bent.</p>
          </div>
        </div>

        {stripePromise ? (
          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{ clientSecret, elementsOptions: { appearance: STRIPE_APPEARANCE } }}
          >
            <CustomCheckoutForm />
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
          Even checken of je een echt persoon bent
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 leading-snug mx-auto max-w-md">
          We doen een eenmalige verificatie van <strong className="text-slate-900">€1</strong>.
          Zo houden we spam en nepsollicitaties buiten de deur.
        </p>
      </div>

      {/* What happens after verifying */}
      <ul className="space-y-2.5 mb-5">
        {[
          'Je bevestigt direct dat je een echt persoon bent',
          'Je sollicitatie wordt direct verstuurd',
          'Je krijgt updates zodra er op je sollicitatie wordt gereageerd',
        ].map((line) => (
          <li key={line} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {/* Payment methods */}
      <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-center gap-3">
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
                className="h-6 w-auto rounded-[4px] ring-1 ring-slate-200/70"
              />
            ))}
          </div>
        </div>
      </div>

      {!status.loggedIn && (
        <div className="mb-3">
          {knowEmail && !editingEmail ? (
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

      {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}

      {/* Sticky action — always visible without scrolling */}
      <div className={STICKY_FOOTER}>
        <button onClick={startSubscription} disabled={starting} className={CTA_CLASS}>
          {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          Direct verifiëren
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          Door te starten ga je akkoord met de{' '}
          <Link href="/voorwaarden" className="underline">
            voorwaarden
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
