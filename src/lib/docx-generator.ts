import 'server-only';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ExternalHyperlink,
  TabStopType,
  TabStopPosition,
  Tab,
} from 'docx';
import { CVData, ColorScheme } from '@/types/cv';
import { getColorScheme } from '@/lib/colorSchemes';

const FONT_BODY = 'Calibri';
const FONT_HEADING = 'Calibri';

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return year ?? '';
  return `${months[idx]} ${year}`;
}

function formatDateRange(start: string, end: string, current: boolean, currentLabel = 'Heden'): string {
  const s = formatMonthYear(start);
  const e = current ? currentLabel : formatMonthYear(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

function hexToOoxml(hex: string): string {
  return hex.replace('#', '').toUpperCase();
}

interface BuildArgs {
  cvData: CVData;
  colorScheme?: ColorScheme;
}

function sectionHeading(label: string, accent: string): Paragraph {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6, // 1/8 pt units → ~0.75pt
        color: hexToOoxml(accent),
      },
    },
    children: [
      new TextRun({
        text: label.toUpperCase(),
        bold: true,
        size: 20, // 10pt
        font: FONT_HEADING,
        characterSpacing: 60, // tracked
        color: hexToOoxml(accent),
      }),
    ],
  });
}

function buildHeader(cvData: CVData, accent: string): Paragraph[] {
  const fullName = [cvData.personal.firstName, cvData.personal.lastName].filter(Boolean).join(' ');
  const contact: string[] = [];
  if (cvData.personal.email) contact.push(cvData.personal.email);
  if (cvData.personal.phone) contact.push(cvData.personal.phone);
  if (cvData.personal.city) contact.push(cvData.personal.city);
  if (cvData.personal.linkedIn) contact.push(cvData.personal.linkedIn);
  if (cvData.personal.website) contact.push(cvData.personal.website);

  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: fullName || 'Voor- en achternaam',
          bold: true,
          size: 48, // 24pt
          font: FONT_HEADING,
          color: '0F172A',
        }),
      ],
    }),
  ];

  if (contact.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 100 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: hexToOoxml(accent),
          },
        },
        children: contact.map(
          (item, i) =>
            new TextRun({
              text: i === 0 ? item : `  ·  ${item}`,
              size: 18, // 9pt
              font: FONT_BODY,
              color: '64748B',
            })
        ),
      })
    );
  }

  return paragraphs;
}

function buildProfile(cvData: CVData, accent: string): Paragraph[] {
  if (!cvData.profile?.summary) return [];
  return [
    sectionHeading('Profiel', accent),
    new Paragraph({
      spacing: { after: 120, line: 320 },
      children: [
        new TextRun({
          text: cvData.profile.summary,
          size: 22, // 11pt
          font: FONT_BODY,
          color: '0F172A',
        }),
      ],
    }),
  ];
}

function buildExperience(cvData: CVData, accent: string): Paragraph[] {
  if (cvData.experience.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading('Werkervaring', accent)];

  for (const exp of cvData.experience) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 160, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({
            text: exp.jobTitle,
            bold: true,
            size: 24, // 12pt
            font: FONT_HEADING,
            color: '0F172A',
          }),
          new TextRun({ children: [new Tab()] }),
          new TextRun({
            text: formatDateRange(exp.startDate, exp.endDate, exp.current),
            size: 20, // 10pt
            font: FONT_BODY,
            color: '64748B',
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: exp.company,
            bold: true,
            size: 21,
            font: FONT_BODY,
            color: '334155',
          }),
          ...(exp.location
            ? [
                new TextRun({
                  text: ` · ${exp.location}`,
                  size: 21,
                  font: FONT_BODY,
                  color: '94A3B8',
                }),
              ]
            : []),
        ],
      })
    );
    if (exp.description) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80, line: 300 },
          children: [
            new TextRun({
              text: exp.description,
              size: 21,
              font: FONT_BODY,
              color: '334155',
            }),
          ],
        })
      );
    }
    for (const task of exp.tasks) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40, line: 280 },
          children: [
            new TextRun({
              text: task,
              size: 21,
              font: FONT_BODY,
              color: '334155',
            }),
          ],
        })
      );
    }
  }

  return paragraphs;
}

function buildEducation(cvData: CVData, accent: string): Paragraph[] {
  if (cvData.education.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading('Opleiding', accent)];

  for (const edu of cvData.education) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({
            text: edu.degree,
            bold: true,
            size: 22,
            font: FONT_HEADING,
            color: '0F172A',
          }),
          new TextRun({ children: [new Tab()] }),
          new TextRun({
            text: formatDateRange(edu.startDate, edu.endDate, edu.current),
            size: 20,
            font: FONT_BODY,
            color: '64748B',
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: edu.institution,
            size: 21,
            font: FONT_BODY,
            color: '334155',
          }),
          ...(edu.location
            ? [
                new TextRun({
                  text: ` · ${edu.location}`,
                  size: 21,
                  font: FONT_BODY,
                  color: '94A3B8',
                }),
              ]
            : []),
        ],
      })
    );
    if (edu.description) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80, line: 300 },
          children: [
            new TextRun({
              text: edu.description,
              size: 21,
              font: FONT_BODY,
              color: '334155',
            }),
          ],
        })
      );
    }
  }

  return paragraphs;
}

function buildSkills(cvData: CVData, accent: string): Paragraph[] {
  if (cvData.skills.length === 0) return [];
  return [
    sectionHeading('Vaardigheden', accent),
    new Paragraph({
      spacing: { after: 100, line: 320 },
      children: [
        new TextRun({
          text: cvData.skills.map((s) => s.name).join('  ·  '),
          size: 21,
          font: FONT_BODY,
          color: '334155',
        }),
      ],
    }),
  ];
}

/**
 * Generate an ATS-friendly DOCX document for the given CV.
 *
 * Single template (matches Modern style). All 6 visual variations are folded
 * into the same Word structure — DOCX renders very differently from HTML/CSS
 * and trying to mimic six PDF templates per Word equivalent would explode
 * scope. Calibri throughout keeps it parseable by every ATS and openable in
 * Word, Pages, Google Docs.
 */
export async function generateDocxBuffer({ cvData, colorScheme }: BuildArgs): Promise<Buffer> {
  const accent = (colorScheme ?? getColorScheme(cvData.meta.selectedColorScheme ?? 'emerald')).primary;

  const doc = new Document({
    creator: 'ResuBox',
    title: 'Curriculum Vitae',
    description: 'CV gegenereerd via ResuBox',
    styles: {
      default: {
        document: {
          run: { font: FONT_BODY, size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch
          },
        },
        children: [
          ...buildHeader(cvData, accent),
          ...buildProfile(cvData, accent),
          ...buildExperience(cvData, accent),
          ...buildEducation(cvData, accent),
          ...buildSkills(cvData, accent),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// Silence linter for unused imports (Tab, ExternalHyperlink, AlignmentType, HeadingLevel kept for future templates)
void [AlignmentType, HeadingLevel, ExternalHyperlink];
