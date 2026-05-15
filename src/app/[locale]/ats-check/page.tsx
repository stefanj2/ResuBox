import type { Metadata } from 'next';
import { Footer } from '@/components/landing';
import AtsCheckClient from './AtsCheckClient';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gratis ATS-check voor je CV | ResuBox',
  description:
    'Check direct of je CV ATS-vriendelijk is. Upload je CV-PDF, krijg een score van 0-100 met concrete verbeterpunten. Optioneel: plak een vacaturetekst voor keyword-match.',
  alternates: { canonical: '/ats-check' },
  openGraph: {
    title: 'Gratis ATS-check voor je CV',
    description: 'Upload je CV, krijg een score + concrete tips. 100% gratis.',
    type: 'website',
  },
};

export default function AtsCheckPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
            >
              Maak gratis je CV <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
            Gratis tool
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Is jouw CV ATS-proof?
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Negen op de tien grote bedrijven gebruiken een Applicant Tracking System om CV&apos;s
            voor te filteren. Een mooi CV dat de ATS niet kan lezen, komt nooit bij een recruiter.
            Upload je CV, krijg direct een score en concrete verbeterpunten.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AtsCheckClient />
        </div>
      </section>

      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Wat checken we?</h2>
          <div className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Tekst-extractie</h3>
              <p>
                Een PDF die uit afbeeldingen bestaat — bijvoorbeeld omdat hij in Canva of via
                screenshot is gemaakt — is voor ATS-systemen blanco. Wij controleren of er echte
                tekst in je CV staat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Section headers</h3>
              <p>
                ATS koppelt informatie aan sectie-koppen. &quot;Werkervaring&quot;,
                &quot;Opleiding&quot; en &quot;Vaardigheden&quot; — zonder die headers weet het
                systeem niet wat het leest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Contactgegevens</h3>
              <p>
                E-mail en telefoonnummer moeten machine-leesbaar zijn, niet in een afbeelding
                verstopt.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Lengte &amp; pagina&apos;s</h3>
              <p>
                400-900 woorden op 1-2 pagina&apos;s is de Nederlandse standaard. Te kort wekt
                twijfel, te lang wordt overgeslagen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Vacature-match (optioneel)</h3>
              <p>
                Plak een vacaturetekst om te zien hoeveel van de gevraagde trefwoorden in je CV
                voorkomen. ATS gebruikt deze match om kandidaten te ranken.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
