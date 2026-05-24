'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Loader2, Search, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import type { CVData } from '@/types/cv';
import {
  type Vacancy,
  type CoverLetterDraft,
  type StatusResponse,
  type AccessState,
  loadCV,
  formatSalary,
  buildLetter,
  fireApplicationEmail,
  COVER_LETTER_STORAGE_KEY,
  PENDING_SEND_KEY,
} from './shared';

const VACANCY_CACHE_PREFIX = 'vacancy:';

type Employment = 'alle' | 'fulltime' | 'parttime';
type ContractType = 'alle' | 'permanent' | 'contract';
type SortBy = 'relevance' | 'date' | 'salary';

interface SearchOverrides {
  what?: string;
  where?: string;
  employment?: Employment;
  contractType?: ContractType;
  salaryMin?: number;
  sortBy?: SortBy;
}

export default function VacanciesClient() {
  const router = useRouter();
  const locale = useLocale();

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/vacancies/status', { credentials: 'include' });
      setStatus(await res.json());
    } catch {
      setStatus({ enabled: false, loggedIn: false, access: null });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Returning from the embedded Stripe checkout: verify the payment, get logged
  // in, and hand the prepared letter off to the editor.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('vac_checkout');
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch('/api/vacancies/subscribe/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const j = await res.json();
        window.history.replaceState({}, '', window.location.pathname);
        if (!j.ok) return;
        const pendingRaw = sessionStorage.getItem(PENDING_SEND_KEY);
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw) as { draft: CoverLetterDraft; vacancy: Vacancy };
          const cv = loadCV();
          const letter = buildLetter(cv, pending.draft, pending.vacancy);
          localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(letter));
          sessionStorage.removeItem(PENDING_SEND_KEY);
          fireApplicationEmail(pending.vacancy, letter, cv, locale);
          router.push('/motivatiebrief');
          return;
        }
        refreshStatus();
      } catch {
        // ignore
      }
    })();
  }, [router, refreshStatus, locale]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/builder" className="text-slate-600 hover:text-slate-900">
                Mijn CV
              </Link>
              <Link href="/motivatiebrief" className="text-slate-600 hover:text-slate-900">
                Motivatiebrief
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingStatus ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : !status?.enabled ? (
          <div className="max-w-lg mx-auto text-center py-24">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Binnenkort beschikbaar</h1>
            <p className="text-slate-600">
              Solliciteren op echte vacatures via ResuBox komt eraan. Houd je inbox in de gaten.
            </p>
          </div>
        ) : (
          <VacancyBoard router={router} status={status} />
        )}
      </main>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Vacancy board — browse + filter; opens a vacancy page on our own site

