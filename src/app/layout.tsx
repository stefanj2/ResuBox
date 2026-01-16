import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { OrganizationSchema, WebApplicationSchema } from "@/components/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resubox.com';
const GA_MEASUREMENT_ID = 'G-JQG4TLTX3J';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ResuBox - Maak een professioneel CV in minuten",
    template: "%s | ResuBox",
  },
  description: "Maak gratis een professioneel CV met ResuBox. Onze slimme CV-builder is ATS-geoptimaliseerd, heeft 6 moderne templates en vereist geen account. Start direct!",
  keywords: [
    "CV maken",
    "CV builder",
    "CV template",
    "professioneel CV",
    "gratis CV maken",
    "CV voorbeeld",
    "curriculum vitae",
    "sollicitatie",
    "ResuBox",
    "online CV maker",
    "CV generator",
    "Nederlandse CV",
    "ATS CV",
  ],
  authors: [{ name: "ResuBox", url: siteUrl }],
  creator: "ResuBox",
  publisher: "ResuBox",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "ResuBox",
    title: "ResuBox - Maak een professioneel CV in minuten",
    description: "Maak gratis een professioneel CV met ResuBox. Onze slimme CV-builder is ATS-geoptimaliseerd, heeft 6 moderne templates en vereist geen account.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResuBox - Professionele CV Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ResuBox - Maak een professioneel CV in minuten",
    description: "Maak gratis een professioneel CV met ResuBox. ATS-geoptimaliseerd en 6 moderne templates.",
    images: ['/og-image.png'],
    creator: '@resubox',
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <OrganizationSchema />
        <WebApplicationSchema />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
