'use client';

import { useCVData } from '@/context/CVContext';

export interface ProgressInfo {
  completed: number;
  total: number;
  percentage: number;
  remainingSections: number;
  isSectionComplete: (id: number) => boolean;
}

export function useProgressCalculation(): ProgressInfo {
  const { cvData } = useCVData();

  const isSectionComplete = (id: number): boolean => {
    switch (id) {
      case 0: // Personal
        return !!(cvData.personal.firstName && cvData.personal.lastName && cvData.personal.email);
      case 1: // Profile
        return cvData.profile.summary.length > 20;
      case 2: // Experience
        return cvData.experience.length > 0 && cvData.experience.some(e => e.jobTitle && e.company);
      case 3: // Education
        return cvData.education.length > 0 && cvData.education.some(e => e.degree && e.institution);
      case 4: // Skills
        return cvData.skills.length >= 3;
      case 5: // Optimaliseren (optional, never shows as complete)
        return false;
      default:
        return false;
    }
  };

  const total = 5; // Excluding the optional "Optimaliseren" section
  const completed = [0, 1, 2, 3, 4].filter(id => isSectionComplete(id)).length;
  const percentage = (completed / total) * 100;
  const remainingSections = total - completed;

  return {
    completed,
    total,
    percentage,
    remainingSections,
    isSectionComplete,
  };
}
