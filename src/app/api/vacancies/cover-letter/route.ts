import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CVData } from '@/types/cv';
import { getCurrentUser } from '@/lib/user-auth';
import { vacanciesEnabled } from '@/lib/vacancies-flag';
import { generateCoverLetter } from '@/lib/ai/cv-optimizer';
import { db } from '@/lib/db';
import { vacancyApplications } from '@/db/schema';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

interface CoverLetterBody {
  cvData: CVData;
  vacancyId?: string;
  vacancyTitle: string;
  vacancyCompany: string;
  vacancyText?: string;
  vacancyUrl?: string;
  locale?: string;
}

/**
 * POST /api/vacancies/cover-letter
 * Free to generate + preview — the paywall sits on the download/send step in
 * the UI, not here. Generates a motivatiebrief tailored to the CV + a specific
 * vacancy and returns the draft. Logs the application when the visitor happens
 * to be logged in.
 */
export async function POST(request: NextRequest) {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ error: 'Niet beschikbaar' }, { status: 404 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  if (!limiter.check(ip).success) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  const user = await getCurrentUser();

  try {
    const body = (await request.json()) as CoverLetterBody;
    const locale = body.locale ?? request.headers.get('x-locale') ?? 'nl';

    if (!body.cvData) {
      return NextResponse.json({ error: 'cvData ontbreekt' }, { status: 400 });
    }
    if (!body.vacancyTitle || !body.vacancyCompany) {
      return NextResponse.json({ error: 'Vacaturegegevens ontbreken' }, { status: 400 });
    }

    const vacancyText = (body.vacancyText ?? '').trim() || `${body.vacancyTitle} bij ${body.vacancyCompany}`;

    const draft = await generateCoverLetter({
      cvData: body.cvData,
      vacancyTitle: body.vacancyTitle,
      vacancyCompany: body.vacancyCompany,
      vacancyText,
      locale,
    });

    // Log the application when logged in (best-effort — never fail on a log error).
    if (user) {
      try {
        await db.insert(vacancyApplications).values({
          user_id: user.id,
          vacancy_external_id: body.vacancyId ?? null,
          vacancy_title: body.vacancyTitle,
          vacancy_company: body.vacancyCompany,
          vacancy_url: body.vacancyUrl ?? null,
          cover_letter: draft as unknown as Record<string, unknown>,
        });
      } catch (logErr) {
        console.error('[vacancies/cover-letter] log insert failed:', logErr);
      }
    }

    return NextResponse.json({ draft });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'AI-service tijdelijk overbelast — probeer over een minuut opnieuw.' },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[vacancies/cover-letter] Anthropic error:', err.status, err.message);
      return NextResponse.json({ error: 'AI-generatie mislukt', details: err.message }, { status: err.status ?? 500 });
    }
    console.error('[vacancies/cover-letter] error:', err);
    return NextResponse.json(
      { error: 'Generatie mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
