import { CVOrder } from '@/types/admin';
import { localizedPath, type Locale } from '@/i18n/routing';

// ─── Config ────────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resubox.com';
const BRAND_NAME = 'ResuBox';
const CONTACT_EMAIL = 'info@resubox.com';
const LOGO_URL = `${SITE_URL}/resubox-logo.jpeg`;

// ─── Locale-aware strings ─────────────────────────────────────────────────
// Locale type is imported from i18n/routing

interface EmailStrings {
  greetingInformal: (firstName: string) => string;
  greetingFormal: (firstName: string, lastName: string) => string;
  closingFriendly: string;
  closingFormal: string;
  teamLabel: string;
  privacyPolicy: string;
  terms: string;
  // Common labels
  dossierNumber: string;
  description: string;
  cvDownloadDesc: string;
  outstandingAmount: string;
  total: string;
  invoiceNumber: string;
  exclVat: string;
  vatPercent: string; // e.g. "VAT (21%)" or "" if not applicable
  paymentTerm: string; // "Payment within 14 days"
  paymentTermSubtle: string; // "Payment term: 14 days from invoice date"
  questionsContact: (email: string) => string;
  // Email 1 — Confirmation
  confirmSubject: (dossier: string) => string;
  confirmPreheader: (dossier: string) => string;
  confirmTitle: string;
  confirmBody1: string;
  confirmStatus: string;
  confirmStatusValue: string;
  confirmWhatNext: string;
  confirmNext1: string;
  confirmNext2: string;
  confirmNext3: string;
  // Email 2 — Invoice
  invoiceSubject: (dossier: string, amount: string) => string;
  invoicePreheader: (dossier: string, amount: string) => string;
  invoiceTitle: string;
  invoiceIntro: string;
  invoicePayCta: (amount: string) => string;
  invoicePaySafely: string;
  // Email 3 — Reminder 1 (friendly)
  rem1Subject: (dossier: string) => string;
  rem1Preheader: (dossier: string, amount: string) => string;
  rem1Title: string;
  rem1Body1: string;
  rem1Body2: string;
  rem1AlreadyPaid: string;
  rem1Cta: (amount: string) => string;
  // Email 4 — Reminder 2 (firmer nudge + SMS, T+7d)
  rem2Subject: (dossier: string) => string;
  rem2Preheader: (dossier: string, amount: string) => string;
  rem2Title: string;
  rem2Body1: string;
  rem2Body2: string;
  rem2Cta: (amount: string) => string;
  rem2AlreadyPaid: string;
  rem2SmsNotice: string;
  // Email 5 — Reminder 3 (pre-aanmaning, T+10d)
  rem3Subject: (dossier: string) => string;
  rem3Preheader: (dossier: string) => string;
  rem3Title: (dossier: string) => string;
  rem3Body1: (dossier: string) => string;
  rem3Body2: string;
  rem3ConsequencesTitle: string;
  rem3ConsequencesBody: string;
  rem3Cta: (amount: string) => string;
  rem3AlreadyPaid: string;
  // Email 6 — WIK formal aanmaning (T+14d)
  wikSubject: (dossier: string) => string;
  wikPreheader: (dossier: string) => string;
  wikTitle: (dossier: string) => string;
  wikBody1: (dossier: string) => string;
  wikBody2: string;
  wikConsequencesTitle: string;
  wikConsequencesBody: string;
  wikCta: (amount: string) => string;
  wikAlreadyPaid: string;
  // Email 7 — Incasso transfer
  incSubject: (dossier: string) => string;
  incPreheader: (dossier: string) => string;
  incTitle: string;
  incBody1: (dossier: string) => string;
  incOverview: string;
  incOurDossier: string;
  incJustusCase: string;
  incOwed: string;
  incCanStillPay: string;
  incCta: (amount: string) => string;
  // Email 8 — Payment received
  paidSubject: (dossier: string) => string;
  paidPreheader: (dossier: string) => string;
  paidTitle: string;
  paidIntro: string;
  paidConfirmedLabel: string;
  paidPaidLabel: string;
  paidClosing: string;
  paidMakeAnother: string;
}

