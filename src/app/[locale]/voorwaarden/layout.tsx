import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description: 'Lees de algemene voorwaarden van ResuBox. Informatie over het gebruik van onze CV builder dienst, betaling, en je rechten als consument.',
  keywords: ['algemene voorwaarden', 'terms of service', 'ResuBox', 'CV builder', 'gebruiksvoorwaarden'],
  alternates: {
    canonical: '/voorwaarden',
  },
  openGraph: {
    title: 'Algemene Voorwaarden | ResuBox',
    description: 'Lees de algemene voorwaarden van ResuBox CV builder.',
    url: '/voorwaarden',
  },
};

export default function VoorwaardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
