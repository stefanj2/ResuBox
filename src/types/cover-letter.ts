/**
 * Cover letter (motivatiebrief) data model.
 *
 * Designed to be filled mostly via reuse from CVData (sender block) and
 * a focused editor for the rest. Single-page A4 output.
 */

import { ColorSchemeId } from './cv';

export type CoverLetterTemplateId = 'modern' | 'klassiek';

export interface CoverLetterSender {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface CoverLetterRecipient {
  /** "Geachte mevrouw Jansen" → just "mevrouw Jansen". Optional. */
  contactName: string;
  /** "HR Manager" or "Recruiter". Optional. */
  contactTitle: string;
  company: string;
  city: string;
}

export interface CoverLetterData {
  id: string;
  createdAt: string;
  updatedAt: string;

  sender: CoverLetterSender;
  recipient: CoverLetterRecipient;

  /** "Senior Backend Developer" — used in opening line and metadata */
  vacancyTitle: string;
  /** Optional reference number from the job ad */
  vacancyReference: string;
  /** Date the letter is written, ISO yyyy-mm-dd */
  date: string;
  /** City where the letter was written */
  letterCity: string;

  /** Salutation, e.g. "Geachte mevrouw Jansen," — auto-generated if empty */
  greeting: string;
  /** Opening paragraph — why writing, where you saw the vacancy */
  opening: string;
  /** Body — why you fit (2-3 paragraphs) */
  body: string;
  /** Closing paragraph — call to action / availability */
  closing: string;
  /** Signature line, e.g. "Met vriendelijke groet," */
  signature: string;

  meta: {
    selectedTemplate: CoverLetterTemplateId;
    selectedColorScheme: ColorSchemeId;
  };
}

export function createEmptyCoverLetter(): CoverLetterData {
  const now = new Date();
  return {
    id: '',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    sender: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      postalCode: '',
    },
    recipient: {
      contactName: '',
      contactTitle: '',
      company: '',
      city: '',
    },
    vacancyTitle: '',
    vacancyReference: '',
    date: now.toISOString().slice(0, 10),
    letterCity: '',
    greeting: '',
    opening: '',
    body: '',
    closing: '',
    signature: 'Met vriendelijke groet,',
    meta: {
      selectedTemplate: 'modern',
      selectedColorScheme: 'emerald',
    },
  };
}
