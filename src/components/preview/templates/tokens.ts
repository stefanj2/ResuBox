/**
 * Shared design tokens for CV templates.
 *
 * The goal is a consistent typographic system across all 6 templates so that
 * "Modern", "Zakelijk", "Executive" etc. differ in layout/voice but share the
 * same visual quality — like a single type family with different weights.
 *
 * All sizes are in points (pt) because CVs are designed for print/PDF.
 * 1pt = 1.333px at 96dpi.
 */

export const fonts = {
  sans: 'var(--font-dm-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'var(--font-newsreader), Georgia, "Times New Roman", serif',
} as const;

export const type = {
  // Display: the candidate's name (hero element)
  display: {
    fontFamily: fonts.serif,
    fontSize: '32pt',
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  // Optional subtitle under the name (job title / one-line headline)
  headline: {
    fontFamily: fonts.sans,
    fontSize: '11pt',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
  },
  // Section labels: "EXPERIENCE", "EDUCATION"
  sectionLabel: {
    fontFamily: fonts.sans,
    fontSize: '8.5pt',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
  },
  // Item title: job title, degree
  itemTitle: {
    fontFamily: fonts.sans,
    fontSize: '11pt',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  // Item subtitle: company, institution
  itemSubtitle: {
    fontFamily: fonts.sans,
    fontSize: '10pt',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  // Body text: profile summary, descriptions, bullets
  body: {
    fontFamily: fonts.sans,
    fontSize: '9.5pt',
    fontWeight: 400,
    lineHeight: 1.55,
  },
  // Date ranges: right-aligned, tabular figures
  date: {
    fontFamily: fonts.sans,
    fontSize: '9pt',
    fontWeight: 400,
    lineHeight: 1.4,
    fontVariantNumeric: 'tabular-nums' as const,
    letterSpacing: '0.01em',
  },
  // Meta: small contact info, locations
  meta: {
    fontFamily: fonts.sans,
    fontSize: '9pt',
    fontWeight: 400,
    lineHeight: 1.4,
  },
} as const;

export const colors = {
  ink: '#0f172a', // slate-900 — name, item titles
  body: '#334155', // slate-700 — descriptions, bullets
  muted: '#64748b', // slate-500 — dates, subtitles
  faint: '#94a3b8', // slate-400 — separators in inline lists
  rule: '#e2e8f0', // slate-200 — hairline dividers
  placeholder: '#cbd5e1', // slate-300 — placeholder data
} as const;

export const space = {
  // A4 page margins (used as padding on the root container)
  pagePadding: '18mm 20mm',
  // Vertical rhythm between top-level sections
  sectionGap: '22pt',
  // Within a section: between the label and the first item
  labelToContent: '10pt',
  // Between items inside one section
  itemGap: '14pt',
  // Inside an item: between title row and description / bullets
  itemInner: '4pt',
} as const;

/**
 * Format a YYYY-MM date as "Maa 2024" (Dutch abbreviated month).
 * Returns empty string for empty input.
 */
export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return year ?? '';
  return `${months[idx]} ${year}`;
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
  currentLabel = 'Heden'
): string {
  const s = formatMonthYear(start);
  const e = current ? currentLabel : formatMonthYear(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} — ${e}`;
}