const STRINGS: Record<Locale, EmailStrings> = {
  nl: {
    greetingInformal: (n) => `Beste ${n},`,
    greetingFormal: (f, l) => `Geachte ${f} ${l},`,
    closingFriendly: 'Met vriendelijke groet,',
    closingFormal: 'Hoogachtend,',
    teamLabel: 'Team',
    privacyPolicy: 'Privacybeleid',
    terms: 'Algemene voorwaarden',
    dossierNumber: 'Dossiernummer',
    description: 'Omschrijving',
    cvDownloadDesc: 'CV download via ResuBox',
    outstandingAmount: 'Openstaand bedrag',
    total: 'Totaal',
    invoiceNumber: 'Factuurnummer',
    exclVat: 'Excl. BTW',
    vatPercent: 'BTW (21%)',
    paymentTerm: 'Betaaltermijn 14 dagen',
    paymentTermSubtle: 'Betaaltermijn: 14 dagen na factuurdatum',
    questionsContact: (e) => `Vragen? Stuur een e-mail naar <a href="mailto:${e}" style="color: #059669;">${e}</a>.`,
    confirmSubject: (d) => `✓ Je CV is klaar — dossiernummer ${d}`,
    confirmPreheader: (d) => `Je CV is klaar — dossiernummer ${d}`,
    confirmTitle: 'Je CV is succesvol aangemaakt ✓',
    confirmBody1: 'Goed nieuws! Je CV is succesvol opgemaakt en gedownload via ResuBox.',
    confirmStatus: 'Status',
    confirmStatusValue: 'CV succesvol gedownload',
    confirmWhatNext: 'Wat gebeurt er nu?',
    confirmNext1: 'Je ontvangt binnenkort een factuur per e-mail',
    confirmNext2: 'Betaal eenvoudig — betaaltermijn 14 dagen',
    confirmNext3: 'Na betaling is je dossier volledig afgerond',
    invoiceSubject: (d, a) => `Factuur ${d} — ${a} — ${BRAND_NAME}`,
    invoicePreheader: (d, a) => `Factuur ${d} — ${a} — betaaltermijn 14 dagen`,
    invoiceTitle: 'Factuur voor je CV download',
    invoiceIntro: `Bedankt voor het gebruiken van ${BRAND_NAME}. Hierbij ontvang je de factuur voor je CV download.`,
    invoicePayCta: (a) => `Betaal nu ${a}`,
    invoicePaySafely: 'Betaal eenvoudig en veilig:',
    rem1Subject: (d) => `Herinnering: dossier ${d} — betaling nog openstaand`,
    rem1Preheader: (d, a) => `Herinnering: openstaande factuur ${d} — ${a}`,
    rem1Title: 'Herinnering: openstaande factuur',
    rem1Body1: 'Wij hebben nog geen betaling ontvangen voor onderstaande factuur. Mogelijk is dit aan uw aandacht ontsnapt.',
    rem1Body2: 'Wij verzoeken u vriendelijk het openstaande bedrag te voldoen om verdere stappen te voorkomen.',
    rem1AlreadyPaid: 'Heeft u al betaald? Dan kunt u dit bericht als niet verzonden beschouwen.',
    rem1Cta: (a) => `Betaal nu ${a}`,
    rem2Subject: (d) => `Tweede herinnering: dossier ${d} — betaling is 7 dagen te laat`,
    rem2Preheader: (d, a) => `Tweede herinnering dossier ${d} — ${a} — betaal deze week`,
    rem2Title: 'Tweede herinnering: betaling is 7 dagen te laat',
    rem2Body1: 'Je betaling voor onderstaand dossier is inmiddels al meer dan 7 dagen over de afgesproken termijn. We sturen je daarom nogmaals een vriendelijke herinnering — en voor de zekerheid ook een sms naar je telefoon.',
    rem2Body2: 'Wij verzoeken je het openstaande bedrag <strong>deze week</strong> te voldoen. Dit is onze laatste vriendelijke herinnering voordat wij overgaan tot een formele aanmaning.',
    rem2SmsNotice: 'We hebben deze herinnering ook per sms verstuurd, zodat het bericht je zeker bereikt.',
    rem2AlreadyPaid: 'Heb je al betaald? Dan kun je dit bericht negeren — het kan zijn dat onze administratie en jouw betaling elkaar hebben gekruist.',
    rem2Cta: (a) => `Betaal nu ${a}`,
    rem3Subject: (d) => `Laatste waarschuwing: dossier ${d} — formele aanmaning op komst`,
    rem3Preheader: (d) => `Laatste waarschuwing dossier ${d} — voorkom €40 wettelijke incassokosten`,
    rem3Title: (d) => `Laatste waarschuwing dossier ${d}: aanmaning op komst`,
    rem3Body1: (d) => `Ondanks twee eerdere herinneringen en een sms hebben wij nog geen betaling ontvangen voor dossiernummer <strong>${d}</strong>. Dit is onze allerlaatste waarschuwing voordat wij overgaan tot de formele aanmaning conform de Wet Incassokosten (WIK).`,
    rem3Body2: 'Wij verzoeken u dringend om het openstaande bedrag <strong>per omgaande</strong> te voldoen om verdere escalatie te voorkomen.',
    rem3ConsequencesTitle: 'Wat gebeurt er als u nu niet betaalt',
    rem3ConsequencesBody: 'Indien wij binnen enkele dagen geen betaling ontvangen, ontvangt u een formele aanmaning (WIK-brief). Daarna geldt een wettelijke betaaltermijn van 14 dagen. Wordt deze termijn overschreden, dan dragen wij uw dossier over aan ons incassobureau (Justus Collect) en worden <strong>€40,00 wettelijke incassokosten</strong> in rekening gebracht, bovenop het reeds openstaande bedrag.',
    rem3Cta: (a) => `Betaal nu ${a}`,
    rem3AlreadyPaid: 'Heeft u al betaald? Dan kunt u deze waarschuwing als niet verzonden beschouwen — onze administratie en uw betaling kunnen elkaar hebben gekruist.',
    wikSubject: (d) => `Aanmaning: dossier ${d} — betaal binnen 14 dagen`,
    wikPreheader: (d) => `Aanmaning dossier ${d} — betaal binnen 14 dagen om incassokosten te voorkomen`,
    wikTitle: (d) => `Aanmaning: openstaande vordering dossier ${d}`,
    wikBody1: (d) => `Wij hebben geconstateerd dat ondanks ons eerdere betalingsverzoek het openstaande bedrag voor dossiernummer <strong>${d}</strong> tot op heden niet is voldaan.`,
    wikBody2: 'Wij sommeren u hierbij het openstaande bedrag <strong>binnen 14 dagen</strong> te voldoen.',
    wikConsequencesTitle: 'Consequenties bij niet-tijdige betaling',
    wikConsequencesBody: 'Indien wij binnen 14 dagen geen volledige betaling ontvangen, zijn wij genoodzaakt uw dossier over te dragen aan een incassobureau. Op grond van de Wet Incassokosten (WIK) worden in dat geval buitengerechtelijke incassokosten van <strong>€40,00</strong> in rekening gebracht, bovenop het reeds openstaande bedrag.',
    wikCta: (a) => `Betaal nu ${a}`,
    wikAlreadyPaid: 'Heeft u al betaald? Dan verzoeken wij u dit bericht te negeren. Het is mogelijk dat onze administratie en uw betaling elkaar hebben gekruist.',
    incSubject: (d) => `Dossier ${d} overgedragen aan incassobureau`,
    incPreheader: (d) => `Dossier ${d} overgedragen aan incassobureau`,
    incTitle: 'Dossier overgedragen aan incassobureau',
    incBody1: (d) => `Ondanks eerdere herinneringen en een aanmaning hebben wij geen betaling ontvangen voor dossiernummer <strong>${d}</strong>. Uw dossier is daarom overgedragen aan <strong>Justus Collect</strong> voor verdere incasso.`,
    incOverview: 'Incasso-overzicht',
    incOurDossier: 'Ons dossiernummer',
    incJustusCase: 'Justus zaaknummer',
    incOwed: 'Verschuldigd bedrag',
    incCanStillPay: 'U kunt nog steeds betalen om verdere kosten te voorkomen. Na ontvangst van uw betaling wordt het incassodossier onmiddellijk gesloten.',
    incCta: (a) => `Betaal nu ${a}`,
    paidSubject: (d) => `✓ Betaling ontvangen — dossier ${d}`,
    paidPreheader: (d) => `Betaling ontvangen voor dossier ${d} — bedankt!`,
    paidTitle: '✓ Betaling ontvangen!',
    paidIntro: 'Bedankt voor je betaling! Wij hebben deze in goede orde ontvangen.',
    paidConfirmedLabel: 'Dossiernummer',
    paidPaidLabel: 'Betaald',
    paidClosing: 'Je dossier is hiermee volledig afgerond. We wensen je veel succes met je sollicitaties!',
    paidMakeAnother: 'Maak nog een CV',
  },
  en: {
    greetingInformal: (n) => `Hi ${n},`,
    greetingFormal: (f, l) => `Dear ${f} ${l},`,
    closingFriendly: 'Kind regards,',
    closingFormal: 'Yours sincerely,',
    teamLabel: 'Team',
    privacyPolicy: 'Privacy policy',
    terms: 'Terms & conditions',
    dossierNumber: 'Reference',
    description: 'Description',
    cvDownloadDesc: 'CV download via ResuBox',
    outstandingAmount: 'Outstanding balance',
    total: 'Total',
    invoiceNumber: 'Invoice number',
    exclVat: 'Excl. VAT',
    vatPercent: 'VAT (20%)',
    paymentTerm: 'Payment terms: 14 days',
    paymentTermSubtle: 'Payment term: 14 days from invoice date',
    questionsContact: (e) => `Questions? Email <a href="mailto:${e}" style="color: #059669;">${e}</a>.`,
    confirmSubject: (d) => `✓ Your CV is ready — reference ${d}`,
    confirmPreheader: (d) => `Your CV is ready — reference ${d}`,
    confirmTitle: 'Your CV has been generated ✓',
    confirmBody1: 'Good news — your CV has been generated and downloaded via ResuBox.',
    confirmStatus: 'Status',
    confirmStatusValue: 'CV downloaded successfully',
    confirmWhatNext: 'What happens next?',
    confirmNext1: 'You will receive an invoice by email shortly',
    confirmNext2: 'Pay easily — 14-day payment terms',
    confirmNext3: 'Once paid, your file is fully closed',
    invoiceSubject: (d, a) => `Invoice ${d} — ${a} — ${BRAND_NAME}`,
    invoicePreheader: (d, a) => `Invoice ${d} — ${a} — due in 14 days`,
    invoiceTitle: 'Invoice for your CV download',
    invoiceIntro: `Thank you for using ${BRAND_NAME}. Please find your invoice for the CV download below.`,
    invoicePayCta: (a) => `Pay now ${a}`,
    invoicePaySafely: 'Pay easily and securely:',
    rem1Subject: (d) => `Reminder: invoice ${d} still outstanding`,
    rem1Preheader: (d, a) => `Reminder: invoice ${d} outstanding — ${a}`,
    rem1Title: 'Reminder: outstanding invoice',
    rem1Body1: 'We have not yet received payment for the invoice below. It may have slipped your attention.',
    rem1Body2: 'We kindly ask you to settle the outstanding amount to avoid further steps.',
    rem1AlreadyPaid: 'Already paid? Please disregard this message.',
    rem1Cta: (a) => `Pay now ${a}`,
    rem2Subject: (d) => `Second reminder: invoice ${d} is now 7 days overdue`,
    rem2Preheader: (d, a) => `Second reminder ${d} — ${a} — please pay this week`,
    rem2Title: 'Second reminder: payment is 7 days overdue',
    rem2Body1: 'Your payment is now more than 7 days past the agreed due date. We are sending you another friendly reminder — and for good measure also a text message to your phone.',
    rem2Body2: 'We kindly ask you to settle the outstanding amount <strong>this week</strong>. This is our last gentle nudge before we proceed to a formal notice.',
    rem2SmsNotice: 'We have also sent this reminder by SMS to make sure it reaches you.',
    rem2AlreadyPaid: 'Already paid? Please disregard this message — our records and your payment may have crossed.',
    rem2Cta: (a) => `Pay now ${a}`,
    rem3Subject: (d) => `Final warning: invoice ${d} — formal notice imminent`,
    rem3Preheader: (d) => `Final warning ${d} — avoid £40 statutory late-payment fees`,
    rem3Title: (d) => `Final warning invoice ${d}: formal notice imminent`,
    rem3Body1: (d) => `Despite two earlier reminders and a text message, we have not yet received payment for invoice <strong>${d}</strong>. This is our final warning before we issue a formal notice (aanmaning) and the statutory 14-day grace period begins.`,
    rem3Body2: 'We urgently request that you settle the outstanding amount <strong>without further delay</strong> to avoid escalation.',
    rem3ConsequencesTitle: 'What happens if you do not pay now',
    rem3ConsequencesBody: 'If we do not receive payment within the next few days, you will be issued a formal notice. A statutory 14-day grace period will then begin. If payment is not received within that period, your file will be transferred to our collection agency (Justus Collect) and <strong>£40.00 statutory late-payment fees</strong> will be added to the outstanding amount.',
    rem3Cta: (a) => `Pay now ${a}`,
    rem3AlreadyPaid: 'Already paid? Please disregard this warning — our records and your payment may have crossed.',
    wikSubject: (d) => `Formal notice: invoice ${d} — pay within 14 days`,
    wikPreheader: (d) => `Formal notice ${d} — pay within 14 days to avoid collection fees`,
    wikTitle: (d) => `Formal notice: outstanding amount invoice ${d}`,
    wikBody1: (d) => `Despite our earlier reminders, we have not received payment for invoice <strong>${d}</strong>.`,
    wikBody2: 'We formally request payment of the outstanding amount <strong>within 14 days</strong>.',
    wikConsequencesTitle: 'Consequences of non-payment',
    wikConsequencesBody: 'If we do not receive full payment within 14 days, we will transfer your file to a collection agency. Statutory collection fees of <strong>£40.00</strong> will then be added to the outstanding amount.',
    wikCta: (a) => `Pay now ${a}`,
    wikAlreadyPaid: 'Already paid? Please disregard this notice — it is possible our records and your payment have crossed.',
    incSubject: (d) => `Invoice ${d} transferred to collections`,
    incPreheader: (d) => `Invoice ${d} transferred to collections agency`,
    incTitle: 'Your file has been transferred to collections',
    incBody1: (d) => `Despite previous reminders and a formal notice, we have not received payment for invoice <strong>${d}</strong>. Your file has been transferred to <strong>Justus Collect</strong> for collection.`,
    incOverview: 'Collection summary',
    incOurDossier: 'Our reference',
    incJustusCase: 'Justus case number',
    incOwed: 'Amount due',
    incCanStillPay: 'You can still pay to avoid further costs. Once your payment is received, the collection file will be closed immediately.',
    incCta: (a) => `Pay now ${a}`,
    paidSubject: (d) => `✓ Payment received — invoice ${d}`,
    paidPreheader: (d) => `Payment received for invoice ${d} — thank you!`,
    paidTitle: '✓ Payment received!',
    paidIntro: 'Thank you for your payment — it has been received successfully.',
    paidConfirmedLabel: 'Reference',
    paidPaidLabel: 'Paid',
    paidClosing: 'Your file is fully closed. Best of luck with your applications!',
    paidMakeAnother: 'Create another CV',
  },
  de: {
    greetingInformal: (n) => `Hallo ${n},`,
    greetingFormal: (f, l) => `Sehr geehrte/r ${f} ${l},`,
    closingFriendly: 'Mit freundlichen Grüßen,',
    closingFormal: 'Hochachtungsvoll,',
    teamLabel: 'Team',
    privacyPolicy: 'Datenschutzerklärung',
    terms: 'AGB',
    dossierNumber: 'Aktenzeichen',
    description: 'Beschreibung',
    cvDownloadDesc: 'Lebenslauf-Download über ResuBox',
    outstandingAmount: 'Offener Betrag',
    total: 'Gesamt',
    invoiceNumber: 'Rechnungsnummer',
    exclVat: 'Netto',
    vatPercent: 'MwSt. (19 %)',
    paymentTerm: 'Zahlungsziel: 14 Tage',
    paymentTermSubtle: 'Zahlungsziel: 14 Tage nach Rechnungsdatum',
    questionsContact: (e) => `Fragen? Schreiben Sie eine E-Mail an <a href="mailto:${e}" style="color: #059669;">${e}</a>.`,
    confirmSubject: (d) => `✓ Ihr Lebenslauf ist fertig — Aktenzeichen ${d}`,
    confirmPreheader: (d) => `Ihr Lebenslauf ist fertig — Aktenzeichen ${d}`,
    confirmTitle: 'Ihr Lebenslauf wurde erfolgreich erstellt ✓',
    confirmBody1: 'Gute Nachricht: Ihr Lebenslauf wurde erfolgreich erstellt und über ResuBox heruntergeladen.',
    confirmStatus: 'Status',
    confirmStatusValue: 'Lebenslauf erfolgreich heruntergeladen',
    confirmWhatNext: 'Wie geht es weiter?',
    confirmNext1: 'Sie erhalten in Kürze eine Rechnung per E-Mail',
    confirmNext2: 'Einfach bezahlen — Zahlungsziel 14 Tage',
    confirmNext3: 'Nach Zahlungseingang ist Ihr Vorgang abgeschlossen',
    invoiceSubject: (d, a) => `Rechnung ${d} — ${a} — ${BRAND_NAME}`,
    invoicePreheader: (d, a) => `Rechnung ${d} — ${a} — Zahlungsziel 14 Tage`,
    invoiceTitle: 'Rechnung für Ihren Lebenslauf-Download',
    invoiceIntro: `Vielen Dank, dass Sie ${BRAND_NAME} nutzen. Anbei Ihre Rechnung für den Lebenslauf-Download.`,
    invoicePayCta: (a) => `Jetzt ${a} bezahlen`,
    invoicePaySafely: 'Einfach und sicher bezahlen:',
    rem1Subject: (d) => `Erinnerung: Rechnung ${d} — Zahlung noch offen`,
    rem1Preheader: (d, a) => `Erinnerung: offene Rechnung ${d} — ${a}`,
    rem1Title: 'Erinnerung: offene Rechnung',
    rem1Body1: 'Wir haben für die untenstehende Rechnung noch keinen Zahlungseingang verbuchen können — möglicherweise ist Ihnen dies entgangen.',
    rem1Body2: 'Wir bitten Sie höflich, den offenen Betrag zu begleichen, um weitere Schritte zu vermeiden.',
    rem1AlreadyPaid: 'Bereits bezahlt? Dann betrachten Sie diese Nachricht bitte als gegenstandslos.',
    rem1Cta: (a) => `Jetzt ${a} bezahlen`,
    rem2Subject: (d) => `Zweite Erinnerung: Rechnung ${d} — Zahlung 7 Tage überfällig`,
    rem2Preheader: (d, a) => `Zweite Erinnerung ${d} — ${a} — bitte diese Woche bezahlen`,
    rem2Title: 'Zweite Erinnerung: Zahlung ist 7 Tage überfällig',
    rem2Body1: 'Ihre Zahlung ist mittlerweile mehr als 7 Tage über die vereinbarte Frist hinaus. Wir senden Ihnen daher erneut eine freundliche Erinnerung — und zur Sicherheit zusätzlich eine SMS an Ihre Handynummer.',
    rem2Body2: 'Wir bitten Sie höflich, den offenen Betrag <strong>noch diese Woche</strong> zu begleichen. Dies ist unsere letzte freundliche Erinnerung, bevor wir zur förmlichen Mahnung übergehen.',
    rem2SmsNotice: 'Wir haben diese Erinnerung zusätzlich per SMS verschickt, damit die Nachricht Sie auch sicher erreicht.',
    rem2AlreadyPaid: 'Bereits bezahlt? Dann betrachten Sie diese Nachricht bitte als gegenstandslos — eventuell haben sich unsere Erinnerung und Ihre Zahlung gekreuzt.',
    rem2Cta: (a) => `Jetzt ${a} bezahlen`,
    rem3Subject: (d) => `Letzte Warnung: Rechnung ${d} — förmliche Mahnung steht bevor`,
    rem3Preheader: (d) => `Letzte Warnung ${d} — vermeiden Sie 40 € gesetzliche Inkassokosten`,
    rem3Title: (d) => `Letzte Warnung Rechnung ${d}: förmliche Mahnung steht bevor`,
    rem3Body1: (d) => `Trotz zwei vorheriger Erinnerungen und einer SMS haben wir bisher keinen Zahlungseingang für Aktenzeichen <strong>${d}</strong> verzeichnen können. Dies ist unsere letzte Warnung, bevor wir die förmliche Mahnung versenden und damit die gesetzliche 14-tägige Nachfrist in Gang setzen.`,
    rem3Body2: 'Wir fordern Sie dringend auf, den offenen Betrag <strong>unverzüglich</strong> zu begleichen, um eine Eskalation zu vermeiden.',
    rem3ConsequencesTitle: 'Was geschieht, wenn Sie jetzt nicht bezahlen',
    rem3ConsequencesBody: 'Sollten wir in den kommenden Tagen keinen Zahlungseingang verzeichnen, erhalten Sie eine förmliche Mahnung. Anschließend beginnt eine gesetzliche Nachfrist von 14 Tagen. Erfolgt auch dann keine Zahlung, übergeben wir Ihren Vorgang an unser Inkassobüro (Justus Collect) und es werden <strong>40,00 € gesetzliche Inkassokosten</strong> zusätzlich zur offenen Forderung in Rechnung gestellt.',
    rem3Cta: (a) => `Jetzt ${a} bezahlen`,
    rem3AlreadyPaid: 'Bereits bezahlt? Dann betrachten Sie diese Warnung bitte als gegenstandslos — eventuell haben sich unsere Mitteilung und Ihre Zahlung gekreuzt.',
    wikSubject: (d) => `Mahnung: Rechnung ${d} — bitte innerhalb 14 Tagen bezahlen`,
    wikPreheader: (d) => `Mahnung ${d} — bitte innerhalb 14 Tagen bezahlen, um Inkassokosten zu vermeiden`,
    wikTitle: (d) => `Mahnung: offene Forderung Rechnung ${d}`,
    wikBody1: (d) => `Trotz unserer vorherigen Zahlungsaufforderungen wurde der offene Betrag für Aktenzeichen <strong>${d}</strong> bisher nicht beglichen.`,
    wikBody2: 'Wir fordern Sie hiermit auf, den offenen Betrag <strong>innerhalb von 14 Tagen</strong> zu begleichen.',
    wikConsequencesTitle: 'Folgen bei nicht fristgerechter Zahlung',
    wikConsequencesBody: 'Sollten wir innerhalb von 14 Tagen keine vollständige Zahlung erhalten, sehen wir uns gezwungen, Ihren Vorgang an ein Inkassobüro zu übergeben. In diesem Fall werden Inkassokosten in Höhe von <strong>40,00 €</strong> zusätzlich zur offenen Forderung in Rechnung gestellt.',
    wikCta: (a) => `Jetzt ${a} bezahlen`,
    wikAlreadyPaid: 'Bereits bezahlt? Dann betrachten Sie diese Mahnung bitte als gegenstandslos — eventuell haben sich unsere Mahnung und Ihre Zahlung gekreuzt.',
    incSubject: (d) => `Vorgang ${d} an Inkassobüro übergeben`,
    incPreheader: (d) => `Vorgang ${d} an Inkassobüro übergeben`,
    incTitle: 'Vorgang an Inkassobüro übergeben',
    incBody1: (d) => `Trotz vorheriger Erinnerungen und Mahnung haben wir keine Zahlung für Aktenzeichen <strong>${d}</strong> erhalten. Ihr Vorgang wurde daher an <strong>Justus Collect</strong> zur weiteren Bearbeitung übergeben.`,
    incOverview: 'Inkasso-Übersicht',
    incOurDossier: 'Unser Aktenzeichen',
    incJustusCase: 'Justus-Fallnummer',
    incOwed: 'Geschuldeter Betrag',
    incCanStillPay: 'Sie können weiterhin direkt bezahlen, um zusätzliche Kosten zu vermeiden. Nach Zahlungseingang wird der Inkassovorgang sofort geschlossen.',
    incCta: (a) => `Jetzt ${a} bezahlen`,
    paidSubject: (d) => `✓ Zahlung eingegangen — Aktenzeichen ${d}`,
    paidPreheader: (d) => `Zahlung für Aktenzeichen ${d} eingegangen — vielen Dank!`,
    paidTitle: '✓ Zahlung eingegangen!',
    paidIntro: 'Vielen Dank für Ihre Zahlung — wir haben sie verbucht.',
    paidConfirmedLabel: 'Aktenzeichen',
    paidPaidLabel: 'Bezahlt',
    paidClosing: 'Ihr Vorgang ist damit vollständig abgeschlossen. Viel Erfolg bei Ihren Bewerbungen!',
    paidMakeAnother: 'Weiteren Lebenslauf erstellen',
  },
  sv: {
    greetingInformal: (n) => `Hej ${n},`,
    greetingFormal: (f, l) => `Bästa ${f} ${l},`,
    closingFriendly: 'Vänliga hälsningar,',
    closingFormal: 'Med vänlig hälsning,',
    teamLabel: 'Team',
    privacyPolicy: 'Integritetspolicy',
    terms: 'Allmänna villkor',
    dossierNumber: 'Ärendenummer',
    description: 'Beskrivning',
    cvDownloadDesc: 'CV-nedladdning via ResuBox',
    outstandingAmount: 'Utestående belopp',
    total: 'Totalt',
    invoiceNumber: 'Fakturanummer',
    exclVat: 'Exkl. moms',
    vatPercent: 'Moms (25 %)',
    paymentTerm: 'Betalningsvillkor: 14 dagar',
    paymentTermSubtle: 'Betalningsvillkor: 14 dagar från fakturadatum',
    questionsContact: (e) => `Frågor? Mejla <a href="mailto:${e}" style="color: #059669;">${e}</a>.`,
    confirmSubject: (d) => `✓ Ditt CV är klart — ärendenummer ${d}`,
    confirmPreheader: (d) => `Ditt CV är klart — ärendenummer ${d}`,
    confirmTitle: 'Ditt CV har skapats ✓',
    confirmBody1: 'Goda nyheter: ditt CV har genererats och laddats ned via ResuBox.',
    confirmStatus: 'Status',
    confirmStatusValue: 'CV nedladdat',
    confirmWhatNext: 'Vad händer nu?',
    confirmNext1: 'Du får inom kort en faktura via e-post',
    confirmNext2: 'Betala enkelt — 14 dagars betalningsvillkor',
    confirmNext3: 'Efter betalning är ditt ärende avslutat',
    invoiceSubject: (d, a) => `Faktura ${d} — ${a} — ${BRAND_NAME}`,
    invoicePreheader: (d, a) => `Faktura ${d} — ${a} — betalningstid 14 dagar`,
    invoiceTitle: 'Faktura för din CV-nedladdning',
    invoiceIntro: `Tack för att du använder ${BRAND_NAME}. Bifogat följer fakturan för din CV-nedladdning.`,
    invoicePayCta: (a) => `Betala ${a}`,
    invoicePaySafely: 'Betala enkelt och säkert:',
    rem1Subject: (d) => `Påminnelse: ärende ${d} — betalning kvarstår`,
    rem1Preheader: (d, a) => `Påminnelse: faktura ${d} — ${a}`,
    rem1Title: 'Påminnelse: obetald faktura',
    rem1Body1: 'Vi har ännu inte registrerat någon betalning för fakturan nedan. Det kan ha undgått dig.',
    rem1Body2: 'Vi ber dig vänligen betala det utestående beloppet för att undvika ytterligare åtgärder.',
    rem1AlreadyPaid: 'Redan betalat? Då kan du bortse från detta meddelande.',
    rem1Cta: (a) => `Betala ${a}`,
    rem2Subject: (d) => `Andra påminnelsen: faktura ${d} — betalningen är 7 dagar försenad`,
    rem2Preheader: (d, a) => `Andra påminnelsen ${d} — ${a} — betala denna vecka`,
    rem2Title: 'Andra påminnelsen: betalningen är 7 dagar försenad',
    rem2Body1: 'Din betalning är nu mer än 7 dagar efter förfallodatum. Vi skickar därför ytterligare en vänlig påminnelse — och för säkerhets skull även ett sms till din telefon.',
    rem2Body2: 'Vi ber dig vänligen att betala det utestående beloppet <strong>denna vecka</strong>. Detta är vår sista vänliga påminnelse innan vi går vidare med ett formellt inkassokrav.',
    rem2SmsNotice: 'Vi har även skickat denna påminnelse som sms för att säkerställa att den når dig.',
    rem2AlreadyPaid: 'Redan betalat? Då kan du bortse från detta meddelande — det är möjligt att vår administration och din betalning korsats.',
    rem2Cta: (a) => `Betala ${a}`,
    rem3Subject: (d) => `Sista varning: faktura ${d} — formellt inkassokrav är på väg`,
    rem3Preheader: (d) => `Sista varning ${d} — undvik 180 kr lagstadgade inkassoavgifter`,
    rem3Title: (d) => `Sista varning faktura ${d}: formellt krav på väg`,
    rem3Body1: (d) => `Trots två tidigare påminnelser och ett sms har vi ännu inte mottagit någon betalning för ärendenummer <strong>${d}</strong>. Detta är vår sista varning innan vi utfärdar ett formellt inkassokrav, varefter en lagstadgad betalningsfrist på 14 dagar börjar löpa.`,
    rem3Body2: 'Vi uppmanar Er bestämt att betala det utestående beloppet <strong>omgående</strong> för att undvika ytterligare åtgärder.',
    rem3ConsequencesTitle: 'Vad händer om Ni inte betalar nu',
    rem3ConsequencesBody: 'Om vi inte mottar betalning inom de närmaste dagarna kommer Ni att erhålla ett formellt inkassokrav. Därefter inleds en lagstadgad betalningsfrist om 14 dagar. Om betalning inte sker inom denna frist överlämnas Ert ärende till vårt inkassobolag (Justus Collect) och <strong>180 kr lagstadgade inkassoavgifter</strong> läggs till det utestående beloppet.',
    rem3Cta: (a) => `Betala ${a}`,
    rem3AlreadyPaid: 'Redan betalat? Då ber vi Er bortse från denna varning — vår administration och Er betalning kan ha korsats.',
    wikSubject: (d) => `Inkassokrav: ärende ${d} — betala inom 14 dagar`,
    wikPreheader: (d) => `Inkassokrav ${d} — betala inom 14 dagar för att undvika inkassoavgifter`,
    wikTitle: (d) => `Inkassokrav: obetald fordran ärende ${d}`,
    wikBody1: (d) => `Trots våra tidigare påminnelser är det utestående beloppet för ärendenummer <strong>${d}</strong> fortfarande obetalt.`,
    wikBody2: 'Vi kräver härmed att det utestående beloppet betalas <strong>inom 14 dagar</strong>.',
    wikConsequencesTitle: 'Konsekvenser vid utebliven betalning',
    wikConsequencesBody: 'Om vi inte erhåller full betalning inom 14 dagar tvingas vi överlämna ditt ärende till ett inkassobolag. Lagstadgade inkassoavgifter om <strong>180 kr</strong> kommer då att läggas till det utestående beloppet.',
    wikCta: (a) => `Betala ${a}`,
    wikAlreadyPaid: 'Redan betalat? Då ber vi dig bortse från detta krav — det är möjligt att vår administration och din betalning korsats.',
    incSubject: (d) => `Ärende ${d} överlämnat till inkasso`,
    incPreheader: (d) => `Ärende ${d} överlämnat till inkasso`,
    incTitle: 'Ditt ärende har överlämnats till inkasso',
    incBody1: (d) => `Trots tidigare påminnelser och krav har vi inte mottagit någon betalning för ärendenummer <strong>${d}</strong>. Ditt ärende har därför överlämnats till <strong>Justus Collect</strong>.`,
    incOverview: 'Inkasso-översikt',
    incOurDossier: 'Vårt ärendenummer',
    incJustusCase: 'Justus ärende',
    incOwed: 'Skuldigt belopp',
    incCanStillPay: 'Du kan fortfarande betala för att undvika ytterligare kostnader. När din betalning registreras stängs inkassoärendet omedelbart.',
    incCta: (a) => `Betala ${a}`,
    paidSubject: (d) => `✓ Betalning mottagen — ärende ${d}`,
    paidPreheader: (d) => `Betalning mottagen för ärende ${d} — tack!`,
    paidTitle: '✓ Betalning mottagen!',
    paidIntro: 'Tack för din betalning — vi har mottagit den.',
    paidConfirmedLabel: 'Ärendenummer',
    paidPaidLabel: 'Betalt',
    paidClosing: 'Ditt ärende är nu fullständigt avslutat. Lycka till med dina ansökningar!',
    paidMakeAnother: 'Skapa ett CV till',
  },
  da: {
    greetingInformal: (n) => `Hej ${n},`,
    greetingFormal: (f, l) => `Kære ${f} ${l},`,
    closingFriendly: 'Med venlig hilsen,',
    closingFormal: 'Med venlig hilsen,',
    teamLabel: 'Team',
    privacyPolicy: 'Privatlivspolitik',
    terms: 'Handelsbetingelser',
    dossierNumber: 'Sagsnummer',
    description: 'Beskrivelse',
    cvDownloadDesc: 'CV-download via ResuBox',
    outstandingAmount: 'Udestående beløb',
    total: 'I alt',
    invoiceNumber: 'Fakturanummer',
    exclVat: 'Ekskl. moms',
    vatPercent: 'Moms (25 %)',
    paymentTerm: 'Betalingsfrist: 14 dage',
    paymentTermSubtle: 'Betalingsfrist: 14 dage fra fakturadato',
    questionsContact: (e) => `Spørgsmål? Skriv til <a href="mailto:${e}" style="color: #059669;">${e}</a>.`,
    confirmSubject: (d) => `✓ Dit CV er klar — sagsnummer ${d}`,
    confirmPreheader: (d) => `Dit CV er klar — sagsnummer ${d}`,
    confirmTitle: 'Dit CV er blevet oprettet ✓',
    confirmBody1: 'Godt nyt: dit CV er blevet genereret og downloadet via ResuBox.',
    confirmStatus: 'Status',
    confirmStatusValue: 'CV downloadet',
    confirmWhatNext: 'Hvad sker der nu?',
    confirmNext1: 'Du modtager snart en faktura pr. e-mail',
    confirmNext2: 'Betal nemt — 14 dages betalingsfrist',
    confirmNext3: 'Efter betaling er din sag afsluttet',
    invoiceSubject: (d, a) => `Faktura ${d} — ${a} — ${BRAND_NAME}`,
    invoicePreheader: (d, a) => `Faktura ${d} — ${a} — betalingsfrist 14 dage`,
    invoiceTitle: 'Faktura for din CV-download',
    invoiceIntro: `Tak fordi du bruger ${BRAND_NAME}. Vedhæftet er fakturaen for din CV-download.`,
    invoicePayCta: (a) => `Betal ${a}`,
    invoicePaySafely: 'Betal nemt og sikkert:',
    rem1Subject: (d) => `Påmindelse: sag ${d} — manglende betaling`,
    rem1Preheader: (d, a) => `Påmindelse: faktura ${d} — ${a}`,
    rem1Title: 'Påmindelse: ubetalt faktura',
    rem1Body1: 'Vi har endnu ikke modtaget betaling for nedenstående faktura. Det kan være undsluppet din opmærksomhed.',
    rem1Body2: 'Vi beder dig venligst om at betale det udestående beløb for at undgå yderligere skridt.',
    rem1AlreadyPaid: 'Allerede betalt? Så bedes du se bort fra denne besked.',
    rem1Cta: (a) => `Betal ${a}`,
    rem2Subject: (d) => `Anden påmindelse: sag ${d} — betalingen er 7 dage forsinket`,
    rem2Preheader: (d, a) => `Anden påmindelse ${d} — ${a} — betal denne uge`,
    rem2Title: 'Anden påmindelse: betalingen er 7 dage forsinket',
    rem2Body1: 'Din betaling er nu mere end 7 dage efter forfaldsdatoen. Vi sender dig derfor endnu en venlig påmindelse — og for en sikkerheds skyld også en sms til din telefon.',
    rem2Body2: 'Vi beder dig venligst betale det udestående beløb <strong>i denne uge</strong>. Dette er vores sidste venlige påmindelse, før vi går videre med en formel rykker.',
    rem2SmsNotice: 'Vi har også sendt denne påmindelse som sms for at sikre, at den når frem til dig.',
    rem2AlreadyPaid: 'Allerede betalt? Så bedes du se bort fra denne besked — vores administration og din betaling kan have krydset hinanden.',
    rem2Cta: (a) => `Betal ${a}`,
    rem3Subject: (d) => `Sidste advarsel: sag ${d} — formel rykker er på vej`,
    rem3Preheader: (d) => `Sidste advarsel ${d} — undgå 100 kr lovbestemte inkassogebyrer`,
    rem3Title: (d) => `Sidste advarsel sag ${d}: formel rykker er på vej`,
    rem3Body1: (d) => `Trods to tidligere påmindelser og en sms har vi endnu ikke modtaget betaling for sagsnummer <strong>${d}</strong>. Dette er vores sidste advarsel, før vi udsender en formel rykker og den lovbestemte 14-dages frist begynder at løbe.`,
    rem3Body2: 'Vi opfordrer Dem indtrængende til at betale det udestående beløb <strong>omgående</strong> for at undgå yderligere skridt.',
    rem3ConsequencesTitle: 'Hvad sker der, hvis De ikke betaler nu',
    rem3ConsequencesBody: 'Hvis vi ikke modtager betaling inden for de næste dage, modtager De en formel rykker. Derefter begynder en lovbestemt frist på 14 dage. Sker betaling ikke inden for denne frist, overdrages Deres sag til vores inkassobureau (Justus Collect), og <strong>100 kr lovbestemte inkassogebyrer</strong> tillægges det udestående beløb.',
    rem3Cta: (a) => `Betal ${a}`,
    rem3AlreadyPaid: 'Allerede betalt? Så bedes De se bort fra denne advarsel — vores administration og Deres betaling kan have krydset hinanden.',
    wikSubject: (d) => `Rykker: sag ${d} — betal inden for 14 dage`,
    wikPreheader: (d) => `Rykker ${d} — betal inden for 14 dage for at undgå inkassogebyrer`,
    wikTitle: (d) => `Rykker: ubetalt fordring sag ${d}`,
    wikBody1: (d) => `Trods vores tidligere påmindelser er det udestående beløb for sagsnummer <strong>${d}</strong> endnu ikke betalt.`,
    wikBody2: 'Vi kræver hermed at det udestående beløb betales <strong>inden for 14 dage</strong>.',
    wikConsequencesTitle: 'Konsekvenser ved manglende betaling',
    wikConsequencesBody: 'Hvis vi ikke modtager fuld betaling inden for 14 dage, er vi nødt til at overdrage din sag til et inkassobureau. Lovbestemte inkassogebyrer på <strong>100 kr</strong> tilføjes da det udestående beløb.',
    wikCta: (a) => `Betal ${a}`,
    wikAlreadyPaid: 'Allerede betalt? Så bedes du se bort fra denne rykker — vores administration og din betaling kan have krydset hinanden.',
    incSubject: (d) => `Sag ${d} overdraget til inkasso`,
    incPreheader: (d) => `Sag ${d} overdraget til inkasso`,
    incTitle: 'Din sag er overdraget til inkasso',
    incBody1: (d) => `Trods tidligere påmindelser og rykker har vi ikke modtaget betaling for sagsnummer <strong>${d}</strong>. Din sag er derfor overdraget til <strong>Justus Collect</strong>.`,
    incOverview: 'Inkasso-oversigt',
    incOurDossier: 'Vores sagsnummer',
    incJustusCase: 'Justus sag',
    incOwed: 'Skyldigt beløb',
    incCanStillPay: 'Du kan stadig betale for at undgå yderligere omkostninger. Når vi modtager din betaling, lukkes inkassosagen straks.',
    incCta: (a) => `Betal ${a}`,
    paidSubject: (d) => `✓ Betaling modtaget — sag ${d}`,
    paidPreheader: (d) => `Betaling modtaget for sag ${d} — tak!`,
    paidTitle: '✓ Betaling modtaget!',
    paidIntro: 'Tak for din betaling — vi har modtaget den.',
    paidConfirmedLabel: 'Sagsnummer',
    paidPaidLabel: 'Betalt',
    paidClosing: 'Din sag er nu fuldstændig afsluttet. Held og lykke med dine ansøgninger!',
    paidMakeAnother: 'Lav endnu et CV',
  },
};

