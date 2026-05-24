import 'server-only';
import type { CVData } from '@/types/cv';

/**
 * Adzuna job-search client.
 *
 * Adzuna exposes real, live job adverts per country. We hit the NL endpoint
 * and normalise the response into our own `Vacancy` shape. The free developer
 * tier is rate-limited (~250 req/day), so every query is cached in-memory for
 * CACHE_TTL_MS — most users searching the same role/city hit the cache.
 *
 * Credentials are optional at build/deploy time: when ADZUNA_APP_ID /
 * ADZUNA_APP_KEY are absent the client degrades gracefully (isConfigured()
 * returns false and searchVacancies() returns an empty, flagged result) so the
 * rest of the feature can be wired up and shipped behind the VACANCIES_ENABLED
 * flag before credentials exist.
 *
 * Docs: https://developer.adzuna.com/docs/search
 */

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  /** Major currency units per year, when Adzuna provides/predicts it. */
  salaryMin: number | null;
  salaryMax: number | null;
  salaryIsPredicted: boolean;
  /** Adzuna redirect URL — the canonical "apply / view" link. */
  url: string;
  /** Short HTML-stripped snippet from the advert. */
  description: string;
  category: string | null;
  /** "permanent" | "contract" — Adzuna contract_type. */
  contractType: string | null;
  /** "full_time" | "part_time" — Adzuna contract_time. */
  contractTime: string | null;
  /** ISO timestamp the advert was created on Adzuna. */
  created: string | null;
}

export type SortBy = 'relevance' | 'date' | 'salary';

export interface SearchParams {
  /** Keywords — job title / role. */
  what?: string;
  /** Location, e.g. "Amsterdam". */
  where?: string;
  page?: number;
  resultsPerPage?: number;
  /** Country endpoint. Defaults to 'nl'. */
  country?: string;
  /** Only full-time roles. */
  fullTime?: boolean;
  /** Only part-time roles. */
  partTime?: boolean;
  /** Only permanent contracts. */
  permanent?: boolean;
  /** Only temporary/contract roles. */
  contract?: boolean;
  /** Minimum yearly salary (major units). */
  salaryMin?: number;
  /** Result ordering. Defaults to relevance. */
  sortBy?: SortBy;
}

export interface SearchResult {
  vacancies: Vacancy[];
  /** Total matching adverts according to Adzuna (for "X+ vacatures"). */
  count: number;
  /** True when results came from the in-memory cache. */
  cached: boolean;
  /** False when credentials are missing — caller should show a setup hint. */
  configured: boolean;
}

export function isConfigured(): boolean {
  return Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
}

