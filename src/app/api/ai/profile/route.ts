import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateProfile } from '@/lib/ai/cv-optimizer';
import { rateLimiter } from '@/lib/rate-limit';
import type { CVData } from '@/types/cv';

export const runtime = 'nodejs';
export const maxDuration = 30;

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const body = (await request.json()) as { cvData?: CVData; locale?: string };
    const cv = body.cvData;
    if (!cv) return NextResponse.json({ error: 'cvData ontbreekt' }, { status: 400 });

    const locale = body.locale ?? request.headers.get('x-locale') ?? 'nl';

    const result = await generateProfile({
      experience: cv.experience ?? [],
      education: cv.education ?? [],
      skills: cv.skills ?? [],
      locale,
    });

    return NextResponse.json({ profile: result.profile, usage: result.usage });
  } catch (err) {
    return aiErrorResponse(err);
  }
}

function aiErrorResponse(err: unknown): NextResponse {
  if (err instanceof Anthropic.RateLimitError) {
    return NextResponse.json(
      { error: 'AI-service tijdelijk overbelast — probeer over een minuut opnieuw.' },
      { status: 429 }
    );
  }
  if (err instanceof Anthropic.APIError) {
    console.error('[ai/profile] Anthropic API error:', err.status, err.message);
    return NextResponse.json(
      { error: 'AI-verzoek mislukt', details: err.message },
      { status: err.status ?? 500 }
    );
  }
  console.error('[ai/profile] error:', err);
  return NextResponse.json(
    { error: 'AI-verzoek mislukt', details: err instanceof Error ? err.message : String(err) },
    { status: 500 }
  );
}