// ─── Currency formatting ─────────────────────────────────────────────────
const CURRENCY_BY_LOCALE: Record<Locale, { symbol: string; format: (amount: number) => string }> = {
  nl: { symbol: '€', format: (a) => `€${a.toFixed(2).replace('.', ',')}` },
  de: { symbol: '€', format: (a) => `${a.toFixed(2).replace('.', ',')} €` },
  en: { symbol: '£', format: (a) => `£${a.toFixed(2)}` },
  sv: { symbol: 'kr', format: (a) => `${Math.round(a)} kr` },
  da: { symbol: 'kr', format: (a) => `${Math.round(a)} kr` },
};

function getOrderLocale(order: CVOrder): Locale {
  // Prefer the top-level order.locale column. Fall back to cv_data.meta.locale
  // for any legacy orders created before that column existed.
  const candidate = order.locale ?? order.cv_data?.meta?.locale;
  if (candidate && (['nl', 'en', 'de', 'sv', 'da'] as const).includes(candidate as Locale)) {
    return candidate as Locale;
  }
  return 'nl';
}

function formatPrice(amount: number, locale: Locale): string {
  return CURRENCY_BY_LOCALE[locale].format(amount);
}

// ─── Styles ───────────────────────────────────────────────────────────────
const EMAIL_STYLES = {
  container: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
  body: 'background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;',
  footer: 'background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 13px;',
  infoBox: 'background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;',
  warningBox: 'background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;',
  dangerBox: 'background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;',
  btnGreen: 'display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
  btnOrange: 'display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
  btnRed: 'display: inline-block; background: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
};