// ── In-memory cache ────────────────────────────────────────────────
interface CacheEntry {
  result: SearchResult;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();

interface ResolvedParams {
  what: string;
  where: string;
  page: number;
  resultsPerPage: number;
  country: string;
  fullTime: boolean;
  partTime: boolean;
  permanent: boolean;
  contract: boolean;
  salaryMin: number | null;
  sortBy: SortBy;
}

function cacheKey(p: ResolvedParams): string {
  return [
    p.country,
    p.what,
    p.where,
    p.page,
    p.resultsPerPage,
    p.fullTime ? 'ft' : '',
    p.partTime ? 'pt' : '',
    p.permanent ? 'perm' : '',
    p.contract ? 'temp' : '',
    p.salaryMin ?? '',
    p.sortBy,
  ]
    .join('|')
    .toLowerCase();
}

/**
 * Convert an HTML description into readable plain text, preserving paragraph
 * and list structure (unlike stripHtml, which collapses everything to one
 * line). Used for the full vacancy description.
 */
function htmlToReadableText(input: string): string {
  return input
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '\n• ')
    .replace(/<\/\s*(p|div|li|ul|ol|h[1-6]|tr|section)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

interface AdzunaResult {
  id?: string;
  title?: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string | number | boolean;
  redirect_url?: string;
  description?: string;
  category?: { label?: string };
  contract_type?: string;
  contract_time?: string;
  created?: string;
}

function normalise(r: AdzunaResult): Vacancy {
  return {
    id: String(r.id ?? ''),
    title: r.title ? stripHtml(r.title) : 'Vacature',
    company: r.company?.display_name ?? 'Onbekend',
    location: r.location?.display_name ?? '',
    salaryMin: typeof r.salary_min === 'number' ? r.salary_min : null,
    salaryMax: typeof r.salary_max === 'number' ? r.salary_max : null,
    salaryIsPredicted: r.salary_is_predicted === '1' || r.salary_is_predicted === 1 || r.salary_is_predicted === true,
    url: r.redirect_url ?? '',
    description: r.description ? stripHtml(r.description).slice(0, 1200) : '',
    category: r.category?.label ?? null,
    contractType: r.contract_type ?? null,
    contractTime: r.contract_time ?? null,
    created: r.created ?? null,
  };
}

export async function searchVacancies(params: SearchParams): Promise<SearchResult> {
  const resolved: ResolvedParams = {
    what: (params.what ?? '').trim(),
    where: (params.where ?? '').trim(),
    page: Math.max(1, params.page ?? 1),
    resultsPerPage: Math.min(50, Math.max(1, params.resultsPerPage ?? 12)),
    country: (params.country ?? 'nl').toLowerCase(),
    fullTime: Boolean(params.fullTime),
    partTime: Boolean(params.partTime),
    permanent: Boolean(params.permanent),
    contract: Boolean(params.contract),
    salaryMin: typeof params.salaryMin === 'number' && params.salaryMin > 0 ? params.salaryMin : null,
    sortBy: params.sortBy ?? 'relevance',
  };

  if (!isConfigured()) {
    return { vacancies: [], count: 0, cached: false, configured: false };
  }

  const key = cacheKey(resolved);
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return { ...hit.result, cached: true };
  }

  const url = new URL(`${ADZUNA_BASE}/${resolved.country}/search/${resolved.page}`);
  url.searchParams.set('app_id', process.env.ADZUNA_APP_ID!);
  url.searchParams.set('app_key', process.env.ADZUNA_APP_KEY!);
  url.searchParams.set('results_per_page', String(resolved.resultsPerPage));
  // Adzuna filter flags are only valid when set to 1; omit them otherwise.
  if (resolved.fullTime) url.searchParams.set('full_time', '1');
  if (resolved.partTime) url.searchParams.set('part_time', '1');
  if (resolved.permanent) url.searchParams.set('permanent', '1');
  if (resolved.contract) url.searchParams.set('contract', '1');
  if (resolved.salaryMin) url.searchParams.set('salary_min', String(Math.round(resolved.salaryMin)));
  if (resolved.sortBy !== 'relevance') url.searchParams.set('sort_by', resolved.sortBy);
  url.searchParams.set('content-type', 'application/json');
  if (resolved.what) url.searchParams.set('what', resolved.what);
  if (resolved.where) url.searchParams.set('where', resolved.where);

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': 'ResuBox/1.0 (+https://www.resubox.com)' },
    // Adzuna data is not personalised; let the platform cache too.
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Adzuna ${response.status}: ${body.slice(0, 200)}`);
  }

  const json = (await response.json()) as { results?: AdzunaResult[]; count?: number };
  const vacancies = (json.results ?? []).map(normalise).filter((v) => v.url);

  const result: SearchResult = {
    vacancies,
    count: typeof json.count === 'number' ? json.count : vacancies.length,
    cached: false,
    configured: true,
  };

  cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

// ── Full description fetch ─────────────────────────────────────────
// Adzuna's search API only returns a snippet. The full text lives on the
// adzuna.nl/.com detail page, which embeds a schema.org JobPosting in JSON-LD.
// We fetch that page and pull the description out. SSRF-guarded to Adzuna hosts.

// Adzuna domain per search country. The detail page (.../details/<id>) is the
// only URL form that reliably embeds a schema.org JobPosting with the full text.
const ADZUNA_DOMAIN_BY_COUNTRY: Record<string, string> = {
  nl: 'www.adzuna.nl',
  gb: 'www.adzuna.co.uk',
  de: 'www.adzuna.de',
};

export interface VacancyDetail {
  description: string;
  employmentType: string | null;
  datePosted: string | null;
  /** Core fields parsed from JSON-LD so a deep-linked page can render standalone. */
  title: string | null;
  company: string | null;
  companyLogo: string | null;
  companyDomain: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
}

function parseLogo(org: Record<string, unknown> | undefined): string | null {
  const logo = org?.logo;
  if (typeof logo === 'string' && logo.startsWith('http')) return logo;
  if (logo && typeof logo === 'object') {
    const url = (logo as Record<string, unknown>).url;
    if (typeof url === 'string' && url.startsWith('http')) return url;
  }
  return null;
}

// Aggregator/social hosts we don't want a "company logo" from.
const NON_COMPANY_HOSTS = /adzuna|indeed|linkedin|facebook|twitter|x\.com|instagram|youtube/i;

function parseCompanyDomain(org: Record<string, unknown> | undefined): string | null {
  const candidates: string[] = [];
  if (typeof org?.url === 'string') candidates.push(org.url);
  const sameAs = org?.sameAs;
  if (typeof sameAs === 'string') candidates.push(sameAs);
  else if (Array.isArray(sameAs)) candidates.push(...sameAs.filter((s): s is string => typeof s === 'string'));
  for (const c of candidates) {
    try {
      const host = new URL(c).hostname.replace(/^www\./, '');
      if (host && host.includes('.') && !NON_COMPANY_HOSTS.test(host)) return host;
    } catch {
      // not a valid URL — skip
    }
  }
  return null;
}

function asNumber(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

function parseSalary(baseSalary: unknown): { min: number | null; max: number | null } {
  const bs = baseSalary as Record<string, unknown> | undefined;
  const value = bs?.value as Record<string, unknown> | undefined;
  if (!value) return { min: null, max: null };
  const min = asNumber(value.minValue) ?? asNumber(value.value);
  const max = asNumber(value.maxValue) ?? asNumber(value.value);
  return { min, max };
}

function parseLocation(jobLocation: unknown): string | null {
  const loc = Array.isArray(jobLocation) ? jobLocation[0] : jobLocation;
  const addr = (loc as Record<string, unknown>)?.address as Record<string, unknown> | undefined;
  if (!addr) return null;
  const parts = [addr.addressLocality, addr.addressRegion].filter((p): p is string => typeof p === 'string');
  return parts.length ? parts.join(', ') : null;
}

// Cache full descriptions per id — they don't change, and re-scraping risks
// Adzuna throttling the server IP (429).
interface DetailCacheEntry {
  detail: VacancyDetail | null;
  expiresAt: number;
}
const detailCache = new Map<string, DetailCacheEntry>();
const DETAIL_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/** Extract the numeric advert id from any Adzuna redirect URL. */
function extractAdzunaId(rawUrl: string): string | null {
  const m = rawUrl.match(/\/(?:details|land\/ad)\/(\d+)/);
  return m ? m[1] : null;
}

export async function fetchVacancyDetail(opts: {
  id?: string;
  url?: string;
  country?: string;
}): Promise<VacancyDetail | null> {
  const country = (opts.country ?? 'nl').toLowerCase();
  const id = opts.id ?? (opts.url ? extractAdzunaId(opts.url) : null);
  if (!id) return null;

  const domain = ADZUNA_DOMAIN_BY_COUNTRY[country] ?? ADZUNA_DOMAIN_BY_COUNTRY.nl;
  const cacheKey = `${domain}/${id}`;
  const hit = detailCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.detail;

  // Always hit the canonical Adzuna detail page (has JSON-LD), regardless of
  // whether the API gave us a /details/ or /land/ad/ redirect URL.
  const target = `https://${domain}/details/${id}`;

  let res: Response;
  try {
    res = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ResuBox/1.0; +https://www.resubox.com)' },
      next: { revalidate: 3600 },
    });
  } catch {
    return null;
  }
  if (!res.ok) {
    // Don't cache failures (e.g. transient 429) — allow a later retry.
    return null;
  }
  const html = await res.text();

