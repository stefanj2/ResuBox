import { NextRequest, NextResponse } from 'next/server';
import { CoverLetterData } from '@/types/cover-letter';
import { generatePdfBuffer } from '@/lib/pdf-generator';
import { rateLimiter } from '@/lib/rate-limit';
import { getColorScheme } from '@/lib/colorSchemes';

export const runtime = 'nodejs';
export const maxDuration = 30;

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  let body: { data?: CoverLetterData };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const data = body.data;
  if (!data?.sender) {
    return NextResponse.json({ error: 'Motivatiebriefdata ontbreekt' }, { status: 400 });
  }

  try {
    const { ModernCoverLetterTemplate } = await import('@/components/cover-letter/ModernCoverLetterTemplate');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const React = await import('react');

    const colorScheme = getColorScheme(data.meta?.selectedColorScheme ?? 'emerald');
    const markup = renderToStaticMarkup(
      React.createElement(ModernCoverLetterTemplate, { data, colorScheme })
    );

    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>Motivatiebrief</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${FONT_LINK}" />
  <style>
    :root {
      --font-inter: 'Inter', system-ui, sans-serif;
      --font-newsreader: 'Newsreader', Georgia, serif;
      --font-mono: ui-monospace, monospace;
      --font-dm-sans: 'DM Sans', system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background: white;
      font-family: var(--font-inter);
    }
    @page { size: A4; margin: 0; }
    .a4-preview {
      box-shadow: none !important;
      width: 210mm !important;
      min-height: 297mm !important;
    }
  </style>
</head>
<body>${markup}</body>
</html>`;

    const pdf = await generatePdfBuffer(html);
    const safeName = `Motivatiebrief_${data.sender.firstName || 'Naam'}_${data.sender.lastName || ''}`.replace(/[^\w\-]/g, '_');

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[generate-cover-letter-pdf] error:', err);
    return NextResponse.json(
      { error: 'PDF generatie mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
