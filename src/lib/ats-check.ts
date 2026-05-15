import 'server-only';

/**
 * Rule-based ATS compatibility check.
 *
 * Looks at the raw text extracted from a CV PDF and scores how parseable
 * it is for typical ATS systems (Workday, Greenhouse, Taleo, AFAS, Recruitee).
 *
 * Honest, deterministic. No LLM — every check has a concrete rule.
 */

export interface AtsCheckResult {
  score: number; // 0-100
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  metadata: {
    wordCount: number;
    pageCountEstimate: number;
    hasEmail: boolean;
    hasPhone: boolean;
    detectedSections: string[];
  };
  checks: AtsCheck[];
  keywordMatch?: KeywordMatch;
}

export interface AtsCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  description: string;
  weight: number; // 0-1, contribution to overall score
}

export interface KeywordMatch {
  jobKeywords: string[];
  cvKeywords: string[];
  matched: string[];
  missing: string[];
  matchPercentage: number;
}

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /\b(?:werkervaring|ervaring|experience|loopbaan|professional\s+experience)\b/i,
  education: /\b(?:opleiding|onderwijs|education|academic|studies)\b/i,
  skills: /\b(?:vaardigheden|skills|competenties|expertise|kerncompetenties)\b/i,
  profile: /\b(?:profiel|samenvatting|profile|summary|over\s+mij|about)\b/i,
  contact: /\b(?:contact|gegevens|contactgegevens)\b/i,
};

const STOP_WORDS = new Set([
  'de', 'het', 'een', 'en', 'van', 'in', 'op', 'voor', 'met', 'aan', 'door', 'naar', 'is', 'zijn', 'was', 'waren', 'word', 'worden', 'wordt', 'werd', 'werden',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'has', 'have', 'had',
  'als', 'ook', 'maar', 'die', 'dat', 'deze', 'dit', 'ik', 'je', 'jij', 'we', 'wij', 'ze', 'zij', 'hij', 'mijn', 'jouw', 'onze', 'hun', 'er', 'om', 'te',
  'als', 'na', 'nog', 'wel', 'niet', 'al', 'meer', 'kan', 'kunnen', 'zal', 'zou', 'moet', 'moeten', 'mag', 'mogen',
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\d\s+\-/.]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && w.length <= 30 && !STOP_WORDS.has(w))
    .filter((w) => !/^\d+$/.test(w)); // drop pure numbers
  return Array.from(new Set(words));
}

