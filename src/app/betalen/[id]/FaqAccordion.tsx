'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Waarom ontvang ik deze factuur?',
    answer:
      'U heeft via ResuBox.nl uw CV opgemaakt en gedownload. De download is door u geïnitieerd en succesvol afgerond. Deze factuur is de vergoeding voor de CV-download en opmaakdienst.',
  },
  {
    question: 'Is ResuBox betrouwbaar?',
    answer:
      'ResuBox is onderdeel van Dune Legal, officieel geregistreerd in Nederland (KvK 67332706). Wij helpen al duizenden mensen met een professioneel CV en werken uitsluitend met veilige betaalmethoden.',
  },
  {
    question: 'Is mijn betaling veilig?',
    answer:
      'Ja. U betaalt via Stripe — het meest gebruikte betaalplatform ter wereld. U kunt kiezen uit iDEAL, creditcard of Bancontact. Uw bankgegevens worden nooit gedeeld met ResuBox.',
  },
  {
    question: 'Wat gebeurt er na mijn betaling?',
    answer:
      'Direct na ontvangst van uw betaling ontvangt u een bevestigingsmail met uw CV als PDF-bijlage. U kunt uw CV daarna direct gebruiken voor sollicitaties.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#f0f0f0]">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between py-3 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-[13px] font-medium text-slate-700 pr-4">{faq.question}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <p className="pb-3 text-[12px] text-slate-500 leading-relaxed">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
