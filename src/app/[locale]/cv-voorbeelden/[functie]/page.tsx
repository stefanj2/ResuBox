import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { CVPreview } from '@/components/preview';
import { EXAMPLE_BY_SLUG, EXAMPLE_SLUGS } from '@/lib/cv-examples/data';
import { Footer } from '@/components/landing';

interface PageProps {
  params: Promise<{ functie: string }>;
}

export function generateStaticParams() {
  return EXAMPLE_SLUGS.map((functie) => ({ functie }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { functie } = await params;
  const example = EXAMPLE_BY_SLUG[functie];
  if (!example) return { title: 'CV Voorbeeld niet gevonden' };
  return {
    title: example.title,
    description: example.description,
    alternates: { canonical: `/cv-voorbeelden/${example.slug}` },
    openGraph: {
      title: example.title,
      description: example.description,
      type: 'article',
    },
  };
}

export default async function CvVoorbeeldDetail({ params }: PageProps) {
  const { functie } = await params;
  const example = EXAMPLE_BY_SLUG[functie];
  if (!example) notFound();

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

      {/* Breadcrumb */}
      <div className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/cv-voorbeelden" className="hover:text-slate-700">CV voorbeelden</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-700">{example.functie}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
            CV Voorbeeld
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            {example.functie}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            {example.description}
          </p>
        </div>
      </section>

      {/* Main: preview + advice */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
            {/* Preview column */}
            <div className="order-2 lg:order-1">
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-8 border border-slate-100">
                <div className="flex justify-center">
                  {/* Scale the A4 to fit nicely in the column */}
                  <div className="origin-top scale-[0.55] sm:scale-[0.78] -mb-[180px] sm:-mb-[80px]">
                    <div className="shadow-xl rounded-md overflow-hidden">
                      <CVPreview
                        dataOverride={example.cv}
                        templateOverride={example.templateId}
                        colorSchemeOverride={example.colorSchemeId}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Template: <span className="font-medium text-slate-700">{example.templateId}</span> ·
                Kleur: <span className="font-medium text-slate-700">{example.colorSchemeId}</span>
              </p>
            </div>

            {/* Right rail: CTA + meta */}
            <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Wil jij ook zo'n CV?
                </h2>
                <p className="text-sm text-slate-600 mb-5">
                  Begin met deze opmaak en vul je eigen gegevens in. Klaar in 10 minuten.
                </p>
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Start gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 6 templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> ATS-leesbaar PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Direct downloadbaar
                  </li>
                </ul>
              </div>

              <div className="mt-6 bg-slate-50 rounded-2xl p-5 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Deze CV is een voorbeeld. Recruiter-gerichte opmaak gebaseerd op onderzoek naar
                    wat hiring managers in Nederland herkennen als "professioneel".
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Advice */}
      <section className="bg-slate-50 py-12 sm:py-16 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Hoe maak je een sterk CV als {example.functie.toLowerCase()}?
          </h2>
          <p className="text-slate-600 mb-10">
            Concreet en zonder clichés — wat werkt bij Nederlandse recruiters.
          </p>
          <div className="space-y-8">
            {example.advice.map((section) => (
              <div key={section.heading}>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{section.heading}</h3>
                <p className="text-slate-700 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other examples */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Andere CV voorbeelden</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(EXAMPLE_BY_SLUG)
              .filter((e) => e.slug !== example.slug)
              .slice(0, 6)
              .map((e) => (
                <Link
                  key={e.slug}
                  href={`/cv-voorbeelden/${e.slug}`}
                  className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-md transition-all"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                    CV Voorbeeld
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
                    {e.functie}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