function VacancyBoard({
  router,
  status,
}: {
  router: ReturnType<typeof useRouter>;
  status: StatusResponse;
}) {
  const locale = useLocale();
  const access: AccessState | null = status.access;
  const hasAccess = access?.hasAccess ?? false;

  const [cv, setCv] = useState<CVData | null>(null);
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [employment, setEmployment] = useState<Employment>('alle');
  const [contractType, setContractType] = useState<ContractType>('alle');
  const [salaryMin, setSalaryMin] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(
    async (cvData: CVData | null, overrides: SearchOverrides = {}) => {
      const emp = overrides.employment ?? employment;
      const ctr = overrides.contractType ?? contractType;
      const sal = overrides.salaryMin ?? salaryMin;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/vacancies/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            what: overrides.what ?? what,
            where: overrides.where ?? where,
            cvData: cvData ?? undefined,
            fullTime: emp === 'fulltime',
            partTime: emp === 'parttime',
            permanent: ctr === 'permanent',
            contract: ctr === 'contract',
            salaryMin: sal > 0 ? sal : undefined,
            sortBy: overrides.sortBy ?? sortBy,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Vacatures ophalen mislukt.');
        setVacancies(j.vacancies ?? []);
        if (j.query) {
          setWhat((prev) => prev || j.query.what || '');
          setWhere((prev) => prev || j.query.where || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er ging iets mis.');
      } finally {
        setLoading(false);
        setSearched(true);
      }
    },
    [what, where, employment, contractType, salaryMin, sortBy]
  );

  // On mount: load CV, run an initial derived search, and resume a pending send
  // if the visitor just returned from Stripe checkout with active access.
  useEffect(() => {
    const loaded = loadCV();
    setCv(loaded);
    runSearch(loaded);

    try {
      const pendingRaw = sessionStorage.getItem(PENDING_SEND_KEY);
      if (pendingRaw && hasAccess) {
        const pending = JSON.parse(pendingRaw) as { draft: CoverLetterDraft; vacancy: Vacancy };
        const letter = buildLetter(loaded, pending.draft, pending.vacancy);
        localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(letter));
        sessionStorage.removeItem(PENDING_SEND_KEY);
        fireApplicationEmail(pending.vacancy, letter, loaded, locale);
        router.push('/motivatiebrief');
      }
    } catch {
      // ignore malformed pending state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openVacancy = (v: Vacancy) => {
    try {
      sessionStorage.setItem(VACANCY_CACHE_PREFIX + v.id, JSON.stringify(v));
    } catch {
      // ignore storage errors
    }
    router.push({ pathname: '/vacatures/[id]', params: { id: v.id } });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vacatures voor jou</h1>
          <p className="text-slate-600">
            Echte vacatures die passen bij jouw CV.{' '}
            {hasAccess ? 'Je abonnement is actief.' : 'Maak een afgestemde motivatiebrief en solliciteer.'}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 border border-slate-200 rounded-lg">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(cv)}
            placeholder="Functie of trefwoord"
            className="w-full py-2.5 text-sm focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 border border-slate-200 rounded-lg">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(cv)}
            placeholder="Plaats"
            className="w-full py-2.5 text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={() => runSearch(cv)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Zoeken
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <FilterSelect
          label="Dienstverband"
          value={employment}
          onChange={(val) => {
            setEmployment(val as Employment);
            runSearch(cv, { employment: val as Employment });
          }}
          options={[
            { value: 'alle', label: 'Alle dienstverbanden' },
            { value: 'fulltime', label: 'Fulltime' },
            { value: 'parttime', label: 'Parttime' },
          ]}
        />
        <FilterSelect
          label="Contract"
          value={contractType}
          onChange={(val) => {
            setContractType(val as ContractType);
            runSearch(cv, { contractType: val as ContractType });
          }}
          options={[
            { value: 'alle', label: 'Elk contract' },
            { value: 'permanent', label: 'Vast' },
            { value: 'contract', label: 'Tijdelijk' },
          ]}
        />
        <FilterSelect
          label="Salaris vanaf"
          value={String(salaryMin)}
          onChange={(val) => {
            const num = Number(val);
            setSalaryMin(num);
            runSearch(cv, { salaryMin: num });
          }}
          options={[
            { value: '0', label: 'Elk salaris' },
            { value: '30000', label: 'vanaf €30.000' },
            { value: '40000', label: 'vanaf €40.000' },
            { value: '50000', label: 'vanaf €50.000' },
            { value: '60000', label: 'vanaf €60.000' },
            { value: '80000', label: 'vanaf €80.000' },
          ]}
        />
        <div className="ml-auto">
          <FilterSelect
            label="Sorteren"
            value={sortBy}
            onChange={(val) => {
              setSortBy(val as SortBy);
              runSearch(cv, { sortBy: val as SortBy });
            }}
            options={[
              { value: 'relevance', label: 'Meest relevant' },
              { value: 'date', label: 'Nieuwste eerst' },
              { value: 'salary', label: 'Hoogste salaris' },
            ]}
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

      {loading && vacancies.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : vacancies.length === 0 && searched ? (
        <div className="text-center py-16 text-slate-500">
          <p>Geen vacatures gevonden. Probeer een andere functie of plaats.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((v) => {
            const salary = formatSalary(v);
            return (
              <button
                key={v.id}
                onClick={() => openVacancy(v)}
                className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm hover:border-emerald-200 transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900">{v.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> {v.company}
                  </span>
                  {v.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {v.location}
                    </span>
                  )}
                  {salary && <span className="text-emerald-700 font-medium">{salary}</span>}
                </div>
                {v.description && <p className="text-sm text-slate-600 mt-3 line-clamp-2">{v.description}</p>}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 mt-3">
                  Bekijk vacature <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Filter dropdown

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 w-4 h-4 text-slate-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}
