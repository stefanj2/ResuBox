import { CVData } from '@/types/cv';

/**
 * Rule-based, deterministic CV scoring. Runs entirely client-side on the
 * structured CVData so feedback is instant — no API calls, no debounce.
 *
 * Each check has:
 *  - status: pass | warn | fail
 *  - weight: contribution to the overall score (sum should be ~1.0)
 *
 * The score is a weighted average mapped to 0-100. Honest, not LLM-judged —
 * the user sees "you have no quantified bullets" if they don't, not vague
 * AI fluff.
 */

export type ScoreStatus = 'pass' | 'warn' | 'fail';
export type Grade = 'excellent' | 'good' | 'fair' | 'poor';

export interface ScoreCheck {
  id: string;
  label: string;
  status: ScoreStatus;
  description: string;
  /** Optional tip on how to improve. Shown when status !== 'pass'. */
  tip?: string;
  weight: number;
}

export interface CVScore {
  overall: number; // 0-100
  grade: Grade;
  checks: ScoreCheck[];
  metadata: {
    wordCount: number;
    bulletCount: number;
    quantifiedBullets: number;
    actionVerbBullets: number;
  };
}

// Strong Dutch CV action verbs — bullets that start with these read as
// "this person did things" instead of "this person was there"
const ACTION_VERBS_NL = new Set([
  'leidde', 'leid', 'ontwikkelde', 'ontwikkel', 'verlaagde', 'verlaag', 'verhoogde', 'verhoog',
  'verbeterde', 'verbeter', 'lanceerde', 'lanceer', 'onderhandelde', 'onderhandel',
  'migreerde', 'migreer', 'optimaliseerde', 'optimaliseer', 'coördineerde', 'coördineer',
  'coordineerde', 'coordineer', 'implementeerde', 'implementeer', 'bouwde', 'bouw',
  'introduceerde', 'introduceer', 'realiseerde', 'realiseer', 'behaalde', 'behaal',
  'sloot', 'sluit', 'wierf', 'werf', 'beheerde', 'beheer', 'creëerde', 'creeerde', 'creëer',
  'creeer', 'schreef', 'schrijf', 'ontwierp', 'ontwerp', 'analyseerde', 'analyseer',
  'verwierf', 'verwerf', 'reduceerde', 'reduceer', 'automatiseerde', 'automatiseer',
  'voerde', 'voer', 'begeleidde', 'begeleid', 'organiseerde', 'organiseer', 'presenteerde',
  'presenteer', 'adviseerde', 'adviseer', 'verkocht', 'verkoop', 'beheerste',
  'transformeerde', 'transformeer', 'initiëerde', 'initieerde', 'initieer', 'initieër',
  'verwijderde', 'verwijder', 'mentort', 'mentorde', 'coachte', 'coach',
  // English action verbs (some users mix languages)
  'led', 'developed', 'reduced', 'improved', 'launched', 'managed', 'built', 'designed',
  'increased', 'negotiated', 'migrated', 'optimised', 'optimized', 'implemented',
]);

