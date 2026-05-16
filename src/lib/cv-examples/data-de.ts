import { FunctieExample } from './types';
import { buildExampleCV } from './builder';

const EXAMPLES_DE: FunctieExample[] = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'developer',
    functie: 'Software-Entwickler / Engineer',
    title: 'Lebenslauf-Beispiel: Software-Entwickler / Engineer',
    description:
      'Kostenloses Lebenslauf-Beispiel für Software-Entwickler und Engineers. Recruiter-orientiertes Layout für Bewerbungen bei Scale-ups, FAANG und Corporate Tech im DACH-Raum. Inklusive Schreibtipps.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Maximilian',
      lastName: 'Becker',
      email: 'maximilian.becker@example.de',
      phone: '+49 151 12345678',
      city: 'Berlin',
      linkedIn: 'linkedin.com/in/maximilianbecker',
      summary:
        'Backend Engineer mit 7 Jahren Erfahrung in TypeScript und Go bei Scale-ups in Fintech und Travel. Reduzierte die API-Latenz um 42 % durch gezielte Query-Optimierung und Caching. Routiniert in Code-Reviews, Production-Debugging und im Mentoring von Junior-Entwicklern.',
      experiences: [
        {
          jobTitle: 'Senior Backend Engineer',
          company: 'Trivago',
          location: 'Düsseldorf',
          startDate: '2023-02',
          current: true,
          description:
            'Teil des Payments-Plattform-Teams (12 Engineers). Owner der Refund-Service-Domain.',
          tasks: [
            'Migration des Refund-Service vom Monolithen zu einem event-driven Microservice (Kafka) — Reduktion der Refund-Durchlaufzeit von 4 Stunden auf 90 Sekunden bei 18 Mio. Transaktionen/Monat.',
            'Erstellte PR-Templates und Code-Review-Guidelines, die teamweit übernommen wurden.',
            'Mentor von 2 Junior Engineers; beide nach 12 Monaten auf Mid-Level befördert.',
          ],
        },
        {
          jobTitle: 'Full-stack Developer',
          company: 'Klarna',
          location: 'Berlin',
          startDate: '2019-08',
          endDate: '2023-01',
          description: 'Arbeit am Merchant-Dashboard (React + Java Backend).',
          tasks: [
            'Entwickelte ein Echtzeit-Fraud-Rules-Dashboard, das täglich von 200+ Merchants genutzt wird.',
            'Reduzierte die TTI des Dashboards von 4,8 s auf 1,6 s durch Code-Splitting und Cache-Strategie.',
            'Führte Storybook + Visual Regression Testing im Frontend-Team ein.',
          ],
        },
      ],
      educations: [
        {
          degree: 'B.Sc. Informatik',
          institution: 'TU München',
          location: 'München',
          startDate: '2015-09',
          endDate: '2019-06',
        },
      ],
      skills: ['TypeScript', 'Go', 'PostgreSQL', 'Kafka', 'Kubernetes', 'AWS', 'React', 'Node.js'],
      template: 'tech',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Worauf Tech-Recruiter in 6 Sekunden achten',
        body:
          'Recruiter bei Trivago, Klarna, N26 und Stripe Germany scannen Entwickler-Lebensläufe nach drei Dingen gleichzeitig: primäre Sprache/Framework, bekannte Arbeitgeber und konkreter Impact in Zahlen. Setzen Sie Ihren Haupt-Stack (Sprache + Framework + Cloud) in Zeile 1 Ihres Profils — nicht in einen Skills-Tag am Ende. Vermeiden Sie "Leidenschaft fürs Coden" und Klischees wie "Teamplayer"; Personaler im DACH-Raum sehen das tausendfach pro Tag und filtern es konsequent heraus.',
      },
      {
        heading: 'Stichpunkte mit Zahlen schlagen Stichpunkte mit Aufgaben',
        body:
          'Vergleichen Sie "Arbeitete am Refund-Service" mit "Migrierte den Refund-Service vom Monolithen zu einem event-driven Microservice — reduzierte die Durchlaufzeit von 4 h auf 90 s bei 18 Mio. Transaktionen/Monat". Die zweite Variante gewinnt jedes Mal. Gehen Sie jeden Stichpunkt durch und fragen Sie: Was hat sich messbar verändert? Latenz, Throughput, Fehlerrate, Team-Kapazität, Kosten. Wenn Sie keine Zahl haben, beschreiben Sie den Scope ("täglich von 200+ Merchants genutzt").',
      },
      {
        heading: 'Was gehört NICHT auf einen Entwickler-Lebenslauf',
        body:
          'Skill-Balken (sich selbst 4/5 in Excel geben — kein Recruiter nimmt das ernst). Icons neben E-Mail oder Telefon. Ein Foto wird im DACH-Raum traditionell erwartet, aber bei Tech-Unternehmen zunehmend optional — verwenden Sie eines nur, wenn es professionell aussieht. GitHub als reinen Link ohne Kontext — nennen Sie bei jedem relevanten Projekt den Stack und Ihre Rolle. Hobby-Projekte nur, wenn sie wirklich relevant für die Stelle sind; sonst streichen Sie sie.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    functie: 'Pflegekraft / Gesundheits- und Krankenpfleger',
    title: 'Lebenslauf-Beispiel: Pflegekraft (Gesundheits- und Krankenpflege)',
    description:
      'Professionelles Lebenslauf-Beispiel für Pflegekräfte. ATS-konformes Layout für Krankenhäuser, Psychiatrie und ambulante Pflege im DACH-Raum. Inklusive Tipps zur Berufsregistrierung und Spezialisierungen.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Lena',
      lastName: 'Wagner',
      email: 'lena.wagner@example.de',
      phone: '+49 151 98765432',
      city: 'München',
      summary:
        'Examinierte Gesundheits- und Krankenpflegerin mit 9 Jahren Erfahrung auf der Intensivstation und in der Kardiologie. Vertraut mit den KIS-Systemen Orbis und Epic, BLS/ACLS-zertifiziert. Spezialisierung Herzinsuffizienz und postoperative Versorgung. Praxisanleiterin für Auszubildende der Pflegeschule im 2. und 3. Ausbildungsjahr.',
      experiences: [
        {
          jobTitle: 'Intensivpflegerin',
          company: 'Universitätsklinikum LMU München',
          location: 'München',
          startDate: '2021-09',
          current: true,
          description:
            'Intensivstation Erwachsene, Station für Herz-Thorax-Chirurgie. Teil eines Teams aus 14 Intensivpflegekräften.',
          tasks: [
            'Erstversorgung und Stabilisierung postoperativer Patienten nach Herzchirurgie (durchschnittlich 4 Patienten pro Schicht).',
            'Begleitung von Extubationen und Weaning von der mechanischen Beatmung.',
            'Praxisanleiterin für 5 Pflegeauszubildende (3. Ausbildungsjahr) in den letzten 2 Jahren.',
            'Mitglied der Qualitätskommission; Überarbeitung des Protokolls Schmerzmanagement post-CABG.',
          ],
        },
        {
          jobTitle: 'Pflegekraft Kardiologie',
          company: 'Klinikum rechts der Isar',
          location: 'München',
          startDate: '2016-02',
          endDate: '2021-08',
          description:
            'Station C2 — Kardiologie. Allgemeine Pflege und Monitoring bei Herzinsuffizienz, Herzrhythmusstörungen und Post-PCI.',
          tasks: [
            'Verantwortlich für 8-10 Patienten pro Schicht; Koordination mit Kardiologen und Physiotherapie.',
            'Vorbereitung und Nachsorge von Patienten für Herzkatheteruntersuchungen und Schrittmacher-Implantationen.',
            'Erstversorgung bei Reanimationen; Teilnahme am Notfallteam.',
          ],
        },
      ],
      educations: [
        {
          degree: 'B.Sc. Pflegewissenschaft (Bachelor FH/HAW)',
          institution: 'Hochschule München',
          location: 'München',
          startDate: '2012-09',
          endDate: '2016-01',
        },
        {
          degree: 'Fachweiterbildung Intensivpflege (DKG)',
          institution: 'Universitätsklinikum LMU',
          location: 'München',
          startDate: '2022-01',
          endDate: '2023-06',
        },
      ],
      skills: [
        'Pflegekammer-Registrierung',
        'BLS / ACLS',
        'KIS Orbis',
        'Epic',
        'Postoperative Versorgung',
        'Herzinsuffizienz',
        'Praxisanleitung',
        'Triage',
      ],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Berufsregistrierung + Spezialisierung zuerst',
        body:
          'Für Pflegeeinrichtungen sind drei Punkte direkt entscheidend: die Berufsregistrierung (Pflegekammer / examinierte Pflegekraft explizit erwähnen), Ihre Spezialisierung und auf welcher Station/in welchem Setting Sie gearbeitet haben. Setzen Sie diese Informationen in die erste Zeile Ihres Profils. Spezifizieren Sie bei jedem Arbeitgeber die Station und Patientenpopulation — eine allgemeine "Pflegekraft Krankenhaus X" sagt nichts aus, "Intensivpflegerin Herz-Thorax X" ist sofort verständlich.',
      },
      {
        heading: 'Kontinuität und Zertifikate zählen schwer',
        body:
          'Pflegeeinrichtungen schätzen längere Beschäftigungszeiten enorm — zeigen Sie gute Employer-Tenure prominent. Erwähnen Sie Fachweiterbildungen (DKG, Intensivpflege, Anästhesie, Onkologie) und Fortbildungen (BLS, ACLS, ALS, EPALS) in einem eigenen Zertifikate-Abschnitt oder integrieren Sie sie unter Ausbildung. KIS-Erfahrung (Orbis, Epic, Nexus, SAP IS-H) ist für viele Häuser ein Filter — nennen Sie es bei den Kompetenzen.',
      },
      {
        heading: 'Praxisanleitung und Qualität als Plus',
        body:
          'Praxisanleitung von Auszubildenden, Teilnahme an Qualitätskommissionen, Protokollentwicklung — das sind alles starke Signale für Pflegedienstleitungen, die Senior-Pflegekräfte suchen. Nennen Sie sie konkret ("5 Pflegeauszubildende im 3. Ausbildungsjahr in den letzten 2 Jahren"), nicht vage ("Erfahrung in der Anleitung").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'leraar',
    functie: 'Lehrer/in',
    title: 'Lebenslauf-Beispiel: Lehrer/in (Gymnasium / Sekundarstufe)',
    description:
      'Lebenslauf-Beispiel für Lehrer/innen in Grundschule, Sekundarstufe und Hochschule. Mit Tipps zu Staatsexamen, Klassenleitung und Curriculum-Entwicklung im Lebenslauf.',
    templateId: 'modern',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Thomas',
      lastName: 'Schneider',
      email: 'thomas.schneider@example.de',
      phone: '+49 151 22334455',
      city: 'Stuttgart',
      summary:
        'Lehrer mit 2. Staatsexamen für Geschichte, 11 Jahre Erfahrung am Königin-Katharina-Stift Stuttgart (Gymnasium). Klassenlehrer der Oberstufe, Entwickler des schulinternen Curriculums Unterstufe und Mitglied der Fachprüfungskommission Geschichte. Abiturschnitt im Fach Geschichte konstant über dem Landesdurchschnitt Baden-Württemberg.',
      experiences: [
        {
          jobTitle: 'Lehrer Geschichte und Gemeinschaftskunde (Sek. II)',
          company: 'Königin-Katharina-Stift Gymnasium',
          location: 'Stuttgart',
          startDate: '2018-08',
          current: true,
          description:
            'Unterricht in den Klassen 10-12 (Oberstufe) sowie Unterstufe. Klassenlehrer Jahrgangsstufe 11. 90 % Lehrauftrag.',
          tasks: [
            'Klassenlehrer Jahrgangsstufe 11 in 4 aufeinanderfolgenden Jahrgängen; durchschnittlich 28 Schüler pro Klasse.',
            'Abiturdurchschnitt Geschichte: 1,9 (Landesdurchschnitt: 2,4), gemessen über 5 Abiturjahrgänge.',
            'Entwicklung des Fach-Curriculums Unterstufe 2022 — schulweit eingeführt durch alle 6 Geschichtslehrer.',
            'Mitglied der Fachprüfungskommission Geschichte: Sicherstellung der Prüfungsanforderungen und Bewertungsmaßstäbe.',
          ],
        },
        {
          jobTitle: 'Studienreferendar Geschichte & Gemeinschaftskunde',
          company: 'Karls-Gymnasium Stuttgart',
          location: 'Stuttgart',
          startDate: '2014-08',
          endDate: '2018-07',
          description: 'Unterricht in Unter- und Mittelstufe, Fachschaft Geschichte und Gemeinschaftskunde.',
          tasks: [
            'Initiator des Programms "Geschichte vor der Haustür": Schüler erforschen Stuttgarts Industrieerbe.',
            'Mentor für 2 Referendare im Rahmen der Berufseinstiegsphase.',
          ],
        },
      ],
      educations: [
        {
          degree: '2. Staatsexamen Lehramt Gymnasium (Geschichte, Gemeinschaftskunde)',
          institution: 'Seminar für Ausbildung und Fortbildung der Lehrkräfte',
          location: 'Stuttgart',
          startDate: '2016-09',
          endDate: '2018-06',
        },
        {
          degree: '1. Staatsexamen Lehramt Gymnasium (Geschichte, Gemeinschaftskunde)',
          institution: 'Universität Tübingen',
          location: 'Tübingen',
          startDate: '2010-09',
          endDate: '2016-06',
        },
      ],
      skills: [
        '2. Staatsexamen Geschichte',
        'Klassenleitung Oberstufe',
        'Fachprüfungskommission',
        'Curriculumentwicklung',
        'WebUntis',
        'Moodle',
        'Differenzierender Unterricht',
      ],
      template: 'modern',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Lehrbefähigung, Fachkombination und Schulart in der ersten Zeile',
        body:
          'Schulleitungen und Personalverantwortliche scannen auf drei Punkte: Lehrbefähigung (1./2. Staatsexamen, Quereinstieg), Ihre Fachkombination und an welcher Schulart Sie unterrichten (Grundschule / Realschule / Gymnasium / Berufsschule / Hochschule). Setzen Sie diese Kombination in die erste Zeile Ihres Profils. Vermeiden Sie "leidenschaftlich für Wissensvermittlung" — Schulleitungen erkennen diese Floskel sofort.',
      },
      {
        heading: 'Ergebnisse in Zahlen, auch im Bildungsbereich',
        body:
          'Das Tabu rund um Zahlen im Bildungsbereich ist überholt. Ein Abiturdurchschnitt über dem Landesdurchschnitt, Übergangsquoten, Schüler-Feedback-Ergebnisse — wenn Sie eine konkrete Zahl haben, nennen Sie sie. "Abiturdurchschnitt 1,9 (Landesdurchschnitt 2,4) über 5 Jahrgänge" ist ein starkes Signal, dass Sie als Lehrkraft tatsächlich wirksam sind, nicht nur anwesend.',
      },
      {
        heading: 'Curriculumarbeit und Klassenleitung wiegen schwer',
        body:
          'Schulleitungen suchen Lehrkräfte, die mehr tun als nur unterrichten: Curriculumentwicklung, Prüfungskommissionen, Klassenleitung in der Oberstufe, Coaching von Berufseinsteigern. Erwähnen Sie diese Rollen konkret mit Zahlen ("Klassenlehrer Jahrgangsstufe 11 in 4 aufeinanderfolgenden Jahrgängen"). Das hebt Sie von hunderten Lebensläufen ab, in denen nur "Erfahrung im Unterrichten" steht.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'accountant',
    functie: 'Wirtschaftsprüfer / Steuerberater',
    title: 'Lebenslauf-Beispiel: Wirtschaftsprüfer / Steuerberater',
    description:
      'Lebenslauf-Beispiel für Wirtschaftsprüfer, Controller und Finance-Profis. Maßgeschneidert für Bewerbungen bei Big 4, mittelständischen Prüfungsgesellschaften und Konzernen.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Katharina',
      lastName: 'Müller',
      email: 'katharina.mueller@example.de',
      phone: '+49 151 13572468',
      city: 'Frankfurt',
      linkedIn: 'linkedin.com/in/katharinamueller',
      summary:
        'Wirtschaftsprüferin mit 8 Jahren Audit-Erfahrung bei Big 4, spezialisiert auf Finanzinstitute und Retail (Prüfungsmandate >500 Mio. € Umsatz). Verantwortliche Audit-Managerin für 14 Jahresabschlussprüfungen pro Saison. Starke Erfahrung mit IFRS-Transitionen und SOX-Compliance-Projekten.',
      experiences: [
        {
          jobTitle: 'Audit Manager — Financial Services',
          company: 'KPMG Deutschland',
          location: 'Frankfurt am Main',
          startDate: '2022-09',
          current: true,
          description:
            'Verantwortlich für die Durchführung von Prüfungsmandaten bei Banken und Versicherern. Leitung von Teams mit 6-12 Auditoren.',
          tasks: [
            'Audit-Verantwortliche für 4 große Financial-Services-Mandanten mit Gesamtumsatz von 3,2 Mrd. €.',
            'Leitung des IFRS-17-Transitionsprojekts bei Versicherungsmandant; termingerechte Lieferung und uneingeschränkter Bestätigungsvermerk.',
            'Coaching von 3 Senior Associates Richtung Wirtschaftsprüfer-Examen; alle 3 im ersten Anlauf bestanden.',
          ],
        },
        {
          jobTitle: 'Senior Associate Audit',
          company: 'EY Deutschland',
          location: 'Frankfurt am Main',
          startDate: '2018-08',
          endDate: '2022-08',
          description: 'Prüfungsmandate bei Retail- und Konsumgüter-Mandanten.',
          tasks: [
            'Feldarbeits-Koordinatorin bei Jahresabschlussprüfungen bis 800 Mio. € Umsatz (REWE-Zulieferer, börsennotierter Einzelhändler).',
            'Autorin eines internen Quality Memos zu Bestandszyklen; aufgenommen in die deutsche Audit-Methodologie.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Wirtschaftsprüfer (Examen WPK)',
          institution: 'WP-Examen Wirtschaftsprüferkammer',
          location: 'Berlin',
          startDate: '2018-09',
          endDate: '2022-06',
        },
        {
          degree: 'M.Sc. Accounting & Auditing',
          institution: 'Goethe-Universität Frankfurt',
          location: 'Frankfurt am Main',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      skills: ['WP-Titel', 'IFRS', 'SOX', 'IDEA / ACL', 'PowerBI', 'Caseware', 'DATEV', 'Lead Auditor'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Titel, Nische und Seniorität zuerst',
        body:
          'Big 4 und mittelständische Gesellschaften filtern auf drei Kriterien: WP/StB-Titel (oder im Examensprozess), Branchen-Spezialisierung (Financial Services, Retail, Public Sector) und Ihren Manager-Track. Setzen Sie diese Informationen explizit in Zeile 1 Ihres Profils. Wer "Audit Manager" schreibt ohne branchenspezifischen Werdegang, weckt sofort Zweifel.',
      },
      {
        heading: 'Zahlen und Namen sind erlaubt — Diskretion unter NDA möglich',
        body:
          'Wirtschaftsprüfer sind aufgrund der Verschwiegenheitspflicht oft vorsichtig mit Mandantennamen — zu Recht. Aber Umsatzgrößen und Branchenkontext ("REWE-Zulieferer", "börsennotierter Versicherer") sind meist zulässig und wirkungsvoll. Erwähnen Sie auch Examensleistungen (CFO-Präsentationen, IFRS-Transitionen geliefert, uneingeschränkte Bestätigungsvermerke), wenn diese messbar beigetragen haben.',
      },
      {
        heading: 'Beförderungspfad und Coaching-Impact',
        body:
          'Auf Manager-Ebene und darüber ist Ihre Fähigkeit, andere nach oben zu ziehen, ebenso wichtig wie technische Qualität. "Coaching von 3 Senior Associates Richtung WP-Examen; alle 3 im ersten Anlauf bestanden" ist ein starkes Signal für professionelle Qualität auf dem Niveau, das Partner sehen wollen.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    functie: 'Marketing Manager',
    title: 'Lebenslauf-Beispiel: Marketing Manager',
    description:
      'Lebenslauf-Beispiel für (Senior) Marketing Manager in B2B und B2C. Konkrete Schreibtipps, Beispiel-Stichpunkte und empfohlenes Layout für den Recruiter-Scan.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Robin',
      lastName: 'Hoffmann',
      email: 'robin.hoffmann@example.de',
      phone: '+49 151 44556677',
      city: 'Hamburg',
      linkedIn: 'linkedin.com/in/robinhoffmann',
      summary:
        'B2B SaaS Marketing Manager mit 6 Jahren Erfahrung bei deutschen Scale-ups in Fintech und HR-Tech. Owner des Paid-Acquisition-Funnels von Pre-Series-A bis 15 Mio. € ARR. Senkte CAC bei Personio um 38 % in 2 Jahren durch Retargeting + LinkedIn-Ads-Optimierung.',
      experiences: [
        {
          jobTitle: 'Senior Marketing Manager — Demand Generation',
          company: 'Personio',
          location: 'München',
          startDate: '2022-04',
          current: true,
          description:
            'Owner des DACH-Demand-Gen-Funnels für die HR-Plattform. Manager von 3 Spezialisten (Paid, Content, ABM).',
          tasks: [
            'Senkte Customer Acquisition Cost von 1.620 € auf 1.005 € in 18 Monaten durch Retargeting + Funnel-Segmentierung.',
            'Launchte ABM-Programm für 200 Enterprise-Accounts; führte zu 4,2 Mio. € Pipeline innerhalb von 9 Monaten.',
            'Manager eines 3-köpfigen Teams; alle drei erhielten "exceeds expectations" im jährlichen Review.',
          ],
        },
        {
          jobTitle: 'Marketing Manager',
          company: 'Haufe-Lexware',
          location: 'Freiburg',
          startDate: '2019-06',
          endDate: '2022-03',
          description: 'B2B-Marketing für HR-Software im KMU-Segment.',
          tasks: [
            'Baute Content-Marketing-Engine von 0 auf 60.000 monatliche organische Besucher in 24 Monaten.',
            'Launchte MQL-to-SQL-Scoring-Modell in HubSpot; verbesserte die Conversion von 4 % auf 11 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'M.Sc. Marketing Management',
          institution: 'WHU – Otto Beisheim School of Management',
          location: 'Vallendar',
          startDate: '2017-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Demand Generation', 'HubSpot', 'Salesforce', 'Google Ads', 'LinkedIn Ads', 'ABM', 'GA4', 'SQL (Basis)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Funnel-Zahlen sind die Währung',
        body:
          'Recruiter für (Senior) Marketing-Rollen suchen nach einer Sache: Können Sie den Funnel messbar verbessern? Setzen Sie harte Zahlen in jeden Stichpunkt: CAC, MQL→SQL-Conversion, generierte Pipeline, ROAS, hinzugefügtes ARR. "Verantwortlich für Marketing-Strategie" ist Wortgeklingel; "CAC gesenkt von 1.620 € auf 1.005 € in 18 Monaten" ist ein Interview-Trigger.',
      },
      {
        heading: 'Channel-Mix + Tool-Stack explizit',
        body:
          'Nennen Sie konkrete Kanäle (LinkedIn Ads, Google Ads, Retargeting, ABM, Content, Partnerships) und die Tools, die Sie tatsächlich operativ nutzen (HubSpot, Salesforce, Marketo, GA4, Looker). Vages "Marketing Automation" ohne Tool-Namen ist eine rote Flagge — Personaler vermuten dann, dass Sie es nur theoretisch kennen.',
      },
      {
        heading: 'Team- und Stakeholder-Leadership',
        body:
          'Für Senior-Rollen zählt, ob Sie ein Team aufbauen und führen können. "Manager von 3 Spezialisten" ist stärker als "Zusammenarbeit mit Team". Nennen Sie konkret, wen Sie führen (Rollen + Anzahl), und als Sahnehäubchen: Leistungen dieser Teammitglieder ("alle drei exceeds expectations").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verkoper',
    functie: 'Vertriebsmitarbeiter / Account Manager',
    title: 'Lebenslauf-Beispiel: Vertriebsmitarbeiter / Account Manager',
    description:
      'Lebenslauf-Beispiel für Vertriebsmitarbeiter, Account Manager und Sales-Profis. Mit Quota-Attainment-Beispielen und Tipps für B2B vs. B2C Bewerbungen.',
    templateId: 'modern',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Daniel',
      lastName: 'Fischer',
      email: 'daniel.fischer@example.de',
      phone: '+49 151 77889900',
      city: 'Köln',
      linkedIn: 'linkedin.com/in/danielfischer',
      summary:
        'B2B Account Executive mit 5 Jahren Erfahrung im SaaS-Vertrieb — Full-Cycle vom Prospect bis zum Close. Erreichte 138 % des Quota in 2025 bei Salesforce DACH (Deal-Size 60-180 T€, Sales-Cycle 4-7 Monate). Starke Erfahrung mit Multi-Stakeholder-Enterprise-Deals im Finance- und Retail-Sektor.',
      experiences: [
        {
          jobTitle: 'Account Executive — Mid-Market',
          company: 'Salesforce DACH',
          location: 'München',
          startDate: '2023-01',
          current: true,
          description:
            'Full-Cycle Sales: vom Outbound-Prospect bis zum unterschriebenen Vertrag. Fokus auf Mid-Market-Kunden (50-500 Mio. € Umsatz).',
          tasks: [
            'Quota-Attainment 2025: 138 % (2,4 Mio. € ARR geschlossen vs. 1,75 Mio. € Target).',
            '#3 im DACH-Mid-Market-Leaderboard von 22 AEs in H1 2025.',
            'Größter Deal DACH Mid-Market Q4 2024: 380 T€ ARR, 6-Monats-Zyklus, 7 Stakeholder.',
          ],
        },
        {
          jobTitle: 'Sales Development Representative',
          company: 'Personio',
          location: 'München',
          startDate: '2020-08',
          endDate: '2022-12',
          description: 'Outbound-Prospecting in DACH und Benelux. Generierung von MQLs für das AE-Team.',
          tasks: [
            '147 % des SQL-Targets in 2022; Team-Rekord für Outbound-Meetings in einem Monat (38).',
            'Schrieb das Playbook für Cold-Outreach in der Fintech-Nische; intern übernommen von 14 SDRs.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Bachelor Betriebswirtschaftslehre',
          institution: 'Universität zu Köln',
          location: 'Köln',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['B2B SaaS Sales', 'Salesforce CRM', 'MEDDPICC', 'Outreach.io', 'LinkedIn Sales Navigator', 'Forecasting', 'Stakeholder-Mapping'],
      template: 'modern',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Quota-Attainment ist die zentrale Kennzahl',
        body:
          'Nichts überzeugt Sales-Recruiter so wie konkretes Quota-Attainment pro Jahr. Schreiben Sie es exakt: "138 % des Quota 2025 (2,4 Mio. € ARR geschlossen vs. 1,75 Mio. € Target)". Fügen Sie Ranking hinzu, wenn Sie im Team gearbeitet haben ("#3 im DACH-Mid-Market-Leaderboard von 22 AEs"). Vermeiden Sie vage Begriffe wie "erfolgreiche Vertriebsergebnisse".',
      },
      {
        heading: 'Deal-Size, Cycle-Length, Stakeholder-Count',
        body:
          'Für Enterprise-Rollen zählt, ob Sie Multi-Stakeholder-Deals abschließen können. Nennen Sie bei großen Wins die Deal-Size, den Sales-Cycle und die Anzahl Stakeholder ("380 T€ ARR, 6-Monats-Zyklus, 7 Stakeholder"). So schätzen Sales-Leader ein, ob Sie zu deren durchschnittlichem ACV und zur Deal-Komplexität passen.',
      },
      {
        heading: 'Methodologie und Tools zählen',
        body:
          'Nennen Sie die Sales-Methodologie, in der Sie geschult sind (MEDDPICC, MEDDIC, BANT, Challenger, SPIN) und das CRM/Tooling, das Sie aktiv beherrschen (Salesforce, HubSpot, Outreach, Gong). Ein AE ohne Methodologie-Erwähnung auf Senior-Niveau ist eine rote Flagge.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'office-manager',
    functie: 'Office Manager / Assistenz der Geschäftsführung',
    title: 'Lebenslauf-Beispiel: Office Manager / Assistenz der Geschäftsführung',
    description:
      'Lebenslauf-Beispiel für Office Manager, Vorstandsassistenten und Management-Assistants. Konkret und operativ — mit Tipps, wie Sie Ihren Wert messbar machen.',
    templateId: 'minimalist',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Sophie',
      lastName: 'Schäfer',
      email: 'sophie.schaefer@example.de',
      phone: '+49 151 55667788',
      city: 'Berlin',
      summary:
        'Office Managerin mit 12 Jahren Erfahrung in Scale-ups und in einer Großkanzlei. Verantwortlich für das Terminmanagement des CEO + 3 Vorstandsmitglieder, die Facility-Operations eines Standorts mit 140 Mitarbeitenden und alle Onboarding-Prozesse. Vertraut mit Personio, Notion, Asana, Concur.',
      experiences: [
        {
          jobTitle: 'Office Manager',
          company: 'N26',
          location: 'Berlin',
          startDate: '2021-02',
          current: true,
          description:
            'Verantwortlich für den Hauptsitz-Betrieb (140 FTE) und das Terminmanagement des CEO + 3 Vorstandsmitglieder.',
          tasks: [
            'Verwaltung des CEO-Kalenders inkl. internationaler Reisen (durchschnittlich 2 Trips/Monat zu EU-Hubs).',
            'Onboarding-Koordinatorin: 38 neue Mitarbeitende in 2024 — 100 % Einarbeitungs-Readiness am Tag 1.',
            'Neuverhandlung des Mietvertrags für die Büroflächen: jährliche Einsparung von 72.000 € bei gleicher Quadratmeterzahl.',
            'Owner des Facilities-Lieferantenpools (Catering, Reinigung, Büroartikel) — 6 Verträge.',
          ],
        },
        {
          jobTitle: 'Vorstandsassistentin',
          company: 'Hengeler Mueller',
          location: 'Frankfurt am Main',
          startDate: '2014-09',
          endDate: '2021-01',
          description: 'Unterstützung von 4 Partnern und deren Teams im Bereich M&A.',
          tasks: [
            'Verwaltung der Partner-Kalender und Mandantenkorrespondenz (DE/EN).',
            'Koordination von Closing-Meetings bei großen Transaktionen — durchschnittlich 8 Closings pro Jahr.',
            'Mitglied im Office-Improvement-Team; Überarbeitung des Onboarding-Prozesses für Referendare.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Kauffrau für Büromanagement (IHK)',
          institution: 'IHK Berlin',
          location: 'Berlin',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: ['Personio', 'Notion', 'Asana', 'Concur', 'Microsoft 365', 'Vendor-Management', 'Onboarding', 'Englisch (verhandlungssicher)'],
      template: 'minimalist',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Operativer Scope vor persönlichen Qualitäten',
        body:
          'Der Klischee-Lebenslauf eines Office Managers beginnt mit "organisiert, kommunikativ, belastbar". Personaler glauben das erst, wenn sie den operativen Scope sehen. Setzen Sie den Maßstab in Zeile 1: Anzahl Mitarbeitende, für die Sie Facilities verantworten, Anzahl Vorstandsmitglieder, deren Kalender Sie verwalten, Anzahl Lieferanten in Ihrem Pool.',
      },
      {
        heading: 'Machen Sie Ihren Wert messbar',
        body:
          'Office-Management-Arbeit wirkt soft, lässt sich aber oft gut in Zahlen übersetzen: jährliche Einsparung bei Verträgen, Anzahl Onboardings pro Jahr, % Readiness am Tag 1, Durchlaufzeit von Facility-Issues. Eine konkrete Zahl in einem Stichpunkt ("jährliche Einsparung 72.000 € bei gleicher Quadratmeterzahl") ist stärker als fünf Adjektive.',
      },
      {
        heading: 'Tools explizit nennen',
        body:
          'Erwähnen Sie die exakten Systeme, die Sie täglich nutzen (Personio, Workday, Concur, Notion, Asana, Slack, MS365). Für Personaler von Scale-ups ist das ein direkter Filter — sie suchen jemanden, der am Tag 1 produktiv ist, nicht erst Tool-Trainings braucht.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'projectmanager',
    functie: 'Projektmanager',
    title: 'Lebenslauf-Beispiel: Projektmanager',
    description:
      'Lebenslauf-Beispiel für Projektmanager in IT, Construction und Consulting. Mit Tipps zu Budget-Impact, Methodologie-Erwähnung und Stakeholder-Management.',
    templateId: 'executive',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Mariska',
      lastName: 'Bauer',
      email: 'mariska.bauer@example.de',
      phone: '+49 151 88990011',
      city: 'Frankfurt',
      linkedIn: 'linkedin.com/in/mariskabauer',
      summary:
        'Senior PMP-zertifizierte Projektmanagerin mit 10 Jahren Erfahrung in Digital-Transformation-Programmen bei Finanzinstituten. Geliefert: 4 große ERP-Implementierungen und ein PSD2-Compliance-Projekt, Gesamtbudget 18 Mio. €. Starke Erfahrung mit Agile/Scrum und hybriden Wasserfall-Umgebungen.',
      experiences: [
        {
          jobTitle: 'Senior Project Manager — Digital Transformation',
          company: 'Deutsche Bank',
          location: 'Frankfurt am Main',
          startDate: '2022-03',
          current: true,
          description:
            'Programm-Management der Core-Banking-Modernisierung. Stakeholder-Management auf Vorstandsebene.',
          tasks: [
            'Leitung der Modernisierung der Zahlungsplattform: 28 FTE, Budget 6,4 Mio. €, geliefert 3 Monate vor Plan.',
            'Lenkungsausschuss-Sekretärin mit CFO + CIO + COO als Teilnehmern; monatliches Reporting im Board.',
            'Coach von 4 Medior-PMs in der bankinternen PM-Academy.',
          ],
        },
        {
          jobTitle: 'Project Manager — IT Programs',
          company: 'Allianz',
          location: 'München',
          startDate: '2017-09',
          endDate: '2022-02',
          description: 'IT-Programmmanagement innerhalb der Life-Pensions-Division.',
          tasks: [
            'Lead des PSD2-Compliance-Projekts (3,2 Mio. € Budget, 18 Monate, 14 FTE); 100 % Audit-clean.',
            'Salesforce Marketing Cloud-Implementierung: Rollout auf 4 Business Units, ROI Break-Even in Monat 9.',
          ],
        },
      ],
      educations: [
        {
          degree: 'PMP — Project Management Professional (PMI)',
          institution: 'Project Management Institute',
          location: 'Online',
          startDate: '2019-03',
          endDate: '2019-06',
        },
        {
          degree: 'M.Sc. Betriebswirtschaftslehre',
          institution: 'Universität Mannheim',
          location: 'Mannheim',
          startDate: '2011-09',
          endDate: '2013-08',
        },
      ],
      skills: ['PMP', 'PRINCE2', 'Agile / Scrum', 'JIRA', 'Confluence', 'MS Project', 'Stakeholder-Management', 'Risikomanagement'],
      template: 'executive',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Budget, Scope und Durchlaufzeit — alle drei',
        body:
          'Für PM-Rollen sind drei Metriken die Währung: Budget des Projekts, Anzahl FTE/Scope und Lieferung vs. Plan. "Leitung der Modernisierung der Zahlungsplattform: 28 FTE, Budget 6,4 Mio. €, geliefert 3 Monate vor Plan" sagt mehr als eine halbe Seite Adjektive. Wenn Sie ein Projekt on-budget und on-time geliefert haben, erwähnen Sie es. Wenn Sie vor Plan geliefert haben, ist das ein Interview-Trigger.',
      },
      {
        heading: 'Methodologie + Zertifizierung erwähnen',
        body:
          'PMP, PRINCE2, AgilePM und Scrum Master gehören in Ihre Kompetenzen oder in einen separaten Zertifizierungs-Abschnitt. Für Enterprise-Rollen ist PMP oder PRINCE2 oft ein Filter. Nennen Sie die Methodologie, die Sie tatsächlich verwenden (Agile/Scrum, Wasserfall, hybrid) und welche Tools (JIRA, MS Project, Asana).',
      },
      {
        heading: 'Lenkungsausschuss- und Stakeholder-Ebene',
        body:
          'Auf Senior-Niveau suchen Vorstände jemanden, der in Lenkungsausschüssen agieren kann. Nennen Sie konkret, auf welcher Ebene Sie berichtet haben ("Lenkungsausschuss mit CFO + CIO + COO", "monatliches Reporting im Board"). Das unterscheidet Junior- von Senior-PMs in Sekunden.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'stagiair',
    functie: 'Praktikant',
    title: 'Lebenslauf-Beispiel: Praktikum (Bachelor & Master)',
    description:
      'Kostenloses Lebenslauf-Beispiel für Studierende auf der Suche nach einem Praktikum. Bachelor und Master. Inklusive Tipps, was Sie tun können, wenn Sie wenig Berufserfahrung haben.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Emma',
      lastName: 'Lehmann',
      email: 'emma.lehmann@example.de',
      phone: '+49 151 11223344',
      city: 'München',
      linkedIn: 'linkedin.com/in/emmalehmann',
      summary:
        'Studentin der Betriebswirtschaftslehre im 5. Semester an der LMU München mit starkem Interesse an Strategie-Beratung. Vorsitzende der Studierendeninitiative MTP München (560 Mitglieder), Case-Finalistin bei der McKinsey Academy 2025 und 3 Jahre Werkstudentin bei REWE. Verfügbar für ein 5-monatiges Praktikum ab Februar 2026.',
      experiences: [
        {
          jobTitle: 'Vorsitzende des Vorstands',
          company: 'Studierendeninitiative MTP München',
          location: 'München',
          startDate: '2024-09',
          current: true,
          description: 'Leitung eines 6-köpfigen Vorstands. 560 Mitglieder, Jahresumsatz 120.000 €.',
          tasks: [
            'Verhandelte Sponsoring-Deal mit BCG (3-Jahres-Vertrag, 45.000 €/Jahr).',
            'Organisation des jährlichen "Marketing Battle"-Events: 220 Teilnehmer, 14 Corporate-Partner.',
            'Wöchentliche 1:1s mit 5 Ressortleitern; Coaching zu Leadership-Fähigkeiten.',
          ],
        },
        {
          jobTitle: 'Werkstudentin (Verkauf & Kasse)',
          company: 'REWE',
          location: 'München',
          startDate: '2022-09',
          endDate: '2024-08',
          description: 'Teilzeit-Tätigkeit neben dem Studium. Verkauf und Kasse.',
          tasks: [
            'Befördert zur Shift-Coach für neue Werkstudenten (nach 8 Monaten).',
            'Verantwortlich für den Sortiments-Reset-Prozess beim Wechsel saisonaler Kampagnen.',
          ],
        },
      ],
      educations: [
        {
          degree: 'B.Sc. Betriebswirtschaftslehre',
          institution: 'LMU München',
          location: 'München',
          startDate: '2023-09',
          endDate: '2026-08',
          description: 'Voraussichtlicher Abschluss Sommer 2026. Notendurchschnitt 1,7. Honors-Track Strategy & Innovation.',
        },
        {
          degree: 'Abitur (mit Auszeichnung)',
          institution: 'Humboldt-Gymnasium München',
          location: 'München',
          startDate: '2017-09',
          endDate: '2023-07',
        },
      ],
      skills: ['Excel (fortgeschritten)', 'PowerPoint', 'Python (Basis)', 'Tableau (Basis)', 'Englisch (C1)', 'Französisch (B2)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Das Berufserfahrungs-Paradox: Leadership > Nebenjobs',
        body:
          'Als Studierende/r haben Sie wenig Berufserfahrung — das ist OK. Was Personaler bei McKinsey, Bain, Deutsche Bank und Henkel bei Praktikumskandidaten suchen, sind nicht Jahre an Erfahrung, sondern SIGNALE für Leadership, Eigenverantwortung und intellektuellen Hunger. Eine Rolle als Vorsitzende einer Studierendeninitiative (mit konkreten Zahlen: Mitgliederzahl, Umsatz, Sponsoring-Deals) wiegt schwerer als zwei Jahre Kasse.',
      },
      {
        heading: 'Notendurchschnitt, Honors-Tracks und Cases erwähnen',
        body:
          'Für Strategie-Beratung und Investment Banking sind Noten buchstäblich ein Filter (Top 5-10 % Ihres Jahrgangs). Nennen Sie Ihren Notendurchschnitt, wenn er besser als 2,0 ist, Ihren Honors-Track und Case-Competition-Ergebnisse ("McKinsey Academy 2025 Case-Finalistin" — das triggert ein Gespräch). Die Verfügbarkeit explizit zu nennen ("ab Februar 2026, 5 Monate") hilft Personalern bei der Planung.',
      },
      {
        heading: 'Kleine Arbeit groß machen — ehrlich',
        body:
          'Ein Studierendenjob bei REWE kann eine starke Geschichte sein, wenn Sie ihn konkret machen: "Befördert zur Shift-Coach nach 8 Monaten" zeigt, dass Sie aufgefallen sind; "Verantwortlich für den Sortiments-Reset-Prozess" zeigt Eigenverantwortung. Vermeiden Sie Übertreibung ("revolutionierte den Markt") — Personaler erkennen das sofort.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'consultant',
    functie: 'Berater / Strategie-Berater',
    title: 'Lebenslauf-Beispiel: Berater / Strategie-Berater',
    description:
      'Lebenslauf-Beispiel für Management-Berater und Strategie-Berater. Inklusive MBB-Format, Case-Impact-Stichpunkten und Branchenangaben.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Florian',
      lastName: 'Huber',
      email: 'florian.huber@example.at',
      phone: '+43 660 3344556',
      city: 'Wien',
      linkedIn: 'linkedin.com/in/florianhuber',
      summary:
        'Senior Berater mit 6 Jahren Erfahrung bei McKinsey & Company DACH, spezialisiert auf Financial Services und Post-Merger-Integration. Lead bei 3 PMI-Projekten (Gesamtdeal-Volumen 4,1 Mrd. €). Stanford MBA. Gastdozent für den MBA-Kurs "Value Creation in M&A" an der WU Wien.',
      experiences: [
        {
          jobTitle: 'Engagement Manager',
          company: 'McKinsey & Company',
          location: 'Wien',
          startDate: '2022-08',
          current: true,
          description:
            'Lead-Berater bei High-Stakes-Engagements in der Banking & Insurance Practice. Leitung von 3-5 Associates pro Case.',
          tasks: [
            'Lead PMI-Projekt für die Fusion zweier DACH-Banken (2,4 Mrd. € Deal): geliefert 6 Monate vor Target.',
            'Cost-Transformation-Programm bei EU-Versicherer: 120 Mio. € Annual Run-Rate Savings identifiziert, 88 Mio. € umgesetzt.',
            'Coach von 4 Associates Richtung Engagement-Manager-Beförderung; 3 im ersten Anlauf erfolgreich.',
          ],
        },
        {
          jobTitle: 'Associate',
          company: 'McKinsey & Company',
          location: 'Wien',
          startDate: '2019-09',
          endDate: '2022-07',
          description: 'Engagements primär in Public Sector und Financial Services.',
          tasks: [
            'Quantitative Modellierung für Vorstandspräsentationen; Autor von 3 client-facing Excel-Modellen.',
            'Initiator interner Research zu "Post-COVID Retail Banking" — veröffentlicht durch die DACH Banking Practice.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MBA',
          institution: 'Stanford Graduate School of Business',
          location: 'Stanford, USA',
          startDate: '2017-08',
          endDate: '2019-06',
        },
        {
          degree: 'B.Sc. Volkswirtschaftslehre (mit Auszeichnung)',
          institution: 'Universität Wien',
          location: 'Wien',
          startDate: '2013-09',
          endDate: '2016-06',
        },
      ],
      skills: ['M&A / PMI', 'Financial Modeling', 'Stakeholder-Management', 'Workshop-Moderation', 'Excel/PowerPoint', 'Deutsch / Englisch / Französisch'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'MBB-Lebenslauf: das "Little Black Dress"-Format',
        body:
          'Bei MBB (McKinsey, BCG, Bain) und Strategy-Tier-Beratungen ist das Format strenger als anderswo: eine Seite, schwarz-weiß, konservative Typografie, keine Farbe, kein Foto. Die Zakelijk- oder Executive-Vorlage von ResuBox passt hier. Zahlen und Namen wo möglich — McKinsey liest einen Case-Stichpunkt ohne Zahl als unbewiesen.',
      },
      {
        heading: 'Cases mit Deal-Volumen, Scope und Impact',
        body:
          'Beschreiben Sie Cases in drei Dimensionen: Scope (Deal-Volumen, FTE-Impact, geografische Reichweite), Ihre Rolle (Analyst / Associate / EM) und konkreter Impact ("88 Mio. € umgesetzt"). NDA-Aspekte: Branche und Deal-Größe sind meist auch ohne Mandantennamen zulässig — bei Zweifeln anonymisieren ("EU-Versicherer") und bei Zahlen konkret bleiben.',
      },
      {
        heading: 'MBA, GMAT, Sprachen — ja oder nein',
        body:
          'Für Strategy-Consulting wiegt die Ausbildung schwer. Top-MBA-Programme (Stanford, INSEAD, LBS, IESE, Harvard, HHL) immer nennen — starker Filter. GMAT-Score nur, wenn über 720. Auszeichnungen / Honors-Tracks immer erwähnen. Sprachen auf C-Niveau oder Muttersprache (DE/EN/FR/IT) sind für internationale Engagements oft ein echter Pluspunkt, erwähnen Sie sie.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'logistiek-medewerker',
    functie: 'Lagermitarbeiter',
    title: 'Lebenslauf-Beispiel: Lagermitarbeiter',
    description:
      'Lebenslauf-Beispiel für Lagermitarbeiter in Distributionszentren, Transport und Warehousing. Mit Staplerschein, WMS-Kenntnissen und Tipps für Zeitarbeitsverträge.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Kevin',
      lastName: 'Schulz',
      email: 'kevin.schulz@example.de',
      phone: '+49 151 11223344',
      city: 'Leipzig',
      summary:
        'Erfahrener Lagermitarbeiter mit 7 Jahren Berufserfahrung in Food-Distribution und E-Commerce-Fulfilment. Staplerschein und Schubmaststapler-Zertifikat, Erfahrung mit den WMS-Systemen SAP EWM und Manhattan. Festangestellt bei DHL Supply Chain seit 2020, mehrfach mit Shift-Coach-Verantwortung betraut.',
      experiences: [
        {
          jobTitle: 'Senior Kommissionierer / Shift-Coach',
          company: 'DHL Supply Chain',
          location: 'Leipzig',
          startDate: '2020-04',
          current: true,
          description: 'Distributionszentrum für REWE-Zulieferer. 2-Schicht-Betrieb (06:00-14:30 / 14:30-23:00).',
          tasks: [
            'Picken und Konsolidieren von Aufträgen mit VR-Brille (Honeywell A700x); durchschnittlich 220 Picks/Stunde.',
            'Shift-Coach für ein Team von 8 Leiharbeitenden; erster Ansprechpartner bei Störungen.',
            'Zyklische Inventur: Genauigkeit 99,4 % über das Kalenderjahr 2024.',
          ],
        },
        {
          jobTitle: 'Staplerfahrer',
          company: 'Amazon Fulfilment',
          location: 'Halle',
          startDate: '2018-02',
          endDate: '2020-03',
          description: 'Inbound-Warenstrom in einem der größten Fulfilment-Center Mitteldeutschlands.',
          tasks: [
            'Entladen von Containern (durchschnittlich 6 pro Schicht); Einbuchen über Manhattan WMS.',
            'Verlagerung von Paletten zu verschiedenen Lagerorten mit dem Schubmaststapler.',
            'Zero-Accident-Bilanz über 24 Monate.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Fachkraft für Lagerlogistik',
          institution: 'IHK Leipzig',
          location: 'Leipzig',
          startDate: '2015-09',
          endDate: '2017-06',
        },
      ],
      skills: ['Staplerschein', 'Schubmaststapler-Zertifikat', 'SAP EWM', 'Manhattan WMS', 'VR-Picking (Honeywell)', 'Sicherheitsunterweisung'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Zertifikate in Zeile 1 Ihres Profils',
        body:
          'Logistik-Arbeitgeber screenen auf eine Sache: Kann diese Person morgen anfangen? Setzen Sie Ihre Zertifikate (Staplerschein, Schubmaststapler, Gefahrgutschein/ADR) und WMS-Systeme direkt nach oben. Vermeiden Sie vage Profile wie "fleißige Fachkraft"; nennen Sie, dass Sie zertifiziert sind und auf welchen Systemen.',
      },
      {
        heading: 'Zahlen wo möglich',
        body:
          'Picks pro Stunde, Genauigkeits-Prozentsatz, Zero-Accident-Records, Anzahl Container pro Schicht — alle messbaren Daten zählen. Logistik-Recruiter bei DHL, Amazon, REWE und Deutsche Post suchen gezielt nach diesen Zahlen, weil sie zwischen Kandidaten direkt vergleichbar sind.',
      },
      {
        heading: 'Shift-Coach / Teamleiter-Erfahrung explizit',
        body:
          'Viele Lagermitarbeiter erhalten nach 1-2 Jahren Coach-Verantwortung für Leiharbeitende oder neue Kollegen. Erwähnen Sie es konkret ("Shift-Coach für ein Team von 8 Leiharbeitenden"). Das signalisiert Beförderungspotenzial Richtung Abteilungsleiter-Rollen.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'monteur',
    functie: 'Mechaniker / Techniker',
    title: 'Lebenslauf-Beispiel: Mechaniker / Anlagenmechaniker SHK',
    description:
      'Lebenslauf-Beispiel für Elektriker, KFZ-Mechaniker und Anlagenmechaniker SHK. Mit Zertifizierungen, Auftraggebern und Tipps für selbstständige Monteure.',
    templateId: 'zakelijk',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Jens',
      lastName: 'Krüger',
      email: 'jens.krueger@example.de',
      phone: '+49 151 22334455',
      city: 'Hannover',
      summary:
        'Geselle Anlagenmechaniker SHK mit 12 Jahren Erfahrung in Heizungsanlagen, Wärmepumpen und Solarthermie bei Vaillant und lokalen SHK-Betrieben. F-Gase-Sachkundenachweis, VDE 0100 und BG ETEM. Bei Bosch Home Comfort verantwortlich für das Schulungsprogramm rund um Hybrid-Wärmepumpen.',
      experiences: [
        {
          jobTitle: 'Geselle Anlagenmechaniker SHK',
          company: 'Bosch Home Comfort Service',
          location: 'Region Hannover-Braunschweig',
          startDate: '2019-06',
          current: true,
          description: 'Installation und Service von Heizungsanlagen, Hybrid-Wärmepumpen und Brennwertkesseln bei Privathaushalten und WEGs.',
          tasks: [
            'Endverantwortlich für durchschnittlich 4 Installationen pro Woche; Kundenzufriedenheit 4,8/5,0 in 2024.',
            'Trainer für 6 neue Kollegen in 2023-2024 im Bereich Hybrid-Wärmepumpen.',
            'Mitglied im regionalen Störungsdienst außerhalb der Bürozeiten (2 Nächte pro Monat).',
          ],
        },
        {
          jobTitle: 'Anlagenmechaniker SHK',
          company: 'Krüger Heizungstechnik GmbH',
          location: 'Hannover',
          startDate: '2013-08',
          endDate: '2019-05',
          description: 'Familienbetrieb — Heizungs- und Sanitärinstallationen für Privatkunden.',
          tasks: [
            'Installation und Wartung von Vaillant-, Viessmann- und Buderus-Brennwertkesseln.',
            'Sanierungsprojekte in denkmalgeschützten Gebäuden inklusive Rohrleitungsbau und Sanitär.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Anlagenmechaniker SHK (Geselle)',
          institution: 'Handwerkskammer Hannover',
          location: 'Hannover',
          startDate: '2009-09',
          endDate: '2013-07',
        },
      ],
      skills: ['F-Gase Kat. I', 'VDE 0100', 'BG ETEM', 'Hybrid-Wärmepumpen', 'Vaillant / Viessmann / Buderus', 'Sanitärinstallation', 'Führerschein Klasse B'],
      template: 'zakelijk',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Zertifikate als harter Filter',
        body:
          'SHK-Betriebe können ohne F-Gase-Sachkundenachweis oder VDE 0100 keine Aufträge vergeben; nennen Sie diese in Ihrem Profil. Speziell bei Wärmepumpen: BAFA-Anerkennung oder Hersteller-Trainings (Vaillant, Viessmann) nennen. Auch Ihren Führerschein erwähnen (Klasse B ist meist Pflicht für den Servicemonteur).',
      },
      {
        heading: 'Kundenzufriedenheit und Zuverlässigkeit zählen',
        body:
          'Arbeitgeber wie Bosch, Vaillant und Viessmann bewerten Monteure teilweise nach Kunden-Feedback. Haben Sie eine Note aus Ihrem Service-Management-System? Erwähnen Sie sie. Keine Note? Nennen Sie Zero-Accident-Jahre, On-Time-Completion-Rate oder First-Time-Fix-Prozentsatz.',
      },
      {
        heading: 'Spezialisierung Hybrid-Wärmepumpen ist der Skill 2026',
        body:
          'Die Energiewende und das Gebäudeenergiegesetz machen die Wärmepumpen-Installation zur Wachstumsnische. Wenn Sie Erfahrung oder Schulung in diesem Bereich haben, schreiben Sie es explizit. Personaler bei Bosch, Vaillant und Stiebel Eltron suchen gezielt danach.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'horeca-medewerker',
    functie: 'Servicekraft / Kellner',
    title: 'Lebenslauf-Beispiel: Gastronomie (Service / Koch / Barkeeper)',
    description:
      'Lebenslauf-Beispiel für Gastronomie-Mitarbeiter in Restaurants, Hotels und Catering. Mit Tipps zu Saisonarbeit, Trinkgeld-Umsatz und Aufstieg zum Schichtleiter.',
    templateId: 'creatief',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Lotte',
      lastName: 'Bauer',
      email: 'lotte.bauer@example.de',
      phone: '+49 151 33445566',
      city: 'Wien',
      summary:
        'Allround-Servicekraft mit 6 Jahren Erfahrung im Fine-Dining-Service bei Restaurant Steirereck (2 Sterne) und Restaurant Tian. Sommelier-Kurs an der Sommelier-Union Austria 2024 abgeschlossen. Aufstieg zum Schichtleiter bei Tian: Leitung von 4 Kollegen während Services mit 80+ Couverts.',
      experiences: [
        {
          jobTitle: 'Schichtleiter Service',
          company: 'Restaurant Tian',
          location: 'Wien',
          startDate: '2022-04',
          current: true,
          description: 'Vegetarisches Fine-Dining-Restaurant im 1. Bezirk. Mittag- und Abendservice, 80-100 Couverts pro Service.',
          tasks: [
            'Leitung von 4 Mitarbeitenden pro Schicht; verantwortlich für den Runner-Flow und die Menü-Erläuterung.',
            'Wein-Empfehlungen geben und Wein-Pairings mit der Küche entwickeln; Flaschen-Umsatz +18 % in 2024.',
            'Coach für neue Mitarbeitende in ihren ersten 6 Wochen.',
          ],
        },
        {
          jobTitle: 'Service',
          company: 'Restaurant Steirereck**',
          location: 'Wien',
          startDate: '2019-08',
          endDate: '2022-03',
          description: '2-Sterne-Restaurant im Stadtpark. À la carte und Chef\'s Menu.',
          tasks: [
            'À la carte Service und Wein-Pairing für das 7-Gänge Chef\'s Menu.',
            'Kommunikation in Deutsch, Englisch und Französisch mit internationaler Klientel.',
            'Mitglied des Eröffnungsteams für die Sommer-Terrassen-Edition 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Sommelier-Kurs (Grundniveau)',
          institution: 'Sommelier-Union Austria',
          location: 'Wien',
          startDate: '2024-01',
          endDate: '2024-06',
        },
        {
          degree: 'Berufsausbildung Restaurantfachfrau (Lehre)',
          institution: 'WIFI Wien',
          location: 'Wien',
          startDate: '2016-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Wein-Pairing', 'Englisch (fließend)', 'Französisch (fortgeschritten)', 'POS Untill', 'Allergene-Coaching', 'Hygieneschulung'],
      template: 'creatief',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Spezialisierung + Niveau in Zeile 1',
        body:
          'Gastronomie-Arbeitgeber (Steirereck, Tian, Hotel Sacher, Kempinski, Adlon) screenen auf Niveau: Fine-Dining vs. Brasserie vs. Fast-Service. Spezifizieren Sie, wo Sie gearbeitet haben (Sterne-Restaurant, Hotel-Kette, lokale Bistro). Sprachen erwähnen — Französisch oder Italienisch für internationale Klientel in Wien oder München ist ein echter Unterschied.',
      },
      {
        heading: 'Aufstieg und Verantwortung',
        body:
          'Viele Servicekräfte wachsen intern zum Schichtleiter, Supervisor oder Chef de Rang. Erwähnen Sie diesen Titel, wenn Sie ihn hatten — Arbeitgeber sehen dann, dass andere Sie bereits befördert haben. Auch: Mitglied eines Eröffnungsteams für einen neuen Standort gewesen zu sein, ist ein starkes Signal.',
      },
      {
        heading: 'Zahlen wo möglich: Umsatz, Couverts, Trinkgeld',
        body:
          'Wein-Umsatz +%, Trinkgeld-Umsatz, durchschnittliche Couverts pro Service. Nicht alle Zahlen sind verfügbar, aber wenn Sie eine haben, nutzen Sie sie. "+18 % Flaschen-Umsatz 2024" sagt viel mehr als "leidenschaftlich für Wein".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'data-analist',
    functie: 'Data Analyst',
    title: 'Lebenslauf-Beispiel: Data Analyst',
    description:
      'Lebenslauf-Beispiel für Data Analysts mit SQL, Python, Tableau und Power BI. Mit Tipps zu Portfolio, Business-Impact und Aufstieg zum Analytics Engineer.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Anna',
      lastName: 'Weber',
      email: 'anna.weber@example.de',
      phone: '+49 151 44556677',
      city: 'Hamburg',
      linkedIn: 'linkedin.com/in/annaweber',
      summary:
        'Data Analyst mit 4 Jahren Erfahrung in Retail-Analytics bei REWE und HelloFresh. SQL, Python (pandas, scikit-learn) und dbt für Pipelines; Tableau und Power BI für Stakeholder-Reportings. Owner des wöchentlichen Forecasting-Dashboards, auf das 12 Category Manager für Einkaufsentscheidungen zugreifen.',
      experiences: [
        {
          jobTitle: 'Data Analyst — Category & Pricing',
          company: 'HelloFresh',
          location: 'Berlin',
          startDate: '2023-08',
          current: true,
          description: 'Analytics-Team innerhalb Commerce, unterstützt 12 Category Manager bei datengetriebenen Einkaufs- und Preisentscheidungen.',
          tasks: [
            'Baute Forecasting-Dashboard in Tableau, das 12 Category Manager wöchentlich für Einkaufsentscheidungen nutzen.',
            'Migrierte 8 Legacy-Reports von Excel zu dbt + Looker; durchschnittliche Refresh-Zeit von 3 h auf 8 min reduziert.',
            'A/B-Test-Analyse für Promo-Mechaniken; identifizierte, dass "2-für-1" bei Frischeprodukten 23 % besser performte als ein Rabatt.',
          ],
        },
        {
          jobTitle: 'Junior Data Analyst',
          company: 'REWE Digital',
          location: 'Köln',
          startDate: '2021-09',
          endDate: '2023-07',
          description: 'Teil des Customer-Insights-Teams innerhalb REWE Online.',
          tasks: [
            'SQL-Queries und Dashboards in Power BI für das Marketing-Team.',
            'RFM-Segmentierung der PAYBACK-Kunden; Pilot führte zu +340.000 € inkrementellem Umsatz.',
          ],
        },
      ],
      educations: [
        {
          degree: 'M.Sc. Business Analytics',
          institution: 'Universität Mannheim',
          location: 'Mannheim',
          startDate: '2019-09',
          endDate: '2021-08',
        },
      ],
      skills: ['SQL (fortgeschritten)', 'Python (pandas, scikit-learn)', 'dbt', 'Tableau', 'Power BI', 'Looker', 'A/B-Testing', 'Statistische Analyse'],
      template: 'tech',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Tools + Impact, nicht nur Tools',
        body:
          'Jeder schreibt "SQL und Python". Was Sie unterscheidet: Was haben Sie damit gemacht und was hat sich messbar verändert? "Baute Forecasting-Dashboard, das 12 Category Manager wöchentlich nutzen" ist stärker als "Tableau-Erfahrung".',
      },
      {
        heading: 'Maßstab des Impacts in Zahlen',
        body:
          'Für Data-Analyst-Rollen sind drei Zahlen König: Umsatz/Kosten-Impact (€), Effizienz-Gewinne (gesparte Stunden, Refresh-Zeit) und Dataset-Größe/User (12 Stakeholder, 500.000 Kunden, 8 Mio. Rows). Wählen Sie eine pro Stichpunkt.',
      },
      {
        heading: 'Tool-Stack passend zur Zielrolle — exakt übernehmen',
        body:
          'Personaler bei Zalando, Delivery Hero, HelloFresh und Otto nutzen Keyword-Matching. Wenn die Stellenanzeige dbt + Looker nennt und Sie es können, schreiben Sie genau diese Wörter. Nicht "Transformationen bauen" — sondern "dbt-Models bauen".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'hr-manager',
    functie: 'HR Manager / Personalreferent',
    title: 'Lebenslauf-Beispiel: HR Manager / Personalreferent',
    description:
      'Lebenslauf-Beispiel für HR Manager und Personalreferenten. Mit Tipps zu Mitarbeiterzufriedenheit, ATS-Tooling und Aufstieg vom HR Generalist zum Manager.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Sandra',
      lastName: 'Klein',
      email: 'sandra.klein@example.de',
      phone: '+49 151 55667788',
      city: 'Stuttgart',
      linkedIn: 'linkedin.com/in/sandraklein',
      summary:
        'HR Manager mit 9 Jahren Erfahrung in Scale-ups und Mid-Market (50-400 FTE) in Tech und Pflege. Owner des gesamten HR-Cycles bei Personio Stuttgart: Recruitment, Onboarding, Performance, Comp&Ben und Exit. Senkte die Mitarbeiterfluktuation in 18 Monaten von 18 % auf 11 % durch ein strukturiertes Onboarding-Programm und Quarterly Check-ins.',
      experiences: [
        {
          jobTitle: 'HR Manager DACH',
          company: 'Personio',
          location: 'Stuttgart',
          startDate: '2022-01',
          current: true,
          description: 'Verantwortlich für die DACH-Organisation (180 FTE). Direkter Bericht an VP People.',
          tasks: [
            'Senkung der Mitarbeiterfluktuation von 18 % auf 11 % in 18 Monaten durch Onboarding-Redesign und Quarterly-1:1-Cycle.',
            'Implementierung Workday (Migration von BambooHR); termingerechte Lieferung eines 4-Monats-Projekts mit 0 Data-Issues.',
            'Manager von 2 HR Business Partnern und 1 People Ops Specialist.',
          ],
        },
        {
          jobTitle: 'HR Business Partner',
          company: 'Caritas Stuttgart',
          location: 'Stuttgart',
          startDate: '2017-04',
          endDate: '2021-12',
          description: 'Sozialer Träger mit 1.200 FTE verteilt auf 8 Standorte.',
          tasks: [
            'Wichtigster HR-Ansprechpartner für 3 Pflegestationen (240 FTE).',
            'Tarifverhandlungen TVöD-Pflege; Abschluss von 11 Verhandlungspunkten in 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'M.Sc. Human Resource Management',
          institution: 'Universität Mannheim',
          location: 'Mannheim',
          startDate: '2015-09',
          endDate: '2017-08',
        },
      ],
      skills: ['Workday', 'Personio', 'Greenhouse ATS', 'Tarifverhandlung TVöD', 'Tarifverhandlung Metall- und Elektroindustrie', 'Performance Management', 'Arbeitsrecht (Grundlagen)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Scope: Anzahl FTE und Branche zuerst',
        body:
          'HR-Recruiter bei Lufthansa, Siemens, SAP und Allianz screenen direkt auf Organisationsgröße (50? 500? 5.000?) und branchenspezifische Tarifverträge. Setzen Sie den Scope in Zeile 1: "HR Manager für DACH-Organisation mit 180 FTE" schlägt "Erfahrene HR-Professional".',
      },
      {
        heading: 'Tools erwähnen — Workday ist die grüne Flagge',
        body:
          'Workday, SuccessFactors, Personio, Greenhouse, Lever — erwähnen Sie, welche Tools Sie aktiv beherrschen. Für Enterprise-Rollen (Lufthansa, Deutsche Bank, BMW) ist Workday-Erfahrung oft ein Filter. Vermeiden Sie vages "HRIS-Erfahrung".',
      },
      {
        heading: 'Messbarer HR-Impact zählt schwer',
        body:
          'Fluktuationsrate gesenkt, Time-to-Hire reduziert, eNPS gesteigert, Krankenstand unter Branchenschnitt — alle Daten zählen. "Senkung der Mitarbeiterfluktuation von 18 % auf 11 % in 18 Monaten" ist ein Interview-Trigger.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    functie: 'Pflegehelfer/in (Altenpflege)',
    title: 'Lebenslauf-Beispiel: Pflegehelfer/in (Altenpflege)',
    description:
      'Lebenslauf-Beispiel für Pflegehelfer in der Altenpflege. Für Pflegeheim, ambulante Pflege und Behindertenhilfe. Mit Tipps zur Berufsregistrierung.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Esther',
      lastName: 'Vogel',
      email: 'esther.vogel@example.de',
      phone: '+49 151 66778899',
      city: 'Dresden',
      summary:
        'Pflegefachkraft mit 11 Jahren Erfahrung in Psychogeriatrie und somatischer Langzeitpflege bei Diakonie Dresden und Caritas. Examinierte Altenpflegerin, Bezugspflegekraft für 8 Bewohner mit Demenz. Praxisanleiterin für Auszubildende der Altenpflege — in den letzten 5 Jahren 12 Auszubildende begleitet, alle bestanden.',
      experiences: [
        {
          jobTitle: 'Bezugspflegekraft Psychogeriatrie',
          company: 'Diakonie Dresden',
          location: 'Dresden',
          startDate: '2019-08',
          current: true,
          description: 'Pflegeheim für Menschen mit Demenz. Kleine Wohngruppe mit 8 Bewohnern.',
          tasks: [
            'Bezugspflegekraft für 8 Bewohner: Pflegepläne schreiben und evaluieren, Ansprechpartnerin für Angehörige.',
            'Praxisanleiterin für Auszubildende der Altenpflege; 12 Auszubildende in den letzten 5 Jahren begleitet (100 % Bestehensquote).',
            'Mitglied der Qualitätskommission Verhaltensauffälligkeiten; Überarbeitung des Sturzprävention-Protokolls 2023.',
          ],
        },
        {
          jobTitle: 'Pflegehelferin',
          company: 'Caritas Sachsen',
          location: 'Pirna',
          startDate: '2014-01',
          endDate: '2019-07',
          description: 'Behindertenhilfe, Wohngruppe für Erwachsene mit geistiger Behinderung.',
          tasks: [
            'Persönliche Pflege und tägliche Unterstützung von 6 Bewohnern mit mittlerer bis schwerer Behinderung.',
            'Koordination von Wochenend-Ausflügen und Familienbesuchen.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Altenpflege (3-jährig, examiniert)',
          institution: 'Berufsfachschule für Altenpflege Dresden',
          location: 'Dresden',
          startDate: '2011-09',
          endDate: '2013-12',
        },
      ],
      skills: ['Examinierte Altenpflegerin', 'Bezugspflege', 'Praxisanleiterin', 'Demenz / Psychogeriatrie', 'Vivendi PD', 'Umgang mit Verhaltensauffälligkeiten', 'Sturzprävention'],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Berufsregistrierung + Niveau + Pflege-Setting in Zeile 1',
        body:
          'Pflegeeinrichtungen filtern auf: examinierte Pflegekraft (ja/nein), Qualifikationsniveau (Pflegehelfer / Pflegefachkraft) und Pflege-Setting (Psychogeriatrie / Somatik / Behindertenhilfe / ambulante Pflege). Setzen Sie diese Kombination in die erste Zeile. Die Erwähnung der Rolle als Bezugspflegekraft gibt sofort ein Senior-Signal.',
      },
      {
        heading: 'Pflegedokumentations-Systeme explizit',
        body:
          'Vivendi PD, MediFox, Connext — welche Systeme haben Sie genutzt? Für Pflege-Träger ist das ein Filter — neue Mitarbeitende, die sofort im System arbeiten können, werden bevorzugt. Erwähnen Sie es in den Kompetenzen.',
      },
      {
        heading: 'Praxisanleitung ist eine unterscheidende Rolle',
        body:
          'Praxisanleiterin für Auszubildende der Altenpflege zu sein, ist ein starker Status — Pflegeeinrichtungen schätzen Menschen, die Wissen weitergeben können. Erwähnen Sie die Anzahl begleiteter Auszubildender und die Bestehensquote, wenn Sie sie haben.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'designer',
    functie: 'Designer (UX / Grafik)',
    title: 'Lebenslauf-Beispiel: UX Designer / Grafik Designer',
    description:
      'Lebenslauf-Beispiel für UX Designer und Grafik Designer. Mit Portfolio-Links, Figma-Skills und Tipps für Agentur- vs. In-House-Bewerbungen.',
    templateId: 'creatief',
    colorSchemeId: 'rose',
    cv: buildExampleCV({
      firstName: 'Tessa',
      lastName: 'Braun',
      email: 'tessa.braun@example.de',
      phone: '+49 151 77889900',
      city: 'Berlin',
      linkedIn: 'linkedin.com/in/tessabraun',
      summary:
        'Senior Product Designer mit 6 Jahren Erfahrung im B2C-App-Design bei N26 und Stripe Germany. Spezialisierung auf Payment-Flows und Onboarding-Optimierung. Owner des Design Systems bei Stripe Germany seit 2023: 80+ Komponenten, genutzt von 14 Engineers und 4 Designern.',
      experiences: [
        {
          jobTitle: 'Senior Product Designer',
          company: 'Stripe Germany',
          location: 'Berlin',
          startDate: '2023-03',
          current: true,
          description: 'Merchant Dashboard Team — Onboarding und Payment-Configuration-Flows.',
          tasks: [
            'Owner des Stripe-Germany-Design-Systems (80+ Komponenten in Figma); genutzt von 14 Engineers und 4 Designern.',
            'Onboarding-Redesign: Completion-Rate der Merchant-Sign-ups +24 % in den ersten 6 Monaten.',
            'User Research mit 12 Einzelunternehmern (Handelsregister-eingetragen); führte zur Vereinfachung des KYC-Prozesses.',
          ],
        },
        {
          jobTitle: 'Product Designer',
          company: 'N26',
          location: 'Berlin',
          startDate: '2019-09',
          endDate: '2023-02',
          description: 'Mobile-App-Design — Fokus auf Investments und Split-Payments-Features.',
          tasks: [
            'Lead Designer für den Investments-Feature-Launch (2021); 60.000+ Premium-Nutzer aktiv im ersten Jahr.',
            'Design Lead für das Redesign des Payment-Request-Flows; Conversion +18 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'B.A. Kommunikationsdesign',
          institution: 'Hochschule für Gestaltung Offenbach',
          location: 'Offenbach',
          startDate: '2015-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Figma (fortgeschritten)', 'Design Systems', 'User Research', 'Prototyping', 'A/B-Testing', 'Webflow', 'Englisch (fließend)'],
      template: 'creatief',
      colorScheme: 'rose',
    }),
    advice: [
      {
        heading: 'Portfolio-Link im Profil + pro Projekt',
        body:
          'Design-Recruiter klicken in 5 Sekunden auf Ihr Portfolio. Setzen Sie diese URL prominent in den Header Ihres Lebenslaufs und verlinken Sie aus relevanten Erfahrungs-Stichpunkten heraus zu spezifischen Cases. Vermeiden Sie allgemeine Portfolios mit "allem drin"; Personaler wollen 3-5 Cases, die für die Rolle relevant sind.',
      },
      {
        heading: 'Spezialisierung + Tool-Stack',
        body:
          'B2C-App-Design ≠ B2B-SaaS-Design ≠ Branding. Spezifizieren Sie, worin Sie stark sind. Tool-Stack explizit: Figma + Webflow + Notion / Maze / Hotjar. Design-Systems-Erfahrung ist für Enterprise-Rollen (Deutsche Bank, SAP, Telekom Design Studio) ein Filter.',
      },
      {
        heading: 'Messbarer Impact: Conversion, Completion, Retention',
        body:
          'Senior Designer werden an Business-Impact gemessen, nicht nur am Output. "Onboarding-Redesign: Completion-Rate +24 % in den ersten 6 Monaten" ist ein Interview-Trigger. Nennen Sie User-Research-Zahlen (Anzahl Interviews, NPS-Veränderungen).',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'financieel-medewerker',
    functie: 'Buchhaltungsassistent',
    title: 'Lebenslauf-Beispiel: Buchhaltungsassistent / Finanzbuchhalter',
    description:
      'Lebenslauf-Beispiel für Buchhaltungsassistenten, Finanzbuchhalter und Finance-Support. Mit Software-Tooling und Aufstieg zum Controller.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Bianca',
      lastName: 'Lange',
      email: 'bianca.lange@example.de',
      phone: '+49 151 88990011',
      city: 'Düsseldorf',
      summary:
        'Allround-Buchhaltungsassistentin mit 8 Jahren Erfahrung im Mittelstand (Umsatz 5-50 Mio. €) in Produktion und Großhandel. Verantwortlich für die vollständige Debitoren- und Kreditorenbuchhaltung, USt-Voranmeldungen und Unterstützung beim Jahresabschluss. DATEV- und SAP-Superuser.',
      experiences: [
        {
          jobTitle: 'Finanzbuchhalterin',
          company: 'Krombacher Brauerei',
          location: 'Kreuztal',
          startDate: '2020-06',
          current: true,
          description: 'Familienbrauerei. Teil eines 6-köpfigen Finance-Teams.',
          tasks: [
            'Vollständige Bearbeitung der Debitoren- und Kreditorenbuchhaltung (durchschnittlich 800 Rechnungen pro Monat).',
            'Monatliche USt-Voranmeldungen und quartalsweise Zusammenfassende Meldungen (ZM).',
            'Unterstützung beim Jahresabschluss zusammen mit der externen Wirtschaftsprüfung (Deloitte Düsseldorf).',
            'Implementierung Basware für automatische Rechnungsverarbeitung; reduzierte manuelle Buchungsarbeit um 60 %.',
          ],
        },
        {
          jobTitle: 'Verwaltungsmitarbeiterin',
          company: 'Van der Schoot Großhandel GmbH',
          location: 'Düsseldorf',
          startDate: '2016-02',
          endDate: '2020-05',
          description: 'Familienunternehmen im technischen Großhandel; Umsatz 18 Mio. €.',
          tasks: [
            'Bearbeitung von Eingangs- und Ausgangsrechnungen, Bankbuchungen, Kasse.',
            'Vorbereitung der monatlichen Reportings für die Geschäftsführung.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Steuerfachangestellte (IHK)',
          institution: 'Steuerakademie Nordrhein-Westfalen',
          location: 'Düsseldorf',
          startDate: '2012-09',
          endDate: '2016-01',
        },
      ],
      skills: ['DATEV', 'SAP FI/CO', 'Basware', 'Lexware', 'USt-Voranmeldung', 'Zusammenfassende Meldung', 'Microsoft Excel (fortgeschritten)'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Software-Stack explizit erwähnen',
        body:
          'Mittelständische Unternehmen und Steuerberater-Kanzleien screenen Finance-Lebensläufe auf Tool-Erfahrung: DATEV, SAP, Lexware, Sage, addison. Erwähnen Sie, welche Sie aktiv nutzen. Für Steuerberater-Kanzleien: Bonus ist Caseware (Audit-Tool) oder branchenspezifische Software.',
      },
      {
        heading: 'Scope: Umsatz, Rechnungsvolumen, Branche',
        body:
          'Ein Buchhalter im Mittelstand mit 5 Mio. € Umsatz ist sehr anders als bei 50 Mio. €. Spezifizieren Sie den Maßstab: durchschnittliche Anzahl Rechnungen pro Monat, Unternehmensumsatz (sofern öffentlich) oder Branche. "800 Rechnungen pro Monat" ist konkret.',
      },
      {
        heading: 'Automatisierung / Prozessverbesserung fällt auf',
        body:
          'Viele Finance-Leute machen Routinearbeit; jemand, der Prozessverbesserung initiiert (Basware-Implementierung, automatische Bankanbindungen, OCR-Rechnungserkennung) hebt sich sofort ab. "60 % Reduktion manuelle Buchungsarbeit" ist ein Interview-Trigger für Controller-Tracks.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'klantenservice-medewerker',
    functie: 'Kundenberater',
    title: 'Lebenslauf-Beispiel: Kundenberater / Kundenservice',
    description:
      'Lebenslauf-Beispiel für Kundenberater im Callcenter, E-Commerce und B2B. Mit First-Contact-Resolution, CSAT-Werten und Tipps zum Aufstieg.',
    templateId: 'minimalist',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Mehmet',
      lastName: 'Yilmaz',
      email: 'mehmet.yilmaz@example.de',
      phone: '+49 151 99001122',
      city: 'Köln',
      summary:
        'Kundenberater mit 5 Jahren Erfahrung im E-Commerce und in der Telekommunikation. Bei MediaMarkt: Top-5%-First-Contact-Resolution-Score in 2024 und NPS 9,2 (Team-Durchschnitt 8,4). Praxisanleiter für neue Kollegen während ihrer ersten 4 Wochen on the floor.',
      experiences: [
        {
          jobTitle: 'Senior Kundenberater / Coach',
          company: 'MediaMarkt',
          location: 'Köln',
          startDate: '2022-08',
          current: true,
          description: 'Webcare- und Telefonie-Team für die Abteilung Kleinhaushaltsgeräte.',
          tasks: [
            'First-Contact-Resolution-Rate 76 % (Team-Durchschnitt 68 %); Top 5 % der 220-köpfigen Abteilung.',
            'NPS 9,2 in 2024 (Team-Durchschnitt 8,4); gehörte zur Top 10 für Kundenzufriedenheit Q4.',
            'Praxisanleiter für neue Kollegen während der ersten 4 Wochen on the floor; 14 Kollegen eingearbeitet.',
          ],
        },
        {
          jobTitle: 'Kundenberater',
          company: 'Vodafone Deutschland',
          location: 'Düsseldorf',
          startDate: '2020-03',
          endDate: '2022-07',
          description: 'Inbound-Team für Mobilfunk- und Internet-Verträge.',
          tasks: [
            'Bearbeitung eingehender Anrufe zu Produktfragen, Abrechnung und Störungen.',
            'Identifikation von Upsell-Möglichkeiten innerhalb laufender Verträge.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Berufsausbildung Kaufmann für Marketingkommunikation',
          institution: 'IHK Köln',
          location: 'Köln',
          startDate: '2016-09',
          endDate: '2020-02',
        },
      ],
      skills: ['Zendesk', 'Salesforce Service Cloud', 'Webcare (Twitter/Instagram)', 'DE, EN, TR fließend', 'Deeskalationstechniken', 'Konfliktmanagement'],
      template: 'minimalist',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Performance-Zahlen sind die Währung',
        body:
          'Kundenservice ist ein messbares Fachgebiet: FCR (First-Contact-Resolution), CSAT, NPS, AHT (Average Handle Time), durchschnittliche Calls pro Schicht. Nennen Sie die messbaren Zahlen, die Sie hatten. "NPS 9,2 vs. Team-Durchschnitt 8,4" ist viel stärker als "kundenorientiert".',
      },
      {
        heading: 'Software-Stack und Kanäle spezifizieren',
        body:
          'Zendesk, Salesforce Service Cloud, Freshdesk, Intercom — welches CRM/Ticketing-System haben Sie genutzt? Telefonisch, Chat, Webcare (Twitter/Instagram), E-Mail? Arbeitgeber wie MediaMarkt, Otto, Lufthansa Customer Care und HelloFresh wollen wissen, ob Sie am Tag 1 produktiv sind.',
      },
      {
        heading: 'Praxisanleitung & Coaching zeigen Führungspotenzial',
        body:
          'Viele Kundenberater erhalten nach 1-2 Jahren Floor-Coach-Verantwortung. Erwähnen Sie es konkret ("14 neue Kollegen eingearbeitet"). Für den Teamleiter-Track ist dies das ausschlaggebendste Signal.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'recruiter',
    functie: 'Recruiter / Talent Acquisition',
    title: 'Lebenslauf-Beispiel: Recruiter / Talent Acquisition',
    description:
      'Lebenslauf-Beispiel für In-House- und Agentur-Recruiter. Mit Time-to-Hire-Metriken, ATS-Tooling und Tipps für den Wechsel zwischen Agentur und Corporate.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Robin',
      lastName: 'Schmidt',
      email: 'robin.schmidt@example.de',
      phone: '+49 151 00112233',
      city: 'Berlin',
      linkedIn: 'linkedin.com/in/robinschmidt',
      summary:
        'Tech Recruiter mit 5 Jahren Erfahrung; 3 bei der Agentur Hays und 2 In-House bei Zalando. Spezialisierung Senior Software Engineers und Data Professionals. 2024: 38 Hires realisiert (Target 30), durchschnittliche Time-to-Hire 28 Tage (Abteilungsdurchschnitt 41).',
      experiences: [
        {
          jobTitle: 'Senior Talent Acquisition Partner',
          company: 'Zalando',
          location: 'Berlin',
          startDate: '2023-04',
          current: true,
          description: 'Tech Recruitment, Fokus auf Senior Engineering & Data Rollen.',
          tasks: [
            '38 Hires realisiert in 2024 (Target 30); Time-to-Hire 28 Tage (Abteilungsdurchschnitt 41).',
            'Hiring-Manager-Partnership für 4 Engineering-Teams; wöchentliche Intake- und Kalibrierungs-Sessions.',
            'Ownership der DACH-Employer-Branding-Zusammenarbeit mit der Marketing-Abteilung.',
          ],
        },
        {
          jobTitle: 'Recruiter',
          company: 'Hays',
          location: 'Berlin',
          startDate: '2020-09',
          endDate: '2023-03',
          description: 'Tech-Personaldienstleister. Eigenes Kundenportfolio von 12 Corporate-Accounts.',
          tasks: [
            'Eigenes Portfolio von 12 Corporate-Accounts (Ø 1,8 Mio. € Jahresumsatz).',
            'Q4 2022: #1 auf dem DACH Tech-Leaderboard mit 31 Placements.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Bachelor Personalmanagement (FH/HAW)',
          institution: 'Hochschule für angewandte Wissenschaften Hamburg',
          location: 'Hamburg',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['Greenhouse ATS', 'LinkedIn Recruiter', 'SmartRecruiters', 'Hireflix', 'Boolean Search', 'Tech Recruiting (Java/Go/Python Stack)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Time-to-Hire und Placement-Zahlen sind Ihr Quota',
        body:
          'Recruiting ist ein messbares Fach. Time-to-Hire, Placement-Anzahl, Offer-Acceptance-Rate, Candidate-NPS. Schreiben Sie die Zahlen exakt: "38 Hires in 2024 (Target 30); Time-to-Hire 28 Tage (Abteilungsdurchschnitt 41)". So bewerten TA-Leader Ihre Stufe.',
      },
      {
        heading: 'ATS-Tooling und Sourcing-Stack',
        body:
          'Welche ATS haben Sie aktiv genutzt? Greenhouse, Workable, SmartRecruiters, Personio, Lever. Welche Sourcing-Tools? LinkedIn Recruiter, Hiretual/SeekOut, GitHub-Search für Tech, Boolean für LinkedIn Free. Für In-House-Corporate-Rollen ist das ein Filter.',
      },
      {
        heading: 'Branchen-Spezialisierung und Seniorität',
        body:
          'Tech Recruiter, Finance Recruiter, Healthcare Recruiter — die Nischen-Spezialisierung wiegt schwer. Nennen Sie, welchen Rollentyp und welche Skills/Stacks Sie aktiv recruitieren. "Senior Software Engineers Java/Go" ist stärker als "Tech Roles".',
      },
    ],
  },
];

export default EXAMPLES_DE;
export const EXAMPLE_BY_SLUG_DE: Record<string, FunctieExample> = Object.fromEntries(
  EXAMPLES_DE.map((e) => [e.slug, e])
);
export const EXAMPLE_SLUGS_DE = EXAMPLES_DE.map((e) => e.slug);
