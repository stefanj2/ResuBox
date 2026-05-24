'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Loader2, MapPin, FileText, ArrowLeft, Check, Banknote, Clock, Calendar } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { Modal } from '@/components/ui';
import type { CVData } from '@/types/cv';
import {
  type Vacancy,
  type CoverLetterDraft,
  type StatusResponse,
  loadCV,
  formatSalary,
  buildLetter,
  fireApplicationEmail,
  LetterPreview,
  Paywall,
  COVER_LETTER_STORAGE_KEY,
  PENDING_SEND_KEY,
} from '../shared';

const VACANCY_CACHE_PREFIX = 'vacancy:';

export default function VacancyPageClient({ id }: { id: string }) {
  const locale = useLocale();
  const router = useRouter();

  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyDomain, setCompanyDomain] = useState<string | null>(null);
  const [fullDescription, setFullDescription] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [cv, setCv] = useState<CVData | null>(null);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<CoverLetterDraft | null>(null);
  const [modalView, setModalView] = useState<'closed' | 'generating' | 'preview' | 'paywall'>('closed');

  const hasAccess = status?.access?.hasAccess ?? false;

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/vacancies/status', { credentials: 'include' });
      setStatus(await res.json());
    } catch {
      setStatus({ enabled: true, loggedIn: false, access: null });
    }
  }, []);

  useEffect(() => {
    setCv(loadCV());
    refreshStatus();

    // Fast path: the list stashed the full vacancy in sessionStorage.
    let stashed: Vacancy | null = null;
    try {
      const raw = sessionStorage.getItem(VACANCY_CACHE_PREFIX + id);
      if (raw) stashed = JSON.parse(raw) as Vacancy;
    } catch {
      // ignore
    }
    if (stashed) setVacancy(stashed);

    // Always fetch the full description; on a deep link this also gives us the
    // core fields so the page renders without the stashed object.
    (async () => {
      try {
        const res = await fetch('/api/vacancies/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, country: 'nl' }),
        });
        const j = await res.json();
        const detail = j.detail;
        if (detail?.description) setFullDescription(detail.description);
        if (detail?.companyLogo) setCompanyLogo(detail.companyLogo);
        if (detail?.companyDomain) setCompanyDomain(detail.companyDomain);

        if (!stashed) {
          if (detail && (detail.title || detail.company)) {
            setVacancy({
              id,
              title: detail.title ?? 'Vacature',
              company: detail.company ?? '',
              location: detail.location ?? '',
              salaryMin: detail.salaryMin ?? null,
              salaryMax: detail.salaryMax ?? null,
              salaryIsPredicted: false,
              url: `https://www.adzuna.nl/details/${id}`,
              description: detail.description ?? '',
              category: null,
              contractType: null,
              contractTime: detail.employmentType ?? null,
              created: detail.datePosted ?? null,
            });
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!stashed) setNotFound(true);
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [id, refreshStatus]);

  const generate = async () => {
    if (!vacancy) return;
    if (!cv) {
      setError('We konden je CV niet vinden. Maak eerst je CV af in de builder.');
      return;
    }
    setError('');
    setModalView('generating');
    setGenerating(true);
    try {
      const res = await fetch('/api/vacancies/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({
          cvData: cv,
          vacancyId: vacancy.id,
          vacancyTitle: vacancy.title,
          vacancyCompany: vacancy.company,
          vacancyText: fullDescription || vacancy.description,
          vacancyUrl: vacancy.url,
          locale,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.draft) throw new Error(j.error || 'Brief genereren mislukt.');
      setDraft(j.draft);
      setModalView('preview');
    } catch (err) {
      // Stay in the modal and show the error with a retry option.
      setError(err instanceof Error ? err.message : 'Er ging iets mis.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = () => {
    if (!draft || !vacancy) return;
    if (hasAccess) {
      const letter = buildLetter(cv, draft, vacancy);
      localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(letter));
      sessionStorage.removeItem(PENDING_SEND_KEY);
      fireApplicationEmail(vacancy, letter, cv, locale);
      router.push('/motivatiebrief');
      return;
    }
    try {
      sessionStorage.setItem(PENDING_SEND_KEY, JSON.stringify({ draft, vacancy }));
    } catch {
      // ignore
    }
    setModalView('paywall');
  };

  const salary = vacancy ? formatSalary(vacancy) : null;
  const description = fullDescription ?? vacancy?.description ?? '';

  const tags: string[] = [];
  if (vacancy?.contractTime === 'full_time' || vacancy?.contractTime === 'FULL_TIME') tags.push('Fulltime');
  if (vacancy?.contractTime === 'part_time' || vacancy?.contractTime === 'PART_TIME') tags.push('Parttime');
  if (vacancy?.contractType === 'permanent') tags.push('Vast contract');
  if (vacancy?.contractType === 'contract') tags.push('Tijdelijk');
  if (vacancy?.category) tags.push(vacancy.category);

  const posted = vacancy?.created
    ? new Date(vacancy.created).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <Link href="/vacatures" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" /> Alle vacatures
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!vacancy && loadingDetail ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : notFound || !vacancy ? (
          <div className="text-center py-24">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Vacature niet gevonden</h1>
            <p className="text-slate-600 mb-6">Deze vacature is mogelijk niet meer beschikbaar.</p>
            <Link
              href="/vacatures"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
            >
              Terug naar vacatures
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <CompanyAvatar
                  name={vacancy.company}
                  sources={[
                    companyLogo,
                    companyDomain ? `https://logo.clearbit.com/${companyDomain}` : null,
                  ].filter((s): s is string => Boolean(s))}
                />
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{vacancy.title}</h1>
                  <p className="text-slate-500 mt-1">{vacancy.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                {vacancy.location && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" /> {vacancy.location}
                  </span>
                )}
                {salary && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <Banknote className="w-3.5 h-3.5" /> {salary}
                  </span>
                )}
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Apply card — first on mobile, sticky on the right on desktop */}
              <aside className="lg:col-span-1 lg:order-last">
                <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <dl className="space-y-3 mb-5">
                    {salary && <Fact icon={<Banknote className="w-4 h-4" />} label="Salaris" value={salary} accent />}
                    {tags[0] && <Fact icon={<Clock className="w-4 h-4" />} label="Dienstverband" value={tags.join(' · ')} />}
                    {vacancy.location && <Fact icon={<MapPin className="w-4 h-4" />} label="Locatie" value={vacancy.location} />}
                    {posted && <Fact icon={<Calendar className="w-4 h-4" />} label="Geplaatst" value={posted} />}
                  </dl>

                  <button
                    onClick={generate}
                    disabled={generating}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60"
                  >
                    {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                    {generating ? 'Motivatiebrief schrijven…' : 'Solliciteer met AI'}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-2.5">
                    Onze AI schrijft je motivatiebrief in seconden — afgestemd op deze vacature.
                  </p>
                  {error && <p className="text-sm text-rose-600 mt-3 text-center">{error}</p>}
                </div>
              </aside>

              {/* Description */}
              <article className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Over deze functie</h2>
                {description ? (
                  <JobDescription text={description} />
                ) : (
                  <p className="text-slate-500">Geen omschrijving beschikbaar.</p>
                )}
                {loadingDetail && (
                  <span className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> Volledige omschrijving laden…
                  </span>
                )}
              </article>
            </div>
          </>
        )}
      </main>

      {/* Generating + preview + paywall modal */}
      <Modal
        isOpen={modalView !== 'closed'}
        onClose={() => setModalView('closed')}
        size={modalView === 'preview' ? 'xl' : 'lg'}
        mobileFullScreen
        title={modalView === 'paywall' ? 'Verificatie' : 'Je motivatiebrief'}
      >
        <div className="p-5 sm:p-6">
          <ApplyStepper current={modalView === 'paywall' ? 2 : 1} />
          {modalView === 'generating' ? (
            <div className="text-center py-10">
              {error ? (
                <>
                  <p className="text-rose-600 mb-4">{error}</p>
                  <button
                    onClick={generate}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                  >
                    Opnieuw proberen
                  </button>
                </>
              ) : (
                <>
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    Je motivatiebrief wordt geschreven…
                  </h2>
                  <p className="text-sm text-slate-500">
                    Onze AI stemt je brief af op {vacancy?.company || 'deze vacature'}. Dit duurt enkele seconden.
                  </p>
                </>
              )}
            </div>
          ) : modalView === 'paywall' ? (
            <Paywall status={status!} locale={locale} />
          ) : (
            draft && (
              <LetterPreview
                draft={draft}
                vacancy={vacancy}
                onSend={handleSend}
                onBack={() => setModalView('closed')}
              />
            )
          )}
        </div>
      </Modal>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Elegant 3-step progress bar shown in the apply modal.

function ApplyStepper({ current }: { current: number }) {
  const steps = ['Motivatiebrief', 'Verificatie', 'Solliciteren'];
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <React.Fragment key={label}>
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : active
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : n}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 rounded transition-colors ${
                    n < current ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between">
        {steps.map((label, i) => {
          const n = i + 1;
          return (
            <span
              key={label}
              className={`text-[11px] font-medium ${n <= current ? 'text-slate-700' : 'text-slate-400'} ${
                i === 0 ? 'text-left' : i === steps.length - 1 ? 'text-right' : 'text-center'
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// A single key fact row in the apply sidebar.

function Fact({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className={`text-sm font-semibold ${accent ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</dd>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Render the (plain-text) Adzuna description into headings, bullet lists
// and paragraphs for a readable, structured layout.

function JobDescription({ text }: { text: string }) {
  const lines = text.split('\n').map((l) => l.trim());
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-[15px] text-slate-600 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  lines.forEach((line) => {
    if (!line) {
      flushBullets();
      return;
    }
    if (line.startsWith('•')) {
      bullets.push(line.replace(/^•\s*/, ''));
      return;
    }
    flushBullets();
    const isHeading = line.endsWith(':') && line.length <= 48 && !line.includes('. ');
    if (isHeading) {
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="text-xs font-bold uppercase tracking-wide text-slate-900 pt-2 first:pt-0"
        >
          {line.replace(/:$/, '')}
        </h3>
      );
    } else {
      blocks.push(
        <p key={`p-${blocks.length}`} className="text-[15px] text-slate-600 leading-relaxed">
          {line}
        </p>
      );
    }
  });
  flushBullets();

  return <div className="space-y-3">{blocks}</div>;
}

// ───────────────────────────────────────────────────────────────────
// Company avatar — real logo (from JSON-LD) or a coloured initials fallback.

const AVATAR_PALETTE = [
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
];

function CompanyAvatar({ name, sources }: { name: string; sources: string[] }) {
  // Try each source (real logo → domain logo) in order; on error advance to the
  // next, and fall back to the coloured initials when all fail.
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setIdx((i) => i + 1)}
        className="h-16 w-16 flex-shrink-0 rounded-2xl object-contain bg-white ring-1 ring-slate-200 p-2 shadow-sm"
      />
    );
  }

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?';
  const colorIdx = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;

  return (
    <div
      className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-sm ${AVATAR_PALETTE[colorIdx]}`}
    >
      {initials}
    </div>
  );
}
