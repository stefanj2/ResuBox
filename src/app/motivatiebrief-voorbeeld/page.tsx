import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, Mail } from 'lucide-react';
import EXAMPLES from '@/lib/cv-examples/data';
import { hasLetterContext } from '@/lib/cover-letter-examples/data';
import { Footer } from '@/components/landing';

export const metadata: Metadata = {
  title: 'Motivatiebrief Voorbeelden — Per beroep | ResuBox',
  description:
    'Bekijk motivatiebrief voorbeelden per beroep — developer, verpleegkundige, accountant, leraar, marketing manager en meer. Gratis te bekijken, direct te gebruiken in onze builder.',
  alternates: { canonical: '/motivatiebrief-voorbeeld' },
  openGraph: {
    title: 'Motivatiebrief voorbeelden per beroep',
    description: 'Recruiter-gerichte motivatiebrief voorbeelden voor 20+ beroepen.',
    type: 'website',
  },
};

export default function MotivatiebriefVoorbeeldenIndex() {
  const eligible = EXAMPLES.filter((e) => hasLetterContext(e.slug));

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <Link
              href="/motivatiebrief"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Maak gratis je brief
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              Motivatiebrief voorbeelden
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              Per beroep, geschreven voor de Nederlandse arbeidsmarkt
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Voorbeelden van motivatiebrieven gericht op specifieke beroepen — geschreven in de
              toon en structuur die Nederlandse recruiters verwachten. Elk voorbeeld kun je
              gebruiken als uitgangspunt voor je eigen brief.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> {eligible.length} beroepen
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Direct gratis te gebruiken
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligible.map((ex) => (
              <Link
                key={ex.slug}
                href={`/motivatiebrief-voorbeeld/${ex.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Motivatiebrief
                </p>
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {ex.functie}
                </h2>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  Bekijk voorbeeld <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
