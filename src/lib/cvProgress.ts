/**
 * Shared completion / progress logic for the builder.
 *
 * Mirrors the rules used by the sidebar checkmarks, mobile sticky CTA and
 * download-gate. Keep this as the single source of truth — if section
 * completion rules change, update them here, not in the components.
 */

import type { CVData } from '@/types/cv';

export type SectionId = 0 | 1 | 2 | 3 | 4;

export const SECTION_COUNT = 5;

export function isSectionComplete(id: number, cv: CVData): boolean {
  switch (id) {
    case 0: // Persoonsgegevens
      return !!(
        cv.personal.firstName &&
        cv.personal.lastName &&
        cv.personal.email
      );
    case 1: // Werkervaring
      return cv.experience.length > 0 && cv.experience.some((e) => e.jobTitle && e.company);
    case 2: // Opleiding
      return cv.education.length > 0 && cv.education.some((e) => e.degree && e.institution);
    case 3: // Vaardigheden
      return cv.skills.length >= 3;
    case 4: // Profiel
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
