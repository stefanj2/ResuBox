import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Maken - Gratis CV Builder',
  description: 'Maak nu je professionele CV met onze gratis CV builder. Kies uit 6 ATS-geoptimaliseerde templates en download direct als PDF.',
  keywords: ['CV maken', 'CV builder', 'CV template', 'gratis CV', 'online CV maker'],
  alternates: {
    canonical: '/builder',
  },
  openGraph: {
    title: 'CV Maken - Gratis CV Builder | ResuBox',
    description: 'Maak nu je professionele CV met onze gratis CV builder. Kies uit 6 templates.',
    url: '/builder',
  },
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
