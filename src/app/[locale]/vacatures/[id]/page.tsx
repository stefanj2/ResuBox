import type { Metadata } from 'next';
import VacancyPageClient from './VacancyPageClient';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: 'Vacature — ResuBox',
    description: 'Bekijk de vacature en maak met één klik een afgestemde motivatiebrief.',
    robots: { index: false, follow: false },
  };
}

export default async function VacancyPage({ params }: Props) {
  const { id } = await params;
  return <VacancyPageClient id={id} />;
}
