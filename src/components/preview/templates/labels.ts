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
  dateOfBirth: string;
  nationality: string;
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
    dateOfBirth: 'Geboortedatum',
    nationality: 'Nationaliteit',
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
    dateOfBirth: 'Date of birth',
    nationality: 'Nationality',
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
    dateOfBirth: 'Geburtsdatum',
    nationality: 'Nationalität',
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
    dateOfBirth: 'Födelsedatum',
    nationality: 'Nationalitet',
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
    dateOfBirth: 'Fødselsdato',
    nationality: 'Nationalitet',
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

/**
 * Locale-aware full date format for birth dates.
 * Accepts ISO 8601 (YYYY-MM-DD, what <input type="date"> produces) or
 * the legacy DD-MM-YYYY / DD.MM.YYYY / DD/MM/YYYY shapes our older
 * sample data uses. Falls through unchanged for anything unparseable.
 */
export function formatDateOfBirthLocalized(value: string, locale: Locale | string = 'nl'): string {
  if (!value) return '';

  let y: number | undefined;
  let m: number | undefined;
  let d: number | undefined;

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
    const [yy, mm, dd] = value.split('-');
    y = Number(yy);
    m = Number(mm);
    d = Number(dd);
  } else if (/^\d{1,2}[-./]\d{1,2}[-./]\d{4}$/.test(value)) {
    const parts = value.split(/[-./]/);
    d = Number(parts[0]);
    m = Number(parts[1]);
    y = Number(parts[2]);
  }

  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return value;

  const pad = (n: number) => String(n).padStart(2, '0');
  const dd = pad(d);
  const mm = pad(m);
  const yyyy = String(y);

  switch (locale) {
    case 'sv':
      return `${yyyy}-${mm}-${dd}`;
    case 'de':
      return `${dd}.${mm}.${yyyy}`;
    case 'en':
      return `${dd}/${mm}/${yyyy}`;
    case 'da':
    case 'nl':
    default:
      return `${dd}-${mm}-${yyyy}`;
  }
}
