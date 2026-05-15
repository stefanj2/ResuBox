import 'server-only';
import { CVData, ColorSchemeId, TemplateId } from '@/types/cv';
import { getColorScheme } from '@/lib/colorSchemes';
import {
  ModernTemplate,
  ZakelijkTemplate,
  CreatiefTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  TechTemplate,
} from '@/components/preview/templates';

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  zakelijk: ZakelijkTemplate,
  creatief: CreatiefTemplate,
  minimalist: MinimalistTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
} as const;

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap';

/**
 * Render a CV template to a full standalone HTML document, ready to be
 * loaded into headless Chrome for PDF generation.
 *
 * Returns text-rendered HTML (real glyphs) so the resulting PDF is
 * ATS-parseable and text-selectable — unlike the previous client-side
 * html-to-image flow which produced a rasterised image PDF.
 */
export async function renderTemplateToHtml(
  cvData: CVData,
  templateId: TemplateId,
  colorSchemeId: ColorSchemeId
): Promise<string> {
  // Dynamic import — react-dom/server cannot be statically imported into a
  // Next.js route handler, but dynamic import in a server-only module works.
  const { renderToStaticMarkup } = await import('react-dom/server');

  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] ?? ModernTemplate;
  const colorScheme = getColorScheme(colorSchemeId);

  const templateMarkup = renderToStaticMarkup(
    <TemplateComponent cvData={cvData} colorScheme={colorScheme} />
  );

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${FONT_LINK}" />
  <style>
    :root {
      --font-inter: 'Inter', system-ui, sans-serif;
      --font-newsreader: 'Newsreader', Georgia, serif;
      --font-mono: 'JetBrains Mono', ui-monospace, monospace;
      --font-dm-sans: 'DM Sans', system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
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
    .bg-white { background-color: #ffffff; }
    .shadow-2xl { box-shadow: none; }
    ul { margin: 0; padding: 0; list-style: none; }
    h1, h2, h3, h4 { margin: 0; }
  </style>
</head>
<body>
${templateMarkup}
</body>
</html>`;
}
