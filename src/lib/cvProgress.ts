/**
 * Shared completion / progress logic for the builder funnel.
 *
 * Funnel layout (8 stepper positions, 7 fillable + 1 review):
 *   0  Persoonlijk basis      — firstName + lastName
 *   1  Persoonlijk contact    — email (required, must look like an email)
 *   2  Persoonlijk extra      — always complete (all fields optional)
 *   3  Werkervaring
 *   4  Opleiding
 *   5  Vaardigheden
 *   6  Profielschets
 *   7  Controle & download    — gated on 0-6 being complete
 */

import type { CVData } from '@/types/cv';

export type SectionId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SECTION_COUNT = 7;
export const REVIEW_STEP_ID = SECTION_COUNT;

export function isSectionComplete(id: number, cv: CVData): boolean {
  switch (id) {
    case 0: // Persoonlijk basis
      return !!(cv.personal.firstName && cv.personal.lastName);
    case 1: // Persoonlijk contact — recruiter needs to be able to reach + locate the candidate
      return (
        !!cv.personal.email &&
        cv.personal.email.includes('@') &&
        !!cv.personal.phone?.trim() &&
        !!cv.personal.city?.trim()
      );
    case 2: // Persoonlijk extra — all fields are optional
      return true;
    case 3: // Werkervaring
      return cv.experience.length > 0 && cv.experience.some((e) => e.jobTitle && e.company);
    case 4: // Opleiding
      return cv.education.length > 0 && cv.education.some((e) => e.degree && e.institution);
    case 5: // Vaardigheden
      return cv.skills.length >= 3;
    case 6: // Profielschets
      return cv.profile.summary.length > 20;
    default:
      return false;
  }
}

export interface CvProgress {
  completed: number;
  total: number;
  percent: number;
  remaining: number;
  isComplete: boolean;
  perSection: boolean[];
}

export function getCvProgress(cv: CVData): CvProgress {
  const perSection = Array.from({ length: SECTION_COUNT }, (_, i) => isSectionComplete(i, cv));
  const completed = perSection.filter(Boolean).length;
  return {
    completed,
    total: SECTION_COUNT,
    percent: Math.round((completed / SECTION_COUNT) * 100),
    remaining: SECTION_COUNT - completed,
    isComplete: completed === SECTION_COUNT,
    perSection,
  };
}
