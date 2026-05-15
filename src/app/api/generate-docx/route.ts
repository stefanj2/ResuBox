import { NextRequest, NextResponse } from 'next/server';
import { CVData, ColorSchemeId } from '@/types/cv';
import { generateDocxBuffer } from '@/lib/docx-generator';
import { rateLimiter } from '@/lib/rate-limit';
import { getColorScheme } from '@/lib/colorSchemes';

export const runtime = 'nodejs';
export const maxDuration = 30;

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

interface Body {
  cvData?: CVData;
  colorSchemeId?: ColorSchemeId;
  filename?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { cvData, colorSchemeId, filename } = body;
  if (!cvData?.personal) {
    return NextResponse.json({ error: 'cvData ontbreekt' }, { status: 400 });
  }

  try {
    const colorScheme = getColorScheme(colorSchemeId ?? cvData.meta?.selectedColorScheme ?? 'emerald');
    const docx = await generateDocxBuffer({ cvData, colorScheme });

    const safeName = (
      filename ?? `CV_${cvData.personal.firstName || 'Naam'}_${cvData.personal.lastName || 'Achternaam'}`
    ).replace(/[^a-zA-Z0-9_\-]/g, '_');

    return new NextResponse(new Uint8Array(docx), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeName}.docx"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[generate-docx] error:', err);
    return NextResponse.json(
      { error: 'DOCX generatie mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
