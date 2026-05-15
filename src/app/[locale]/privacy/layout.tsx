import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Lees het privacybeleid van ResuBox. Informatie over hoe wij omgaan met je persoonsgegevens, cookies, en je rechten onder de AVG.',
  keywords: ['privacybeleid', 'privacy policy', 'AVG', 'GDPR', 'persoonsgegevens', 'ResuBox', 'CV builder'],
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacybeleid | ResuBox',
    description: 'Lees het privacybeleid van ResuBox CV builder.',
    url: '/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
