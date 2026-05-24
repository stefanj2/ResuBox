import { NextRequest, NextResponse } from 'next/server';
import { vacanciesEnabled } from '@/lib/vacancies-flag';
import { fetchVacancyDetail } from '@/lib/jobs/adzuna';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 20;

const limiter = rateLimiter({ limit: 30, windowMs: 60_000 });

/**
 * POST /api/vacancies/detail
 * Free. Fetches the full vacancy description from the Adzuna detail page
 * (schema.org JobPosting). Falls back gracefully (null) so the UI keeps the
 * snippet when the full text can't be retrieved.
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
    const { id, url, country } = (await request.json()) as {
      id?: string;
      url?: string;
      country?: string;
    };
    if (!id && !url) {
      return NextResponse.json({ error: 'id of url ontbreekt' }, { status: 400 });
    }

    const detail = await fetchVacancyDetail({ id, url, country });
    return NextResponse.json({ detail });
  } catch (err) {
    console.error('[vacancies/detail] error:', err);
    return NextResponse.json({ detail: null });
  }
}