const LOGO_HEADER = `
<div style="background: #ffffff; padding: 20px 30px; border-radius: 12px 12px 0 0; border: 1px solid #e5e7eb; border-bottom: none; text-align: center;">
  <img src="${LOGO_URL}" alt="${BRAND_NAME}" style="height: 44px; width: auto; display: block; margin: 0 auto;">
</div>`;

function preheader(text: string) {
  return `<span style="display:none;font-size:1px;color:#ffffff;max-height:0;overflow:hidden;opacity:0;">${text}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>`;
}

function buildFooter(s: EmailStrings) {
  return `
<div style="${EMAIL_STYLES.footer}">
  <p style="margin: 0; font-weight: 600;">${BRAND_NAME}</p>
  <p style="margin: 6px 0 0; font-size: 11px; color: #9ca3af;">${SITE_URL.replace('https://', '')}</p>
  <p style="margin: 8px 0 0; font-size: 11px;">
    <a href="${SITE_URL}/privacy" style="color: #059669; text-decoration: none;">${s.privacyPolicy}</a>
    &nbsp;&middot;&nbsp;
    <a href="${SITE_URL}/voorwaarden" style="color: #059669; text-decoration: none;">${s.terms}</a>
  </p>
</div>`;
}

function wrap(html: string, s: EmailStrings) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
  <div style="${EMAIL_STYLES.container}">
    ${LOGO_HEADER}
    <div style="${EMAIL_STYLES.body}">${html}</div>
    ${buildFooter(s)}
  </div>