export function runAtsCheck(cvText: string, jobDescription?: string): AtsCheckResult {
  const wordCount = cvText.trim().split(/\s+/).filter(Boolean).length;
  // Rough estimate: ~500 words per A4 page
  const pageCountEstimate = Math.max(1, Math.ceil(wordCount / 500));

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(cvText);
  const hasPhone = /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,3}\)?[\s-]?){2,4}\d{2,4}/.test(cvText);

  const detectedSections = Object.entries(SECTION_PATTERNS)
    .filter(([, pattern]) => pattern.test(cvText))
    .map(([name]) => name);

  const checks: AtsCheck[] = [
    {
      id: 'text-extractable',
      label: 'Tekst is leesbaar',
      status: wordCount > 50 ? 'pass' : 'fail',
      description:
        wordCount > 50
          ? `${wordCount} woorden uit de PDF gelezen — perfect parseerbaar.`
          : 'Er kwam (vrijwel) geen tekst uit deze PDF. Waarschijnlijk een afbeelding-PDF — ATS-systemen kunnen hier niets mee.',
      weight: 0.25,
    },
    {
      id: 'has-email',
      label: 'E-mailadres aanwezig',
      status: hasEmail ? 'pass' : 'fail',
      description: hasEmail
        ? 'E-mailadres gevonden in CV.'
        : 'Geen geldig e-mailadres gedetecteerd — recruiters moeten je kunnen mailen.',
      weight: 0.1,
    },
    {
      id: 'has-phone',
      label: 'Telefoonnummer aanwezig',
      status: hasPhone ? 'pass' : 'warn',
      description: hasPhone
        ? 'Telefoonnummer gedetecteerd.'
        : 'Geen telefoonnummer gevonden. Niet kritiek, maar veel recruiters bellen liever.',
      weight: 0.05,
    },
    {
      id: 'has-experience',
      label: 'Werkervaring sectie',
      status: detectedSections.includes('experience') ? 'pass' : 'fail',
      description: detectedSections.includes('experience')
        ? 'Sectie "Werkervaring" of "Experience" herkend.'
        : 'Geen duidelijke werkervaring-sectie gevonden. ATS koppelt bullets aan deze section header.',
      weight: 0.15,
    },
    {
      id: 'has-education',
      label: 'Opleiding sectie',
      status: detectedSections.includes('education') ? 'pass' : 'warn',
      description: detectedSections.includes('education')
        ? 'Sectie "Opleiding" of "Education" herkend.'
        : 'Geen opleiding-sectie gedetecteerd. Vermeld minimaal je hoogst behaalde diploma.',
      weight: 0.1,
    },
    {
      id: 'has-skills',
      label: 'Skills / Vaardigheden sectie',
      status: detectedSections.includes('skills') ? 'pass' : 'warn',
      description: detectedSections.includes('skills')
        ? 'Skills-sectie aanwezig — ATS keyword-matching werkt hierop.'
        : 'Geen aparte skills-sectie. ATS verwacht een vaardigheden-blok om je profiel te matchen.',
      weight: 0.1,
    },
    {
      id: 'length',
      label: 'Lengte van het CV',
      status:
        wordCount >= 200 && wordCount <= 1200 ? 'pass' : wordCount < 200 ? 'fail' : 'warn',
      description:
        wordCount < 200
          ? `Slechts ${wordCount} woorden — te kort. Een recruiter krijgt geen volledig beeld.`
          : wordCount > 1200
            ? `${wordCount} woorden — aan de lange kant. Streef naar 400-900 woorden op 1-2 pagina's.`
            : `${wordCount} woorden — goede lengte voor één scan in 6-10 seconden.`,
      weight: 0.1,
    },
    {
      id: 'pages',
      label: 'Pagina-aantal',
      status: pageCountEstimate <= 2 ? 'pass' : 'warn',
      description:
        pageCountEstimate <= 2
          ? `Ongeveer ${pageCountEstimate} pagina('s) — perfect voor de Nederlandse markt.`
          : `Ongeveer ${pageCountEstimate} pagina's — dat is veel. Recruiters scannen pagina 1 zwaar; pagina 3+ wordt vaak overgeslagen.`,
      weight: 0.05,
    },
    {
      id: 'special-chars',
      label: 'Geen onleesbare karakters',
      status: /[�]/.test(cvText) ? 'fail' : 'pass',
      description: /[�]/.test(cvText)
        ? 'Vervangingstekens (�) gedetecteerd — vaak een teken dat fonts niet correct embedded zijn.'
        : 'Karakter-encoding ziet er goed uit.',
      weight: 0.05,
    },
    {
      id: 'image-only',
      label: 'Tekst-PDF (niet alleen afbeelding)',
      status: wordCount >= 80 ? 'pass' : 'fail',
      description:
        wordCount >= 80
          ? 'PDF bevat selecteerbare tekst — ATS kan deze lezen.'
          : 'PDF lijkt vooral uit afbeeldingen te bestaan. ATS leest geen plaatjes — automatisch afgewezen.',
      weight: 0.05,
    },
  ];

  // Compute weighted score (pass = 1, warn = 0.5, fail = 0)
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce((sum, c) => sum + c.weight * (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0), 0);
  let score = Math.round((earned / totalWeight) * 100);

  // Job keyword matching (optional)
  let keywordMatch: KeywordMatch | undefined;
  if (jobDescription && jobDescription.trim().length > 50) {
    const cvKeywords = extractKeywords(cvText);
    const cvSet = new Set(cvKeywords);
    const jobKeywords = extractKeywords(jobDescription);
    // Score significantly weighted on top of base score
    const matched = jobKeywords.filter((k) => cvSet.has(k));
    const missing = jobKeywords.filter((k) => !cvSet.has(k));
    const matchPercentage = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    keywordMatch = { jobKeywords, cvKeywords, matched, missing, matchPercentage };

    // Blend keyword match (40%) with base ATS score (60%)
    score = Math.round(score * 0.6 + matchPercentage * 0.4);
  }

  const grade: AtsCheckResult['grade'] =
    score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor';

  return {
    score,
    grade,
    metadata: { wordCount, pageCountEstimate, hasEmail, hasPhone, detectedSections },
    checks,
    keywordMatch,
  };
}
