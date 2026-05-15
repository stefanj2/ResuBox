import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen (FAQ)',
  description: 'Antwoorden op veelgestelde vragen over ResuBox CV builder. Leer meer over prijzen, ATS-optimalisatie, betaling en hoe je je CV kunt opslaan.',
  keywords: ['FAQ', 'veelgestelde vragen', 'CV builder help', 'ResuBox support', 'CV maken hulp'],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Veelgestelde Vragen | ResuBox',
    description: 'Antwoorden op veelgestelde vragen over ResuBox CV builder.',
    url: '/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
