'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS_BY_LOCALE: Record<string, FaqItem[]> = {
  nl: [
    { question: 'Waarom ontvang ik deze factuur?',
      answer: 'U heeft via ResuBox uw CV opgemaakt en gedownload. De download is door u geïnitieerd en succesvol afgerond. Deze factuur is de vergoeding voor de CV-download.' },
    { question: 'Is ResuBox betrouwbaar?',
      answer: 'Wij helpen al duizenden mensen met een professioneel CV en werken uitsluitend met veilige betaalmethoden.' },
    { question: 'Is mijn betaling veilig?',
      answer: 'Ja. U betaalt via Stripe — het meest gebruikte betaalplatform ter wereld. U kunt kiezen uit iDEAL, creditcard of Bancontact. Uw bankgegevens worden nooit gedeeld met ResuBox.' },
    { question: 'Wat gebeurt er na mijn betaling?',
      answer: 'Direct na ontvangst van uw betaling ontvangt u een bevestigingsmail met uw CV als PDF-bijlage.' },
  ],
  en: [
    { question: 'Why am I receiving this invoice?',
      answer: 'You designed and downloaded your CV through ResuBox. The download was initiated by you and completed successfully. This invoice is the fee for the CV download.' },
    { question: 'Is ResuBox trustworthy?',
      answer: 'We have helped thousands of people with a professional CV and work only with secure payment methods.' },
    { question: 'Is my payment secure?',
      answer: 'Yes. You pay through Stripe — one of the most widely used payment platforms in the world. Your card details are never shared with ResuBox.' },
    { question: 'What happens after I pay?',
      answer: 'Immediately after we receive your payment you will get a confirmation email with your CV as a PDF attachment.' },
  ],
  de: [
    { question: 'Warum erhalte ich diese Rechnung?',
      answer: 'Sie haben über ResuBox Ihren Lebenslauf erstellt und heruntergeladen. Der Download wurde von Ihnen initiiert und erfolgreich abgeschlossen. Diese Rechnung ist die Gebühr dafür.' },
    { question: 'Ist ResuBox vertrauenswürdig?',
      answer: 'Wir helfen bereits Tausenden Menschen mit einem professionellen Lebenslauf und arbeiten ausschließlich mit sicheren Zahlungsmethoden.' },
    { question: 'Ist meine Zahlung sicher?',
      answer: 'Ja. Sie zahlen über Stripe — eine der weltweit meistgenutzten Zahlungsplattformen. Ihre Kartendaten werden niemals an ResuBox weitergegeben.' },
    { question: 'Was passiert nach der Zahlung?',
      answer: 'Unmittelbar nach Zahlungseingang erhalten Sie eine Bestätigungs-E-Mail mit Ihrem Lebenslauf als PDF-Anhang.' },
  ],
  sv: [
    { question: 'Varför har jag fått den här fakturan?',
      answer: 'Du har skapat och laddat ner ditt CV via ResuBox. Nedladdningen initierades av dig och slutfördes. Den här fakturan är avgiften för CV-nedladdningen.' },
    { question: 'Är ResuBox att lita på?',
      answer: 'Vi har hjälpt tusentals personer med ett professionellt CV och använder endast säkra betalningsmetoder.' },
    { question: 'Är min betalning säker?',
      answer: 'Ja. Du betalar via Stripe — en av världens mest använda betalningsplattformar. Dina kortuppgifter delas aldrig med ResuBox.' },
    { question: 'Vad händer efter betalning?',
      answer: 'Direkt efter att vi har mottagit din betalning får du ett bekräftelsemejl med ditt CV som PDF-bilaga.' },
  ],
  da: [
    { question: 'Hvorfor modtager jeg denne faktura?',
      answer: 'Du har via ResuBox lavet og downloadet dit CV. Downloaden blev startet af dig og fuldført. Denne faktura er gebyret for CV-downloaden.' },
    { question: 'Kan man stole på ResuBox?',
      answer: 'Vi har hjulpet tusindvis af personer med et professionelt CV og bruger kun sikre betalingsmetoder.' },
    { question: 'Er min betaling sikker?',
      answer: 'Ja. Du betaler via Stripe — en af verdens mest brugte betalingsplatforme. Dine kortoplysninger deles aldrig med ResuBox.' },
    { question: 'Hvad sker der efter betaling?',
      answer: 'Umiddelbart efter vi modtager din betaling, får du en bekræftelsesmail med dit CV som PDF-vedhæftning.' },
  ],
};

interface Props {
  locale?: string;
}

export default function FaqAccordion({ locale = 'nl' }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = FAQS_BY_LOCALE[locale] ?? FAQS_BY_LOCALE.nl;

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
