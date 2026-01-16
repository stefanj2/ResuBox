'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  User,
  FileText,
  Database,
  Clock,
  Users,
  Cookie,
  Key,
  Lock,
  Baby,
  Globe,
  RefreshCw,
  MessageCircle,
  Mail,
  Check,
  X
} from 'lucide-react';
import { Header, Footer } from '@/components/landing';

const sections = [
  {
    id: 'wie-zijn-wij',
    icon: User,
    title: '1. Wie zijn wij?',
    content: (
      <>
        <p className="text-slate-600 mb-4">
          ResuBox is een online CV builder dienst waarmee je eenvoudig een professioneel CV kunt maken.
          Voor vragen over dit privacybeleid kun je contact opnemen via:
        </p>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
          <div className="space-y-2">
            <p className="font-semibold text-slate-900">ResuBox</p>
            <p className="text-slate-600">
              E-mail: <a href="mailto:info@resubox.nl" className="text-emerald-600 hover:text-emerald-700 underline">info@resubox.nl</a>
            </p>
            <p className="text-slate-600">
              Website: <a href="https://resubox.nl" className="text-emerald-600 hover:text-emerald-700 underline">resubox.nl</a>
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'welke-gegevens',
    icon: FileText,
    title: '2. Welke gegevens verzamelen wij?',
    content: (
      <>
        <p className="text-slate-600 mb-6">Wij verzamelen en verwerken de volgende categorieën persoonsgegevens:</p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              2.1 Gegevens die je zelf invoert in je CV
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Naam (voornaam, achternaam)',
                'E-mailadres en telefoonnummer',
                'Adres en woonplaats',
                'Geboortedatum en nationaliteit',
                'LinkedIn profiel en website',
                'Profielfoto (optioneel)',
                'Werkervaring en taken',
                'Opleiding en diploma\'s',
                'Vaardigheden',
                'Profielsamenvatting',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Key className="w-4 h-4 text-blue-600" />
              </div>
              2.2 Gegevens voor magic link functionaliteit
            </h4>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">E-mailadres</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">Unieke sessietoken</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              2.3 Facturatiegegevens
            </h4>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">Naam</span>
              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">E-mailadres</span>
              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">Betalingsgegevens</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-amber-600" />
              </div>
              2.4 Automatisch verzamelde gegevens
            </h4>
            <div className="flex flex-wrap gap-3">
              {['IP-adres', 'Browsertype', 'Apparaatgegevens', 'Tijdstip bezoek', 'Bezochte pagina\'s'].map((item, i) => (
                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'waarvoor',
    icon: Database,
    title: '3. Waarvoor gebruiken wij je gegevens?',
    content: (
      <>
        <p className="text-slate-600 mb-4">Wij verwerken je gegevens voor de volgende doeleinden:</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 bg-slate-50 rounded-tl-lg">Doel</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 bg-slate-50 rounded-tr-lg">Rechtsgrond (AVG)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { doel: 'Het genereren van je CV', grond: 'Uitvoering overeenkomst' },
                { doel: 'Het opslaan van je CV via magic link', grond: 'Uitvoering overeenkomst / Toestemming' },
                { doel: 'Het versturen van facturen', grond: 'Uitvoering overeenkomst / Wettelijke verplichting' },
                { doel: 'Klantenservice en communicatie', grond: 'Gerechtvaardigd belang' },
                { doel: 'Verbetering van onze dienst', grond: 'Gerechtvaardigd belang' },
                { doel: 'Voorkomen van fraude', grond: 'Gerechtvaardigd belang' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">{row.doel}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">{row.grond}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'waar-opgeslagen',
    icon: Database,
    title: '4. Waar worden je gegevens opgeslagen?',
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            4.1 Lokale opslag (browser)
          </h4>
          <p className="text-slate-600 text-sm">
            Standaard worden je CV-gegevens lokaal in je browser opgeslagen (localStorage).
            Deze gegevens verlaten je apparaat niet, tenzij je een magic link aanvraagt of je CV downloadt.
            Je kunt deze gegevens verwijderen door je browsergegevens te wissen.
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            4.2 Serveropslag
          </h4>
          <p className="text-slate-600 text-sm mb-3">
            Wanneer je een magic link aanvraagt of je CV downloadt, worden je gegevens opgeslagen op beveiligde servers:
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Lock, text: 'Versleutelde verbindingen (HTTPS/TLS)' },
              { icon: Shield, text: 'Beveiligde datacenters in de EU' },
              { icon: Key, text: 'Toegangsbeperking' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-sm text-emerald-700 bg-white rounded-lg p-2">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'bewaartermijn',
    icon: Clock,
    title: '5. Hoe lang bewaren wij je gegevens?',
    content: (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900 bg-slate-50 rounded-tl-lg">Type gegevens</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900 bg-slate-50 rounded-tr-lg">Bewaartermijn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { type: 'CV-gegevens (lokaal)', termijn: 'Tot je je browser wist' },
              { type: 'CV-gegevens (server, via magic link)', termijn: '1 jaar na laatste gebruik' },
              { type: 'Facturatiegegevens', termijn: '7 jaar (wettelijke bewaarplicht)' },
              { type: 'E-mailcorrespondentie', termijn: '2 jaar' },
              { type: 'Analytics gegevens', termijn: '26 maanden' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-600">{row.type}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">{row.termijn}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: 'delen',
    icon: Users,
    title: '6. Delen wij je gegevens met derden?',
    content: (
      <div className="space-y-6">
        <p className="text-slate-600">Wij delen je gegevens alleen met derden wanneer dit noodzakelijk is:</p>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-900 mb-3">6.1 Dienstverleners (verwerkers)</h4>
          <div className="space-y-2">
            {[
              { label: 'Hostingprovider', desc: 'voor het hosten van de website en opslag van gegevens' },
              { label: 'E-mailprovider', desc: 'voor het versturen van magic links en facturen' },
              { label: 'Betalingsprovider', desc: 'voor het verwerken van betalingen' },
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-medium text-slate-700 whitespace-nowrap">{item.label}:</span>
                <span className="text-slate-600">{item.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3 italic">Met al deze partijen hebben wij verwerkersovereenkomsten gesloten.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-900 mb-3">6.2 Wanneer wettelijk vereist</h4>
          <p className="text-slate-600 text-sm">Wij kunnen gegevens delen wanneer dit wettelijk verplicht is, bijvoorbeeld op verzoek van autoriteiten.</p>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
          <h4 className="font-semibold text-red-900 mb-3">6.3 Wat wij NIET doen</h4>
          <ul className="space-y-2">
            {[
              'Wij verkopen je gegevens nooit aan derden',
              'Wij gebruiken je gegevens niet voor commerciële doeleinden van derden',
              'Wij delen je CV-inhoud niet met werkgevers of recruiters',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-800">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: '7. Cookies',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600">Wij maken beperkt gebruik van cookies:</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900">7.1 Noodzakelijke cookies</h4>
            </div>
            <p className="text-slate-600 text-sm">
              Essentieel voor het functioneren van de website. Kunnen niet worden uitgeschakeld.
              Gebruikt voor sessiebeheer en beveiligingsdoeleinden.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900">7.2 Analytische cookies</h4>
            </div>
            <p className="text-slate-600 text-sm">
              Gebruikt om te begrijpen hoe bezoekers onze website gebruiken.
              Deze gegevens worden geanonimiseerd verwerkt.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-amber-800 text-sm">
            <strong>7.3 Cookie-instellingen:</strong> Je kunt cookies beheren via je browserinstellingen.
            Het uitschakelen van noodzakelijke cookies kan de functionaliteit van de website beperken.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'rechten',
    icon: Key,
    title: '8. Je rechten',
    content: (
      <>
        <p className="text-slate-600 mb-4">Onder de AVG heb je de volgende rechten:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: 'Recht op inzage', desc: 'Je kunt opvragen welke gegevens wij van je hebben.' },
            { title: 'Recht op rectificatie', desc: 'Je kunt onjuiste gegevens laten corrigeren.' },
            { title: 'Recht op verwijdering', desc: 'Je kunt vragen om verwijdering van je gegevens.' },
            { title: 'Recht op beperking', desc: 'Je kunt vragen om beperking van de verwerking.' },
            { title: 'Recht op overdraagbaarheid', desc: 'Je kunt je gegevens in een gestructureerd formaat ontvangen.' },
            { title: 'Recht van bezwaar', desc: 'Je kunt bezwaar maken tegen verwerking.' },
            { title: 'Toestemming intrekken', desc: 'Je kunt je toestemming altijd intrekken.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors">
              <h4 className="font-semibold text-emerald-700 mb-1">{item.title}</h4>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-emerald-800 text-sm">
            Om je rechten uit te oefenen, neem contact met ons op via <a href="mailto:info@resubox.nl" className="underline font-medium">info@resubox.nl</a>.
            Wij reageren binnen 30 dagen op je verzoek.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'beveiliging',
    icon: Lock,
    title: '9. Beveiliging',
    content: (
      <>
        <p className="text-slate-600 mb-4">Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Lock, text: 'SSL/TLS-versleuteling' },
            { icon: Database, text: 'Versleutelde opslag' },
            { icon: RefreshCw, text: 'Regelmatige updates' },
            { icon: Key, text: 'Toegangsbeperking' },
            { icon: Database, text: 'Regelmatige back-ups' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-slate-700 font-medium text-sm">{item.text}</span>
              </div>
            );
          })}
        </div>
      </>
    ),
  },
  {
    id: 'minderjarigen',
    icon: Baby,
    title: '10. Minderjarigen',
    content: (
      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
        <p className="text-amber-800">
          Onze dienst is primair bedoeld voor personen van <strong>16 jaar en ouder</strong>.
          Wij verzamelen niet bewust gegevens van kinderen jonger dan 16 jaar.
          Als je ouder of voogd bent en ontdekt dat je kind gegevens heeft verstrekt,
          neem dan contact met ons op.
        </p>
      </div>
    ),
  },
  {
    id: 'internationaal',
    icon: Globe,
    title: '11. Internationale doorgifte',
    content: (
      <p className="text-slate-600">
        Wij streven ernaar je gegevens binnen de <strong>Europese Economische Ruimte (EER)</strong> te verwerken.
        Indien gegevens buiten de EER worden verwerkt, zorgen wij voor passende waarborgen
        conform de AVG, zoals standaardcontractbepalingen (SCC's).
      </p>
    ),
  },
  {
    id: 'wijzigingen',
    icon: RefreshCw,
    title: '12. Wijzigingen',
    content: (
      <p className="text-slate-600">
        Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. Wijzigingen worden op deze pagina gepubliceerd.
        Bij significante wijzigingen informeren wij je via e-mail (indien beschikbaar) of via een melding op de website.
      </p>
    ),
  },
  {
    id: 'klachten',
    icon: MessageCircle,
    title: '13. Klachten',
    content: (
      <div className="space-y-4">
        <p className="text-slate-600">
          Als je een klacht hebt over de verwerking van je persoonsgegevens, horen we dit graag.
          Neem contact met ons op via <a href="mailto:info@resubox.nl" className="text-emerald-600 hover:text-emerald-700 underline">info@resubox.nl</a>.
        </p>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <p className="text-slate-600 mb-3">Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens:</p>
          <div className="space-y-2">
            <p className="text-slate-700">
              <strong>Website:</strong>{' '}
              <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">
                autoriteitpersoonsgegevens.nl
              </a>
            </p>
            <p className="text-slate-700">
              <strong>Telefoon:</strong> 088 - 1805 250
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: '14. Contact',
    content: (
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <p className="text-slate-600 mb-4">Voor vragen over dit privacybeleid of de verwerking van je gegevens:</p>
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">ResuBox</p>
          <p className="text-slate-600">
            E-mail: <a href="mailto:info@resubox.nl" className="text-emerald-600 hover:text-emerald-700 underline">info@resubox.nl</a>
          </p>
          <p className="text-slate-600">
            Website: <a href="https://resubox.nl" className="text-emerald-600 hover:text-emerald-700 underline">resubox.nl</a>
          </p>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Privacybeleid
              </h1>
              <p className="text-slate-400 mt-1">
                Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            ResuBox hecht veel waarde aan de bescherming van je persoonsgegevens.
            In dit privacybeleid leggen we uit welke gegevens we verzamelen, waarom we dit doen,
            en hoe we je privacy beschermen conform de AVG/GDPR.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <span className="text-sm text-slate-500 whitespace-nowrap">Ga naar:</span>
            {['Gegevens', 'Doel', 'Opslag', 'Delen', 'Cookies', 'Rechten'].map((item, i) => (
              <a
                key={i}
                href={`#${['welke-gegevens', 'waarvoor', 'waar-opgeslagen', 'delen', 'cookies', 'rechten'][i]}`}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-600 bg-white rounded-full border border-slate-200 hover:border-emerald-300 transition-colors whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-2">
                        {section.title}
                      </h2>
                    </div>

                    <div className="pl-0 sm:pl-16">
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Vragen over je privacy?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              Neem gerust contact met ons op als je vragen hebt over hoe wij met je gegevens omgaan.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Neem contact op
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
