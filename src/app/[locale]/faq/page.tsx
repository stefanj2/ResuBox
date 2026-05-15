'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/landing';
import { Button } from '@/components/ui';
import { FAQSchema } from '@/components/seo';

const faqs = [
  {
    category: 'Algemeen',
    questions: [
      {
        question: 'Is het echt gratis om een CV te maken?',
        answer: 'Ja! Het ontwerpen en bouwen van je CV is volledig gratis. Je kunt zoveel aanpassen als je wilt. Pas wanneer je tevreden bent en je CV wilt downloaden als PDF, betaal je eenmalig €42 (incl. BTW). Dit is een factuur achteraf - je ontvangt eerst je CV.',
      },
      {
        question: 'Wat kost het downloaden van mijn CV?',
        answer: 'Het downloaden kost €42,00 inclusief BTW. Dit is een eenmalige betaling per factuur achteraf. Je ontvangt je CV direct en de factuur per email. Je hebt dan 14 dagen om te betalen.',
      },
      {
        question: 'Moet ik een account aanmaken?',
        answer: 'Nee, je hoeft geen account aan te maken. Je kunt direct beginnen met het bouwen van je CV. Wil je later verdergaan? Vraag dan een magic link aan met je emailadres.',
      },
    ],
  },
  {
    category: 'CV & ATS',
    questions: [
      {
        question: 'Wat is een ATS en waarom is het belangrijk?',
        answer: 'ATS staat voor Applicant Tracking System. Dit is software die bedrijven gebruiken om CV\'s automatisch te scannen en te filteren. Onze CV\'s zijn zo opgemaakt dat ze correct worden gelezen door deze systemen. Hierdoor heb je meer kans dat je CV daadwerkelijk door een recruiter wordt bekeken.',
      },
      {
        question: 'In welk formaat krijg ik mijn CV?',
        answer: 'Je ontvangt je CV als een hoogwaardige PDF die je direct kunt gebruiken voor sollicitaties. Het formaat is A4 en perfect geschikt voor zowel digitaal versturen als printen.',
      },
      {
        question: 'Kan ik meerdere CV\'s maken?',
        answer: 'Ja, je kunt meerdere CV\'s maken voor verschillende vacatures of doeleinden. Elk CV wordt apart opgeslagen en je betaalt alleen voor de CV\'s die je daadwerkelijk download.',
      },
    ],
  },
  {
    category: 'Opslaan & Terugkomen',
    questions: [
      {
        question: 'Hoe werkt de Magic Link?',
        answer: 'Zodra je je email invult, sturen we je een speciale link. Met deze link kun je later altijd terugkomen en verdergaan waar je gebleven was. Geen wachtwoord nodig - klik gewoon op de link in je email.',
      },
      {
        question: 'Worden mijn gegevens veilig opgeslagen?',
        answer: 'Je gegevens worden lokaal in je browser opgeslagen en optioneel op onze beveiligde servers (alleen als je een magic link aanvraagt). We verkopen nooit je gegevens aan derden en gebruiken ze uitsluitend voor jouw CV.',
      },
      {
        question: 'Kan ik mijn CV later nog aanpassen?',
        answer: 'Zeker! Je kunt je CV onbeperkt aanpassen zolang je de browser niet wist. Met een magic link kun je zelfs op andere apparaten verdergaan. Na download kun je altijd terugkomen om wijzigingen te maken.',
      },
    ],
  },
  {
    category: 'Betaling & Support',
    questions: [
      {
        question: 'Hoe werkt betaling per factuur?',
        answer: 'Na het downloaden van je CV ontvang je een factuur per email. Je hebt 14 dagen de tijd om deze te betalen. Je kunt betalen via iDEAL, bankoverschrijving of andere gangbare betaalmethodes.',
      },
      {
        question: 'Wat als ik niet tevreden ben?',
        answer: 'Je kunt je CV onbeperkt aanpassen voordat je downloadt. Zie je toch iets dat niet klopt na download? Neem contact met ons op en we helpen je verder.',
      },
      {
        question: 'Hoe neem ik contact op met support?',
        answer: 'Je kunt ons bereiken via email op info@resubox.nl. We proberen binnen 24 uur te reageren op werkdagen.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'Algemeen-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Flatten FAQs for schema
  const allFaqs = faqs.flatMap(cat =>
    cat.questions.map(q => ({ question: q.question, answer: q.answer }))
  );

  return (
    <main className="min-h-screen bg-white">
      <FAQSchema faqs={allFaqs} />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Veelgestelde vragen
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Vind snel antwoord op je vragen over ResuBox, prijzen, en hoe alles werkt.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const key = `${category.category}-${index}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-900 pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Nog vragen? Of klaar om te beginnen?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              Heb je een vraag die hier niet beantwoord wordt?
              Neem dan contact met ons op. Of begin direct met je CV!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" className="bg-white text-emerald-600 border-white hover:bg-emerald-50">
                  Neem contact op
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="secondary" icon={ArrowRight} iconPosition="right">
                  Maak nu je CV
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
