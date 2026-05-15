import type { Locale } from '@/i18n/routing';

/**
 * Section labels and date formatting per locale, used by all CV templates.
 * Kept here (not via next-intl getTranslations) so the SAME function works
 * in both server-rendered PDF generation and client-side preview.
 */

export interface TemplateLabels {
  profile: string;
  experience: string;
  education: string;
  skills: string;
  contact: string;
  present: string;
  executiveSummary: string;
  coreCompetencies: string;
  cvHeader: string;
}

export const TEMPLATE_LABELS: Record<Locale, TemplateLabels> = {
  nl: {
    profile: 'Profiel',
    experience: 'Werkervaring',
    education: 'Opleiding',
    skills: 'Vaardigheden',
    contact: 'Contact',
    present: 'Heden',
    executiveSummary: 'Executive Summary',
    coreCompetencies: 'Kerncompetenties',
    cvHeader: 'Curriculum Vitae',
  },
  en: {
    profile: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    contact: 'Contact',
    present: 'Present',
    executiveSummary: 'Executive Summary',
    coreCompetencies: 'Core Competencies',
    cvHeader: 'Curriculum Vitae',
  },
  de: {
    profile: 'Kurzprofil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Kenntnisse',
    contact: 'Kontakt',
    present: 'Heute',
    executiveSummary: 'Executive Summary',
    coreCompetencies: 'Kernkompetenzen',
    cvHeader: 'Lebenslauf',
  },
  sv: {
    profile: 'Profil',
    experience: 'Arbetslivserfarenhet',
    education: 'Utbildning',
    skills: 'Kompetenser',
    contact: 'Kontakt',
    present: 'Pågående',
    executiveSummary: 'Executive Summary',
    coreCompetencies: 'Kärnkompetenser',
    cvHeader: 'CV',
  },
  da: {
    profile: 'Profil',
    experience: 'Erhvervserfaring',
    education: 'Uddannelse',
    skills: 'Færdigheder',
    contact: 'Kontakt',
    present: 'Nu',
    executiveSummary: 'Executive Summary',
    coreCompetencies: 'Kernekompetencer',
    cvHeader: 'CV',
  },
};

/** Locale-aware month abbreviations */
const MONTH_NAMES: Record<Locale, string[]> = {
  nl: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  sv: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  da: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
};

export function getTemplateLabels(locale?: Locale | string): TemplateLabels {
  const key = (locale ?? 'nl') as Locale;
  return TEMPLATE_LABELS[key] ?? TEMPLATE_LABELS.nl;
}

export function formatMonthYearLocalized(dateStr: string, locale: Locale | string = 'nl'): string {
  if (!dateStr) return '';
  const months = MONTH_NAMES[(locale as Locale)] ?? MONTH_NAMES.nl;
  const [year, month] = dateStr.split('-');
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return year ?? '';
  return `${months[idx]} ${year}`;
}

export function formatDateRangeLocalized(
  start: string,
  end: string,
  current: boolean,
  locale: Locale | string = 'nl'
): string {
  const labels = getTemplateLabels(locale);
  const s = formatMonthYearLocalized(start, locale);
  const e = current ? labels.present : formatMonthYearLocalized(end, locale);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} — ${e}`;
}
