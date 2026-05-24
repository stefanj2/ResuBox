import 'server-only';
import type { CVData } from '@/types/cv';
import type { CoverLetterData } from '@/types/cover-letter';
import { renderTemplateToHtml } from './pdf-renderer';
import { generatePdfBuffer } from './pdf-generator';
import { getColorScheme } from './colorSchemes';
import { sendEmail } from './resend';

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap';

async function buildCvPdf(cvData: CVData, locale: string): Promise<Buffer> {
  const template = cvData.meta?.selectedTemplate ?? 'modern';
  const color = cvData.meta?.selectedColorScheme ?? 'emerald';
  const html = await renderTemplateToHtml(cvData, template, color, locale);
  return generatePdfBuffer(html);
}

async function buildCoverLetterPdf(data: CoverLetterData): Promise<Buffer> {
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
    html, body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-family: var(--font-inter); }
    @page { size: A4; margin: 0; }
    .a4-preview { box-shadow: none !important; width: 210mm !important; min-height: 297mm !important; }
  </style>
</head>
<body>${markup}</body>
</html>`;

  return generatePdfBuffer(html);
}

export interface ApplicationEmailVacancy {
  title: string;
  company: string;
  location?: string;
  url?: string;
}

export interface SendApplicationEmailInput {
  to: string;
  vacancy: ApplicationEmailVacancy;
  coverLetter: CoverLetterData;
  cvData: CVData;
  locale?: string;
}

function safeName(s: string): string {
  return (s || 'document').replace(/[^\w\-]/g, '_');
}

/**
 * After a successful verification, email the applicant their application
 * package: which vacancy it concerns, the tailored cover letter (text in the
 * body) and both the cover letter and CV as PDF attachments.
 */
export async function sendApplicationEmail(input: SendApplicationEmailInput) {
  const { to, vacancy, coverLetter, cvData, locale = 'nl' } = input;

  const [cvPdf, letterPdf] = await Promise.all([
    buildCvPdf(cvData, locale),
    buildCoverLetterPdf(coverLetter),
  ]);

  const firstName = cvData.personal?.firstName ?? '';
  const fullName = `${firstName} ${cvData.personal?.lastName ?? ''}`.trim() || 'kandidaat';
  const letterBody = [coverLetter.greeting, coverLetter.opening, coverLetter.body, coverLetter.closing, coverLetter.signature]
    .filter(Boolean)
    .join('\n\n');

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #0f172a;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">Je sollicitatie staat klaar${firstName ? `, ${firstName}` : ''}!</h1>
      <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
        Hieronder vind je je sollicitatie voor onderstaande vacature. Je motivatiebrief en CV zitten als PDF in de bijlage.
      </p>

      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-weight: 600; font-size: 16px;">${vacancy.title}</p>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">
          ${vacancy.company}${vacancy.location ? ` · ${vacancy.location}` : ''}
        </p>
        ${
          vacancy.url
            ? `<p style="margin: 12px 0 0;"><a href="${vacancy.url}" style="color: #059669; font-weight: 600; text-decoration: none;">Bekijk de vacature →</a></p>`
            : ''
        }
      </div>

      <h2 style="font-size: 15px; margin: 0 0 8px; color: #0f172a;">Je motivatiebrief</h2>
      <div style="white-space: pre-line; color: #334155; font-size: 14px; line-height: 1.6; background: #f8fafc; border-radius: 12px; padding: 16px;">${letterBody.replace(/</g, '&lt;')}</div>

      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 24px;">
        Bijlagen: je motivatiebrief en CV als PDF. Veel succes met solliciteren!
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Je sollicitatie voor ${vacancy.title}${vacancy.company ? ` bij ${vacancy.company}` : ''}`,
    html,
    attachments: [
      { filename: `Motivatiebrief_${safeName(fullName)}.pdf`, content: letterPdf },
      { filename: `CV_${safeName(fullName)}.pdf`, content: cvPdf },
    ],
  });
}
