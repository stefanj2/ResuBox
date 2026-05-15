import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { improveBullet } from '@/lib/ai/cv-optimizer';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const limiter = rateLimiter({ limit: 60, windowMs: 60_000 });

interface Body {
  bullet?: string;
  jobTitle?: string;
  company?: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { bullet, jobTitle, company, description } = (await request.json()) as Body;
    if (!bullet || typeof bullet !== 'string') {
      return NextResponse.json({ error: 'bullet is verplicht' }, { status: 400 });
    }
    if (bullet.length > 1000) {
      return NextResponse.json({ error: 'bullet is te lang (max 1000 tekens)' }, { status: 400 });
    }

    const result = await improveBullet({
      bullet,
      jobTitle: jobTitle ?? '',
      company: company ?? '',
      description: description ?? '',
    });

    return NextResponse.json({ bullet: result.bullet, usage: result.usage });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'AI-service tijdelijk overbelast — probeer over een minuut opnieuw.' },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[ai/bullet] Anthropic API error:', err.status, err.message);
      return NextResponse.json(
        { error: 'AI-verzoek mislukt', details: err.message },
        { status: err.status ?? 500 }
      );
    }
    console.error('[ai/bullet] error:', err);
    return NextResponse.json(
      { error: 'AI-verzoek mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
