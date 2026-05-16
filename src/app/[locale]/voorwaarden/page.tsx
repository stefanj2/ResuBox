'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import {
  ArrowLeft,
  FileText,
  Users,
  CheckCircle,
  CreditCard,
  RotateCcw,
  Shield,
  Scale,
  Database,
  AlertTriangle,
  Cloud,
  MessageCircle,
  Gavel,
  Mail,
} from 'lucide-react';
import { Header, Footer } from '@/components/landing';
import { Link } from '@/i18n/navigation';

type SectionDef = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: React.ReactElement;
};

const SUPPORT_EMAIL = 'info@resubox.com';

const nlSections: SectionDef[] = [
  {
    id: 'definities',
    icon: FileText,
    title: 'Artikel 1 - Definities',
    content: (
      <>
        <p className="text-slate-600 mb-4">In deze algemene voorwaarden wordt verstaan onder:</p>
        <div className="space-y-3">
          {[
            { term: 'ResuBox', def: 'de aanbieder van de online CV builder dienst.' },
            { term: 'Gebruiker', def: 'de natuurlijke persoon die gebruik maakt van de diensten van ResuBox.' },
            { term: 'Dienst', def: 'de online CV builder applicatie waarmee gebruikers een curriculum vitae kunnen ontwerpen en downloaden.' },
            { term: 'Overeenkomst', def: 'de overeenkomst tussen ResuBox en de Gebruiker voor het leveren van de Dienst.' },
            { term: 'CV', def: 'het curriculum vitae dat door de Gebruiker wordt gemaakt met behulp van de Dienst.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 bg-slate-50 rounded-lg p-3">
              <span className="font-semibold text-emerald-600 whitespace-nowrap">{item.term}:</span>
              <span className="text-slate-600">{item.def}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'toepasselijkheid',
    icon: CheckCircle,
    title: 'Artikel 2 - Toepasselijkheid',
    content: (
      <ul className="space-y-3">
        {[
          'Deze algemene voorwaarden zijn van toepassing op elk aanbod van ResuBox en op elke tot stand gekomen overeenkomst tussen ResuBox en de Gebruiker.',
          'Door gebruik te maken van de Dienst gaat de Gebruiker akkoord met deze algemene voorwaarden.',
          'ResuBox behoudt zich het recht voor deze voorwaarden te wijzigen. Wijzigingen treden in werking na publicatie op de website.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'aanbod',
    icon: Users,
    title: 'Artikel 3 - Het Aanbod',
    content: (
      <>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mb-4 border border-emerald-100">
          <p className="text-emerald-800 font-medium">
            Het ontwerpen en aanpassen van het CV is gratis. Voor het downloaden van het CV als PDF wordt een eenmalige vergoeding gevraagd van €42,00 inclusief BTW.
          </p>
        </div>
        <ul className="space-y-3">
          {[
            'ResuBox biedt een online CV builder waarmee gebruikers kosteloos een CV kunnen ontwerpen en bewerken.',
            'Het ontwerpen en aanpassen van het CV is gratis. Voor het downloaden van het CV als PDF wordt een eenmalige vergoeding gevraagd.',
            'De actuele prijs voor het downloaden van een CV bedraagt €42,00 inclusief BTW, tenzij anders vermeld op de website.',
            'ResuBox behoudt zich het recht voor om prijzen te wijzigen. Prijswijzigingen hebben geen effect op reeds gedownloade CV\'s.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'overeenkomst',
    icon: Scale,
    title: 'Artikel 4 - De Overeenkomst',
    content: (
      <ul className="space-y-3">
        {[
          'De overeenkomst komt tot stand op het moment dat de Gebruiker een CV downloadt en daarmee akkoord gaat met betaling via factuur.',
          'ResuBox bevestigt de overeenkomst door het verzenden van het CV en een factuur naar het opgegeven e-mailadres.',
          'De Gebruiker garandeert dat de door hem/haar verstrekte gegevens correct en volledig zijn.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'betaling',
    icon: CreditCard,
    title: 'Artikel 5 - Betaling',
    content: (
      <>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">14 dagen</div>
            <div className="text-sm text-slate-600">Betalingstermijn na factuurdatum</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">iDEAL & kaart</div>
            <div className="text-sm text-slate-600">Beschikbare betaalmethoden</div>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            'Betaling geschiedt via factuur achteraf. De Gebruiker ontvangt na het downloaden van het CV een factuur per e-mail.',
            'De betalingstermijn bedraagt 14 dagen na factuurdatum.',
            'Betaling kan geschieden via de op de factuur vermelde betaalmethoden, waaronder iDEAL en bankoverschrijving.',
            'Bij niet-tijdige betaling is de Gebruiker van rechtswege in verzuim. ResuBox kan dan wettelijke rente en incassokosten in rekening brengen.',
            'Bij betalingsachterstand behoudt ResuBox zich het recht voor de vordering over te dragen aan een incassobureau.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'herroeping',
    icon: RotateCcw,
    title: 'Artikel 6 - Herroepingsrecht',
    content: (
      <>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Let op:</strong> Omdat het CV direct na aankoop digitaal wordt geleverd en de Gebruiker hiermee instemt, vervalt het herroepingsrecht zodra het CV is gedownload.
            </p>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            'Omdat het CV direct na aankoop digitaal wordt geleverd en de Gebruiker hiermee instemt, vervalt het herroepingsrecht zodra het CV is gedownload.',
            'De Gebruiker kan voor het downloaden onbeperkt wijzigingen aanbrengen aan het CV om tot een gewenst resultaat te komen.',
            'Door te klikken op de downloadknop en akkoord te gaan met de voorwaarden, stemt de Gebruiker in met directe levering en ziet af van het herroepingsrecht.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'gebruik',
    icon: Shield,
    title: 'Artikel 7 - Gebruik van de Dienst',
    content: (
      <>
        <ul className="space-y-3 mb-4">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">1.</span>
            <span className="text-slate-600">De Gebruiker mag de Dienst uitsluitend gebruiken voor het maken van CV&apos;s voor persoonlijke sollicitatiedoeleinden.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">2.</span>
            <span className="text-slate-600">Het is niet toegestaan om:</span>
          </li>
        </ul>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 ml-6 mb-4">
          <ul className="space-y-2 text-sm text-red-800">
            {[
              'De Dienst te gebruiken voor illegale doeleinden',
              'Valse of misleidende informatie in het CV op te nemen',
              'De Dienst te reproduceren, kopiëren of door te verkopen',
              'Pogingen te doen om de beveiliging van de Dienst te omzeilen',
            ].map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">3.</span>
            <span className="text-slate-600">ResuBox behoudt zich het recht voor toegang tot de Dienst te weigeren bij misbruik.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'eigendom',
    icon: Gavel,
    title: 'Artikel 8 - Intellectueel Eigendom',
    content: (
      <ul className="space-y-3">
        {[
          'Alle intellectuele eigendomsrechten op de Dienst, inclusief de software, templates en ontwerpen, berusten bij ResuBox.',
          'De Gebruiker verkrijgt na betaling een persoonlijk, niet-overdraagbaar gebruiksrecht op het door hem/haar gemaakte CV.',
          'De inhoud van het CV (teksten, gegevens) blijft eigendom van de Gebruiker.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'gegevensopslag',
    icon: Database,
    title: 'Artikel 9 - Gegevensopslag',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">CV-gegevens worden primair lokaal in de browser van de Gebruiker opgeslagen.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">Wanneer de Gebruiker een magic link aanvraagt, worden gegevens ook op de servers van ResuBox opgeslagen om toegang vanaf andere apparaten mogelijk te maken.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">3.</span>
          <span className="text-slate-600">ResuBox verwerkt persoonsgegevens conform het <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">Privacybeleid</Link> en de Algemene Verordening Gegevensbescherming (AVG).</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'aansprakelijkheid',
    icon: AlertTriangle,
    title: 'Artikel 10 - Aansprakelijkheid',
    content: (
      <>
        <ul className="space-y-3 mb-4">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">1.</span>
            <span className="text-slate-600">ResuBox spant zich in om de Dienst naar behoren te laten functioneren, maar garandeert geen ononderbroken beschikbaarheid.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">2.</span>
            <span className="text-slate-600">ResuBox is niet aansprakelijk voor:</span>
          </li>
        </ul>
        <div className="bg-slate-50 rounded-xl p-4 ml-6 mb-4 border border-slate-200">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Schade als gevolg van onjuiste of onvolledige informatie in het CV</li>
            <li>• Schade door het niet verkrijgen van een baan of sollicitatiegesprek</li>
            <li>• Indirecte schade, gevolgschade of gederfde winst</li>
            <li>• Verlies van gegevens door technische storingen aan de zijde van de Gebruiker</li>
          </ul>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">3.</span>
            <span className="text-slate-600">De aansprakelijkheid van ResuBox is in alle gevallen beperkt tot het bedrag dat de Gebruiker heeft betaald voor de Dienst.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'overmacht',
    icon: Cloud,
    title: 'Artikel 11 - Overmacht',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">ResuBox is niet gehouden tot nakoming van enige verplichting indien dit onmogelijk is door overmacht.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">Onder overmacht wordt onder meer verstaan: stroomstoringen, internetstoringen, cyberaanvallen, natuurrampen, pandemieën, en overheidsmaatregelen.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'klachten',
    icon: MessageCircle,
    title: 'Artikel 12 - Klachten',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">Klachten over de Dienst kunnen worden ingediend via <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{SUPPORT_EMAIL}</a>.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">ResuBox streeft ernaar klachten binnen 14 dagen te behandelen.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">3.</span>
          <span className="text-slate-600">Bij geschillen kan de Gebruiker zich wenden tot de bevoegde rechter of het ODR-platform van de Europese Commissie: <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">ec.europa.eu/odr</a>.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'recht',
    icon: Gavel,
    title: 'Artikel 13 - Toepasselijk Recht',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">Op deze algemene voorwaarden en alle overeenkomsten is Nederlands recht van toepassing.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Artikel 14 - Contact',
    content: (
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <p className="text-slate-600 mb-4">Voor vragen over deze algemene voorwaarden kunt u contact opnemen met:</p>
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">ResuBox</p>
          <p className="text-slate-600">
            E-mail: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{SUPPORT_EMAIL}</a>
          </p>
        </div>
      </div>
    ),
  },
];

const enSections: SectionDef[] = [
  {
    id: 'definities',
    icon: FileText,
    title: 'Article 1 — Definitions',
    content: (
      <>
        <p className="text-slate-600 mb-4">In these terms and conditions the following words shall have the following meaning:</p>
        <div className="space-y-3">
          {[
            { term: 'ResuBox', def: 'the provider of the online CV builder service.' },
            { term: 'User', def: 'the natural person making use of ResuBox\'s services.' },
            { term: 'Service', def: 'the online CV builder application enabling users to design and download a curriculum vitae.' },
            { term: 'Agreement', def: 'the agreement between ResuBox and the User for the provision of the Service.' },
            { term: 'CV', def: 'the curriculum vitae created by the User using the Service.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 bg-slate-50 rounded-lg p-3">
              <span className="font-semibold text-emerald-600 whitespace-nowrap">{item.term}:</span>
              <span className="text-slate-600">{item.def}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'toepasselijkheid',
    icon: CheckCircle,
    title: 'Article 2 — Applicability',
    content: (
      <ul className="space-y-3">
        {[
          'These terms and conditions apply to every offer made by ResuBox and to every agreement concluded between ResuBox and the User.',
          'By using the Service the User agrees to these terms and conditions.',
          'ResuBox reserves the right to amend these terms. Amendments take effect upon publication on the website.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'aanbod',
    icon: Users,
    title: 'Article 3 — The Offer',
    content: (
      <>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mb-4 border border-emerald-100">
          <p className="text-emerald-800 font-medium">
            Designing and editing the CV is free. A one-off fee of £42.00 (incl. VAT) is charged when downloading the CV as a PDF.
          </p>
        </div>
        <ul className="space-y-3">
          {[
            'ResuBox offers an online CV builder which allows users to design and edit a CV free of charge.',
            'Designing and editing the CV is free. A one-off fee is charged when downloading the CV as a PDF.',
            'The current price for downloading a CV is £42.00 (incl. VAT), unless stated otherwise on the website.',
            'ResuBox reserves the right to change prices. Price changes do not affect CVs that have already been downloaded.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'overeenkomst',
    icon: Scale,
    title: 'Article 4 — The Agreement',
    content: (
      <ul className="space-y-3">
        {[
          'The agreement is concluded at the moment the User downloads a CV and thereby agrees to pay by invoice.',
          'ResuBox confirms the agreement by sending the CV and an invoice to the email address provided.',
          'The User warrants that the information provided is accurate and complete.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'betaling',
    icon: CreditCard,
    title: 'Article 5 — Payment',
    content: (
      <>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">14 days</div>
            <div className="text-sm text-slate-600">Payment term from invoice date</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">Card &amp; bank</div>
            <div className="text-sm text-slate-600">Available payment methods</div>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            'Payment is made by post-pay invoice. After downloading the CV the User receives an invoice by email.',
            'The payment term is 14 days from the invoice date.',
            'Payment can be made using the methods stated on the invoice, including card and bank transfer.',
            'On late payment the User is in default by operation of law. ResuBox may then charge statutory interest and collection costs.',
            'On payment arrears ResuBox reserves the right to transfer the claim to a collection agency.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'herroeping',
    icon: RotateCcw,
    title: 'Article 6 — Right of Withdrawal',
    content: (
      <>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Please note:</strong> because the CV is delivered digitally immediately after purchase and the User consents to this, the right of withdrawal lapses as soon as the CV is downloaded.
            </p>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            'Because the CV is delivered digitally immediately after purchase and the User consents to this, the right of withdrawal lapses as soon as the CV is downloaded.',
            'Before downloading, the User may make unlimited changes to the CV to reach the desired result.',
            'By clicking the download button and agreeing to the terms, the User consents to immediate delivery and waives the right of withdrawal.',
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-500 font-bold">{i + 1}.</span>
              <span className="text-slate-600">{t}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'gebruik',
    icon: Shield,
    title: 'Article 7 — Use of the Service',
    content: (
      <>
        <ul className="space-y-3 mb-4">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">1.</span>
            <span className="text-slate-600">The User may only use the Service for creating CVs for personal job-application purposes.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">2.</span>
            <span className="text-slate-600">It is not permitted to:</span>
          </li>
        </ul>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 ml-6 mb-4">
          <ul className="space-y-2 text-sm text-red-800">
            {[
              'Use the Service for unlawful purposes',
              'Include false or misleading information in the CV',
              'Reproduce, copy or resell the Service',
              'Attempt to bypass the Service\'s security',
            ].map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">3.</span>
            <span className="text-slate-600">ResuBox reserves the right to refuse access to the Service in case of misuse.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'eigendom',
    icon: Gavel,
    title: 'Article 8 — Intellectual Property',
    content: (
      <ul className="space-y-3">
        {[
          'All intellectual property rights in the Service, including the software, templates and designs, belong to ResuBox.',
          'After payment the User obtains a personal, non-transferable right to use the CV they have created.',
          'The content of the CV (text, data) remains the property of the User.',
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-emerald-500 font-bold">{i + 1}.</span>
            <span className="text-slate-600">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'gegevensopslag',
    icon: Database,
    title: 'Article 9 — Data Storage',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">CV data is primarily stored locally in the User&apos;s browser.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">When the User requests a magic link, data is also stored on ResuBox&apos;s servers to allow access from other devices.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">3.</span>
          <span className="text-slate-600">ResuBox processes personal data in accordance with the <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</Link> and the General Data Protection Regulation (GDPR).</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'aansprakelijkheid',
    icon: AlertTriangle,
    title: 'Article 10 — Liability',
    content: (
      <>
        <ul className="space-y-3 mb-4">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">1.</span>
            <span className="text-slate-600">ResuBox uses reasonable efforts to keep the Service running but does not guarantee uninterrupted availability.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">2.</span>
            <span className="text-slate-600">ResuBox is not liable for:</span>
          </li>
        </ul>
        <div className="bg-slate-50 rounded-xl p-4 ml-6 mb-4 border border-slate-200">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Damage resulting from incorrect or incomplete information in the CV</li>
            <li>• Damage from not obtaining a job or interview</li>
            <li>• Indirect damage, consequential loss or lost profits</li>
            <li>• Data loss caused by technical failures on the User&apos;s side</li>
          </ul>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">3.</span>
            <span className="text-slate-600">In all cases ResuBox&apos;s liability is limited to the amount the User has paid for the Service.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'overmacht',
    icon: Cloud,
    title: 'Article 11 — Force Majeure',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">ResuBox is not obliged to perform any obligation if performance is impossible due to force majeure.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">Force majeure includes power outages, internet outages, cyber-attacks, natural disasters, pandemics and government measures.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'klachten',
    icon: MessageCircle,
    title: 'Article 12 — Complaints',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">Complaints about the Service can be submitted to <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{SUPPORT_EMAIL}</a>.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">ResuBox aims to handle complaints within 14 days.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">3.</span>
          <span className="text-slate-600">For disputes the User may turn to the competent court or the ODR platform of the European Commission: <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">ec.europa.eu/odr</a>.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'recht',
    icon: Gavel,
    title: 'Article 13 — Governing Law',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">1.</span>
          <span className="text-slate-600">These terms and conditions and all agreements are governed by Dutch law.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-emerald-500 font-bold">2.</span>
          <span className="text-slate-600">Disputes will be submitted to the competent court in the Netherlands.</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Article 14 — Contact',
    content: (
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <p className="text-slate-600 mb-4">For questions about these terms and conditions please contact:</p>
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">ResuBox</p>
          <p className="text-slate-600">
            Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{SUPPORT_EMAIL}</a>
          </p>
        </div>
      </div>
    ),
  },
];

const COPY = {
  nl: {
    backHome: 'Terug naar home',
    pageTitle: 'Algemene Voorwaarden',
    lastUpdated: 'Laatst bijgewerkt',
    intro: 'Lees hieronder de voorwaarden die van toepassing zijn op het gebruik van ResuBox. Door onze dienst te gebruiken, ga je akkoord met deze voorwaarden.',
    goTo: 'Ga naar:',
    articleLabel: 'Artikel',
    ctaTitle: 'Vragen over onze voorwaarden?',
    ctaSubtitle: 'Neem gerust contact met ons op als je vragen hebt over deze algemene voorwaarden.',
    contactButton: 'Neem contact op',
    sections: nlSections,
    dateLocale: 'nl-NL',
  },
  en: {
    backHome: 'Back to home',
    pageTitle: 'Terms & Conditions',
    lastUpdated: 'Last updated',
    intro: 'Below are the terms that apply when using ResuBox. By using our service you agree to these terms.',
    goTo: 'Jump to:',
    articleLabel: 'Article',
    ctaTitle: 'Questions about our terms?',
    ctaSubtitle: 'Feel free to get in touch if you have any questions about these terms and conditions.',
    contactButton: 'Contact us',
    sections: enSections,
    dateLocale: 'en-GB',
  },
} as const;

export default function VoorwaardenPage() {
  const locale = useLocale();
  const copy = locale === 'nl' ? COPY.nl : COPY.en;
  const sections = copy.sections;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
            {copy.backHome}
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                {copy.pageTitle}
              </h1>
              <p className="text-slate-400 mt-1">
                {copy.lastUpdated}: {new Date().toLocaleDateString(copy.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="py-8 bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <span className="text-sm text-slate-500 whitespace-nowrap">{copy.goTo}</span>
            {sections.slice(0, 6).map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-600 bg-white rounded-full border border-slate-200 hover:border-emerald-300 transition-colors whitespace-nowrap"
              >
                {section.title.split(/[—-]/)[1]?.trim() ?? section.title}
              </a>
            ))}
            <span className="text-slate-300">...</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
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
                      <div>
                        <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                          {copy.articleLabel} {index + 1}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900">
                          {section.title.split(/[—-]/)[1]?.trim() ?? section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="pl-0 sm:pl-16">
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {copy.ctaTitle}
            </h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              {copy.ctaSubtitle}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {copy.contactButton}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