</body>
</html>`;
}

function factuurTabel(order: CVOrder, locale: Locale, boxStyle: string, color: string) {
  const s = STRINGS[locale];
  return `
<div style="${boxStyle}">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="color: ${color}; padding: 5px 0;">${s.dossierNumber}:</td>
      <td style="color: ${color}; text-align: right;">${(order.dossier_number ?? order.id)}</td>
    </tr>
    <tr>
      <td style="color: ${color}; padding: 5px 0;">${s.description}:</td>
      <td style="color: ${color}; text-align: right;">${s.cvDownloadDesc}</td>
    </tr>
    <tr style="border-top: 2px solid rgba(0,0,0,0.08);">
      <td style="color: ${color}; padding: 10px 0 5px; font-size: 17px;"><strong>${s.outstandingAmount}:</strong></td>
      <td style="color: ${color}; text-align: right; font-size: 17px;"><strong>${formatPrice(order.amount, locale)}</strong></td>
    </tr>
  </table>
</div>`;
}

// ─── Email 1: Confirmation ─────────────────────────────────
export function getConfirmationEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];

  const html = wrap(`
    ${preheader(s.confirmPreheader((order.dossier_number ?? order.id)))}
    <h2 style="color: #111827; margin-top: 0;">${s.confirmTitle}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingInformal(firstName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.confirmBody1}</p>
    <div style="${EMAIL_STYLES.infoBox}">
      <p style="margin: 0; color: #166534;"><strong>${s.dossierNumber}:</strong> ${(order.dossier_number ?? order.id)}</p>
      <p style="margin: 8px 0 0; color: #166534;"><strong>${s.confirmStatus}:</strong> ${s.confirmStatusValue}</p>
    </div>
    <h3 style="color: #111827;">${s.confirmWhatNext}</h3>
    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li>${s.confirmNext1}</li>
      <li>${s.confirmNext2}</li>
      <li>${s.confirmNext3}</li>
    </ul>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      ${s.questionsContact(CONTACT_EMAIL)}
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.confirmTitle}\n\n${s.greetingInformal(firstName)}\n\n${s.confirmBody1}\n\n${s.dossierNumber}: ${(order.dossier_number ?? order.id)}\n\n${s.confirmWhatNext}\n- ${s.confirmNext1}\n- ${s.confirmNext2}\n- ${s.confirmNext3}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.confirmSubject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 2: Invoice ────────────────────────────────────────────────────────
export function getInvoiceEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.invoicePreheader((order.dossier_number ?? order.id), amount))}
    <h2 style="color: #111827; margin-top: 0;">${s.invoiceTitle}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingInformal(firstName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.invoiceIntro}</p>
    <div style="${EMAIL_STYLES.infoBox}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #166534; padding: 5px 0;">${s.invoiceNumber}:</td>
          <td style="color: #166534; text-align: right;">${(order.dossier_number ?? order.id)}</td>
        </tr>
        <tr>
          <td style="color: #166534; padding: 5px 0;">${s.description}:</td>
          <td style="color: #166534; text-align: right;">${s.cvDownloadDesc}</td>
        </tr>
        <tr style="border-top: 2px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 5px; font-size: 18px;"><strong>${s.total}:</strong></td>
          <td style="color: #166534; text-align: right; font-size: 18px;"><strong>${amount}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.invoicePaySafely}</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnGreen}">${s.invoicePayCta(amount)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; text-align: center;">${s.paymentTermSubtle}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.invoiceTitle}\n\n${s.greetingInformal(firstName)}\n\n${s.invoiceIntro}\n\n${s.invoiceNumber}: ${(order.dossier_number ?? order.id)}\n${s.total}: ${amount}\n${s.paymentTerm}\n\n${paymentUrl}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.invoiceSubject((order.dossier_number ?? order.id), amount), html, text };
}

