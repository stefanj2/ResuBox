import { FunctieExample } from './types';
import { buildExampleCV } from './builder';

const EXAMPLES_DA: FunctieExample[] = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'developer',
    functie: 'Softwareudvikler / Engineer',
    title: 'CV-eksempel: Softwareudvikler / Engineer',
    description:
      'Gratis CV-eksempel for softwareudviklere og engineers. Rekrutterer-orienteret layout til ansøgninger hos scale-ups, FAANG og corporate tech på det danske marked. Inklusive skrivetips.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Mads',
      lastName: 'Nielsen',
      email: 'mads.nielsen@example.dk',
      phone: '+45 22 14 35 67',
      city: 'København',
      linkedIn: 'linkedin.com/in/madsnielsen',
      summary:
        'Backend engineer med 7 års erfaring i TypeScript og Go hos scale-ups inden for fintech og rejser. Reducerede API-latency med 42 % gennem målrettet query-optimering og caching. Rutineret i code reviews, production debugging og mentoring af junior-udviklere.',
      experiences: [
        {
          jobTitle: 'Senior Backend Engineer',
          company: 'Trustpilot',
          location: 'København',
          startDate: '2023-02',
          current: true,
          description:
            'Del af payments platform-teamet (12 engineers). Ejer af refund service-domænet.',
          tasks: [
            'Migrerede refund service fra monolit til event-driven microservice (Kafka) — reducerede refund-gennemløbstiden fra 4 timer til 90 sekunder på 18 mio. transaktioner/måned.',
            'Udarbejdede PR-skabeloner og code review-guidelines, der blev adopteret på tværs af teamet.',
            'Mentor for 2 junior engineers; begge forfremmet til mid-level efter 12 måneder.',
          ],
        },
        {
          jobTitle: 'Full-stack Developer',
          company: 'Pleo',
          location: 'København',
          startDate: '2019-08',
          endDate: '2023-01',
          description: 'Arbejdede på merchant dashboardet (React + Java backend).',
          tasks: [
            'Udviklede et real-time fraud rules-dashboard, der bruges dagligt af 200+ merchants.',
            'Reducerede dashboardets TTI fra 4,8 s til 1,6 s gennem code splitting og caching-strategi.',
            'Introducerede Storybook + visual regression testing i frontend-teamet.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Bachelor i Datalogi',
          institution: 'Danmarks Tekniske Universitet (DTU)',
          location: 'Kongens Lyngby',
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
        heading: 'Hvad tech-rekrutterere kigger efter på 6 sekunder',
        body:
          'Rekrutterere hos Trustpilot, Pleo, Lunar og Maersk scanner udvikler-CV\'er efter tre ting samtidigt: primært sprog/framework, kendte arbejdsgivere og konkret impact i tal. Sæt dit hovedstack (sprog + framework + cloud) i første linje af din profil — ikke i et skills-tag til sidst. Undgå "passion for kodning" og klichéer som "teamplayer"; danske rekrutterere ser det tusind gange om dagen og filtrerer det konsekvent fra.',
      },
      {
        heading: 'Bulletpoints med tal slår bulletpoints med opgaver',
        body:
          'Sammenlign "Arbejdede på refund service" med "Migrerede refund service fra monolit til event-driven microservice — reducerede gennemløbstiden fra 4 t til 90 s på 18 mio. transaktioner/måned". Den anden vinder hver gang. Gå hvert bulletpoint igennem og spørg: Hvad ændrede sig målbart? Latency, throughput, fejlrate, team-kapacitet, omkostninger. Hvis du ikke har et tal, så beskriv scope ("bruges dagligt af 200+ merchants").',
      },
      {
        heading: 'Hvad der IKKE hører hjemme på et udvikler-CV',
        body:
          'Skill-bars (give dig selv 4/5 i Excel — ingen rekrutterer tager det seriøst). Ikoner ved siden af e-mail eller telefon. Et foto er på det danske arbejdsmarked typisk valgfrit i tech — brug kun et, hvis det ser professionelt ud. GitHub som et rent link uden kontekst — nævn for hvert relevant projekt stacken og din rolle. Hobby-projekter kun, hvis de er virkelig relevante for stillingen; ellers stryg dem.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    functie: 'Sygeplejerske',
    title: 'CV-eksempel: Sygeplejerske',
    description:
      'Professionelt CV-eksempel for sygeplejersker. ATS-venligt layout til hospitaler, psykiatri og hjemmesygepleje på det danske arbejdsmarked. Inklusive tips om autorisation og specialisering.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Sofie',
      lastName: 'Larsen',
      email: 'sofie.larsen@example.dk',
      phone: '+45 26 78 12 45',
      city: 'København',
      summary:
        'Autoriseret sygeplejerske med 9 års erfaring på intensiv og kardiologisk afdeling. Vant med EPJ-systemerne Sundhedsplatformen og Epic, BLS/ACLS-certificeret. Specialisering i hjertesvigt og postoperativ pleje. Klinisk vejleder for sygeplejestuderende på modul 11 og 12.',
      experiences: [
        {
          jobTitle: 'Intensivsygeplejerske',
          company: 'Rigshospitalet',
          location: 'København',
          startDate: '2021-09',
          current: true,
          description:
            'Voksenintensiv, thoraxkirurgisk afdeling. Del af et team på 14 intensivsygeplejersker.',
          tasks: [
            'Modtagelse og stabilisering af postoperative patienter efter hjertekirurgi (i gennemsnit 4 patienter pr. vagt).',
            'Vejledning ved ekstubation og weaning fra mekanisk ventilation.',
            'Klinisk vejleder for 5 sygeplejestuderende (modul 12) de seneste 2 år.',
            'Medlem af kvalitetsudvalget; revision af protokol for smertehåndtering post-CABG.',
          ],
        },
        {
          jobTitle: 'Sygeplejerske, kardiologi',
          company: 'Bispebjerg Hospital',
          location: 'København',
          startDate: '2016-02',
          endDate: '2021-08',
          description:
            'Afsnit C2 — kardiologi. Almen sygepleje og monitorering ved hjertesvigt, arytmier og post-PCI.',
          tasks: [
            'Ansvarlig for 8-10 patienter pr. vagt; koordinering med kardiologer og fysioterapi.',
            'Forberedelse og efterbehandling af patienter til KAG og pacemaker-implantationer.',
            'Førstehjælp ved hjertestop; medlem af genoplivningsteamet.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Professionsbachelor i Sygepleje',
          institution: 'Københavns Professionshøjskole',
          location: 'København',
          startDate: '2012-09',
          endDate: '2016-01',
        },
        {
          degree: 'Specialuddannelse i Intensiv Sygepleje',
          institution: 'Rigshospitalet',
          location: 'København',
          startDate: '2022-01',
          endDate: '2023-06',
        },
      ],
      skills: [
        'Autorisation fra Styrelsen for Patientsikkerhed',
        'BLS / ACLS',
        'Sundhedsplatformen',
        'Epic',
        'Postoperativ pleje',
        'Hjertesvigt',
        'Klinisk vejledning',
        'Triage',
      ],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Autorisation + specialisering først',
        body:
          'For hospitaler og plejeinstitutioner er tre punkter direkte afgørende: autorisationen (autoriseret sygeplejerske skal stå eksplicit), din specialisering og hvilken afdeling/setting du har arbejdet på. Sæt disse oplysninger i første linje af din profil. Specificer ved hver arbejdsgiver afdelingen og patientpopulationen — en generel "sygeplejerske hospital X" siger ikke noget, "intensivsygeplejerske, thoraxkirurgisk X" er straks forståeligt.',
      },
      {
        heading: 'Kontinuitet og certifikater vægter tungt',
        body:
          'Danske hospitaler værdsætter længere ansættelsesforhold meget højt — vis god employer-tenure prominent. Nævn specialuddannelser (intensiv, anæstesi, onkologi) og kurser (BLS, ACLS, ALS, EPALS) i et særskilt certifikat-afsnit eller integrer dem under uddannelse. EPJ-erfaring (Sundhedsplatformen, Cosmic, EPIC) er for mange hospitaler et filter — nævn det under kompetencer.',
      },
      {
        heading: 'Klinisk vejledning og kvalitet som plus',
        body:
          'Klinisk vejledning af studerende, deltagelse i kvalitetsudvalg, protokoludvikling — det er alle stærke signaler for afdelingsledere, der søger erfarne sygeplejersker. Nævn dem konkret ("5 sygeplejestuderende på modul 12 i de seneste 2 år"), ikke vagt ("erfaring med vejledning").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'leraar',
    functie: 'Lærer / Gymnasielærer',
    title: 'CV-eksempel: Lærer (Folkeskole / Gymnasium)',
    description:
      'CV-eksempel til lærere i folkeskolen, gymnasiet og videregående uddannelse. Med tips til linjefag, klasselærerrollen og udvikling af læreplaner på CV\'et.',
    templateId: 'modern',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Frederik',
      lastName: 'Hansen',
      email: 'frederik.hansen@example.dk',
      phone: '+45 30 45 89 12',
      city: 'Aarhus',
      summary:
        'Gymnasielærer med kandidat i historie og sidefag i samfundsfag, 11 års erfaring på Aurehøj Gymnasium. Klasselærer i 3.g, udvikler af skolens interne historie-curriculum i 1.g og medlem af fagudvalget for historie. Studentereksamen i historie konstant over landsgennemsnittet.',
      experiences: [
        {
          jobTitle: 'Gymnasielærer i historie og samfundsfag',
          company: 'Aurehøj Gymnasium',
          location: 'Gentofte',
          startDate: '2018-08',
          current: true,
          description:
            'Undervisning i 1.-3.g samt valghold. Klasselærer i 3.g. 90 % stillingsbrøk.',
          tasks: [
            'Klasselærer i 3.g i 4 sammenhængende årgange; gennemsnitligt 28 elever pr. klasse.',
            'Eksamenskarakter historie A: 9,1 (landsgennemsnit: 7,2), målt over 5 eksamensårgange.',
            'Udvikling af fag-curriculum til 1.g 2022 — implementeret skole-bredt af alle 6 historielærere.',
            'Medlem af fagudvalget for historie: sikrer eksamensstandarder og bedømmelseskriterier.',
          ],
        },
        {
          jobTitle: 'Lærervikar / pædagogikum-ansat i historie og samfundsfag',
          company: 'Aarhus Katedralskole',
          location: 'Aarhus',
          startDate: '2014-08',
          endDate: '2018-07',
          description: 'Undervisning i 1.-2.g, fagudvalg historie og samfundsfag.',
          tasks: [
            'Initiativtager til programmet "Historien lige uden for døren": elever udforsker Aarhus\' industriarv.',
            'Mentor for 2 nye lærere under deres pædagogikum.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Pædagogikum (gymnasial undervisning)',
          institution: 'Aarhus Universitet',
          location: 'Aarhus',
          startDate: '2016-09',
          endDate: '2018-06',
        },
        {
          degree: 'Kandidat i Historie med sidefag i Samfundsfag',
          institution: 'Aarhus Universitet',
          location: 'Aarhus',
          startDate: '2010-09',
          endDate: '2016-06',
        },
      ],
      skills: [
        'Pædagogikum historie',
        'Klasselærer i 3.g',
        'Fagudvalg',
        'Læreplansudvikling',
        'Lectio',
        'Moodle',
        'Differentieret undervisning',
      ],
      template: 'modern',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Undervisningskompetence, fagkombination og skoleform i første linje',
        body:
          'Rektorer og personaleansvarlige scanner efter tre punkter: undervisningskompetence (pædagogikum, linjefag, meritlærer), din fagkombination og hvilken skoleform du underviser på (folkeskole/gymnasium/HHX/HTX/erhvervsskole). Sæt denne kombination i første linje af din profil. Undgå "passion for at formidle viden" — rektorer genkender denne kliché med det samme.',
      },
      {
        heading: 'Resultater i tal, også i uddannelsessektoren',
        body:
          'Tabuet omkring tal i uddannelsessektoren er forældet. En eksamenskarakter over landsgennemsnittet, overgangsprocenter, elev-feedback — hvis du har et konkret tal, så nævn det. "Eksamenskarakter historie A: 9,1 (landsgennemsnit 7,2) over 5 årgange" er et stærkt signal om, at du faktisk er en effektiv lærer, ikke kun til stede.',
      },
      {
        heading: 'Curriculum-arbejde og klasselærerrolle vejer tungt',
        body:
          'Rektorer søger lærere, der gør mere end at undervise: curriculum-udvikling, fagudvalg, klasselærer i 3.g, coaching af nyuddannede. Nævn disse roller konkret med tal ("klasselærer i 3.g i 4 sammenhængende årgange"). Det løfter dig over hundredevis af CV\'er, hvor der kun står "erfaring med undervisning".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'accountant',
    functie: 'Registreret revisor / Statsautoriseret revisor',
    title: 'CV-eksempel: Registreret revisor / Statsautoriseret revisor',
    description:
      'CV-eksempel for revisorer, controllere og finance-profiler. Skræddersyet til ansøgninger hos Big 4, mellemstore revisionshuse og koncerner i Danmark.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Mette',
      lastName: 'Sørensen',
      email: 'mette.sorensen@example.dk',
      phone: '+45 27 89 14 56',
      city: 'København',
      linkedIn: 'linkedin.com/in/mettesorensen',
      summary:
        'Statsautoriseret revisor med 8 års audit-erfaring hos Big 4, specialiseret i finansielle institutioner og retail (revisionsklienter >500 mio. kr. omsætning). Ansvarlig audit manager for 14 årsregnskabsrevisioner pr. sæson. Stærk erfaring med IFRS-overgange og SOX-compliance-projekter.',
      experiences: [
        {
          jobTitle: 'Audit Manager — Financial Services',
          company: 'KPMG Danmark',
          location: 'København',
          startDate: '2022-09',
          current: true,
          description:
            'Ansvarlig for revisionsopgaver hos banker og forsikringsselskaber. Ledelse af teams på 6-12 revisorer.',
          tasks: [
            'Audit-ansvarlig for 4 store financial services-klienter med samlet omsætning på 3,2 mia. kr.',
            'Ledelse af IFRS 17-overgangsprojekt hos forsikringsklient; rettidig levering og blank revisionspåtegning.',
            'Coaching af 3 senior associates mod statsautorisations-eksamen; alle 3 bestod i første forsøg.',
          ],
        },
        {
          jobTitle: 'Senior Associate Audit',
          company: 'EY Danmark',
          location: 'København',
          startDate: '2018-08',
          endDate: '2022-08',
          description: 'Revisionsopgaver hos retail- og forbrugsvarekunder.',
          tasks: [
            'Field-koordinator ved årsregnskabsrevisioner op til 800 mio. kr. omsætning (Coop-leverandør, børsnoteret detailhandler).',
            'Forfatter til internt quality memo om varelagercyklusser; optaget i den danske audit-metode.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Statsautoriseret revisor (cand.merc.aud. + eksamen)',
          institution: 'FSR – danske revisorer',
          location: 'København',
          startDate: '2018-09',
          endDate: '2022-06',
        },
        {
          degree: 'Cand.merc.aud.',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      skills: ['Statsautoriseret revisor', 'IFRS', 'SOX', 'IDEA / ACL', 'PowerBI', 'Caseware', 'e-conomic', 'Lead Auditor'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Titel, niche og senioritet først',
        body:
          'Big 4 og mellemstore revisionshuse filtrerer på tre kriterier: SR/RR-titel (eller under eksamen), branche-specialisering (financial services, retail, public sector) og din manager-track. Sæt disse oplysninger eksplicit i linje 1 af din profil. Den, der skriver "audit manager" uden branchespecifikt karriereforløb, vækker straks tvivl.',
      },
      {
        heading: 'Tal og navne er tilladt — diskretion under NDA er muligt',
        body:
          'Revisorer er på grund af tavshedspligten ofte forsigtige med klientnavne — med rette. Men omsætningsstørrelser og branchekontekst ("Coop-leverandør", "børsnoteret forsikringsselskab") er som regel tilladt og virkningsfuldt. Nævn også eksamensresultater (CFO-præsentationer, IFRS-overgange leveret, blanke revisionspåtegninger), når de har bidraget målbart.',
      },
      {
        heading: 'Forfremmelsesvej og coaching-impact',
        body:
          'På manager-niveau og opefter er din evne til at trække andre op lige så vigtig som teknisk kvalitet. "Coaching af 3 senior associates mod statsautorisations-eksamen; alle 3 bestod i første forsøg" er et stærkt signal om professionel kvalitet på det niveau, partnere vil se.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    functie: 'Marketingchef',
    title: 'CV-eksempel: Marketingchef / Marketing Manager',
    description:
      'CV-eksempel for (senior) marketingchefer i B2B og B2C. Konkrete skrivetips, eksempel-bulletpoints og anbefalet layout til rekrutterer-scanningen.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Anders',
      lastName: 'Pedersen',
      email: 'anders.pedersen@example.dk',
      phone: '+45 31 45 78 92',
      city: 'København',
      linkedIn: 'linkedin.com/in/anderspedersen',
      summary:
        'B2B SaaS Marketing Manager med 6 års erfaring hos danske scale-ups inden for fintech og HR-tech. Ejer af paid acquisition-funnel fra pre-Series-A til 15 mio. EUR ARR. Sænkede CAC hos Templafy med 38 % på 2 år gennem retargeting + LinkedIn Ads-optimering.',
      experiences: [
        {
          jobTitle: 'Senior Marketing Manager — Demand Generation',
          company: 'Templafy',
          location: 'København',
          startDate: '2022-04',
          current: true,
          description:
            'Ejer af Nordics demand gen-funnel for SaaS-platformen. Manager for 3 specialister (paid, content, ABM).',
          tasks: [
            'Sænkede Customer Acquisition Cost fra 1.620 EUR til 1.005 EUR på 18 måneder gennem retargeting + funnel-segmentering.',
            'Lancerede ABM-program for 200 enterprise accounts; gav 4,2 mio. EUR pipeline inden for 9 måneder.',
            'Manager for 3-personers team; alle tre fik "exceeds expectations" i den årlige review.',
          ],
        },
        {
          jobTitle: 'Marketing Manager',
          company: 'Visma Danmark',
          location: 'København',
          startDate: '2019-06',
          endDate: '2022-03',
          description: 'B2B marketing for HR-software i SMV-segmentet.',
          tasks: [
            'Byggede content marketing-engine fra 0 til 60.000 månedlige organiske besøgende på 24 måneder.',
            'Lancerede MQL-til-SQL scoring-model i HubSpot; forbedrede konvertering fra 4 % til 11 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidat i Marketing Management',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
          startDate: '2017-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Demand Generation', 'HubSpot', 'Salesforce', 'Google Ads', 'LinkedIn Ads', 'ABM', 'GA4', 'SQL (basis)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Funnel-tal er valutaen',
        body:
          'Rekrutterere til (senior) marketing-roller leder efter én ting: Kan du forbedre funnelen målbart? Sæt hårde tal i hvert bulletpoint: CAC, MQL→SQL konvertering, genereret pipeline, ROAS, tilføjet ARR. "Ansvarlig for marketingstrategi" er ordfyld; "CAC sænket fra 1.620 EUR til 1.005 EUR på 18 måneder" er en interview-trigger.',
      },
      {
        heading: 'Kanal-mix + tool-stack eksplicit',
        body:
          'Nævn konkrete kanaler (LinkedIn Ads, Google Ads, retargeting, ABM, content, partnerships) og de værktøjer, du faktisk bruger operationelt (HubSpot, Salesforce, Marketo, GA4, Looker). Vagt "marketing automation" uden tool-navne er et rødt flag — rekrutterere antager så, at du kun kender det teoretisk.',
      },
      {
        heading: 'Team- og stakeholder-ledelse',
        body:
          'Til senior-roller tæller, om du kan opbygge og lede et team. "Manager for 3 specialister" er stærkere end "samarbejde med team". Nævn konkret, hvem du leder (roller + antal), og som prikken over i\'et: præstationer fra dette team ("alle tre exceeds expectations").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verkoper',
    functie: 'Sælger / Account Manager',
    title: 'CV-eksempel: Sælger / Account Manager',
    description:
      'CV-eksempel for sælgere, account managers og sales-profiler. Med quota attainment-eksempler og tips til B2B vs. B2C ansøgninger.',
    templateId: 'modern',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Daniel',
      lastName: 'Christensen',
      email: 'daniel.christensen@example.dk',
      phone: '+45 28 56 89 01',
      city: 'København',
      linkedIn: 'linkedin.com/in/danielchristensen',
      summary:
        'B2B Account Executive med 5 års erfaring inden for SaaS-salg — full-cycle fra prospect til close. Opnåede 138 % af quota i 2025 hos Salesforce Nordics (deal-størrelse 60-180 t.EUR, sales cycle 4-7 måneder). Stærk erfaring med multi-stakeholder enterprise deals i finance- og retail-sektoren.',
      experiences: [
        {
          jobTitle: 'Account Executive — Mid-Market',
          company: 'Salesforce Nordics',
          location: 'København',
          startDate: '2023-01',
          current: true,
          description:
            'Full-cycle sales: fra outbound prospect til underskrevet kontrakt. Fokus på mid-market kunder (50-500 mio. EUR omsætning).',
          tasks: [
            'Quota attainment 2025: 138 % (2,4 mio. EUR ARR closed vs. 1,75 mio. EUR target).',
            '#3 på Nordics mid-market leaderboard af 22 AEs i H1 2025.',
            'Største deal Nordics mid-market Q4 2024: 380 t.EUR ARR, 6-måneders cyklus, 7 stakeholders.',
          ],
        },
        {
          jobTitle: 'Sales Development Representative',
          company: 'Templafy',
          location: 'København',
          startDate: '2020-08',
          endDate: '2022-12',
          description: 'Outbound prospecting i Norden og Benelux. Generering af MQLs til AE-teamet.',
          tasks: [
            '147 % af SQL-target i 2022; team-rekord for outbound-møder på en måned (38).',
            'Skrev playbook for cold outreach i fintech-nichen; adopteret internt af 14 SDRs.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Bachelor i Erhvervsøkonomi',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
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
        heading: 'Quota attainment er den centrale KPI',
        body:
          'Intet overbeviser sales-rekrutterere som konkret quota attainment pr. år. Skriv det præcist: "138 % af quota 2025 (2,4 mio. EUR ARR closed vs. 1,75 mio. EUR target)". Tilføj ranking, hvis du har arbejdet i et team ("#3 på Nordics mid-market leaderboard af 22 AEs"). Undgå vage termer som "vellykkede salgsresultater".',
      },
      {
        heading: 'Deal-size, cycle-length, stakeholder-count',
        body:
          'Til enterprise-roller tæller, om du kan lukke multi-stakeholder deals. Nævn ved store wins deal-størrelsen, sales-cyklen og antal stakeholders ("380 t.EUR ARR, 6-måneders cyklus, 7 stakeholders"). Så vurderer sales-ledere, om du passer til deres gennemsnitlige ACV og deal-kompleksitet.',
      },
      {
        heading: 'Metode og værktøjer tæller',
        body:
          'Nævn den sales-metodik, du er trænet i (MEDDPICC, MEDDIC, BANT, Challenger, SPIN) og CRM/tooling, du aktivt mestrer (Salesforce, HubSpot, Outreach, Gong). En AE uden metodik-omtale på senior-niveau er et rødt flag.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'office-manager',
    functie: 'Office Manager / Direktionsassistent',
    title: 'CV-eksempel: Office Manager / Direktionsassistent',
    description:
      'CV-eksempel for office managers, direktionsassistenter og management assistants. Konkret og operationelt — med tips til hvordan du gør din værdi målbar.',
    templateId: 'minimalist',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Camilla',
      lastName: 'Møller',
      email: 'camilla.moller@example.dk',
      phone: '+45 22 34 56 78',
      city: 'København',
      summary:
        'Office Manager med 12 års erfaring i scale-ups og et stort advokatfirma. Ansvarlig for kalenderstyring for CEO + 3 direktionsmedlemmer, facility operations på en lokation med 140 medarbejdere og alle onboarding-processer. Vant med HR-on, Notion, Asana, Concur.',
      experiences: [
        {
          jobTitle: 'Office Manager',
          company: 'Lunar',
          location: 'Aarhus',
          startDate: '2021-02',
          current: true,
          description:
            'Ansvarlig for hovedkontorets drift (140 FTE) og kalenderstyring for CEO + 3 direktionsmedlemmer.',
          tasks: [
            'Styring af CEO\'s kalender inkl. internationale rejser (gennemsnitligt 2 trips/måned til EU-hubs).',
            'Onboarding-koordinator: 38 nye medarbejdere i 2024 — 100 % indkøringsklar dag 1.',
            'Genforhandlede lejekontrakten for kontorlokaler: årlig besparelse på 540.000 kr. ved samme kvadratmeter.',
            'Ejer af facility leverandørpoolen (catering, rengøring, kontorartikler) — 6 kontrakter.',
          ],
        },
        {
          jobTitle: 'Direktionsassistent',
          company: 'Plesner Advokatpartnerselskab',
          location: 'København',
          startDate: '2014-09',
          endDate: '2021-01',
          description: 'Support af 4 partnere og deres teams inden for M&A.',
          tasks: [
            'Styring af partner-kalendere og klientkorrespondance (DK/EN).',
            'Koordinering af closing-møder ved store transaktioner — gennemsnitligt 8 closings pr. år.',
            'Medlem af office improvement-teamet; revision af onboarding-processen for advokatfuldmægtige.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Erhvervsuddannelse Kontorassistent (EUD)',
          institution: 'Niels Brock',
          location: 'København',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: ['HR-on', 'Notion', 'Asana', 'Concur', 'Microsoft 365', 'Vendor management', 'Onboarding', 'Engelsk (forhandlingsniveau)'],
      template: 'minimalist',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Operationelt scope frem for personlige kvaliteter',
        body:
          'Klassisk klichét office manager-CV starter med "organiseret, kommunikativ, robust". Rekrutterere tror først på det, når de ser det operationelle scope. Sæt målestokken i linje 1: antal medarbejdere, du er ansvarlig for facility for, antal direktionsmedlemmer hvis kalender du styrer, antal leverandører i din pool.',
      },
      {
        heading: 'Gør din værdi målbar',
        body:
          'Office management-arbejde virker blødt, men kan ofte oversættes godt til tal: årlig besparelse på kontrakter, antal onboardings pr. år, % klarhed dag 1, gennemløbstid for facility issues. Et konkret tal i et bulletpoint ("årlig besparelse 540.000 kr. ved samme kvadratmeter") er stærkere end fem adjektiver.',
      },
      {
        heading: 'Nævn værktøjer eksplicit',
        body:
          'Nævn de præcise systemer, du bruger dagligt (HR-on, Workday, Concur, Notion, Asana, Slack, MS365). For scale-up rekrutterere er det et direkte filter — de leder efter nogen, der er produktiv dag 1, ikke som først skal lære værktøjer.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'projectmanager',
    functie: 'Projektleder',
    title: 'CV-eksempel: Projektleder',
    description:
      'CV-eksempel for projektledere inden for IT, byggeri og konsulentbranchen. Med tips til budget-impact, omtale af metodik og stakeholder management.',
    templateId: 'executive',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Anne',
      lastName: 'Jakobsen',
      email: 'anne.jakobsen@example.dk',
      phone: '+45 23 67 89 14',
      city: 'København',
      linkedIn: 'linkedin.com/in/annejakobsen',
      summary:
        'Senior PMP-certificeret projektleder med 10 års erfaring i digital transformation-programmer hos finansielle institutioner. Leveret: 4 store ERP-implementeringer og et PSD2 compliance-projekt, samlet budget 18 mio. EUR. Stærk erfaring med Agile/Scrum og hybride waterfall-miljøer.',
      experiences: [
        {
          jobTitle: 'Senior Project Manager — Digital Transformation',
          company: 'Danske Bank',
          location: 'København',
          startDate: '2022-03',
          current: true,
          description:
            'Program-ledelse af core banking-modernisering. Stakeholder management på direktionsniveau.',
          tasks: [
            'Ledelse af modernisering af betalingsplatform: 28 FTE, budget 6,4 mio. EUR, leveret 3 måneder før plan.',
            'Sekretær for styregruppen med CFO + CIO + COO som deltagere; månedlig rapportering til bestyrelsen.',
            'Coach for 4 medior-PMs i bankens interne PM Academy.',
          ],
        },
        {
          jobTitle: 'Project Manager — IT Programs',
          company: 'Tryg Forsikring',
          location: 'Ballerup',
          startDate: '2017-09',
          endDate: '2022-02',
          description: 'IT-programledelse inden for Life & Pensions-divisionen.',
          tasks: [
            'Lead på PSD2 compliance-projekt (3,2 mio. EUR budget, 18 måneder, 14 FTE); 100 % audit-clean.',
            'Salesforce Marketing Cloud-implementering: udrulning til 4 business units, ROI break-even i måned 9.',
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
          degree: 'Kandidat i Erhvervsøkonomi',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
          startDate: '2011-09',
          endDate: '2013-08',
        },
      ],
      skills: ['PMP', 'PRINCE2', 'Agile / Scrum', 'JIRA', 'Confluence', 'MS Project', 'Stakeholder management', 'Risk management'],
      template: 'executive',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Budget, scope og leveringstid — alle tre',
        body:
          'For PM-roller er tre metrics valutaen: projektets budget, antal FTE/scope og levering vs. plan. "Ledelse af modernisering af betalingsplatform: 28 FTE, budget 6,4 mio. EUR, leveret 3 måneder før plan" siger mere end en halv side adjektiver. Hvis du har leveret et projekt on-budget og on-time, så nævn det. Hvis du har leveret før plan, er det en interview-trigger.',
      },
      {
        heading: 'Nævn metodik + certificering',
        body:
          'PMP, PRINCE2, AgilePM og Scrum Master hører hjemme i dine kompetencer eller i et separat certifikat-afsnit. Til enterprise-roller er PMP eller PRINCE2 ofte et filter. Nævn den metodik, du faktisk bruger (Agile/Scrum, waterfall, hybrid) og hvilke værktøjer (JIRA, MS Project, Asana).',
      },
      {
        heading: 'Styregruppe- og stakeholder-niveau',
        body:
          'På senior-niveau leder direktioner efter nogen, der kan agere i styregrupper. Nævn konkret, på hvilket niveau du har rapporteret ("styregruppe med CFO + CIO + COO", "månedlig rapportering til bestyrelsen"). Det skiller junior- fra senior-PMs på sekunder.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'stagiair',
    functie: 'Praktikant',
    title: 'CV-eksempel: Praktikant (Bachelor & Kandidat)',
    description:
      'Gratis CV-eksempel for studerende på jagt efter et praktikophold. Bachelor og kandidat. Inklusive tips om, hvad du kan gøre, hvis du har lidt erhvervserfaring.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Emma',
      lastName: 'Andersen',
      email: 'emma.andersen@example.dk',
      phone: '+45 26 78 12 34',
      city: 'København',
      linkedIn: 'linkedin.com/in/emmaandersen',
      summary:
        'Studerende på cand.merc. på CBS på 3. semester med stærk interesse for strategikonsulentbranchen. Formand for studenterforeningen MTP København (560 medlemmer), case-finalist ved McKinsey Academy 2025 og 3 års studiejob hos Coop Danmark. Tilgængelig for et 5-måneders praktikophold fra februar 2026.',
      experiences: [
        {
          jobTitle: 'Formand for bestyrelsen',
          company: 'Studenterforeningen MTP København',
          location: 'København',
          startDate: '2024-09',
          current: true,
          description: 'Ledelse af 6-personers bestyrelse. 560 medlemmer, årsomsætning 900.000 kr.',
          tasks: [
            'Forhandlede sponsoraftale med BCG (3-årig kontrakt, 335.000 kr./år).',
            'Organisering af det årlige "Marketing Battle"-event: 220 deltagere, 14 corporate-partnere.',
            'Ugentlige 1:1\'er med 5 ressortledere; coaching i ledelseskompetencer.',
          ],
        },
        {
          jobTitle: 'Studentermedhjælper (kasse & service)',
          company: 'Coop Danmark',
          location: 'København',
          startDate: '2022-09',
          endDate: '2024-08',
          description: 'Deltidsjob ved siden af studierne. Salg og kassebetjening.',
          tasks: [
            'Forfremmet til shift-coach for nye studentermedhjælpere (efter 8 måneder).',
            'Ansvarlig for sortiments-reset-processen ved skift mellem sæsonkampagner.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Cand.merc. (HA-almen)',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
          startDate: '2023-09',
          endDate: '2026-08',
          description: 'Forventet afgang sommer 2026. Gennemsnit 11,2 (12-skalaen). Honors track Strategy & Innovation.',
        },
        {
          degree: 'STX (Almen Studentereksamen) med udmærkelse',
          institution: 'Frederiksberg Gymnasium',
          location: 'Frederiksberg',
          startDate: '2017-09',
          endDate: '2020-06',
        },
      ],
      skills: ['Excel (avanceret)', 'PowerPoint', 'Python (basis)', 'Tableau (basis)', 'Engelsk (C1)', 'Fransk (B2)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Erhvervserfaring-paradokset: ledelse > studiejobs',
        body:
          'Som studerende har du lidt erhvervserfaring — det er OK. Hvad rekrutterere hos McKinsey, Bain, Danske Bank og Carlsberg leder efter hos praktikantkandidater, er ikke års erfaring, men SIGNALER om ledelse, ejerskab og intellektuel sult. En rolle som formand for en studenterforening (med konkrete tal: medlemstal, omsætning, sponsoraftaler) vejer tungere end to års kasseekspedition.',
      },
      {
        heading: 'Nævn karaktergennemsnit, honors-tracks og cases',
        body:
          'Til strategikonsulentbranchen og investment banking er karakterer bogstaveligt talt et filter (top 5-10 % af din årgang). Nævn dit gennemsnit, hvis det er over 10 på 12-skalaen, dit honors-track og resultater af case-konkurrencer ("McKinsey Academy 2025 case-finalist" — det trigger en samtale). At nævne tilgængelighed eksplicit ("fra februar 2026, 5 måneder") hjælper rekrutterere med planlægning.',
      },
      {
        heading: 'Gør lille arbejde stort — ærligt',
        body:
          'Et studiejob hos Coop kan være en stærk historie, hvis du gør det konkret: "Forfremmet til shift-coach efter 8 måneder" viser, at du blev lagt mærke til; "Ansvarlig for sortiments-reset-processen" viser ejerskab. Undgå overdrivelse ("revolutionerede markedet") — rekrutterere genkender det med det samme.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'consultant',
    functie: 'Konsulent / Strategikonsulent',
    title: 'CV-eksempel: Konsulent / Strategikonsulent',
    description:
      'CV-eksempel for management- og strategikonsulenter. Inklusive MBB-format, case-impact bulletpoints og brancheangivelser.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Jakob',
      lastName: 'Andersen',
      email: 'jakob.andersen@example.dk',
      phone: '+45 27 89 14 56',
      city: 'København',
      linkedIn: 'linkedin.com/in/jakobandersen',
      summary:
        'Senior konsulent med 6 års erfaring hos McKinsey & Company Nordics, specialiseret i financial services og post-merger integration. Lead på 3 PMI-projekter (samlet deal-volumen 4,1 mia. EUR). Stanford MBA. Gæsteunderviser på MBA-kurset "Value Creation in M&A" på CBS.',
      experiences: [
        {
          jobTitle: 'Engagement Manager',
          company: 'McKinsey & Company',
          location: 'København',
          startDate: '2022-08',
          current: true,
          description:
            'Lead-konsulent på high-stakes engagements i Banking & Insurance Practice. Ledelse af 3-5 associates pr. case.',
          tasks: [
            'Lead PMI-projekt for fusion mellem to nordiske banker (2,4 mia. EUR deal): leveret 6 måneder før target.',
            'Cost transformation-program hos EU-forsikringsselskab: 120 mio. EUR annual run-rate savings identificeret, 88 mio. EUR realiseret.',
            'Coach for 4 associates mod engagement manager-forfremmelse; 3 lykkedes i første forsøg.',
          ],
        },
        {
          jobTitle: 'Associate',
          company: 'McKinsey & Company',
          location: 'København',
          startDate: '2019-09',
          endDate: '2022-07',
          description: 'Engagements primært inden for public sector og financial services.',
          tasks: [
            'Kvantitativ modellering til direktionspræsentationer; forfatter til 3 client-facing Excel-modeller.',
            'Initiativtager til intern research om "Post-COVID Retail Banking" — publiceret af Nordics Banking Practice.',
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
          degree: 'Bachelor i Økonomi (med udmærkelse)',
          institution: 'Københavns Universitet (KU)',
          location: 'København',
          startDate: '2013-09',
          endDate: '2016-06',
        },
      ],
      skills: ['M&A / PMI', 'Financial Modeling', 'Stakeholder management', 'Workshop-facilitering', 'Excel/PowerPoint', 'Dansk / Engelsk / Fransk'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'MBB-CV: "the little black dress"-formatet',
        body:
          'Hos MBB (McKinsey, BCG, Bain) og strategy tier-konsulenthuse er formatet strammere end andre steder: én side, sort-hvid, konservativ typografi, ingen farve, intet foto. ResuBox\' Zakelijk- eller Executive-template passer her. Tal og navne hvor muligt — McKinsey læser et case-bulletpoint uden tal som ubevist.',
      },
      {
        heading: 'Cases med deal-volumen, scope og impact',
        body:
          'Beskriv cases i tre dimensioner: scope (deal-volumen, FTE-impact, geografisk rækkevidde), din rolle (Analyst / Associate / EM) og konkret impact ("88 mio. EUR realiseret"). NDA-aspekt: branche og deal-størrelse er som regel også tilladt uden klientnavne — ved tvivl anonymisér ("EU-forsikringsselskab") og hold tal konkrete.',
      },
      {
        heading: 'MBA, GMAT, sprog — ja eller nej',
        body:
          'Til strategikonsulentbranchen vejer uddannelse tungt. Top-MBA-programmer (Stanford, INSEAD, LBS, IESE, Harvard, CBS Executive MBA) skal altid nævnes — stærkt filter. GMAT-score kun, hvis over 720. Udmærkelser/honors-tracks skal altid nævnes. Sprog på C-niveau eller modersmål (DA/EN/FR/DE) er ofte et reelt plus til internationale engagements, så nævn dem.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'logistiek-medewerker',
    functie: 'Lagermedarbejder',
    title: 'CV-eksempel: Lagermedarbejder',
    description:
      'CV-eksempel for lagermedarbejdere i distributionscentre, transport og warehousing. Med truckcertifikat, WMS-kendskab og tips til vikariater.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Kevin',
      lastName: 'Jensen',
      email: 'kevin.jensen@example.dk',
      phone: '+45 28 34 56 78',
      city: 'Kolding',
      summary:
        'Erfaren lagermedarbejder med 7 års erfaring inden for food distribution og e-commerce fulfilment. Truckcertifikat (B+C) og reachtruck-certifikat, erfaring med WMS-systemerne SAP EWM og Manhattan. Fastansat hos DSV Solutions siden 2020, flere gange betroet shift-coach-ansvar.',
      experiences: [
        {
          jobTitle: 'Senior plukker / Shift-coach',
          company: 'DSV Solutions',
          location: 'Horsens',
          startDate: '2020-04',
          current: true,
          description: 'Distributionscenter for Coop-leverandører. 2-skiftsdrift (06:00-14:30 / 14:30-23:00).',
          tasks: [
            'Plukker og konsoliderer ordrer med VR-briller (Honeywell A700x); gennemsnitligt 220 picks/time.',
            'Shift-coach for et team på 8 vikarer; første kontaktperson ved problemer.',
            'Cyklisk varetælling: nøjagtighed 99,4 % over kalenderåret 2024.',
          ],
        },
        {
          jobTitle: 'Trucksjåfør',
          company: 'PostNord',
          location: 'Brøndby',
          startDate: '2018-02',
          endDate: '2020-03',
          description: 'Indgående varestrøm i et af Danmarks største distributionscentre.',
          tasks: [
            'Aflæsning af containere (gennemsnitligt 6 pr. vagt); booking via Manhattan WMS.',
            'Flytning af paller til forskellige lagerlokationer med reachtruck.',
            'Zero-accident-statistik over 24 måneder.',
          ],
        },
      ],
      educations: [
        {
          degree: 'EUD Lager- og terminaluddannelse',
          institution: 'IBC International Business College',
          location: 'Kolding',
          startDate: '2015-09',
          endDate: '2017-06',
        },
      ],
      skills: ['Truckcertifikat B+C', 'Reachtruck-certifikat', 'SAP EWM', 'Manhattan WMS', 'VR-picking (Honeywell)', 'Sikkerhedsuddannelse'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Certifikater i linje 1 af din profil',
        body:
          'Logistik-arbejdsgivere screener efter én ting: Kan denne person starte i morgen? Sæt dine certifikater (truck, reachtruck, ADR for farligt gods) og WMS-systemer øverst. Undgå vage profiler som "flittig medarbejder"; nævn at du er certificeret og på hvilke systemer.',
      },
      {
        heading: 'Tal hvor muligt',
        body:
          'Picks pr. time, nøjagtighedsprocent, zero-accident records, antal containere pr. vagt — alle målbare data tæller. Logistik-rekrutterere hos DSV, PostNord, GLS og Bring leder målrettet efter disse tal, fordi de direkte kan sammenligne kandidater.',
      },
      {
        heading: 'Shift-coach / teamleder-erfaring eksplicit',
        body:
          'Mange lagermedarbejdere får efter 1-2 år coach-ansvar for vikarer eller nye kolleger. Nævn det konkret ("shift-coach for et team på 8 vikarer"). Det signalerer forfremmelsespotentiale mod afdelingsleder-roller.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'monteur',
    functie: 'Mekaniker / Servicetekniker',
    title: 'CV-eksempel: Mekaniker / VVS-installatør',
    description:
      'CV-eksempel for elektrikere, automekanikere og VVS-installatører. Med certificeringer, opdragsgivere og tips til selvstændige montører.',
    templateId: 'zakelijk',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Jens',
      lastName: 'Kristensen',
      email: 'jens.kristensen@example.dk',
      phone: '+45 30 23 45 67',
      city: 'Odense',
      summary:
        'Faglært VVS-energimontør med 12 års erfaring inden for varmeanlæg, varmepumper og solvarme hos Vaillant og lokale VVS-firmaer. F-gas-autorisation, EL-autorisation kat. 1 og GORM. Hos Kemp & Lauritzen ansvarlig for uddannelsesprogram omkring hybrid-varmepumper.',
      experiences: [
        {
          jobTitle: 'Faglært VVS-energimontør',
          company: 'Kemp & Lauritzen',
          location: 'Region Odense-Svendborg',
          startDate: '2019-06',
          current: true,
          description: 'Installation og service af varmeanlæg, hybrid-varmepumper og kondenserende gaskedler hos privathusstande og boligforeninger.',
          tasks: [
            'Slutansvarlig for gennemsnitligt 4 installationer pr. uge; kundetilfredshed 4,8/5,0 i 2024.',
            'Underviser for 6 nye kolleger i 2023-2024 inden for hybrid-varmepumper.',
            'Medlem af regional vagtordning uden for kontortid (2 nætter pr. måned).',
          ],
        },
        {
          jobTitle: 'VVS-montør',
          company: 'Kristensen VVS ApS',
          location: 'Odense',
          startDate: '2013-08',
          endDate: '2019-05',
          description: 'Familieforetagende — varme- og sanitetsinstallation til privatkunder.',
          tasks: [
            'Installation og vedligehold af Vaillant-, Viessmann- og Bosch-kondenseringskedler.',
            'Renoveringsprojekter i fredede bygninger inklusive rørføring og sanitetsinstallation.',
          ],
        },
      ],
      educations: [
        {
          degree: 'EUD VVS-energiuddannelsen (faglært)',
          institution: 'Syddansk Erhvervsskole',
          location: 'Odense',
          startDate: '2009-09',
          endDate: '2013-07',
        },
      ],
      skills: ['F-gas kat. I', 'EL-autorisation kat. 1', 'GORM-godkendelse', 'Hybrid-varmepumper', 'Vaillant / Viessmann / Bosch', 'Sanitetsinstallation', 'Kørekort kat. B'],
      template: 'zakelijk',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Certifikater som hårdt filter',
        body:
          'VVS-firmaer kan ikke uddele opgaver uden F-gas-autorisation eller EL-autorisation; nævn disse i din profil. Især ved varmepumper: nævn producent-trainings (Vaillant, Viessmann) og energistyrelses-godkendelser. Nævn også dit kørekort (kat. B er som regel et krav for servicemontøren).',
      },
      {
        heading: 'Kundetilfredshed og pålidelighed tæller',
        body:
          'Arbejdsgivere som Kemp & Lauritzen, Caverion og NCC vurderer delvist montører på kunde-feedback. Har du en karakter fra dit service-management-system? Så nævn den. Ingen karakter? Så nævn zero-accident-år, on-time-completion-rate eller first-time-fix procent.',
      },
      {
        heading: 'Specialisering i hybrid-varmepumper er skillen i 2026',
        body:
          'Energiomstillingen gør varmepumpe-installation til vækstnichen. Hvis du har erfaring eller uddannelse på området, så skriv det eksplicit. Rekrutterere hos Vaillant, Viessmann og Bosch leder målrettet efter det.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'horeca-medewerker',
    functie: 'Tjener / Restaurationsmedarbejder',
    title: 'CV-eksempel: Hotel & Restauration (Service / Kok / Bartender)',
    description:
      'CV-eksempel for medarbejdere inden for hotel og restauration. Med tips til sæsonarbejde, drikkepenge-omsætning og forfremmelse til shift leader.',
    templateId: 'creatief',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Lotte',
      lastName: 'Olsen',
      email: 'lotte.olsen@example.dk',
      phone: '+45 31 23 45 67',
      city: 'København',
      summary:
        'Alsidig tjener med 6 års erfaring inden for fine dining service hos Restaurant Geranium (3 stjerner) og Restaurant Kadeau. Gennemført sommelier-kursus hos Wine of Course Danmark i 2024. Forfremmet til shift leader hos Kadeau: ledelse af 4 kolleger under services med 80+ couverts.',
      experiences: [
        {
          jobTitle: 'Shift Leader Service',
          company: 'Restaurant Kadeau',
          location: 'København',
          startDate: '2022-04',
          current: true,
          description: 'Michelin-stjerne restaurant på Christianshavn. Frokost og middag, 80-100 couverts pr. service.',
          tasks: [
            'Ledelse af 4 medarbejdere pr. vagt; ansvarlig for runner-flow og menu-forklaring.',
            'Giver vin-anbefalinger og udvikler vin-pairings sammen med køkkenet; flaskeomsætning +18 % i 2024.',
            'Coach for nye medarbejdere i deres første 6 uger.',
          ],
        },
        {
          jobTitle: 'Tjener',
          company: 'Restaurant Geranium***',
          location: 'København',
          startDate: '2019-08',
          endDate: '2022-03',
          description: '3-stjernet Michelin-restaurant i Parken. À la carte og chef\'s menu.',
          tasks: [
            'À la carte-service og vin-pairing til 7-retters chef\'s menu.',
            'Kommunikation på dansk, engelsk og fransk med international klientel.',
            'Medlem af åbningsteamet for sommer-terrasse-editionen 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Sommelier-kursus (grundniveau)',
          institution: 'Wine of Course Danmark',
          location: 'København',
          startDate: '2024-01',
          endDate: '2024-06',
        },
        {
          degree: 'EUD Tjener',
          institution: 'Hotel- og Restaurantskolen',
          location: 'København',
          startDate: '2016-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Vin-pairing', 'Engelsk (flydende)', 'Fransk (avanceret)', 'POS Lightspeed', 'Allergencoaching', 'Hygiejnebevis'],
      template: 'creatief',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Specialisering + niveau i linje 1',
        body:
          'Restaurations-arbejdsgivere (Noma, Geranium, Kadeau, Hotel d\'Angleterre, Marriott) screener på niveau: fine dining vs. brasserie vs. fast service. Specificer, hvor du har arbejdet (stjerne-restaurant, hotel-kæde, lokal bistro). Nævn sprog — fransk eller italiensk til international klientel i København er en reel forskel.',
      },
      {
        heading: 'Forfremmelse og ansvar',
        body:
          'Mange tjenere vokser internt til shift leader, supervisor eller chef de rang. Nævn denne titel, hvis du har haft den — arbejdsgivere ser så, at andre allerede har forfremmet dig. Også: at have været medlem af et åbningsteam for en ny lokation er et stærkt signal.',
      },
      {
        heading: 'Tal hvor muligt: omsætning, couverts, drikkepenge',
        body:
          'Vin-omsætning +%, drikkepenge-omsætning, gennemsnitlige couverts pr. service. Ikke alle tal er tilgængelige, men har du et, så brug det. "+18 % flaskeomsætning 2024" siger langt mere end "passion for vin".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'data-analist',
    functie: 'Dataanalytiker',
    title: 'CV-eksempel: Dataanalytiker / Data Analyst',
    description:
      'CV-eksempel for dataanalytikere med SQL, Python, Tableau og Power BI. Med tips til portfolio, business impact og forfremmelse til analytics engineer.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.dk',
      phone: '+45 26 12 34 78',
      city: 'København',
      linkedIn: 'linkedin.com/in/annaschmidt',
      summary:
        'Dataanalytiker med 4 års erfaring inden for retail analytics hos Salling Group og HelloFresh. SQL, Python (pandas, scikit-learn) og dbt til pipelines; Tableau og Power BI til stakeholder reporting. Ejer af ugentligt forecasting-dashboard, som 12 category managers tilgår til indkøbsbeslutninger.',
      experiences: [
        {
          jobTitle: 'Data Analyst — Category & Pricing',
          company: 'HelloFresh Nordics',
          location: 'København',
          startDate: '2023-08',
          current: true,
          description: 'Analytics-team inden for commerce, supporter 12 category managers med datadrevne indkøbs- og prisbeslutninger.',
          tasks: [
            'Byggede forecasting-dashboard i Tableau, som 12 category managers bruger ugentligt til indkøbsbeslutninger.',
            'Migrerede 8 legacy-reports fra Excel til dbt + Looker; gennemsnitlig refresh-tid reduceret fra 3 t til 8 min.',
            'A/B-test-analyse for kampagnemekanikker; identificerede, at "2 for 1" på friske varer performede 23 % bedre end en rabat.',
          ],
        },
        {
          jobTitle: 'Junior Data Analyst',
          company: 'Salling Group',
          location: 'Aarhus',
          startDate: '2021-09',
          endDate: '2023-07',
          description: 'Del af customer insights-teamet inden for Salling Group online.',
          tasks: [
            'SQL-queries og dashboards i Power BI til marketingteamet.',
            'RFM-segmentering af MinKøbmand-kunder; pilot førte til +2,5 mio. kr. inkrementel omsætning.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidat i Business Analytics',
          institution: 'Aarhus Universitet (AU)',
          location: 'Aarhus',
          startDate: '2019-09',
          endDate: '2021-08',
        },
      ],
      skills: ['SQL (avanceret)', 'Python (pandas, scikit-learn)', 'dbt', 'Tableau', 'Power BI', 'Looker', 'A/B-testing', 'Statistisk analyse'],
      template: 'tech',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Værktøjer + impact, ikke kun værktøjer',
        body:
          'Alle skriver "SQL og Python". Det, der skiller dig ud: Hvad har du brugt det til, og hvad ændrede sig målbart? "Byggede forecasting-dashboard, som 12 category managers bruger ugentligt" er stærkere end "Tableau-erfaring".',
      },
      {
        heading: 'Impactens omfang i tal',
        body:
          'Til data analyst-roller er tre tal konge: omsætnings-/omkostnings-impact (kr.), effektivitetsgevinster (sparede timer, refresh-tid) og datasæt-størrelse/brugere (12 stakeholders, 500.000 kunder, 8 mio. rows). Vælg én pr. bulletpoint.',
      },
      {
        heading: 'Tool-stack matchende målrollen — eksakt overtaget',
        body:
          'Rekrutterere hos Trustpilot, Maersk, HelloFresh og Salling Group bruger keyword matching. Hvis stillingsopslaget nævner dbt + Looker, og du kan det, så skriv præcis de ord. Ikke "bygge transformationer" — men "bygge dbt-models".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'hr-manager',
    functie: 'HR-chef / HR Manager',
    title: 'CV-eksempel: HR-chef / HR Manager',
    description:
      'CV-eksempel for HR-chefer og HR Business Partners. Med tips til medarbejdertilfredshed, ATS-tooling og forfremmelse fra HR Generalist til Manager.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Sandra',
      lastName: 'Knudsen',
      email: 'sandra.knudsen@example.dk',
      phone: '+45 27 67 89 01',
      city: 'København',
      linkedIn: 'linkedin.com/in/sandraknudsen',
      summary:
        'HR Manager med 9 års erfaring i scale-ups og mid-market (50-400 FTE) inden for tech og pleje. Ejer af hele HR-cyklussen hos Templafy København: rekruttering, onboarding, performance, comp&ben og exit. Sænkede personaleomsætningen på 18 måneder fra 18 % til 11 % gennem struktureret onboarding-program og quarterly check-ins.',
      experiences: [
        {
          jobTitle: 'HR Manager Nordics',
          company: 'Templafy',
          location: 'København',
          startDate: '2022-01',
          current: true,
          description: 'Ansvarlig for den nordiske organisation (180 FTE). Refererer direkte til VP People.',
          tasks: [
            'Sænkning af personaleomsætningen fra 18 % til 11 % på 18 måneder gennem onboarding-redesign og quarterly 1:1-cyklus.',
            'Implementering af Workday (migration fra BambooHR); rettidig levering af 4-måneders projekt med 0 data-issues.',
            'Manager for 2 HR Business Partners og 1 People Ops Specialist.',
          ],
        },
        {
          jobTitle: 'HR Business Partner',
          company: 'OK-Fonden',
          location: 'København',
          startDate: '2017-04',
          endDate: '2021-12',
          description: 'Social og pleje-aktør med 1.200 FTE fordelt på 8 lokationer.',
          tasks: [
            'Primær HR-sparringspartner for 3 plejecentre (240 FTE).',
            'Overenskomstforhandling (FOA-overenskomst); afslutning af 11 forhandlingspunkter i 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidat i Human Resource Management',
          institution: 'Copenhagen Business School (CBS)',
          location: 'Frederiksberg',
          startDate: '2015-09',
          endDate: '2017-08',
        },
      ],
      skills: ['Workday', 'HR-on', 'Greenhouse ATS', 'Overenskomstforhandling (FOA)', 'Overenskomstforhandling (Dansk Industri)', 'Performance management', 'Ansættelsesret (grundlæggende)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Scope: antal FTE og branche først',
        body:
          'HR-rekrutterere hos Maersk, Carlsberg, Novo Nordisk og LEGO screener direkte på organisationsstørrelse (50? 500? 5.000?) og branchespecifikke overenskomster. Sæt scope i linje 1: "HR Manager for nordisk organisation med 180 FTE" slår "erfaren HR-professionel".',
      },
      {
        heading: 'Nævn værktøjer — Workday er det grønne flag',
        body:
          'Workday, SuccessFactors, HR-on, Greenhouse, Lever — nævn hvilke værktøjer, du aktivt mestrer. Til enterprise-roller (Mærsk, Danske Bank, Novo Nordisk) er Workday-erfaring ofte et filter. Undgå vagt "HRIS-erfaring".',
      },
      {
        heading: 'Målbar HR-impact tæller tungt',
        body:
          'Sænket personaleomsætning, reduceret time-to-hire, øget eNPS, sygefravær under brancheniveau — alle data tæller. "Sænkning af personaleomsætningen fra 18 % til 11 % på 18 måneder" er en interview-trigger.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    functie: 'Social- og sundhedsassistent',
    title: 'CV-eksempel: Social- og sundhedsassistent (ældrepleje)',
    description:
      'CV-eksempel for social- og sundhedsassistenter i ældreplejen. Til plejehjem, hjemmepleje og handicapområdet. Med tips til autorisation.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Esther',
      lastName: 'Vogel',
      email: 'esther.vogel@example.dk',
      phone: '+45 28 56 78 90',
      city: 'Aarhus',
      summary:
        'Social- og sundhedsassistent med 11 års erfaring i demens-pleje og somatisk langtidspleje hos OK-Fonden og Aleris. Autoriseret SOSU-assistent, kontaktperson for 8 beboere med demens. Klinisk vejleder for SOSU-elever — har de seneste 5 år begleitet 12 elever, alle bestod.',
      experiences: [
        {
          jobTitle: 'Kontaktperson, demensafsnit',
          company: 'OK-Fonden Plejecenter',
          location: 'Aarhus',
          startDate: '2019-08',
          current: true,
          description: 'Plejecenter for mennesker med demens. Lille bo-enhed med 8 beboere.',
          tasks: [
            'Kontaktperson for 8 beboere: udarbejder og evaluerer plejeplaner, kontaktperson for pårørende.',
            'Klinisk vejleder for SOSU-elever; 12 elever begleitet i de seneste 5 år (100 % beståelse).',
            'Medlem af kvalitetsudvalget for adfærdsudfordringer; revision af faldforebyggelses-protokollen 2023.',
          ],
        },
        {
          jobTitle: 'Social- og sundhedshjælper',
          company: 'Aleris',
          location: 'Skanderborg',
          startDate: '2014-01',
          endDate: '2019-07',
          description: 'Bofællesskab for voksne med udviklingshæmning.',
          tasks: [
            'Personlig pleje og daglig støtte til 6 beboere med moderat til svær handicap.',
            'Koordinering af weekend-udflugter og familiebesøg.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Social- og sundhedsassistentuddannelsen (3-årig, autoriseret)',
          institution: 'SOSU Østjylland',
          location: 'Aarhus',
          startDate: '2011-09',
          endDate: '2013-12',
        },
      ],
      skills: ['Autoriseret SOSU-assistent', 'Kontaktpersonordning', 'Klinisk vejleder', 'Demens / gerontopsykiatri', 'Cura', 'Håndtering af adfærdsudfordringer', 'Faldforebyggelse'],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Autorisation + niveau + pleje-setting i linje 1',
        body:
          'Plejeinstitutioner filtrerer på: autoriseret (ja/nej), kvalifikationsniveau (SOSU-hjælper / SOSU-assistent) og pleje-setting (demens / somatik / handicap / hjemmepleje). Sæt denne kombination i første linje. At nævne rollen som kontaktperson giver straks et senior-signal.',
      },
      {
        heading: 'Plejedokumentations-systemer eksplicit',
        body:
          'Cura, Nexus, KMD Care — hvilke systemer har du brugt? For pleje-aktører er det et filter — nye medarbejdere, der straks kan arbejde i systemet, foretrækkes. Nævn det under kompetencer.',
      },
      {
        heading: 'Klinisk vejledning er en differentierende rolle',
        body:
          'At være klinisk vejleder for SOSU-elever er en stærk status — plejeinstitutioner værdsætter dem, der kan videregive viden. Nævn antal vejledte elever og beståelsesprocenten, hvis du har den.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'designer',
    functie: 'Designer (UX / Grafisk)',
    title: 'CV-eksempel: UX Designer / Grafisk Designer',
    description:
      'CV-eksempel for UX-designere og grafiske designere. Med portfolio-links, Figma-kompetencer og tips til bureau- vs. in-house-ansøgninger.',
    templateId: 'creatief',
    colorSchemeId: 'rose',
    cv: buildExampleCV({
      firstName: 'Tessa',
      lastName: 'Bruun',
      email: 'tessa.bruun@example.dk',
      phone: '+45 26 78 90 12',
      city: 'København',
      linkedIn: 'linkedin.com/in/tessabruun',
      summary:
        'Senior Product Designer med 6 års erfaring i B2C-app-design hos Lunar og Pleo. Specialisering i payment flows og onboarding-optimering. Ejer af design system hos Pleo siden 2023: 80+ komponenter, brugt af 14 engineers og 4 designere.',
      experiences: [
        {
          jobTitle: 'Senior Product Designer',
          company: 'Pleo',
          location: 'København',
          startDate: '2023-03',
          current: true,
          description: 'Merchant dashboard-teamet — onboarding og payment-konfigurationsflows.',
          tasks: [
            'Ejer af Pleo design system (80+ komponenter i Figma); brugt af 14 engineers og 4 designere.',
            'Onboarding-redesign: completion rate for merchant sign-ups +24 % i de første 6 måneder.',
            'User research med 12 enkeltmandsejede virksomheder (CVR-registrerede); førte til forenkling af KYC-processen.',
          ],
        },
        {
          jobTitle: 'Product Designer',
          company: 'Lunar',
          location: 'Aarhus',
          startDate: '2019-09',
          endDate: '2023-02',
          description: 'Mobile app-design — fokus på investments og split payments-features.',
          tasks: [
            'Lead designer på investments-feature-launch (2021); 60.000+ premium-brugere aktive i første år.',
            'Design lead på redesign af payment request-flow; conversion +18 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Bachelor i Kommunikationsdesign',
          institution: 'Designskolen Kolding',
          location: 'Kolding',
          startDate: '2015-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Figma (avanceret)', 'Design Systems', 'User Research', 'Prototyping', 'A/B-testing', 'Webflow', 'Engelsk (flydende)'],
      template: 'creatief',
      colorScheme: 'rose',
    }),
    advice: [
      {
        heading: 'Portfolio-link i profilen + pr. projekt',
        body:
          'Design-rekrutterere klikker på dit portfolio inden for 5 sekunder. Sæt denne URL fremtrædende i headeren af dit CV, og linke fra relevante erfaringsbulletpoints til specifikke cases. Undgå generelle portfolios med "alt indeni"; rekrutterere vil se 3-5 cases, der er relevante for rollen.',
      },
      {
        heading: 'Specialisering + tool-stack',
        body:
          'B2C app-design ≠ B2B SaaS-design ≠ branding. Specificer, hvad du er stærk i. Tool-stack eksplicit: Figma + Webflow + Notion / Maze / Hotjar. Design systems-erfaring er til enterprise-roller (Danske Bank, Mærsk, Novo Nordisk Design Studio) et filter.',
      },
      {
        heading: 'Målbar impact: conversion, completion, retention',
        body:
          'Senior designere måles på business impact, ikke kun på output. "Onboarding-redesign: completion rate +24 % i de første 6 måneder" er en interview-trigger. Nævn user research-tal (antal interviews, NPS-ændringer).',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'financieel-medewerker',
    functie: 'Bogholderiassistent',
    title: 'CV-eksempel: Bogholderiassistent / Finansbogholder',
    description:
      'CV-eksempel for bogholderiassistenter, finansbogholdere og finance support. Med software-tooling og forfremmelse til controller.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Bianca',
      lastName: 'Lund',
      email: 'bianca.lund@example.dk',
      phone: '+45 27 89 01 23',
      city: 'Aarhus',
      summary:
        'Alsidig bogholderiassistent med 8 års erfaring i mellemstore virksomheder (omsætning 35-350 mio. kr.) inden for produktion og engros. Ansvarlig for komplet debitor- og kreditorbogholderi, momsindberetninger og support til årsregnskab. Superbruger i e-conomic og SAP.',
      experiences: [
        {
          jobTitle: 'Finansbogholder',
          company: 'Carlsberg',
          location: 'København',
          startDate: '2020-06',
          current: true,
          description: 'Bryggerikoncern. Del af et 6-personers finance-team.',
          tasks: [
            'Komplet håndtering af debitor- og kreditorbogholderi (gennemsnitligt 800 fakturaer pr. måned).',
            'Månedlige momsindberetninger og kvartalsvise EU-listeangivelser.',
            'Support til årsregnskab sammen med ekstern revision (Deloitte København).',
            'Implementering af Basware til automatisk fakturahåndtering; reducerede manuelt bogføringsarbejde med 60 %.',
          ],
        },
        {
          jobTitle: 'Administrationsmedarbejder',
          company: 'Van der Schoot Engros A/S',
          location: 'Aarhus',
          startDate: '2016-02',
          endDate: '2020-05',
          description: 'Familievirksomhed inden for teknisk engros; omsætning 130 mio. kr.',
          tasks: [
            'Håndtering af ind- og udgående fakturaer, bankbogføringer, kasse.',
            'Forberedelse af månedlig rapportering til direktionen.',
          ],
        },
      ],
      educations: [
        {
          degree: 'EUD Kontoruddannelsen med speciale i økonomi',
          institution: 'Aarhus Business College',
          location: 'Aarhus',
          startDate: '2012-09',
          endDate: '2016-01',
        },
      ],
      skills: ['e-conomic', 'SAP FI/CO', 'Basware', 'Microsoft Dynamics', 'Momsindberetning', 'EU-listeangivelse', 'Microsoft Excel (avanceret)'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Nævn software-stack eksplicit',
        body:
          'Mellemstore virksomheder og revisorkontorer screener finance-CV\'er på værktøjs-erfaring: e-conomic, SAP, Microsoft Dynamics, Visma, Navision. Nævn, hvilke du aktivt bruger. Til revisorkontorer: bonus er Caseware (audit-tool) eller branchespecifik software.',
      },
      {
        heading: 'Scope: omsætning, fakturavolumen, branche',
        body:
          'En bogholder i en virksomhed med 35 mio. kr. omsætning er meget anderledes end i én med 350 mio. kr. Specificer skalaen: gennemsnitligt antal fakturaer pr. måned, virksomhedens omsætning (hvis offentligt) eller branche. "800 fakturaer pr. måned" er konkret.',
      },
      {
        heading: 'Automatisering / procesforbedring skiller sig ud',
        body:
          'Mange finance-folk laver rutinearbejde; den der initierer procesforbedring (Basware-implementering, automatisk bankafstemning, OCR-fakturagenkendelse) skiller sig straks ud. "60 % reduktion i manuelt bogføringsarbejde" er en interview-trigger til controller-track.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'klantenservice-medewerker',
    functie: 'Kundeservicemedarbejder',
    title: 'CV-eksempel: Kundeservicemedarbejder',
    description:
      'CV-eksempel for kundeservicemedarbejdere i callcenter, e-commerce og B2B. Med First-Contact-Resolution, CSAT-scores og tips til forfremmelse.',
    templateId: 'minimalist',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Mehmet',
      lastName: 'Yilmaz',
      email: 'mehmet.yilmaz@example.dk',
      phone: '+45 28 90 12 34',
      city: 'København',
      summary:
        'Kundeservicemedarbejder med 5 års erfaring inden for e-commerce og telekommunikation. Hos Elgiganten: top 5 % First-Contact-Resolution score i 2024 og NPS 9,2 (team-gennemsnit 8,4). Klinisk vejleder for nye kolleger i deres første 4 uger on the floor.',
      experiences: [
        {
          jobTitle: 'Senior Kundeservicemedarbejder / Coach',
          company: 'Elgiganten',
          location: 'Taastrup',
          startDate: '2022-08',
          current: true,
          description: 'Webcare- og telefoniteam for afdelingen for små husholdningsapparater.',
          tasks: [
            'First-Contact-Resolution rate 76 % (team-gennemsnit 68 %); top 5 % af 220-personers afdeling.',
            'NPS 9,2 i 2024 (team-gennemsnit 8,4); hørte til top 10 for kundetilfredshed Q4.',
            'Floor coach for nye kolleger under deres første 4 uger; 14 kolleger oplært.',
          ],
        },
        {
          jobTitle: 'Kundeservicemedarbejder',
          company: 'TDC',
          location: 'København',
          startDate: '2020-03',
          endDate: '2022-07',
          description: 'Indgående team for mobil- og internetabonnementer.',
          tasks: [
            'Behandling af indgående opkald om produktspørgsmål, fakturering og driftsforstyrrelser.',
            'Identifikation af upsell-muligheder inden for eksisterende kontrakter.',
          ],
        },
      ],
      educations: [
        {
          degree: 'EUD Detailhandel med specialer (marketing)',
          institution: 'Niels Brock',
          location: 'København',
          startDate: '2016-09',
          endDate: '2020-02',
        },
      ],
      skills: ['Zendesk', 'Salesforce Service Cloud', 'Webcare (Twitter/Instagram)', 'DA, EN, TR flydende', 'Deeskaleringsteknikker', 'Konflikthåndtering'],
      template: 'minimalist',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Performance-tal er valutaen',
        body:
          'Kundeservice er et målbart fagområde: FCR (First-Contact-Resolution), CSAT, NPS, AHT (Average Handle Time), gennemsnitlige calls pr. vagt. Nævn de målbare tal, du har haft. "NPS 9,2 vs. team-gennemsnit 8,4" er meget stærkere end "kundeorienteret".',
      },
      {
        heading: 'Specificer software-stack og kanaler',
        body:
          'Zendesk, Salesforce Service Cloud, Freshdesk, Intercom — hvilket CRM/ticketing-system har du brugt? Telefonisk, chat, webcare (Twitter/Instagram), e-mail? Arbejdsgivere som Elgiganten, Power, SAS og HelloFresh vil vide, om du er produktiv dag 1.',
      },
      {
        heading: 'Vejledning & coaching viser lederpotentiale',
        body:
          'Mange kundeservicemedarbejdere får efter 1-2 år floor coach-ansvar. Nævn det konkret ("14 nye kolleger oplært"). Til teamleder-tracket er dette det mest afgørende signal.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'recruiter',
    functie: 'Rekrutterer / Talent Acquisition',
    title: 'CV-eksempel: Rekrutterer / Talent Acquisition',
    description:
      'CV-eksempel for in-house- og bureau-rekrutterere. Med time-to-hire metrics, ATS-tooling og tips til skift mellem bureau og corporate.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Robin',
      lastName: 'Schultz',
      email: 'robin.schultz@example.dk',
      phone: '+45 23 45 67 89',
      city: 'København',
      linkedIn: 'linkedin.com/in/robinschultz',
      summary:
        'Tech-rekrutterer med 5 års erfaring; 3 år hos bureauet Hays og 2 år in-house hos Trustpilot. Specialisering i senior software engineers og data professionals. 2024: 38 hires realiseret (target 30), gennemsnitlig time-to-hire 28 dage (afdelingsgennemsnit 41).',
      experiences: [
        {
          jobTitle: 'Senior Talent Acquisition Partner',
          company: 'Trustpilot',
          location: 'København',
          startDate: '2023-04',
          current: true,
          description: 'Tech recruitment, fokus på senior engineering & data-roller.',
          tasks: [
            '38 hires realiseret i 2024 (target 30); time-to-hire 28 dage (afdelingsgennemsnit 41).',
            'Hiring manager partnership for 4 engineering-teams; ugentlige intake- og kalibrerings-sessioner.',
            'Ejerskab af Nordics employer branding-samarbejde med marketingafdelingen.',
          ],
        },
        {
          jobTitle: 'Rekrutterer',
          company: 'Hays',
          location: 'København',
          startDate: '2020-09',
          endDate: '2023-03',
          description: 'Tech-rekrutteringsbureau. Egen kundeportefølje på 12 corporate accounts.',
          tasks: [
            'Egen portefølje på 12 corporate accounts (Ø 13,5 mio. kr. årsomsætning).',
            'Q4 2022: #1 på Nordics tech-leaderboard med 31 placements.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Professionsbachelor i Human Resources',
          institution: 'Københavns Professionshøjskole',
          location: 'København',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['Greenhouse ATS', 'LinkedIn Recruiter', 'SmartRecruiters', 'Hireflix', 'Boolean Search', 'Tech-rekruttering (Java/Go/Python stack)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Time-to-hire og placement-tal er din quota',
        body:
          'Rekruttering er et målbart fag. Time-to-hire, antal placements, offer acceptance rate, candidate NPS. Skriv tallene præcist: "38 hires i 2024 (target 30); time-to-hire 28 dage (afdelingsgennemsnit 41)". Sådan vurderer TA-ledere dit niveau.',
      },
      {
        heading: 'ATS-tooling og sourcing-stack',
        body:
          'Hvilke ATS har du aktivt brugt? Greenhouse, Workable, SmartRecruiters, HR-on, Lever. Hvilke sourcing-værktøjer? LinkedIn Recruiter, Hiretual/SeekOut, GitHub search til tech, Boolean til LinkedIn Free. Til in-house corporate-roller er det et filter.',
      },
      {
        heading: 'Branche-specialisering og senioritet',
        body:
          'Tech-rekrutterer, finance-rekrutterer, healthcare-rekrutterer — niche-specialisering vejer tungt. Nævn hvilken rolle-type og hvilke skills/stacks, du aktivt rekrutterer til. "Senior software engineers Java/Go" er stærkere end "tech roles".',
      },
    ],
  },
];

export default EXAMPLES_DA;
export const EXAMPLE_BY_SLUG_DA: Record<string, FunctieExample> = Object.fromEntries(
  EXAMPLES_DA.map((e) => [e.slug, e])
);
export const EXAMPLE_SLUGS_DA = EXAMPLES_DA.map((e) => e.slug);
