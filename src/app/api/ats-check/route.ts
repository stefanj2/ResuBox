import { NextRequest, NextResponse } from 'next/server';
import { runAtsCheck } from '@/lib/ats-check';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const jobDescription = (formData.get('jobDescription') as string | null) ?? undefined;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Geen CV bestand ontvangen' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Bestand is te groot (max 8 MB)' }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Alleen PDF-bestanden worden ondersteund' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParseModule = await import('pdf-parse');
    const pdfParse =
      (pdfParseModule as { default?: typeof pdfParseModule } & typeof pdfParseModule).default ?? pdfParseModule;
    const parsed = await (pdfParse as unknown as (b: Buffer) => Promise<{ text: string }>)(buffer);

    const result = runAtsCheck(parsed.text ?? '', jobDescription);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error('[ats-check] error:', err);
    return NextResponse.json(
      { error: 'ATS check mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
