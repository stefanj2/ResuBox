import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met ResuBox. Heb je vragen over onze CV builder of hulp nodig? We helpen je graag verder.',
  keywords: ['contact', 'ResuBox contact', 'CV builder support', 'hulp CV maken'],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | ResuBox',
    description: 'Neem contact op met ResuBox. We helpen je graag verder.',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