// "Weak openers" — phrases that signal the bullet is a job description, not an achievement
const WEAK_OPENERS = [
  'verantwoordelijk voor',
  'verantwoordelijk',
  'hielp met',
  'hielp bij',
  'werkte aan',
  'werkte mee',
  'meewerkte',
  'diverse',
  'verschillende',
  'verschillende werkzaamheden',
  'taken zoals',
  'responsible for',
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function startsWithActionVerb(bullet: string): boolean {
  const firstWord = bullet.trim().split(/[\s,.;:]/)[0]?.toLowerCase().replace(/[^\p{L}]/gu, '');
  if (!firstWord) return false;
  return ACTION_VERBS_NL.has(firstWord);
}

function startsWithWeakOpener(bullet: string): boolean {
  const lower = bullet.trim().toLowerCase();
  return WEAK_OPENERS.some((w) => lower.startsWith(w));
}

function isQuantified(bullet: string): boolean {
  // Contains a number, percentage, euro sign, time period, or scale word
  return (
    /\d/.test(bullet) ||
    /%/.test(bullet) ||
    /€/.test(bullet) ||
    /\b(miljoen|duizend|miljard|mln|k\b|m\b)\b/i.test(bullet)
  );
}

function totalWordCount(cvData: CVData): number {
  let total = 0;
  total += countWords(cvData.profile?.summary ?? '');
  for (const e of cvData.experience) {
    total += countWords(e.jobTitle) + countWords(e.company) + countWords(e.description);
    for (const t of e.tasks) total += countWords(t);
  }
  for (const e of cvData.education) {
    total += countWords(e.degree) + countWords(e.institution) + countWords(e.description ?? '');
  }
  total += cvData.skills.length * 2; // skills are short
  return total;
}

export function computeScore(cvData: CVData): CVScore {
  const checks: ScoreCheck[] = [];

  const allBullets = cvData.experience.flatMap((e) => e.tasks);
  const bulletCount = allBullets.length;
  const quantifiedBullets = allBullets.filter(isQuantified).length;
  const actionVerbBullets = allBullets.filter(startsWithActionVerb).length;
  const weakOpenerBullets = allBullets.filter(startsWithWeakOpener).length;
  const wordCount = totalWordCount(cvData);

  // ── Contact basics
  const hasEmail = !!cvData.personal.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personal.email);
  const hasPhone = !!cvData.personal.phone && cvData.personal.phone.replace(/\D/g, '').length >= 9;
  checks.push({
    id: 'contact',
    label: 'Contactgegevens',
    status: hasEmail && hasPhone ? 'pass' : hasEmail || hasPhone ? 'warn' : 'fail',
    description:
      hasEmail && hasPhone
        ? 'E-mail en telefoonnummer zijn beide ingevuld.'
        : !hasEmail && !hasPhone
          ? 'Vul e-mail en telefoonnummer in zodat recruiters je kunnen bereiken.'
          : 'Vul ook het ontbrekende contactveld in (e-mail of telefoon).',
    tip: !hasEmail ? 'Een geldig e-mailadres is essentieel — anders kan ATS je niet routeren.' : undefined,
    weight: 0.1,
  });

  // ── Naam aanwezig
  const hasName = !!(cvData.personal.firstName?.trim() && cvData.personal.lastName?.trim());
  checks.push({
    id: 'name',
    label: 'Volledige naam',
    status: hasName ? 'pass' : 'fail',
    description: hasName ? 'Voor- en achternaam zijn ingevuld.' : 'Vul je voor- en achternaam in.',
    weight: 0.04,
  });

  // ── Werkervaring aanwezig
  const expCount = cvData.experience.filter((e) => e.jobTitle && e.company).length;
  checks.push({
    id: 'experience-count',
    label: 'Werkervaring',
    status: expCount >= 2 ? 'pass' : expCount === 1 ? 'warn' : 'fail',
    description:
      expCount === 0
        ? 'Geen werkervaring ingevuld. Voeg minimaal één positie toe.'
        : expCount === 1
          ? '1 werkervaring ingevuld — voeg eerdere posities toe als je die hebt.'
          : `${expCount} werkervaringen ingevuld.`,
    weight: 0.12,
  });

  // ── Bullets per ervaring
  const expWithBullets = cvData.experience.filter((e) => e.tasks.length >= 2);
  const expWithBulletsRatio =
    cvData.experience.length === 0 ? 0 : expWithBullets.length / cvData.experience.length;
  checks.push({
    id: 'bullet-count',
    label: 'Bullets per werkervaring',
    status: expWithBulletsRatio >= 0.8 ? 'pass' : expWithBulletsRatio >= 0.4 ? 'warn' : 'fail',
    description:
      expWithBulletsRatio >= 0.8
        ? 'Elke werkervaring heeft minimaal 2 bullets met taken/prestaties.'
        : expWithBulletsRatio >= 0.4
          ? 'Niet alle werkervaringen hebben genoeg bullets. Mik op 2-5 per positie.'
          : 'Te weinig bullets. Voeg per werkervaring 2-5 concrete taken of prestaties toe.',
    tip: 'Een bullet vertelt wat je deed én wat het opleverde. "Migreerde refund-service" > "Werkte aan migratie".',
    weight: 0.1,
  });

  // ── Quantified bullets
  const qRatio = bulletCount === 0 ? 0 : quantifiedBullets / bulletCount;
  checks.push({
    id: 'quantified',
    label: 'Cijfers in bullets',
    status: qRatio >= 0.4 ? 'pass' : qRatio >= 0.2 ? 'warn' : 'fail',
    description:
      bulletCount === 0
        ? 'Geen bullets om te scoren.'
        : `${quantifiedBullets} van ${bulletCount} bullets bevatten cijfers, percentages of bedragen (${Math.round(
            qRatio * 100
          )}%).`,
    tip: 'Cijfers maken impact concreet: "verlaagde latency met 40%" beat "verbeterde performance".',
    weight: 0.13,
  });

  // ── Action verbs
  const verbRatio = bulletCount === 0 ? 0 : actionVerbBullets / bulletCount;
  checks.push({
    id: 'action-verbs',
    label: 'Sterke werkwoorden',
    status: verbRatio >= 0.5 ? 'pass' : verbRatio >= 0.25 ? 'warn' : 'fail',
    description:
      bulletCount === 0
        ? 'Geen bullets om te scoren.'
        : `${actionVerbBullets} van ${bulletCount} bullets beginnen met een actiewerkwoord (${Math.round(
            verbRatio * 100
          )}%).`,
    tip: 'Begin bullets met "Leidde", "Verlaagde", "Migreerde" — niet "Verantwoordelijk voor" of "Werkte aan".',
    weight: 0.1,
  });

  // ── Weak openers
  if (weakOpenerBullets > 0) {
    checks.push({
      id: 'weak-openers',
      label: 'Vage openers',
      status: weakOpenerBullets >= 3 ? 'fail' : 'warn',
      description: `${weakOpenerBullets} bullet${weakOpenerBullets > 1 ? 's' : ''} begin${
        weakOpenerBullets > 1 ? 'nen' : 't'
      } met "verantwoordelijk voor", "hielp met" of vergelijkbaar. Herschrijf met een sterk werkwoord.`,
      tip: 'Klik op de 🪄-knop naast een bullet om Claude te vragen een sterkere versie te schrijven.',
      weight: 0.05,
    });
  }

  // ── Profiel
  const profileWords = countWords(cvData.profile?.summary ?? '');
  checks.push({
    id: 'profile',
    label: 'Profielsamenvatting',
    status: profileWords >= 30 && profileWords <= 120 ? 'pass' : profileWords > 0 ? 'warn' : 'fail',
    description:
      profileWords === 0
        ? 'Geen profielsamenvatting. Recruiters lezen die als eerste.'
        : profileWords < 30
          ? `Profiel is kort (${profileWords} woorden). Mik op 50-100 woorden, 2-3 zinnen.`
          : profileWords > 120
            ? `Profiel is lang (${profileWords} woorden). Recruiters scannen — houd het op 2-3 zinnen.`
            : `Profielsamenvatting is goede lengte (${profileWords} woorden).`,
    tip: 'Klik "Schrijf voor mij" in de Profiel-stap om Claude een profiel te laten genereren op basis van je werkervaring.',
    weight: 0.1,
  });

  // ── Opleiding
  const eduCount = cvData.education.filter((e) => e.degree && e.institution).length;
  checks.push({
    id: 'education',
    label: 'Opleiding',
    status: eduCount >= 1 ? 'pass' : 'fail',
    description: eduCount === 0 ? 'Voeg minimaal je hoogst behaalde opleiding toe.' : `${eduCount} opleiding(en) ingevuld.`,
    weight: 0.06,
  });

  // ── Skills
  const skillCount = cvData.skills.filter((s) => s.name?.trim()).length;
  checks.push({
    id: 'skills',
    label: 'Vaardigheden',
    status:
      skillCount >= 6 && skillCount <= 15
        ? 'pass'
        : skillCount >= 3
          ? 'warn'
          : 'fail',
    description:
      skillCount === 0
        ? 'Voeg minimaal 5-8 relevante skills toe — ATS gebruikt deze voor keyword-matching.'
        : skillCount < 6
          ? `${skillCount} skills — voeg er nog wat toe (mik op 6-15).`
          : skillCount > 15
            ? `${skillCount} skills is veel. Beperk tot 8-12 meest relevante voor recruiter-leesbaarheid.`
            : `${skillCount} relevante skills.`,
    weight: 0.08,
  });

  // ── Lengte
  checks.push({
    id: 'length',
    label: 'CV lengte',
    status:
      wordCount >= 250 && wordCount <= 900
        ? 'pass'
        : wordCount >= 150
          ? 'warn'
          : 'fail',
    description:
      wordCount < 150
        ? `Te kort (${wordCount} woorden). Recruiters krijgen geen volledig beeld.`
        : wordCount > 900
          ? `Aan de lange kant (${wordCount} woorden). Mik op 400-700 woorden voor max scan-baarheid.`
          : `${wordCount} woorden — goede lengte.`,
    weight: 0.06,
  });

  // ── Dates aanwezig
  const totalEntries = cvData.experience.length + cvData.education.length;
  const entriesWithDates =
    cvData.experience.filter((e) => e.startDate).length +
    cvData.education.filter((e) => e.startDate).length;
  const dateRatio = totalEntries === 0 ? 1 : entriesWithDates / totalEntries;
  checks.push({
    id: 'dates',
    label: 'Datums',
    status: dateRatio === 1 ? 'pass' : dateRatio >= 0.5 ? 'warn' : 'fail',
    description:
      totalEntries === 0
        ? 'Nog geen werkervaring of opleiding ingevuld.'
        : dateRatio === 1
          ? 'Alle ervaringen en opleidingen hebben datums.'
          : `${entriesWithDates}/${totalEntries} entries hebben startdatum. Recruiters checken altijd op gaps.`,
    weight: 0.06,
  });

  // Score = weighted average; pass = 1.0, warn = 0.5, fail = 0
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce(
    (sum, c) => sum + c.weight * (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0),
    0
  );
  const overall = Math.round((earned / totalWeight) * 100);

  const grade: Grade =
    overall >= 85 ? 'excellent' : overall >= 70 ? 'good' : overall >= 50 ? 'fair' : 'poor';

  return {
    overall,
    grade,
    checks,
    metadata: { wordCount, bulletCount, quantifiedBullets, actionVerbBullets },
  };
}
