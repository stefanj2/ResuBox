import { NextRequest, NextResponse } from 'next/server';
import { parseLinkedInPdf } from '@/lib/linkedin-parser';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Geen bestand ontvangen' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Bestand is te groot (max 8 MB)' }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Alleen PDF-bestanden worden ondersteund' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Lazy import — pdf-parse pulls in heavy native dependencies
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = (pdfParseModule as { default?: typeof pdfParseModule } & typeof pdfParseModule).default ?? pdfParseModule;
    const result = await (pdfParse as unknown as (buffer: Buffer) => Promise<{ text: string }>)(buffer);

    if (!result.text || result.text.length < 50) {
      return NextResponse.json(
        { error: 'Kon geen tekst uit de PDF halen. Is dit een LinkedIn-export?' },
        { status: 422 }
      );
    }

    const parsed = parseLinkedInPdf(result.text);

    return NextResponse.json({
      success: true,
      data: parsed,
      warning:
        parsed.experience.length === 0 && parsed.education.length === 0
          ? 'Geen werkervaring of opleiding gevonden — controleer of dit een LinkedIn "Save to PDF" export is.'
          : undefined,
    });
  } catch (err) {
    console.error('[import-linkedin] error:', err);
    return NextResponse.json(
      { error: 'Verwerken van LinkedIn-PDF mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
