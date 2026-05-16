import { buildExampleLetter as buildLetterNL, hasLetterContext as hasContextNL } from './data';
import { buildExampleLetter as buildLetterEN, hasLetterContext as hasContextEN } from './data-en';
import type { CoverLetterData } from '@/types/cover-letter';
import type { FunctieExample } from '@/lib/cv-examples/types';

export function buildExampleLetterForLocale(
  example: FunctieExample,
  locale: string
): CoverLetterData {
  return locale === 'nl' ? buildLetterNL(example) : buildLetterEN(example);
}

export function hasLetterContextForLocale(slug: string, locale: string): boolean {
  return locale === 'nl' ? hasContextNL(slug) : hasContextEN(slug);
}
