import { NextRequest, NextResponse } from 'next/server';
import { CVData, TemplateId, ColorSchemeId } from '@/types/cv';
import { renderTemplateToHtml } from '@/lib/pdf-renderer';
import { generatePdfBuffer } from '@/lib/pdf-generator';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

interface GeneratePdfBody {
  cvData: CVData;
  templateId?: TemplateId;
  colorSchemeId?: ColorSchemeId;
  filename?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: GeneratePdfBody;
  try {
    body = (await request.json()) as GeneratePdfBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { cvData, templateId, colorSchemeId, filename } = body;
  if (!cvData?.personal) {
    return NextResponse.json({ error: 'cvData ontbreekt' }, { status: 400 });
  }

  const resolvedTemplate: TemplateId = templateId ?? cvData.meta?.selectedTemplate ?? 'modern';
  const resolvedColor: ColorSchemeId = colorSchemeId ?? cvData.meta?.selectedColorScheme ?? 'emerald';

  try {
    const html = await renderTemplateToHtml(cvData, resolvedTemplate, resolvedColor);
    const pdf = await generatePdfBuffer(html);

    const safeName = (filename ?? `CV_${cvData.personal.firstName || 'Naam'}_${cvData.personal.lastName || 'Achternaam'}`).replace(/[^a-zA-Z0-9_\-]/g, '_');

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[generate-pdf] error:', err);
    return NextResponse.json(
      { error: 'PDF generatie mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
