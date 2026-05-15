import type { Metadata } from 'next';
import { CoverLetterProvider } from '@/context/CoverLetterContext';
import CoverLetterEditor from './CoverLetterEditor';

export const metadata: Metadata = {
  title: 'Motivatiebrief maken — Gratis sjabloon | ResuBox',
  description:
    'Maak in 5 minuten een professionele motivatiebrief. Recruiter-gerichte opmaak die past bij je CV. Direct downloadbaar als ATS-vriendelijke PDF.',
  alternates: { canonical: '/motivatiebrief' },
  openGraph: {
    title: 'Motivatiebrief maken — Gratis | ResuBox',
    description: 'Recruiter-gerichte motivatiebrief in 5 minuten.',
    type: 'website',
  },
};

export default function MotivatiebriefPage() {
  return (
    <CoverLetterProvider>
      <CoverLetterEditor />
    </CoverLetterProvider>
  );
}