// ─── Email 3: Reminder 1 ─────────────────────────────────────────────────────
export function getReminder1Email(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.rem1Preheader((order.dossier_number ?? order.id), amount))}
    <h2 style="color: #92400e; margin-top: 0;">${s.rem1Title}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingInformal(firstName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem1Body1}</p>
    ${factuurTabel(order, locale, EMAIL_STYLES.warningBox, '#92400e')}
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
      ${s.rem1Body2}
    </p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnOrange}">${s.rem1Cta(amount)}</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem1AlreadyPaid}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.rem1Title}\n\n${s.greetingInformal(firstName)}\n\n${s.rem1Body1}\n\n${paymentUrl}\n\n${s.rem1AlreadyPaid}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.rem1Subject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 4: Reminder 2 (firmer + SMS, T+7d) ────────────────────────────────
export function getReminder2Email(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.rem2Preheader((order.dossier_number ?? order.id), amount))}
    <h2 style="color: #92400e; margin-top: 0;">${s.rem2Title}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingInformal(firstName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem2Body1}</p>
    ${factuurTabel(order, locale, EMAIL_STYLES.warningBox, '#92400e')}
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
      ${s.rem2Body2}
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; font-style: italic;">${s.rem2SmsNotice}</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnOrange}">${s.rem2Cta(amount)}</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem2AlreadyPaid}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.rem2Title}\n\n${s.greetingInformal(firstName)}\n\n${s.rem2Body1}\n\n${s.rem2Body2.replace(/<[^>]+>/g, '')}\n\n${s.rem2SmsNotice}\n\n${paymentUrl}\n\n${s.rem2AlreadyPaid}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.rem2Subject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 5: Reminder 3 (pre-aanmaning, T+10d) ──────────────────────────────
export function getReminder3Email(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const lastName = order.cv_data?.personal?.lastName || '';
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.rem3Preheader((order.dossier_number ?? order.id)))}
    <h2 style="color: #b91c1c; margin-top: 0;">${s.rem3Title((order.dossier_number ?? order.id))}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingFormal(firstName, lastName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem3Body1((order.dossier_number ?? order.id))}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.rem3Body2}</p>
    <div style="${EMAIL_STYLES.dangerBox}">
      <p style="margin: 0 0 12px; color: #991b1b; font-weight: 600; font-size: 15px;">${s.rem3ConsequencesTitle}</p>
      <p style="color: #7f1d1d; font-size: 15px; line-height: 1.7; margin: 0;">${s.rem3ConsequencesBody}</p>
    </div>
    ${factuurTabel(order, locale, EMAIL_STYLES.warningBox, '#92400e')}
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="display: inline-block; background: #ea580c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${s.rem3Cta(amount)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">${s.rem3AlreadyPaid}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFormal}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.rem3Title((order.dossier_number ?? order.id))}\n\n${s.greetingFormal(firstName, lastName)}\n\n${s.rem3Body1((order.dossier_number ?? order.id)).replace(/<[^>]+>/g, '')}\n\n${s.rem3Body2.replace(/<[^>]+>/g, '')}\n\n${s.rem3ConsequencesBody.replace(/<[^>]+>/g, '')}\n\n${paymentUrl}\n\n${s.rem3AlreadyPaid}\n\n${s.closingFormal}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.rem3Subject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 6: WIK (formal aanmaning, T+14d) ──────────────────────────────────
export function getWikEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const lastName = order.cv_data?.personal?.lastName || '';
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.wikPreheader((order.dossier_number ?? order.id)))}
    <h2 style="color: #991b1b; margin-top: 0;">${s.wikTitle((order.dossier_number ?? order.id))}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingFormal(firstName, lastName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.wikBody1((order.dossier_number ?? order.id))}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.wikBody2}</p>
    <div style="${EMAIL_STYLES.dangerBox}">
      <p style="margin: 0 0 12px; color: #991b1b; font-weight: 600; font-size: 15px;">${s.wikConsequencesTitle}</p>
      <p style="color: #7f1d1d; font-size: 15px; line-height: 1.7; margin: 0;">${s.wikConsequencesBody}</p>
    </div>
    ${factuurTabel(order, locale, EMAIL_STYLES.infoBox, '#166534')}
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnRed}">${s.wikCta(amount)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">${s.wikAlreadyPaid}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFormal}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.wikTitle((order.dossier_number ?? order.id))}\n\n${s.greetingFormal(firstName, lastName)}\n\n${s.wikBody1((order.dossier_number ?? order.id)).replace(/<[^>]+>/g, '')}\n\n${s.wikConsequencesBody.replace(/<[^>]+>/g, '')}\n\n${paymentUrl}\n\n${s.closingFormal}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.wikSubject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 7: Incasso transfer ───────────────────────────────────────────────
export function getIncassoEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const lastName = order.cv_data?.personal?.lastName || '';
  const paymentUrl = `${SITE_URL}${localizedPath('/betalen/[id]', locale, { id: order.id })}`;
  const amount = formatPrice(order.amount, locale);

  const html = wrap(`
    ${preheader(s.incPreheader((order.dossier_number ?? order.id)))}
    <h2 style="color: #92400e; margin-top: 0;">${s.incTitle}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingFormal(firstName, lastName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.incBody1((order.dossier_number ?? order.id))}</p>
    <div style="${EMAIL_STYLES.warningBox}">
      <p style="margin: 0 0 15px; color: #92400e; font-weight: bold; font-size: 17px;">${s.incOverview}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #92400e; padding: 5px 0;">${s.incOurDossier}:</td>
          <td style="color: #92400e; text-align: right;">${(order.dossier_number ?? order.id)}</td>
        </tr>
        ${order.justus_case_number ? `<tr>
          <td style="color: #92400e; padding: 5px 0;">${s.incJustusCase}:</td>
          <td style="color: #92400e; text-align: right;">${order.justus_case_number}</td>
        </tr>` : ''}
        <tr style="border-top: 2px solid #fcd34d;">
          <td style="color: #92400e; padding: 10px 0 5px; font-size: 19px;"><strong>${s.incOwed}:</strong></td>
          <td style="color: #92400e; text-align: right; font-size: 19px;"><strong>${amount}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.incCanStillPay}</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnOrange}">${s.incCta(amount)}</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.incTitle}\n\n${s.greetingFormal(firstName, lastName)}\n\n${s.incBody1((order.dossier_number ?? order.id)).replace(/<[^>]+>/g, '')}\n\n${s.incOwed}: ${amount}\n\n${paymentUrl}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.incSubject((order.dossier_number ?? order.id)), html, text };
}

// ─── Email 8: Payment received ───────────────────────────────────────────────
export function getPaymentReceivedEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const locale = getOrderLocale(order);
  const s = STRINGS[locale];
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const amount = formatPrice(order.amount, locale);
  const builderUrl = `${SITE_URL}${localizedPath('/builder', locale)}`;

  const html = wrap(`
    ${preheader(s.paidPreheader((order.dossier_number ?? order.id)))}
    <h2 style="color: #111827; margin-top: 0;">${s.paidTitle}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.greetingInformal(firstName)}</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.paidIntro}</p>
    <div style="${EMAIL_STYLES.infoBox}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #166534; padding: 5px 0;">${s.paidConfirmedLabel}:</td>
          <td style="color: #166534; text-align: right;">${(order.dossier_number ?? order.id)}</td>
        </tr>
        <tr style="border-top: 2px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 5px; font-size: 18px;"><strong>${s.paidPaidLabel}:</strong></td>
          <td style="color: #166534; text-align: right; font-size: 18px;"><strong>${amount}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${s.paidClosing}</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${builderUrl}" style="${EMAIL_STYLES.btnGreen}">${s.paidMakeAnother}</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      ${s.closingFriendly}<br><strong>${s.teamLabel} ${BRAND_NAME}</strong>
    </p>
  `, s);

  const text = `${s.paidTitle}\n\n${s.greetingInformal(firstName)}\n\n${s.paidIntro}\n\n${s.paidConfirmedLabel}: ${(order.dossier_number ?? order.id)}\n${s.paidPaidLabel}: ${amount}\n\n${s.paidClosing}\n\n${s.closingFriendly}\n${s.teamLabel} ${BRAND_NAME}`;

  return { subject: s.paidSubject((order.dossier_number ?? order.id)), html, text };
}

// ─── Router ──────────────────────────────────────────────────────────────────
export type EmailType = 'confirmation' | 'incasso' | 'invoice' | 'payment_received' | 'reminder_1' | 'reminder_2' | 'reminder_3' | 'wik';

export function getEmailTemplate(
  order: CVOrder,
  type: EmailType
): { subject: string; html: string; text?: string } {
  switch (type) {
    case 'confirmation':     return getConfirmationEmail(order);
    case 'invoice':          return getInvoiceEmail(order);
    case 'reminder_1':       return getReminder1Email(order);
    case 'reminder_2':       return getReminder2Email(order);
    case 'reminder_3':       return getReminder3Email(order);
    case 'wik':              return getWikEmail(order);
    case 'incasso':          return getIncassoEmail(order);
    case 'payment_received': return getPaymentReceivedEmail(order);
    default: throw new Error(`Unknown email type: ${type}`);
  }
}
