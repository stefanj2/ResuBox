import type { Metadata } from 'next';
import VacanciesClient from './VacanciesClient';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: 'Solliciteer direct op echte vacatures — ResuBox',
    description:
      'Vind echte vacatures die bij jouw CV passen en laat je motivatiebrief automatisch afstemmen op elke vacature.',
    alternates: { canonical: '/vacatures' },
    robots: { index: false, follow: false },
  };
}

export default function VacaturesPage() {
  return <VacanciesClient />;
}