  const blocks = [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const m of blocks) {
    let json: unknown;
    try {
      json = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    const items = Array.isArray(json)
      ? json
      : ((json as Record<string, unknown>)?.['@graph'] as unknown[]) ?? [json];
    for (const raw of items) {
      const item = raw as Record<string, unknown>;
      const type = item?.['@type'];
      const isJob = type === 'JobPosting' || (Array.isArray(type) && type.includes('JobPosting'));
      if (!isJob) continue;
      const desc = typeof item.description === 'string' ? htmlToReadableText(item.description) : '';
      if (desc.length > 0) {
        const org = item.hiringOrganization as Record<string, unknown> | undefined;
        const salary = parseSalary(item.baseSalary);
        const detail: VacancyDetail = {
          description: desc.slice(0, 6000),
          employmentType: typeof item.employmentType === 'string' ? item.employmentType : null,
          datePosted: typeof item.datePosted === 'string' ? item.datePosted : null,
          title: typeof item.title === 'string' ? stripHtml(item.title) : null,
          company: typeof org?.name === 'string' ? org.name : null,
          companyLogo: parseLogo(org),
          companyDomain: parseCompanyDomain(org),
          location: parseLocation(item.jobLocation),
          salaryMin: salary.min,
          salaryMax: salary.max,
        };
        detailCache.set(cacheKey, { detail, expiresAt: Date.now() + DETAIL_TTL_MS });
        return detail;
      }
    }
  }
  return null;
}

/**
 * Build sensible Adzuna search parameters from a CV: most-recent job title as
 * the keyword, and the candidate's city as the location. Falls back to top
 * skills when no job title is present (e.g. students).
 */
export function deriveSearchFromCV(cvData: CVData): { what: string; where: string } {
  const experience = cvData.experience ?? [];
  // Prefer the current/most-recent role; experience is typically newest-first.
  const current = experience.find((e) => e.current) ?? experience[0];
  let what = current?.jobTitle?.trim() ?? '';

  if (!what) {
    const topSkills = (cvData.skills ?? []).slice(0, 3).map((s) => s.name).filter(Boolean);
    what = topSkills.join(' ');
  }

  const where = cvData.personal?.city?.trim() ?? '';
  return { what, where };
}
