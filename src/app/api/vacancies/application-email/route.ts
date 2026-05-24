import { NextRequest, NextResponse } from 'next/server';
import type { CVData } from '@/types/cv';
import type { CoverLetterData } from '@/types/cover-letter';
import { getCurrentUser } from '@/lib/user-auth';
import { vacanciesEnabled } from '@/lib/vacancies-flag';
import { sendApplicationEmail, type ApplicationEmailVacancy } from '@/lib/application-email';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

interface Body {
  vacancy: ApplicationEmailVacancy;
  coverLetter: CoverLetterData;
  cvData: CVData;
  locale?: string;
}

/**
 * POST /api/vacancies/application-email
 * Emails the logged-in applicant their application package (vacancy info +
 * tailored cover letter + CV as PDF attachments). Called right after the €1
 * verification completes.
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
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  try {
    const { vacancy, coverLetter, cvData, locale } = (await request.json()) as Body;
    if (!vacancy || !coverLetter || !cvData) {
      return NextResponse.json({ error: 'Onvolledige gegevens' }, { status: 400 });
    }

    const result = await sendApplicationEmail({
      to: user.email,
      vacancy,
      coverLetter,
      cvData,
      locale: locale ?? 'nl',
    });

    return NextResponse.json({ success: result.success });
  } catch (err) {
    console.error('[vacancies/application-email] error:', err);
    return NextResponse.json(
      { error: 'E-mail versturen mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
