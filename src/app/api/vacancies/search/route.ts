import { NextRequest, NextResponse } from 'next/server';
import type { CVData } from '@/types/cv';
import { vacanciesEnabled } from '@/lib/vacancies-flag';
import { searchVacancies, deriveSearchFromCV, isConfigured } from '@/lib/jobs/adzuna';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

interface SearchBody {
  what?: string;
  where?: string;
  page?: number;
  cvData?: CVData;
  fullTime?: boolean;
  partTime?: boolean;
  permanent?: boolean;
  contract?: boolean;
  salaryMin?: number;
  sortBy?: 'relevance' | 'date' | 'salary';
}

/**
 * POST /api/vacancies/search
 * Free to browse — no login or subscription required. The paywall only kicks
 * in when the visitor wants to generate a tailored motivatiebrief to apply
 * (see /api/vacancies/cover-letter). Search terms come from the body, or are
 * derived from the posted CV when absent.
 */
export async function POST(request: NextRequest) {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  if (!limiter.check(ip).success) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  try {
    const body = (await request.json()) as SearchBody;

    let what = (body.what ?? '').trim();
    let where = (body.where ?? '').trim();
    if (!what && body.cvData) {
      const derived = deriveSearchFromCV(body.cvData);
      what = derived.what;
      where = where || derived.where;
    }

    const result = await searchVacancies({
      what,
      where,
      page: body.page ?? 1,
      fullTime: body.fullTime,
      partTime: body.partTime,
      permanent: body.permanent,
      contract: body.contract,
      salaryMin: body.salaryMin,
      sortBy: body.sortBy,
    });

    if (!result.configured) {
      return NextResponse.json(
        { error: 'Vacaturebron is nog niet geconfigureerd', configured: false, vacancies: [] },
        { status: 503 }
      );
    }

    return NextResponse.json({
      vacancies: result.vacancies,
      count: result.count,
      query: { what, where },
      configured: isConfigured(),
    });
  } catch (err) {
    console.error('[vacancies/search] error:', err);
    return NextResponse.json(
      { error: 'Vacatures ophalen mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
