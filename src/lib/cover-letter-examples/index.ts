import { buildExampleLetter as buildLetterNL, hasLetterContext as hasContextNL } from './data';
import { buildExampleLetter as buildLetterEN, hasLetterContext as hasContextEN } from './data-en';
import { buildExampleLetter as buildLetterDE, hasLetterContext as hasContextDE } from './data-de';
import { buildExampleLetter as buildLetterSV, hasLetterContext as hasContextSV } from './data-sv';
import { buildExampleLetter as buildLetterDA, hasLetterContext as hasContextDA } from './data-da';
import type { CoverLetterData } from '@/types/cover-letter';
import type { FunctieExample } from '@/lib/cv-examples/types';

type Builder = (example: FunctieExample) => CoverLetterData;
type ContextCheck = (slug: string) => boolean;

const BUILDERS: Record<string, Builder> = {
  nl: buildLetterNL,
  en: buildLetterEN,
  de: buildLetterDE,
  sv: buildLetterSV,
  da: buildLetterDA,
};

const CONTEXT_CHECKS: Record<string, ContextCheck> = {
  nl: hasContextNL,
  en: hasContextEN,
  de: hasContextDE,
  sv: hasContextSV,
  da: hasContextDA,
};

export function buildExampleLetterForLocale(
  example: FunctieExample,
  locale: string
): CoverLetterData {
  return (BUILDERS[locale] ?? BUILDERS.nl)(example);
}

export function hasLetterContextForLocale(slug: string, locale: string): boolean {
  return (CONTEXT_CHECKS[locale] ?? CONTEXT_CHECKS.nl)(slug);
}
