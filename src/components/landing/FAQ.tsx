'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS_BY_LOCALE: Record<Locale, FaqItem[]> = {
  nl: [
    { question: 'Hoe werkt de Magic Link?',
      answer: 'Zodra je je email invult, sturen we je een speciale link. Met deze link kun je later altijd terugkomen en verdergaan waar je gebleven was. Geen wachtwoord nodig — klik gewoon op de link in je email.' },
    { question: 'Wat is een ATS en waarom is het belangrijk?',
      answer: 'ATS staat voor Applicant Tracking System. Dit is software die bedrijven gebruiken om CV\'s automatisch te scannen en te filteren. Onze CV\'s zijn zo opgemaakt dat ze correct worden gelezen door deze systemen, zodat je CV daadwerkelijk door een recruiter wordt bekeken.' },
    { question: 'Moet ik een account aanmaken?',
      answer: 'Nee, je hoeft geen account aan te maken. Wil je later verdergaan? Vraag een gratis magic link aan en je kunt altijd terugkomen waar je gebleven was.' },
    { question: 'Is het echt gratis om te maken?',
      answer: 'Ja, het bouwen van je CV is volledig gratis. Pas wanneer je downloadt betaal je eenmalig €42 (achteraf, na ontvangst). Geen abonnement, geen verborgen kosten.' },
    { question: 'Worden mijn gegevens veilig opgeslagen?',
      answer: 'Je gegevens worden lokaal in je browser opgeslagen en optioneel op onze beveiligde servers (alleen als je een magic link aanvraagt). We verkopen nooit je gegevens aan derden.' },
    { question: 'Kan ik mijn CV later nog aanpassen?',
      answer: 'Zeker! Je kunt je CV onbeperkt aanpassen. Met een magic link kun je zelfs op andere apparaten verdergaan.' },
    { question: 'In welk formaat krijg ik mijn CV?',
      answer: 'Je ontvangt je CV als hoogwaardige PDF (text-selectable, ATS-ready) of als Word-document. Beide A4 en perfect voor digitaal versturen of printen.' },
    { question: 'Kan ik meerdere CV\'s maken?',
      answer: 'Ja! Met een account kun je meerdere CV\'s opslaan en switchen tussen verschillende versies voor verschillende vacatures.' },
  ],
  en: [
    { question: 'How does the Magic Link work?',
      answer: 'Once you enter your email, we send you a special link. Clicking it lets you return anytime and pick up where you left off — no password required.' },
    { question: 'What is an ATS and why does it matter?',
      answer: 'ATS stands for Applicant Tracking System — the software employers use to automatically scan and filter CVs. Our templates are formatted to be read correctly by these systems so your CV actually reaches a recruiter.' },
    { question: 'Do I need to create an account?',
      answer: 'No. You can start straight away. If you want to come back later, request a free magic link and you\'ll pick up exactly where you stopped.' },
    { question: 'Is it really free to build?',
      answer: 'Yes — building your CV is fully free. You only pay £42 once when you download (post-pay, invoiced after delivery). No subscription, no hidden fees.' },
    { question: 'Is my data stored securely?',
      answer: 'Your data is stored locally in your browser and optionally on our secured servers (only if you request a magic link). We never sell your data to third parties.' },
    { question: 'Can I edit my CV later?',
      answer: 'Absolutely. You can update your CV as often as you want. With a magic link you can even continue on a different device.' },
    { question: 'What format will I receive?',
      answer: 'You get a high-quality PDF (text-selectable, ATS-ready) or a Word document. Both A4 and perfect for both digital applications and printing.' },
    { question: 'Can I create multiple CVs?',
      answer: 'Yes. With an account you can save multiple CVs and switch between versions tailored to different roles.' },
  ],
  de: [
    { question: 'Wie funktioniert der Magic Link?',
      answer: 'Sobald Sie Ihre E-Mail eingeben, schicken wir Ihnen einen besonderen Link. Mit diesem Link kommen Sie jederzeit zurück und arbeiten weiter — kein Passwort nötig.' },
    { question: 'Was ist ein ATS und warum ist das wichtig?',
      answer: 'ATS steht für Applicant Tracking System — Software, mit der Arbeitgeber Lebensläufe automatisch scannen und filtern. Unsere Vorlagen sind so formatiert, dass diese Systeme sie korrekt lesen.' },
    { question: 'Muss ich ein Konto erstellen?',
      answer: 'Nein. Sie können sofort loslegen. Möchten Sie später weitermachen? Fordern Sie einfach einen kostenlosen Magic Link an.' },
    { question: 'Ist das Erstellen wirklich kostenlos?',
      answer: 'Ja — das Erstellen ist komplett kostenlos. Erst beim Download bezahlen Sie einmalig 42 € (nachträglich per Rechnung). Kein Abo, keine versteckten Kosten.' },
    { question: 'Werden meine Daten sicher gespeichert?',
      answer: 'Ihre Daten werden lokal im Browser gespeichert und optional auf unseren gesicherten Servern (nur wenn Sie einen Magic Link anfordern). Wir verkaufen Ihre Daten niemals.' },
    { question: 'Kann ich meinen Lebenslauf später ändern?',
      answer: 'Selbstverständlich. Sie können Ihren Lebenslauf so oft ändern, wie Sie möchten. Mit einem Magic Link auch geräteübergreifend.' },
    { question: 'In welchem Format bekomme ich meinen Lebenslauf?',
      answer: 'Sie erhalten ein hochwertiges PDF (text-selektierbar, ATS-tauglich) oder ein Word-Dokument. Beide im A4-Format, ideal für digitale Bewerbungen und Druck.' },
    { question: 'Kann ich mehrere Lebensläufe erstellen?',
      answer: 'Ja. Mit einem Konto speichern Sie mehrere Lebensläufe und wechseln zwischen Versionen für unterschiedliche Stellen.' },
  ],
  sv: [
    { question: 'Hur fungerar Magic Link?',
      answer: 'När du anger din e-post skickar vi en speciell länk. Klicka på den för att fortsätta där du slutade — inget lösenord behövs.' },
    { question: 'Vad är ATS och varför är det viktigt?',
      answer: 'ATS står för Applicant Tracking System — mjukvara som arbetsgivare använder för att automatiskt scanna och filtrera CV. Våra mallar är formaterade så att dessa system läser dem korrekt.' },
    { question: 'Måste jag skapa ett konto?',
      answer: 'Nej. Du kan börja direkt. Vill du fortsätta senare? Begär en gratis magic link och fortsätt exakt där du var.' },
    { question: 'Är det verkligen gratis att bygga?',
      answer: 'Ja — det är helt gratis att bygga. Du betalar bara 449 kr en gång när du laddar ner (efter leverans). Inget abonnemang, inga dolda avgifter.' },
    { question: 'Lagras mina data säkert?',
      answer: 'Dina data lagras lokalt i webbläsaren och valfritt på våra säkra servrar (endast om du begär en magic link). Vi säljer aldrig dina data.' },
    { question: 'Kan jag redigera mitt CV senare?',
      answer: 'Absolut. Du kan uppdatera CV:t hur ofta du vill. Med en magic link kan du även fortsätta på en annan enhet.' },
    { question: 'I vilket format får jag mitt CV?',
      answer: 'Du får en högkvalitativ PDF (markeringsbar text, ATS-redo) eller ett Word-dokument. Båda i A4-format, perfekt både digitalt och tryckt.' },
    { question: 'Kan jag skapa flera CV?',
      answer: 'Ja. Med ett konto kan du spara flera CV och växla mellan versioner anpassade för olika roller.' },
  ],
  da: [
    { question: 'Hvordan virker Magic Link?',
      answer: 'Når du indtaster din e-mail, sender vi dig et særligt link. Klik på det for at fortsætte, hvor du slap — uden adgangskode.' },
    { question: 'Hvad er et ATS og hvorfor er det vigtigt?',
      answer: 'ATS står for Applicant Tracking System — software som arbejdsgivere bruger til at scanne og filtrere CV\'er automatisk. Vores skabeloner er formateret, så disse systemer læser dem korrekt.' },
    { question: 'Skal jeg oprette en konto?',
      answer: 'Nej. Du kan starte med det samme. Vil du fortsætte senere? Få et gratis magic link og fortsæt præcis hvor du slap.' },
    { question: 'Er det virkelig gratis at bygge?',
      answer: 'Ja — det er helt gratis at bygge. Du betaler kun 315 kr én gang når du downloader (efter levering). Intet abonnement, ingen skjulte gebyrer.' },
    { question: 'Bliver mine data opbevaret sikkert?',
      answer: 'Dine data gemmes lokalt i din browser og valgfrit på vores sikre servere (kun hvis du beder om et magic link). Vi sælger aldrig dine data.' },
    { question: 'Kan jeg redigere mit CV senere?',
      answer: 'Selvfølgelig. Du kan opdatere dit CV så ofte du vil. Med et magic link kan du også fortsætte på en anden enhed.' },
    { question: 'I hvilket format får jeg mit CV?',
      answer: 'Du får en CV i høj kvalitet som PDF (markerbar tekst, ATS-klar) eller Word-dokument. Begge i A4-format, perfekt til både digitale ansøgninger og print.' },
    { question: 'Kan jeg lave flere CV\'er?',
      answer: 'Ja. Med en konto kan du gemme flere CV\'er og skifte mellem versioner skræddersyet til forskellige stillinger.' },
  ],
};

export function FAQ() {
  const t = useTranslations('FAQLanding');
  const tHeader = useTranslations('Header');
  const locale = useLocale() as Locale;
  const faqs = FAQS_BY_LOCALE[locale] ?? FAQS_BY_LOCALE.nl;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('subtitle')}
          </p>
        </div>

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

        <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            {t('ctaTitle')}
          </h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link href="/builder">
            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-white !text-emerald-600 !border-white hover:bg-emerald-50 hover:!border-emerald-50"
            >
              {tHeader('ctaPrimary')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
