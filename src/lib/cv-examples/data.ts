import { FunctieExample } from './types';
import { buildExampleCV } from './builder';

const EXAMPLES: FunctieExample[] = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'developer',
    functie: 'Developer / Software Engineer',
    title: 'CV Voorbeeld: Developer / Software Engineer',
    description:
      'Gratis CV voorbeeld voor developers en software engineers. Recruiter-gerichte opmaak voor sollicitaties bij scaleups, FAANG en corporate tech. Inclusief schrijftips.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Sven',
      lastName: 'Bakker',
      email: 'sven.bakker@example.nl',
      phone: '06 1234 5678',
      city: 'Amsterdam',
      linkedIn: 'linkedin.com/in/svenbakker',
      summary:
        'Backend engineer met 7 jaar ervaring in TypeScript en Go bij scale-ups in fintech en travel. Verlaagde API-latency met 42% door gerichte query-optimalisatie en caching. Komfortabel met code-reviews, productie-debugging en mentorschap van junior developers.',
      experiences: [
        {
          jobTitle: 'Senior Backend Engineer',
          company: 'Booking.com',
          location: 'Amsterdam',
          startDate: '2023-02',
          current: true,
          description:
            'Onderdeel van het Payments-platform team (12 engineers). Eigenaar van het refund-service-domein.',
          tasks: [
            'Migreerde refund-service van monoliet naar event-driven microservice (Kafka) — reduceerde refund-doorlooptijd van 4 uur naar 90 seconden voor 18M transacties/maand.',
            'Schreef PR-templates en code-review guidelines die teambreed werden overgenomen.',
            'Mentor van 2 junior engineers; beide na 12 maanden gepromoveerd naar mid-level.',
          ],
        },
        {
          jobTitle: 'Full-stack Developer',
          company: 'Adyen',
          location: 'Amsterdam',
          startDate: '2019-08',
          endDate: '2023-01',
          description: 'Werkte aan het merchant-dashboard (React + Java backend).',
          tasks: [
            'Bouwde realtime fraud-rules dashboard dat door 200+ merchants dagelijks gebruikt wordt.',
            'Verlaagde TTI van het dashboard van 4.8s naar 1.6s door code-splitting en cache-strategie.',
            'Introduceerde Storybook + visual regression testing in het frontend-team.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BSc Informatica',
          institution: 'Universiteit van Amsterdam',
          location: 'Amsterdam',
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
        heading: 'Wat tech-recruiters in 6 seconden zoeken',
        body:
          'Recruiters bij Booking.com, Adyen, Mollie en Stripe scannen developer-CV\'s op drie dingen tegelijk: primaire taal/framework, bekende employers, en concrete impact in cijfers. Zet je primaire stack (taal + framework + cloud) in regel 1 van je profiel — niet in een skills-tag onderaan. Vermijd "passie voor coderen" en clichés zoals "team player"; recruiters zien dat duizend keer per dag en filteren er hard op weg.',
      },
      {
        heading: 'Bullets met cijfers verslaan bullets met taken',
        body:
          'Vergelijk "Werkte aan refund-service" met "Migreerde refund-service van monoliet naar event-driven microservice — reduceerde doorlooptijd van 4u naar 90s voor 18M transacties/maand". De tweede vorm wint elke keer. Ga elke bullet langs en vraag: wat veranderde meetbaar? Latency, throughput, foutpercentage, teamcapaciteit, kosten. Als je geen cijfer hebt, omschrijf de scope ("door 200+ merchants dagelijks gebruikt").',
      },
      {
        heading: 'Wat hoort er niet op een developer-CV',
        body:
          'Skill-balkjes (geef jezelf 4/5 in Excel — geen recruiter neemt dat serieus). Iconen naast email of telefoon. Een foto, tenzij Nederlandse SME of zorg-/onderwijs-context. GitHub als alleen-link zonder context — vermeld bij elk relevant project de stack en wat je rol was. Hobby-projecten alleen als ze écht relevant zijn voor de functie; anders schrap ze.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    functie: 'Verpleegkundige',
    title: 'CV Voorbeeld: Verpleegkundige',
    description:
      'Professioneel CV voorbeeld voor verpleegkundigen. ATS-proof opmaak, gericht op ziekenhuizen, GGZ en thuiszorg in Nederland. Inclusief tips voor BIG-registratie en specialisaties.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Marije',
      lastName: 'Hendriks',
      email: 'marije.hendriks@example.nl',
      phone: '06 9876 5432',
      city: 'Utrecht',
      summary:
        'BIG-geregistreerd verpleegkundige met 9 jaar ervaring op de Intensive Care en cardiologie. Bekend met EPD Chipsoft HiX en Epic, BLS/ACLS-gecertificeerd. Specialisatie hartfalen en post-operatieve zorg. Werkbegeleider voor 3e- en 4e-jaars HBO-V studenten.',
      experiences: [
        {
          jobTitle: 'IC-Verpleegkundige',
          company: 'UMC Utrecht',
          location: 'Utrecht',
          startDate: '2021-09',
          current: true,
          description:
            'IC-Volwassenen, afdeling cardio-thoracale chirurgie. Onderdeel van een team van 14 IC-verpleegkundigen.',
          tasks: [
            'Eerste opvang en stabilisatie van post-operatieve patiënten na hartchirurgie (gemiddeld 4 patiënten per dienst).',
            'Begeleiding van extubatie-procedures en weaning van mechanische ventilatie.',
            'Werkbegeleider voor 5 HBO-V-studenten (jaar 3-4) in afgelopen 2 jaar.',
            'Lid van de kwaliteitscommissie; herziening protocol pijnmanagement post-CABG.',
          ],
        },
        {
          jobTitle: 'Verpleegkundige Cardiologie',
          company: 'Diakonessenhuis',
          location: 'Utrecht',
          startDate: '2016-02',
          endDate: '2021-08',
          description:
            'Afdeling C2 — Cardiologie. Algemene zorg en monitoring bij hartfalen, ritmestoornissen en post-PCI.',
          tasks: [
            'Verantwoordelijk voor 8-10 patiënten per dienst; coördinatie met cardioloog en fysio.',
            'Voorbereiding en nazorg van patiënten voor hartkatheterisatie en pacemaker-implantatie.',
            'Eerste hulp bij reanimaties; deelname aan crash-team.',
          ],
        },
      ],
      educations: [
        {
          degree: 'HBO-V (Verpleegkunde, BSc)',
          institution: 'Hogeschool Utrecht',
          location: 'Utrecht',
          startDate: '2012-09',
          endDate: '2016-01',
        },
        {
          degree: 'Vervolgopleiding IC-Verpleegkundige (CZO)',
          institution: 'UMC Utrecht',
          location: 'Utrecht',
          startDate: '2022-01',
          endDate: '2023-06',
        },
      ],
      skills: [
        'BIG-registratie',
        'BLS / ACLS',
        'Chipsoft HiX',
        'Epic',
        'Post-operatieve zorg',
        'Hartfalen',
        'Werkbegeleiding HBO-V',
        'Triage',
      ],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'BIG-registratie + specialisatie eerst',
        body:
          'Voor zorginstellingen zijn drie dingen direct doorslaggevend: je BIG-registratie (vermeld het nummer of "BIG-geregistreerd" expliciet), je specialisatie en op welke afdeling/setting je gewerkt hebt. Zet die info in de eerste regel van je profiel. Bij elke werkgever specificeer je de afdeling en patiëntpopulatie — een algemene "verpleegkundige ziekenhuis X" zegt niets, "IC-verpleegkundige cardiothoracaal X" is direct duidelijk.',
      },
      {
        heading: 'Continuïteit en certificaten tellen zwaar',
        body:
          'Zorginstellingen waarderen langere dienstverbanden enorm — laat goede employer-tenure prominent zien. Vermeld vervolgopleidingen (CZO, ANIOS, SOSA, etc.) en bijscholing (BLS, ACLS, ALS, EPALS, NLS) in een dedicated certificaten-sectie of integreer ze bij opleiding. EPD-ervaring (Chipsoft HiX, Epic, NEXUS) is voor veel ziekenhuizen een filter — noem het bij vaardigheden.',
      },
      {
        heading: 'Werkbegeleiding en kwaliteit als pré',
        body:
          'Werkbegeleiding van studenten, deelname aan kwaliteitscommissies, protocol-ontwikkeling — dit zijn allemaal sterke signalen voor afdelingshoofden die senior verpleegkundigen zoeken. Noem ze concreet ("5 HBO-V-studenten jaar 3-4 in afgelopen 2 jaar"), niet vaag ("ervaring met begeleiden").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'leraar',
    functie: 'Leraar / Docent',
    title: 'CV Voorbeeld: Leraar / Docent',
    description:
      'CV voorbeeld voor leraren in basis-, voortgezet- en hoger onderwijs. Met tips voor bevoegdheid, mentoraat en curriculum-ontwikkeling op je CV.',
    templateId: 'modern',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Thomas',
      lastName: 'van der Meer',
      email: 'thomas.vandermeer@example.nl',
      phone: '06 2233 4455',
      city: 'Eindhoven',
      summary:
        'Eerstegraads docent geschiedenis met 11 jaar ervaring op het Stedelijk College Eindhoven (havo/vwo). Mentor van 4e klas vwo, ontwikkelaar van het vakwerkplan onderbouw, en lid van de examencommissie geschiedenis. Slagingspercentage geschiedenis havo/vwo consistent boven landelijk gemiddelde.',
      experiences: [
        {
          jobTitle: 'Eerstegraads docent Geschiedenis (havo/vwo)',
          company: 'Stedelijk College Eindhoven',
          location: 'Eindhoven',
          startDate: '2018-08',
          current: true,
          description:
            'Lesgeven aan klas 4-6 havo/vwo en onderbouw. Mentor 4-vwo. 0,9 fte aanstelling.',
          tasks: [
            'Mentor van 4-vwo gedurende 4 opeenvolgende cohorten; gemiddeld 28 leerlingen per klas.',
            'Slagingspercentage CE Geschiedenis havo/vwo: 96% (landelijk: 89%) gemeten over 5 cohorten.',
            'Ontwikkeling vakwerkplan onderbouw 2022 — schoolbreed geïmplementeerd door alle 6 geschiedenisdocenten.',
            'Lid examencommissie geschiedenis: bewaking exameneisen en SE-toetsmatrijzen.',
          ],
        },
        {
          jobTitle: 'Tweedegraads docent Geschiedenis & Maatschappijleer',
          company: 'Augustinianum',
          location: 'Eindhoven',
          startDate: '2014-08',
          endDate: '2018-07',
          description: 'Lesgeven onderbouw havo/vwo, vakgroep geschiedenis en maatschappijleer.',
          tasks: [
            'Initiator van het programma "Geschiedenis in de stad": leerlingen onderzoeken Eindhovens industrieel erfgoed.',
            'Coach van 2 startende collega\'s in het kader van de inductiefase.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Master Educatie en Communicatie in de Mens- en Maatschappijwetenschappen (eerstegraads)',
          institution: 'Universiteit Utrecht',
          location: 'Utrecht',
          startDate: '2016-09',
          endDate: '2018-06',
        },
        {
          degree: 'HBO-Bachelor Leraar Geschiedenis (2e graads)',
          institution: 'Fontys Lerarenopleiding',
          location: 'Tilburg',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: [
        'Eerstegraads bevoegdheid geschiedenis',
        'Mentoraat bovenbouw',
        'Examencommissie',
        'Curriculumontwikkeling',
        'Magister',
        'Somtoday',
        'Differentiatie in lesgeven',
      ],
      template: 'modern',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Bevoegdheid, vakgebied en niveau in de eerste regel',
        body:
          'Schoolleiders en HR scannen op drie zaken: bevoegdheid (eerstegraads / tweedegraads / pabo), je vakgebied, en op welk niveau je lesgeeft (vmbo / havo / vwo / mbo / hbo / wo). Zet die combinatie in de eerste regel van je profiel. Vermijd "gepassioneerd over kennisoverdracht" — schoolleiders zien dat patroon en herkennen het direct als invuloefening.',
      },
      {
        heading: 'Resultaten in cijfers, ook in het onderwijs',
        body:
          'Het taboe rond cijfers in het onderwijs is verouderd. Een slagingspercentage boven landelijk gemiddelde, doorstroom-percentages, NPS van leerling-evaluaties — als je er ééntje hebt, vermeld die. "Slagingspercentage 96% (landelijk 89%) over 5 cohorten" is een sterk signaal dat je daadwerkelijk effectief bent als docent, niet alleen aanwezig.',
      },
      {
        heading: 'Curriculumwerk en mentoraat zwaar wegen',
        body:
          'Schoolleiders zoeken docenten die meer doen dan lesgeven: curriculumontwikkeling, examencommissies, mentoraat in de bovenbouw, coaching van starters. Vermeld deze rollen concreet met aantallen ("mentor van 4 opeenvolgende cohorten 4-vwo"). Dit onderscheidt je van honderden CV\'s waarin enkel "ervaring met lesgeven" staat.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'accountant',
    functie: 'Accountant',
    title: 'CV Voorbeeld: Accountant',
    description:
      'CV voorbeeld voor accountants, controllers en finance professionals. Op maat gemaakt voor sollicitaties bij Big 4, mid-tier accountantskantoren en corporates.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Lieke',
      lastName: 'de Jong',
      email: 'lieke.dejong@example.nl',
      phone: '06 1357 2468',
      city: 'Amsterdam',
      linkedIn: 'linkedin.com/in/liekedejong',
      summary:
        'RA met 8 jaar audit-ervaring bij Big 4, gespecialiseerd in financiële instellingen en retail (controleopdrachten >€500M omzet). Verantwoordelijk audit-manager voor 14 jaarrekening-controles per seizoen. Sterke ervaring met IFRS-transities en SOX-compliance trajecten.',
      experiences: [
        {
          jobTitle: 'Audit Manager — Financial Services',
          company: 'KPMG Nederland',
          location: 'Amstelveen',
          startDate: '2022-09',
          current: true,
          description:
            'Verantwoordelijk voor de uitvoering van controleopdrachten bij banken en verzekeraars. Aansturing van teams van 6-12 auditors.',
          tasks: [
            'Audit-verantwoordelijke voor 4 grote financial-services clients met gezamenlijke omzet van €3,2 mld.',
            'Leiding gegeven aan IFRS 17-transitie-project bij verzekeringsklant; on-time delivery en clean audit-opinion.',
            'Coaching van 3 senior associates richting RA-eindtraject; alle 3 gehaald op eerste poging.',
          ],
        },
        {
          jobTitle: 'Senior Associate Audit',
          company: 'EY Nederland',
          location: 'Amsterdam',
          startDate: '2018-08',
          endDate: '2022-08',
          description: 'Controleopdrachten bij retail- en consumentengoederenklanten.',
          tasks: [
            'Veldwerk-coördinator bij jaarrekeningcontroles tot €800M omzet (Albert Heijn-toeleverancier, beursgenoteerde retailer).',
            'Auteur van interne quality memo over voorraad-cycli; opgenomen in NL audit-methodologie.',
          ],
        },
      ],
      educations: [
        {
          degree: 'RA — Register Accountant (NBA)',
          institution: 'Nyenrode Business Universiteit',
          location: 'Breukelen',
          startDate: '2018-09',
          endDate: '2022-06',
        },
        {
          degree: 'MSc Accountancy',
          institution: 'Universiteit van Amsterdam',
          location: 'Amsterdam',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      skills: ['RA-titel', 'IFRS', 'SOX', 'Audit-Command Language (ACL)', 'PowerBI', 'Caseware', 'IDEA', 'Lead-auditor'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Titel, niche en seniority eerst',
        body:
          'Big 4 en mid-tier kantoren screenen op drie filters: RA/AA-titel (of in-traject), branche-specialisatie (Financial Services, Retail, Public Sector), en je manager-track. Zet die info expliciet in regel 1 van je profiel. Wie auditmanager schrijft zonder branche-specifiek werkverleden, krijgt direct twijfel.',
      },
      {
        heading: 'Cijfers en namen mogen — discretie kan binnen NDA',
        body:
          'Auditors zijn vaak voorzichtig met klantnamen vanwege geheimhoudingsplicht — terecht. Maar omzet-ranges en sector-context ("Albert Heijn-toeleverancier", "beursgenoteerde verzekeraar") zijn meestal toegestaan en sterk. Vermeld ook eindtraject-prestaties (CFO-presentaties, IFRS-transities geleverd, clean audit-opinions) als deze meetbaar bijdroegen.',
      },
      {
        heading: 'Promotie-traject en coaching-impact',
        body:
          'Voor manager-niveau en hoger is je vermogen om mensen omhoog te trekken even belangrijk als technische kwaliteit. "Coaching van 3 senior associates richting RA-eindtraject; alle 3 gehaald op eerste poging" is een sterk signaal van professionele kwaliteit op het niveau dat partners willen zien.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    functie: 'Marketing Manager',
    title: 'CV Voorbeeld: Marketing Manager',
    description:
      'CV voorbeeld voor (senior) marketing managers in B2B en B2C. Concrete schrijftips, voorbeeld-bullets en aanbevolen layout voor recruiter-scan.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Robin',
      lastName: 'van der Linden',
      email: 'robin.vanderlinden@example.nl',
      phone: '06 4455 6677',
      city: 'Rotterdam',
      linkedIn: 'linkedin.com/in/robinvanderlinden',
      summary:
        'B2B SaaS marketing manager met 6 jaar ervaring bij Nederlandse scale-ups in fintech en HR-tech. Eigenaar van de paid-acquisition-funnel van pre-Series-A tot €15M ARR. Verlaagde CAC met 38% bij Mendix in 2 jaar door retargeting + LinkedIn-Ads optimalisatie.',
      experiences: [
        {
          jobTitle: 'Senior Marketing Manager — Demand Generation',
          company: 'Mendix (Siemens)',
          location: 'Rotterdam',
          startDate: '2022-04',
          current: true,
          description:
            'Eigenaar van het EMEA demand-gen-funnel voor low-code platform. Manager van 3 specialisten (Paid, Content, ABM).',
          tasks: [
            'Verlaagde Customer Acquisition Cost van €1.620 naar €1.005 in 18 maanden door retargeting + funnel-segmentatie.',
            'Lanceerde ABM-programma voor 200 enterprise-accounts; resulteerde in €4,2M pipeline binnen 9 maanden.',
            'Manager van team van 3; alle drie ontvingen "exceeds expectations" in jaarlijkse review.',
          ],
        },
        {
          jobTitle: 'Marketing Manager',
          company: 'Visma | Raet',
          location: 'Amersfoort',
          startDate: '2019-06',
          endDate: '2022-03',
          description: 'B2B-marketing voor HR-software in MKB-segment.',
          tasks: [
            'Bouwde content-marketing-engine van 0 naar 60K maandelijkse organische bezoekers in 24 maanden.',
            'Lanceerde MQL-to-SQL scoring-model in HubSpot; verbeterde conversie van 4% naar 11%.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MSc Marketing Management',
          institution: 'Erasmus Universiteit',
          location: 'Rotterdam',
          startDate: '2017-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Demand Generation', 'HubSpot', 'Salesforce', 'Google Ads', 'LinkedIn Ads', 'ABM', 'GA4', 'SQL (basic)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Funnel-getallen zijn de munt',
        body:
          'Recruiters voor (senior) marketing-rollen zoeken naar één ding: kun jij meetbaar de funnel verbeteren. Zet harde cijfers in elke bullet: CAC, MQL→SQL conversie, pipeline gegenereerd, ROAS, ARR-toegevoegd. "Verantwoordelijk voor marketing-strategie" is woordenruis; "CAC verlaagd van €1.620 naar €1.005 in 18 maanden" is een interview-trigger.',
      },
      {
        heading: 'Channel-mix + tool-stack expliciet',
        body:
          'Vermeld concrete kanalen (LinkedIn Ads, Google Ads, retargeting, ABM, content, partnerships) en de tools die je daadwerkelijk operationeel gebruikt (HubSpot, Salesforce, Marketo, GA4, Looker). Vage "marketing automation" zonder tool-naam is een rode vlag — recruiters denken dan dat je het van papier kent.',
      },
      {
        heading: 'Team- en stakeholder-leiderschap',
        body:
          'Voor senior rollen telt of je een team kunt opbouwen en aansturen. "Manager van 3 specialisten" is sterker dan "samenwerken met team". Vermeld concreet wie je manage (rollen + aantal), en als kers op de taart: prestaties van die teamleden ("alle drie exceeds expectations").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verkoper',
    functie: 'Verkoper / Account Manager',
    title: 'CV Voorbeeld: Verkoper / Account Manager',
    description:
      'CV voorbeeld voor verkopers, account managers en sales professionals. Met quota-attainment voorbeelden en tips voor B2B vs B2C sollicitaties.',
    templateId: 'modern',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Daan',
      lastName: 'Visser',
      email: 'daan.visser@example.nl',
      phone: '06 7788 9900',
      city: 'Den Haag',
      linkedIn: 'linkedin.com/in/daanvisser',
      summary:
        'B2B Account Executive met 5 jaar ervaring in SaaS-sales — full-cycle van prospect tot close. Behaalde 138% van quota in 2025 bij Salesforce NL (deal-size €60-180K, sales-cycle 4-7 maanden). Sterke ervaring met multi-stakeholder enterprise-deals in finance- en retail-sector.',
      experiences: [
        {
          jobTitle: 'Account Executive — Mid-Market',
          company: 'Salesforce Nederland',
          location: 'Amsterdam',
          startDate: '2023-01',
          current: true,
          description:
            'Full-cycle sales: van outbound prospect tot signed contract. Focus op mid-market klanten (€50M-€500M omzet).',
          tasks: [
            'Quota-attainment 2025: 138% (€2,4M ARR closed vs €1,75M target).',
            '#3 op de NL Mid-Market leaderboard van 22 AE\'s in H1 2025.',
            'Won grootste deal NL Mid-Market Q4 2024: €380K ARR, 6-maanden cycle, 7 stakeholders.',
          ],
        },
        {
          jobTitle: 'Sales Development Representative',
          company: 'Personio',
          location: 'Amsterdam',
          startDate: '2020-08',
          endDate: '2022-12',
          description: 'Outbound prospecting in DACH en Benelux. Genereren van MQL\'s voor AE-team.',
          tasks: [
            '147% van SQL-target in 2022; team-record voor outbound-meetings in één maand (38).',
            'Schreef het playbook voor cold-outreach in de fintech-niche; intern overgenomen door 14 SDR\'s.',
          ],
        },
      ],
      educations: [
        {
          degree: 'HBO Bedrijfskunde MER',
          institution: 'De Haagse Hogeschool',
          location: 'Den Haag',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['B2B SaaS Sales', 'Salesforce CRM', 'MEDDPICC', 'Outreach.io', 'LinkedIn Sales Navigator', 'Forecasting', 'Stakeholder-mapping'],
      template: 'modern',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Quota-attainment is dé kerncijfer',
        body:
          'Niets overtuigt sales-recruiters zoals concrete quota-attainment per jaar. Schrijf het exact: "138% van quota 2025 (€2,4M ARR closed vs €1,75M target)". Voeg ranking toe als je in een team werkte ("#3 op de NL Mid-Market leaderboard van 22 AE\'s"). Vermijd vage termen zoals "succesvolle salesresultaten".',
      },
      {
        heading: 'Deal-size, cycle-length, stakeholder-count',
        body:
          'Voor enterprise-rollen telt of jij multi-stakeholder deals kunt closen. Vermeld bij grote wins de deal-size, sales-cycle en aantal stakeholders ("€380K ARR, 6-maanden cycle, 7 stakeholders"). Dit is hoe sales-leaders inschatten of je past bij hun gemiddelde ACV en deal-complexity.',
      },
      {
        heading: 'Methodologie en tools tellen',
        body:
          'Vermeld de sales-methodologie waar je in opgeleid bent (MEDDPICC, MEDDIC, BANT, Challenger, SPIN) en de CRM/tooling die je actief beheert (Salesforce, HubSpot, Outreach, Gong). Een AE zonder methodologie-vermelding op senior niveau is een rode vlag.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'office-manager',
    functie: 'Office Manager / Secretaresse',
    title: 'CV Voorbeeld: Office Manager / Secretaresse',
    description:
      'CV voorbeeld voor office managers, directiesecretaresses en management-assistants. Concreet en operationeel — met tips voor hoe je waarde meetbaar maakt.',
    templateId: 'minimalist',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Sanne',
      lastName: 'de Boer',
      email: 'sanne.deboer@example.nl',
      phone: '06 5566 7788',
      city: 'Amsterdam',
      summary:
        'Office Manager met 12 jaar ervaring in scale-ups en advocatuur. Verantwoordelijk voor agenda van CEO + 3 directieleden, faciliteiten van een kantoor van 140 medewerkers, en alle onboarding-processen. Bekend met BambooHR, Notion, Asana, Concur.',
      experiences: [
        {
          jobTitle: 'Office Manager',
          company: 'Bunq',
          location: 'Amsterdam',
          startDate: '2021-02',
          current: true,
          description:
            'Verantwoordelijk voor de hoofdkantoor-operatie (140 FTE) en de agenda van de CEO + 3 directieleden.',
          tasks: [
            'Beheer van CEO-agenda incl. internationale reizen (gemiddeld 2 trips/maand naar EU-hubs).',
            'Onboarding-coördinator: 38 nieuwe medewerkers in 2024 — 100% inwerk-readiness op dag 1.',
            'Onderhandelde kantoor-huurcontract herzien: jaarlijkse besparing €72K bij gelijke vierkante meters.',
            'Eigenaar van facilities-leverancierspool (catering, schoonmaak, kantoorartikelen) — 6 contracten.',
          ],
        },
        {
          jobTitle: 'Directiesecretaresse',
          company: 'Stibbe',
          location: 'Amsterdam',
          startDate: '2014-09',
          endDate: '2021-01',
          description: 'Ondersteuning van 4 partners en hun teams binnen de praktijkgroep M&A.',
          tasks: [
            'Beheer van partner-agenda\'s en cliënt-correspondentie (NL/EN).',
            'Coördinatie van closing-meetings bij grote transacties — gemiddeld 8 closings per jaar.',
            'Lid van het office-improvement team; herziening van het onboardingsproces voor stagiaires.',
          ],
        },
      ],
      educations: [
        {
          degree: 'HBO Office Management (Schoevers)',
          institution: 'Schoevers',
          location: 'Amsterdam',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: ['BambooHR', 'Notion', 'Asana', 'Concur', 'Microsoft 365', 'Vendor-management', 'Onboarding', 'Vloeiend Engels'],
      template: 'minimalist',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Operationele scope vóór persoonlijke kwaliteiten',
        body:
          'Het cliché-CV van een office manager begint met "georganiseerd, communicatief, stressbestendig". Recruiters geloven dat pas als ze de operationele scope zien. Zet de schaal in regel 1: aantal medewerkers waar je faciliteiten voor doet, aantal directieleden waarvoor je de agenda beheert, aantal leveranciers in je pool.',
      },
      {
        heading: 'Maak je waarde meetbaar',
        body:
          'Office-management-werk lijkt soft maar laat zich vaak goed in cijfers vertalen: jaarlijkse besparing op contracten, aantal onboardings per jaar, % readiness op dag 1, doorlooptijd van facility-issues. Eén concreet cijfer in een bullet ("jaarlijkse besparing €72K bij gelijke vierkante meters") is sterker dan vijf adjectieven.',
      },
      {
        heading: 'Tooling expliciet',
        body:
          'Vermeld de exacte systemen die je dagelijks gebruikt (BambooHR, Workday, Concur, Notion, Asana, Slack, MS365). Voor recruiters van scale-ups is dit een direct filter — ze willen iemand die op dag 1 productief is, niet eerst een tool-training nodig heeft.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'projectmanager',
    functie: 'Projectmanager',
    title: 'CV Voorbeeld: Projectmanager',
    description:
      'CV voorbeeld voor projectmanagers in IT, construction en consulting. Met tips voor budget-impact, methodologie-vermelding en stakeholder-management.',
    templateId: 'executive',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Mariska',
      lastName: 'Janssen',
      email: 'mariska.janssen@example.nl',
      phone: '06 8899 0011',
      city: 'Utrecht',
      linkedIn: 'linkedin.com/in/mariskajanssen',
      summary:
        'Senior PMP-gecertificeerd projectmanager met 10 jaar ervaring in digital-transformation programma\'s bij financiële instellingen. Geleverd: 4 grote ERP-implementaties en een PSD2 compliance-traject, gezamenlijk budget €18M. Sterke ervaring met agile/scrum en hybride waterval-omgevingen.',
      experiences: [
        {
          jobTitle: 'Senior Project Manager — Digital Transformation',
          company: 'Rabobank',
          location: 'Utrecht',
          startDate: '2022-03',
          current: true,
          description:
            'Programma-management van core-banking-modernisatie. Stakeholder-management op directie-niveau.',
          tasks: [
            'Leiding aan modernisatie van betalingsplatform: 28 FTE\'s, budget €6,4M, opgeleverd 3 maanden vóór planning.',
            'Stuurgroep-secretaris met CFO + CIO + COO als deelnemers; maandelijkse rapportage in board.',
            'Coach van 4 medior PM\'s in de PM-academy van de bank.',
          ],
        },
        {
          jobTitle: 'Project Manager — IT Programs',
          company: 'NN Group',
          location: 'Den Haag',
          startDate: '2017-09',
          endDate: '2022-02',
          description: 'IT-programmamanagement binnen Life-Pensions divisie.',
          tasks: [
            'Lead van PSD2-compliance traject (€3,2M budget, 18 maanden, 14 FTE\'s); 100% audit-clean.',
            'Salesforce Marketing Cloud-implementatie: rollout naar 4 BU\'s, ROI break-even in maand 9.',
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
          degree: 'MSc Business Administration',
          institution: 'Erasmus Universiteit',
          location: 'Rotterdam',
          startDate: '2011-09',
          endDate: '2013-08',
        },
      ],
      skills: ['PMP', 'PRINCE2', 'Agile / Scrum', 'JIRA', 'Confluence', 'MS Project', 'Stakeholder-management', 'Risk-management'],
      template: 'executive',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Budget, scope en doorlooptijd — alle drie',
        body:
          'Voor PM-rollen zijn drie metrics dé valuta: budget van het project, aantal FTE\'s/scope, en delivery vs. planning. "Leiding aan modernisatie van betalingsplatform: 28 FTE\'s, budget €6,4M, opgeleverd 3 maanden vóór planning" zegt meer dan een halve pagina adjectieven. Als je een project on-budget en on-time leverde, vermeld het. Als je vóór planning leverde, is dat een interview-trigger.',
      },
      {
        heading: 'Methodologie + certificering vermelden',
        body:
          'PMP, PRINCE2, AgilePM en Scrum Master horen in je vaardigheden of in een aparte certificeringen-sectie. Voor enterprise-rollen is PMP of PRINCE2 vaak een filter. Vermeld de methodologie die je daadwerkelijk gebruikt (Agile/Scrum, Waterval, hybride) en welke tools (JIRA, MS Project, Asana).',
      },
      {
        heading: 'Stuurgroep en stakeholder-niveau',
        body:
          'Op senior niveau zoeken bestuurders iemand die in stuurgroepen kan opereren. Vermeld concreet op welk niveau je rapporteerde ("stuurgroep met CFO + CIO + COO", "maandelijkse rapportage in board"). Dit onderscheidt junior van senior PM\'s in seconden.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'stagiair',
    functie: 'Stagiair / Stage CV',
    title: 'CV Voorbeeld: Stage CV (HBO & WO)',
    description:
      'Gratis CV voorbeeld voor studenten op zoek naar een stage. HBO en WO. Inclusief tips voor wat je doet als je weinig werkervaring hebt.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Emma',
      lastName: 'van Leeuwen',
      email: 'emma.vanleeuwen@example.nl',
      phone: '06 1122 3344',
      city: 'Amsterdam',
      linkedIn: 'linkedin.com/in/emmavanleeuwen',
      summary:
        'Derdejaars Bedrijfskunde-student aan de Universiteit van Amsterdam met sterke interesse in strategie-consulting. Voorzitter van studievereniging Sefa-Marketing (560 leden), case-finalist bij McKinsey Academy 2025, en werkervaring als student-medewerker bij Albert Heijn (3 jaar). Beschikbaar voor 5-maanden stage vanaf februari 2026.',
      experiences: [
        {
          jobTitle: 'Voorzitter Bestuur',
          company: 'Studievereniging Sefa-Marketing',
          location: 'Amsterdam',
          startDate: '2024-09',
          current: true,
          description: 'Aansturing van 6-koppig bestuur. 560 leden, jaarlijkse omzet €120K.',
          tasks: [
            'Onderhandelde sponsor-deal met BCG (3-jarig contract, €45K/jaar).',
            'Organisatie van het jaarlijkse "Marketing Battle" event: 220 deelnemers, 14 corporate partners.',
            'Wekelijkse 1-op-1\'s met 5 commissaris-leden; coaching op leadership-vaardigheden.',
          ],
        },
        {
          jobTitle: 'Student-medewerker (verkoop & kassa)',
          company: 'Albert Heijn',
          location: 'Amstelveen',
          startDate: '2022-09',
          endDate: '2024-08',
          description: 'Parttime functie naast studie. Vakwerk op vloer + kassa.',
          tasks: [
            'Gepromoveerd naar shift-coach voor nieuwe student-medewerkers (na 8 maanden).',
            'Eigenaar van het assortiment-resetproces bij wisseling van seizoens-campagnes.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BSc Bedrijfskunde',
          institution: 'Universiteit van Amsterdam',
          location: 'Amsterdam',
          startDate: '2023-09',
          endDate: '2026-08',
          description: 'Verwachte afronding zomer 2026. GPA 7.8/10. Honours-track Strategy & Innovation.',
        },
        {
          degree: 'VWO (cum laude)',
          institution: 'Stedelijk Gymnasium Haarlem',
          location: 'Haarlem',
          startDate: '2017-09',
          endDate: '2023-07',
        },
      ],
      skills: ['Excel (intermediate)', 'PowerPoint', 'Python (basic)', 'Tableau (basic)', 'Engels (C1)', 'Frans (B2)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Het werkervaring-paradox: leiderschap > baantjes',
        body:
          'Als student heb je weinig werkervaring — dat is OK. Wat recruiters bij McKinsey, Bain, ING en Unilever zoeken in stage-kandidaten is niet jaren ervaring maar SIGNALEN van leiderschap, eigenaarschap en intellectuele honger. Een rol als voorzitter van een studievereniging (met concrete cijfers: aantal leden, omzet, sponsor-deals) weegt zwaarder dan twee jaar kassa.',
      },
      {
        heading: 'GPA, honours-tracks en cases vermelden',
        body:
          'Voor strategie-consulting en investment banking zijn cijfers letterlijk een filter (top 5-10% van je cohort). Vermeld je GPA als die boven 7.5/10 is, je honours-track, en case-competition resultaten ("McKinsey Academy 2025 case-finalist" — dit triggert een gesprek). Beschikbaarheid expliciet noemen ("vanaf februari 2026, 5 maanden") helpt recruiters om je in hun planning te passen.',
      },
      {
        heading: 'Klein werk groot maken — eerlijk',
        body:
          'Een student-baan bij Albert Heijn kan een sterk verhaal zijn als je het concreet maakt: "Gepromoveerd naar shift-coach na 8 maanden" laat zien dat je opviel; "Eigenaar van assortiment-resetproces" laat eigenaarschap zien. Vermijd grootspraak ("revolutioneerde de winkel") — recruiters zien dat onmiddellijk.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'consultant',
    functie: 'Consultant / Strategie-adviseur',
    title: 'CV Voorbeeld: Consultant / Strategie-adviseur',
    description:
      'CV voorbeeld voor management consultants en strategie-adviseurs. Inclusief MBB-stijl format, case-impact bullets en industrie-vermelding.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Pieter',
      lastName: 'van der Heijden',
      email: 'pieter.vanderheijden@example.nl',
      phone: '06 3344 5566',
      city: 'Amsterdam',
      linkedIn: 'linkedin.com/in/pietervanderheijden',
      summary:
        'Senior consultant met 6 jaar ervaring bij McKinsey & Company NL, gespecialiseerd in financial services en post-merger integration. Lead op 3 PMI-trajecten (totaal deal-waarde €4,1 mld). Stanford MBA. Doceert MBA-cursus "Value Creation in M&A" als gastdocent aan IE Madrid.',
      experiences: [
        {
          jobTitle: 'Engagement Manager',
          company: 'McKinsey & Company',
          location: 'Amsterdam',
          startDate: '2022-08',
          current: true,
          description:
            'Lead consultant op high-stakes engagements in Banking & Insurance practice. Aansturing van 3-5 associates per case.',
          tasks: [
            'Lead PMI-traject voor fusie tussen twee NL-banken (€2,4 mld deal): geleverd 6 maanden eerder dan target.',
            'Cost-transformation programma bij EU-verzekeraar: €120M annual run-rate savings geïdentificeerd, €88M geïmplementeerd.',
            'Coach van 4 associates richting Engagement Manager-promotie; 3 geslaagd in eerste poging.',
          ],
        },
        {
          jobTitle: 'Associate',
          company: 'McKinsey & Company',
          location: 'Amsterdam',
          startDate: '2019-09',
          endDate: '2022-07',
          description: 'Engagements primair in Public Sector en Financial Services.',
          tasks: [
            'Quantitative modeling voor RvB-presentaties; auteur van 3 client-facing Excel-modellen.',
            'Initiator van interne research op "post-COVID retail banking" — gepubliceerd door NL Banking Practice.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MBA',
          institution: 'Stanford Graduate School of Business',
          location: 'Stanford, US',
          startDate: '2017-08',
          endDate: '2019-06',
        },
        {
          degree: 'BSc Econometrie (cum laude)',
          institution: 'Erasmus Universiteit',
          location: 'Rotterdam',
          startDate: '2013-09',
          endDate: '2016-06',
        },
      ],
      skills: ['M&A / PMI', 'Financial modeling', 'Stakeholder-management', 'Workshop facilitation', 'Excel/PowerPoint', 'Nederlands / Engels / Frans'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'MBB-CV: het "Little Black Dress" format',
        body:
          'Bij MBB (McKinsey, BCG, Bain) en strategy-tier consulting kantoren is het format strikter dan elders: één pagina, zwart-wit, conservatieve typografie, geen kleur, geen foto. De Zakelijk-template of Executive-template van ResuBox sluit hier op aan. Cijfers en namen waar mogelijk — McKinsey leest een case-bullet zonder cijfer als niet bewezen.',
      },
      {
        heading: 'Cases met deal-waarde, scope en impact',
        body:
          'Beschrijf cases met drie dimensies: scope (deal-waarde, FTE-impact, geografische dekking), jouw rol (analyst / associate / EM), en concrete impact ("€88M geïmplementeerd"). NDA-issues: branche en deal-grootte zijn meestal toegestaan zonder klantnaam — als je twijfelt, anonimiseer ("EU-verzekeraar") en blijf met cijfers concreet.',
      },
      {
        heading: 'MBA, GMAT, talen — wel of niet',
        body:
          'Voor strategy-consulting weegt opleiding zwaar. Top-MBA programmas (Stanford, INSEAD, LBS, IESE, Harvard) altijd vermelden — sterk filter. GMAT-score alleen als boven 720. Cum laude / honours tracks altijd vermelden. Talen op C-niveau of native (NL/EN/FR/DE) zijn voor international engagements vaak een echte plus, vermeld ze.',
      },
    ],
  },
];

export default EXAMPLES;
export const EXAMPLE_BY_SLUG: Record<string, FunctieExample> = Object.fromEntries(
  EXAMPLES.map((e) => [e.slug, e])
);
export const EXAMPLE_SLUGS = EXAMPLES.map((e) => e.slug);
