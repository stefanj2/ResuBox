import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import EXAMPLES from '@/lib/cv-examples/data';
import { Footer } from '@/components/landing';

export const metadata: Metadata = {
  title: 'CV Voorbeelden — Per beroep & sector | ResuBox',
  description:
    'Bekijk professionele CV voorbeelden per beroep. Recruiter-gerichte opmaak voor developer, verpleegkundige, accountant, leraar, marketing manager en meer. Inclusief schrijftips per functie.',
  alternates: { canonical: '/cv-voorbeelden' },
  openGraph: {
    title: 'CV Voorbeelden per beroep — ResuBox',
    description:
      'Recruiter-gerichte CV voorbeelden per beroep met concrete schrijftips. Direct gratis te bekijken en aan te passen.',
    type: 'website',
  },
};

export default function CvVoorbeeldenIndex() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Maak gratis je CV
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              CV Voorbeelden
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              Per beroep, voor de Nederlandse arbeidsmarkt
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Hier vind je CV voorbeelden gemaakt voor specifieke beroepen — geschreven met de
              opmaak en de schrijfstijl die corporate recruiters in Nederland herkennen. Elk
              voorbeeld is een realistische case mét toelichting waarom het werkt.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ATS-vriendelijk
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Direct downloadbaar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex.slug}
                href={`/cv-voorbeelden/${ex.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                    CV Voorbeeld
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {ex.functie}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {ex.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  Bekijk voorbeeld <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Maak nu jouw eigen CV
          </h2>
          <p className="text-slate-600 mb-8">
            Geen account nodig. Kies een template, vul je gegevens in en download direct.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Start gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
