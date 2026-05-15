import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { ModernCoverLetterTemplate } from '@/components/cover-letter/ModernCoverLetterTemplate';
import { EXAMPLE_BY_SLUG } from '@/lib/cv-examples/data';
import { buildExampleLetter, hasLetterContext } from '@/lib/cover-letter-examples/data';
import { Footer } from '@/components/landing';

interface PageProps {
  params: Promise<{ functie: string }>;
}

export function generateStaticParams() {
  return Object.values(EXAMPLE_BY_SLUG)
    .filter((ex) => hasLetterContext(ex.slug))
    .map((ex) => ({ functie: ex.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { functie } = await params;
  const example = EXAMPLE_BY_SLUG[functie];
  if (!example || !hasLetterContext(functie)) return { title: 'Motivatiebrief niet gevonden' };
  return {
    title: `Motivatiebrief Voorbeeld: ${example.functie} | ResuBox`,
    description: `Concreet motivatiebrief voorbeeld voor ${example.functie}. Recruiter-gerichte opbouw — opening, body en afsluiting. Gratis te bekijken en aan te passen.`,
    alternates: { canonical: `/motivatiebrief-voorbeeld/${example.slug}` },
    openGraph: {
      title: `Motivatiebrief Voorbeeld: ${example.functie}`,
      description: `Voorbeeld motivatiebrief voor ${example.functie}.`,
      type: 'article',
    },
  };
}

export default async function MotivatiebriefVoorbeeldDetail({ params }: PageProps) {
  const { functie } = await params;
  const example = EXAMPLE_BY_SLUG[functie];
  if (!example || !hasLetterContext(functie)) notFound();

  const letter = buildExampleLetter(example);

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
              Maak gratis je brief <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/motivatiebrief-voorbeeld" className="hover:text-slate-700">Motivatiebrief voorbeelden</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-700">{example.functie}</span>
        </div>
      </div>

      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
            Motivatiebrief Voorbeeld
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            {example.functie}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Voorbeeld motivatiebrief voor een sollicitatie als {example.functie.toLowerCase()}. De
            structuur — aanhef, opening, body, afsluiting — is wat Nederlandse recruiters
            verwachten. Gebruik dit als startpunt en pas aan op je eigen ervaring en de vacature.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-8 border border-slate-100">
                <div className="flex justify-center">
                  <div className="origin-top scale-[0.55] sm:scale-[0.78] -mb-[180px] sm:-mb-[80px]">
                    <div className="shadow-xl rounded-md overflow-hidden">
                      <ModernCoverLetterTemplate data={letter} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Template: <span className="font-medium text-slate-700">Modern</span> · Gericht aan:{' '}
                <span className="font-medium text-slate-700">{letter.recipient.company}</span>
              </p>
            </div>

            <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Maak ook jouw motivatiebrief
                </h2>
                <p className="text-sm text-slate-600 mb-5">
                  Begin met dit voorbeeld en vul je eigen gegevens in. Klaar in 5 minuten.
                </p>
                <Link
                  href="/motivatiebrief"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Start gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Auto-prefil
                    vanuit je CV
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Live preview
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Direct
                    downloadbaar
                  </li>
                </ul>
              </div>
              <div className="mt-6 bg-slate-50 rounded-2xl p-5 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Dit is een fictief voorbeeld. Bedrijfsnamen en gegevens zijn ter illustratie.
                    Gebruik het als sjabloon voor je eigen sollicitatie.
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-16 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Hoe schrijf je een sterke motivatiebrief als {example.functie.toLowerCase()}?
          </h2>
          <p className="text-slate-600 mb-10">
            De vier vaste blokken — en wat je in elk hoort te zetten.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Opening — waarom déze vacature</h3>
              <p className="text-slate-700 leading-relaxed">
                Noem in één zin de specifieke functie en het bedrijf. Geef in de tweede zin aan
                waar je de vacature hebt gezien (LinkedIn, jobboard, via een contact) als dat
                relevant is. Vermijd algemene openers als "Met deze brief reageer ik op uw
                vacature" — recruiters zien dat duizend keer per dag.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Body — waarom jij past</h3>
              <p className="text-slate-700 leading-relaxed">
                Hier maak je de match. Pak twee of drie concrete elementen uit je werkverleden die
                één-op-één matchen met de vacature. Voor {example.functie.toLowerCase()}: noem
                resultaten in cijfers (waar mogelijk), specifieke systemen, certificaten of
                projecten. Verwijs naar je CV maar herhaal het niet — laat zien dat je begrijpt
                wat de functie inhoudelijk vraagt.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Bedrijfsmotivatie — waarom déze organisatie</h3>
              <p className="text-slate-700 leading-relaxed">
                Eén of twee zinnen waarom je specifiek bij dit bedrijf wilt werken. Concreet en
                specifiek: een product, een strategische zet die het bedrijf heeft gemaakt, een
                cultureel kenmerk. "Marktleider in de branche" is leeg — "uw recente uitbreiding
                naar EMEA en de focus op API-first architectuur" is sterk.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Afsluiting — concrete call to action</h3>
              <p className="text-slate-700 leading-relaxed">
                Vraag om een gesprek. Geef je beschikbaarheid aan (vanaf welke datum, opzegtermijn
                indien relevant). Sluit af met "Met vriendelijke groet" — niet "Hoogachtend"
                (verouderd in NL B2B) of "Sincerely yours" (Engels). Lengte van de hele brief:
                250-400 woorden, één pagina.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
