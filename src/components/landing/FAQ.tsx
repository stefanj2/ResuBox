'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

const faqs = [
  {
    question: 'Hoe werkt de Magic Link?',
    answer: 'Zodra je je email invult, sturen we je een speciale link. Met deze link kun je later altijd terugkomen en verdergaan waar je gebleven was. Geen wachtwoord nodig - klik gewoon op de link in je email.',
  },
  {
    question: 'Wat is een ATS en waarom is het belangrijk?',
    answer: 'ATS staat voor Applicant Tracking System. Dit is software die bedrijven gebruiken om CV\'s automatisch te scannen en te filteren. Onze CV\'s zijn zo opgemaakt dat ze correct worden gelezen door deze systemen. Hierdoor heb je meer kans dat je CV daadwerkelijk door een recruiter wordt bekeken.',
  },
  {
    question: 'Moet ik een account aanmaken?',
    answer: 'Nee, je hoeft geen account aan te maken. Je kunt direct beginnen met je CV. Wil je later verdergaan? Vraag een gratis magic link aan en je kunt altijd terugkomen waar je gebleven was.',
  },
  {
    question: 'Is het echt 100% gratis?',
    answer: 'Ja, ResuBox is volledig gratis! Het maken van je CV, het kiezen uit al onze 6 professionele templates, én het downloaden als PDF – alles is gratis. Geen verborgen kosten, geen watermerk, geen beperkingen. Je kunt direct aan de slag en je CV onbeperkt downloaden.',
  },
  {
    question: 'Worden mijn gegevens veilig opgeslagen?',
    answer: 'Je gegevens worden lokaal in je browser opgeslagen en optioneel op onze beveiligde servers (alleen als je een magic link aanvraagt). We verkopen nooit je gegevens aan derden en gebruiken ze uitsluitend voor jouw CV.',
  },
  {
    question: 'Kan ik mijn CV later nog aanpassen?',
    answer: 'Zeker! Je kunt je CV onbeperkt aanpassen en opnieuw downloaden. Met een magic link kun je zelfs op andere apparaten verdergaan. Er zijn geen limieten aan het aantal keren dat je je CV kunt bewerken of downloaden.',
  },
  {
    question: 'In welk formaat krijg ik mijn CV?',
    answer: 'Je ontvangt je CV als een hoogwaardige PDF die je direct kunt gebruiken voor sollicitaties. Het formaat is A4 en perfect geschikt voor zowel digitaal versturen als printen.',
  },
  {
    question: 'Kan ik meerdere CV\'s maken?',
    answer: 'Ja! Je kunt zoveel verschillende CV\'s maken als je wilt. Handig als je voor verschillende functies solliciteert en je CV wilt aanpassen aan de vacature.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Veelgestelde vragen
          </h2>
          <p className="text-lg text-slate-600">
            Alles wat je wilt weten over ResuBox
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Klaar om op te vallen bij recruiters?
          </h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            Maak binnen 10 minuten je professionele CV. Geen kosten, geen account nodig, direct resultaat.
          </p>
          <Link href="/builder">
            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-white !text-emerald-600 !border-white hover:bg-emerald-50 hover:!border-emerald-50"
            >
              Start nu direct (100% Gratis)
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
