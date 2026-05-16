'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/landing';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { FAQSchema } from '@/components/seo';
import type { Locale } from '@/i18n/routing';

interface FAQCategory {
  category: string;
  questions: { question: string; answer: string }[];
}

const FAQS_BY_LOCALE: Record<Locale, FAQCategory[]> = {
  nl: [
    {
      category: 'Algemeen',
      questions: [
        { question: 'Is het echt gratis om een CV te maken?',
          answer: 'Ja! Het ontwerpen en bouwen van je CV is volledig gratis. Pas wanneer je tevreden bent en je CV wilt downloaden, betaal je eenmalig €42 (incl. BTW). Dit is een factuur achteraf — je ontvangt eerst je CV.' },
        { question: 'Wat kost het downloaden van mijn CV?',
          answer: 'Het downloaden kost €42,00 inclusief BTW. Eenmalige betaling per factuur achteraf met 14 dagen betaaltermijn.' },
        { question: 'Moet ik een account aanmaken?',
          answer: 'Nee, je hoeft geen account aan te maken. Met een magic link op je e-mail kun je later altijd terug.' },
      ],
    },
    {
      category: 'CV & ATS',
      questions: [
        { question: 'Wat is een ATS en waarom is het belangrijk?',
          answer: 'ATS staat voor Applicant Tracking System — software die bedrijven gebruiken om CV\'s te scannen. Onze CV\'s zijn zo opgemaakt dat ze correct worden gelezen door deze systemen.' },
        { question: 'In welk formaat krijg ik mijn CV?',
          answer: 'Je krijgt je CV als hoogwaardige PDF (text-selectable, ATS-ready) of als Word-document. Beide A4.' },
        { question: 'Kan ik meerdere CV\'s maken?',
          answer: 'Ja. Met een account bewaar je meerdere CV\'s voor verschillende vacatures.' },
      ],
    },
    {
      category: 'Opslaan & Terugkomen',
      questions: [
        { question: 'Hoe werkt de Magic Link?',
          answer: 'Vul je e-mail in en wij sturen je een speciale link. Klik op de link om verder te gaan — geen wachtwoord nodig.' },
        { question: 'Worden mijn gegevens veilig opgeslagen?',
          answer: 'Lokaal in je browser en optioneel op onze beveiligde servers (alleen met magic link). We verkopen nooit je gegevens.' },
        { question: 'Kan ik mijn CV later nog aanpassen?',
          answer: 'Zeker. Onbeperkt aanpassen, ook na download.' },
      ],
    },
    {
      category: 'Betaling & Support',
      questions: [
        { question: 'Hoe werkt betaling per factuur?',
          answer: 'Na download ontvang je een factuur per e-mail. Betaal binnen 14 dagen via iDEAL, kaart of bankoverschrijving.' },
        { question: 'Wat als ik niet tevreden ben?',
          answer: 'Pas je CV onbeperkt aan voor download. Daarna nog vragen? Neem contact op.' },
        { question: 'Hoe neem ik contact op met support?',
          answer: 'Mail info@resubox.com — we reageren binnen 24 uur op werkdagen.' },
      ],
    },
  ],
  en: [
    {
      category: 'General',
      questions: [
        { question: 'Is it really free to build a CV?',
          answer: 'Yes! Building your CV is fully free. You only pay £42 (incl. VAT) once when you download. Pay-by-invoice, 14-day terms.' },
        { question: 'How much does downloading cost?',
          answer: '£42.00 incl. VAT, one-off. Invoiced after delivery with 14-day payment terms.' },
        { question: 'Do I need an account?',
          answer: 'No. With a magic link you can come back anytime — no password required.' },
      ],
    },
    {
      category: 'CV & ATS',
      questions: [
        { question: 'What is an ATS and why does it matter?',
          answer: 'An Applicant Tracking System is software employers use to scan and filter CVs. Our templates are formatted to be read correctly by these systems.' },
        { question: 'What file format do I get?',
          answer: 'A high-quality PDF (text-selectable, ATS-ready) or a Word document. Both A4.' },
        { question: 'Can I create multiple CVs?',
          answer: 'Yes. With an account you can save multiple CVs for different roles.' },
      ],
    },
    {
      category: 'Save & Resume',
      questions: [
        { question: 'How does the Magic Link work?',
          answer: 'Enter your email and we\'ll send you a unique link. Click it to resume — no password required.' },
        { question: 'Is my data stored securely?',
          answer: 'Locally in your browser and optionally on our secured servers (only with a magic link). We never sell your data.' },
        { question: 'Can I edit my CV later?',
          answer: 'Absolutely. Unlimited edits, including after download.' },
      ],
    },
    {
      category: 'Payment & Support',
      questions: [
        { question: 'How does pay-by-invoice work?',
          answer: 'After download you receive an invoice by email. Pay within 14 days via card or bank transfer.' },
        { question: 'What if I\'m not happy?',
          answer: 'Edit your CV unlimited times before download. Issues afterwards? Contact support.' },
        { question: 'How do I contact support?',
          answer: 'Email info@resubox.com — we reply within 24 hours on business days.' },
      ],
    },
  ],
  de: [
    {
      category: 'Allgemein',
      questions: [
        { question: 'Ist die Lebenslauf-Erstellung wirklich kostenlos?',
          answer: 'Ja! Das Erstellen ist komplett kostenlos. Erst beim Download zahlen Sie einmalig 42 € (inkl. MwSt.). Rechnung nachträglich, Zahlungsziel 14 Tage.' },
        { question: 'Was kostet der Download?',
          answer: '42,00 € inkl. MwSt. einmalig. Rechnung nach Lieferung mit 14 Tagen Zahlungsziel.' },
        { question: 'Brauche ich ein Konto?',
          answer: 'Nein. Mit einem Magic Link können Sie jederzeit zurückkommen — kein Passwort nötig.' },
      ],
    },
    {
      category: 'Lebenslauf & ATS',
      questions: [
        { question: 'Was ist ein ATS und warum ist es wichtig?',
          answer: 'Applicant Tracking System — Software, die Arbeitgeber zum Scannen und Filtern von Lebensläufen nutzen. Unsere Vorlagen werden korrekt gelesen.' },
        { question: 'In welchem Format erhalte ich meinen Lebenslauf?',
          answer: 'Als hochwertiges PDF (text-selektierbar, ATS-tauglich) oder Word-Dokument. Beide im A4-Format.' },
        { question: 'Kann ich mehrere Lebensläufe erstellen?',
          answer: 'Ja. Mit einem Konto speichern Sie mehrere Versionen für unterschiedliche Stellen.' },
      ],
    },
    {
      category: 'Speichern & Fortsetzen',
      questions: [
        { question: 'Wie funktioniert der Magic Link?',
          answer: 'Geben Sie Ihre E-Mail ein und wir senden einen einzigartigen Link. Klicken zum Fortsetzen — kein Passwort.' },
        { question: 'Werden meine Daten sicher gespeichert?',
          answer: 'Lokal im Browser und optional auf unseren gesicherten Servern (nur mit Magic Link). Wir verkaufen Daten nie.' },
        { question: 'Kann ich meinen Lebenslauf später ändern?',
          answer: 'Selbstverständlich. Unbegrenzte Änderungen, auch nach dem Download.' },
      ],
    },
    {
      category: 'Zahlung & Support',
      questions: [
        { question: 'Wie funktioniert die Zahlung per Rechnung?',
          answer: 'Nach dem Download erhalten Sie eine Rechnung per E-Mail. Zahlung innerhalb 14 Tagen per Karte, SEPA oder Überweisung.' },
        { question: 'Was, wenn ich unzufrieden bin?',
          answer: 'Ändern Sie den Lebenslauf vor dem Download beliebig oft. Probleme danach? Kontaktieren Sie den Support.' },
        { question: 'Wie erreiche ich den Support?',
          answer: 'E-Mail an info@resubox.com — wir antworten innerhalb 24 Stunden an Werktagen.' },
      ],
    },
  ],
  sv: [
    {
      category: 'Allmänt',
      questions: [
        { question: 'Är det verkligen gratis att bygga ett CV?',
          answer: 'Ja! Att bygga är helt gratis. Du betalar bara 449 kr (inkl. moms) en gång när du laddar ner. Faktura efter leverans, 14 dagars betalningsvillkor.' },
        { question: 'Vad kostar nedladdningen?',
          answer: '449 kr inkl. moms, en gång. Faktureras efter leverans med 14 dagars betalningsvillkor.' },
        { question: 'Behöver jag ett konto?',
          answer: 'Nej. Med en magic link kan du komma tillbaka när som helst — inget lösenord behövs.' },
      ],
    },
    {
      category: 'CV & ATS',
      questions: [
        { question: 'Vad är ATS och varför är det viktigt?',
          answer: 'Applicant Tracking System är mjukvara som arbetsgivare använder för att scanna och filtrera CV. Våra mallar läses korrekt av dessa system.' },
        { question: 'Vilket format får jag CV:t i?',
          answer: 'Som högkvalitativ PDF (markeringsbar text, ATS-redo) eller Word-dokument. Båda i A4.' },
        { question: 'Kan jag skapa flera CV?',
          answer: 'Ja. Med ett konto sparar du flera CV för olika roller.' },
      ],
    },
    {
      category: 'Spara & Fortsätt',
      questions: [
        { question: 'Hur fungerar Magic Link?',
          answer: 'Ange din e-post så skickar vi en unik länk. Klicka för att fortsätta — inget lösenord.' },
        { question: 'Lagras mina data säkert?',
          answer: 'Lokalt i webbläsaren och valfritt på våra säkra servrar (endast med magic link). Vi säljer aldrig dina data.' },
        { question: 'Kan jag redigera mitt CV senare?',
          answer: 'Absolut. Obegränsade ändringar, även efter nedladdning.' },
      ],
    },
    {
      category: 'Betalning & Support',
      questions: [
        { question: 'Hur fungerar betalning mot faktura?',
          answer: 'Efter nedladdning får du en faktura via e-post. Betala inom 14 dagar via kort eller banköverföring.' },
        { question: 'Vad om jag inte är nöjd?',
          answer: 'Redigera CV:t obegränsat innan nedladdning. Frågor efteråt? Kontakta supporten.' },
        { question: 'Hur kontaktar jag supporten?',
          answer: 'Mejla info@resubox.com — vi svarar inom 24 timmar på vardagar.' },
      ],
    },
  ],
  da: [
    {
      category: 'Generelt',
      questions: [
        { question: 'Er det virkelig gratis at bygge et CV?',
          answer: 'Ja! At bygge er helt gratis. Du betaler kun 315 kr (inkl. moms) én gang når du downloader. Faktura efter levering, 14 dages betalingsfrist.' },
        { question: 'Hvad koster downloaden?',
          answer: '315 kr inkl. moms, én gang. Faktureres efter levering med 14 dages betalingsfrist.' },
        { question: 'Skal jeg oprette en konto?',
          answer: 'Nej. Med et magic link kan du komme tilbage når som helst — uden adgangskode.' },
      ],
    },
    {
      category: 'CV & ATS',
      questions: [
        { question: 'Hvad er et ATS og hvorfor er det vigtigt?',
          answer: 'Et Applicant Tracking System er software som arbejdsgivere bruger til at scanne og filtrere CV\'er. Vores skabeloner læses korrekt af disse systemer.' },
        { question: 'I hvilket format får jeg CV\'et?',
          answer: 'Som CV i høj kvalitet som PDF (markerbar tekst, ATS-klar) eller Word-dokument. Begge i A4-format.' },
        { question: 'Kan jeg lave flere CV\'er?',
          answer: 'Ja. Med en konto gemmer du flere CV\'er til forskellige roller.' },
      ],
    },
    {
      category: 'Gem & Fortsæt',
      questions: [
        { question: 'Hvordan virker Magic Link?',
          answer: 'Indtast din e-mail, så sender vi et unikt link. Klik for at fortsætte — ingen adgangskode.' },
        { question: 'Bliver mine data opbevaret sikkert?',
          answer: 'Lokalt i din browser og valgfrit på vores sikre servere (kun med magic link). Vi sælger aldrig dine data.' },
        { question: 'Kan jeg redigere mit CV senere?',
          answer: 'Selvfølgelig. Ubegrænsede ændringer, også efter download.' },
      ],
    },
    {
      category: 'Betaling & Support',
      questions: [
        { question: 'Hvordan virker betaling med faktura?',
          answer: 'Efter download modtager du en faktura pr. e-mail. Betal inden for 14 dage via kort eller bankoverførsel.' },
        { question: 'Hvad hvis jeg ikke er tilfreds?',
          answer: 'Rediger CV\'et ubegrænset før download. Spørgsmål bagefter? Kontakt supporten.' },
        { question: 'Hvordan kontakter jeg supporten?',
          answer: 'Mail info@resubox.com — vi svarer inden for 24 timer på hverdage.' },
      ],
    },
  ],
};

export default function FAQPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('FAQPage');
  const tHeader = useTranslations('Header');
  const faqs = FAQS_BY_LOCALE[locale] ?? FAQS_BY_LOCALE.nl;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [`${faqs[0].category}-0`]: true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allFaqs = faqs.flatMap((cat) =>
    cat.questions.map((q) => ({ question: q.question, answer: q.answer }))
  );

  return (
    <main className="min-h-screen bg-white">
      <FAQSchema faqs={allFaqs} />
      <Header />

      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

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

          <div className="mt-16 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t('ctaTitle')}
            </h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" className="bg-white text-emerald-600 border-white hover:bg-emerald-50">
                  {t('contactButton')}
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="secondary" icon={ArrowRight} iconPosition="right">
                  {tHeader('ctaPrimary')}
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
