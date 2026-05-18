/**
 * Shared design tokens for CV templates.
 *
 * Six templates each have a distinct visual voice but share this typographic
 * system so they feel like one family. All sizes are in points (pt) because
 * CVs are designed for print/PDF.
 */

export const fonts = {
  sans: 'var(--font-inter), var(--font-dm-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'var(--font-newsreader), Georgia, "Times New Roman", serif',
  mono: 'var(--font-mono), ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const type = {
  display: {
    fontFamily: fonts.serif,
    fontSize: '32pt',
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  displaySans: {
    fontFamily: fonts.sans,
    fontSize: '24pt',
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headline: {
    fontFamily: fonts.sans,
    fontSize: '11pt',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  sectionLabel: {
    fontFamily: fonts.sans,
    fontSize: '8.5pt',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
  },
  sectionLabelSerif: {
    fontFamily: fonts.serif,
    fontSize: '11pt',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },
  // Lead summary — the "positioning statement" treatment used by Pender/Creatief
  lead: {
    fontFamily: fonts.serif,
    fontSize: '14pt',
    fontWeight: 400,
    fontStyle: 'normal' as const,
    lineHeight: 1.45,
    letterSpacing: '-0.005em',
  },
  itemTitle: {
    fontFamily: fonts.sans,
    fontSize: '11pt',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  itemTitleLg: {
    fontFamily: fonts.sans,
    fontSize: '12pt',
    fontWeight: 600,
    lineHeight: 1.25,
  },
  itemSubtitle: {
    fontFamily: fonts.sans,
    fontSize: '10pt',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: '9.5pt',
    fontWeight: 400,
    lineHeight: 1.55,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: '9pt',
    fontWeight: 400,
    lineHeight: 1.4,
    fontVariantNumeric: 'tabular-nums' as const,
    letterSpacing: '0.01em',
  },
  dateMono: {
    fontFamily: fonts.mono,
    fontSize: '8.5pt',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: '9pt',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  monoLabel: {
    fontFamily: fonts.mono,
    fontSize: '8.5pt',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '0',
  },
} as const;

export const palette = {
  // Default — used by Modern, Minimalist, Creatief
  default: {
    ink: '#0f172a',     // slate-900 — names, titles
    body: '#334155',    // slate-700 — body text
    muted: '#64748b',   // slate-500 — dates, subtitles
    faint: '#94a3b8',   // slate-400 — separators
    rule: '#e2e8f0',    // slate-200 — hairlines
    placeholder: '#cbd5e1',
    page: '#ffffff',
  },
  // Executive — corporate navy + warm grey ("consulting deck")
  executive: {
    ink: '#0b1733',     // deep navy
    body: '#1f2937',
    muted: '#52606d',
    faint: '#9ca3af',
    rule: '#d8dde6',
    placeholder: '#c9cfd9',
    page: '#fdfcfa',    // warm off-white
    accent: '#0b1733',  // navy as accent (no color, just deep tone)
  },
  // Zakelijk — classic Harvard / Word-doc neutrality
  zakelijk: {
    ink: '#0a0a0a',    // near-black, less harsh than pure #000
    body: '#1f2937',
    muted: '#4b5563',
    faint: '#9ca3af',
    rule: '#1f2937',   // warmer near-black hairlines
    placeholder: '#cbd5e1',
    page: '#ffffff',
  },
} as const;

// Backwards-compat — Modern uses this directly
export const colors = palette.default;

export const space = {
  pagePadding: '18mm 20mm',
  pagePaddingTight: '16mm 18mm',
  pagePaddingWide: '22mm 22mm',
  sectionGap: '22pt',
  sectionGapTight: '16pt',
  sectionGapWide: '28pt',
  labelToContent: '10pt',
  itemGap: '14pt',
  itemGapTight: '10pt',
  itemInner: '4pt',
} as const;

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

export function formatYear(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.split('-')[0] ?? '';
}

export function formatYearRange(start: string, end: string, current: boolean, currentLabel = 'Heden'): string {
  const s = formatYear(start);
  const e = current ? currentLabel : formatYear(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  if (s === e) return s;
  return `${s} — ${e}`;
}
