import { FunctieExample } from './types';
import { buildExampleCV } from './builder';

const EXAMPLES_SV: FunctieExample[] = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'developer',
    functie: 'Mjukvaruutvecklare / Engineer',
    title: 'CV-exempel: Mjukvaruutvecklare / Engineer',
    description:
      'Gratis CV-exempel för mjukvaruutvecklare och engineers. Rekryterarvänlig layout för ansökningar till svenska scale-ups, FAANG och corporate tech. Inkluderar skrivtips.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Erik',
      lastName: 'Andersson',
      email: 'erik.andersson@example.se',
      phone: '+46 70 123 45 67',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/erikandersson',
      summary:
        'Backend engineer med 7 års erfarenhet av TypeScript och Go hos scale-ups inom fintech och resor. Reducerade API-latens med 42 % genom riktad query-optimering och caching. Trygg med code reviews, produktionsfelsökning och mentorskap för juniora utvecklare.',
      experiences: [
        {
          jobTitle: 'Senior Backend Engineer',
          company: 'Klarna',
          location: 'Stockholm',
          startDate: '2023-02',
          current: true,
          description:
            'Del av Payments platform-teamet (12 engineers). Owner av refund service-domänen.',
          tasks: [
            'Migrerade refund-tjänsten från monolit till event-driven microservice (Kafka) — minskade refund-handläggning från 4 timmar till 90 sekunder för 18M transaktioner/månad.',
            'Skrev PR-mallar och code review-guidelines som infördes i hela teamet.',
            'Mentor för 2 juniora engineers; båda befordrade till mid-level efter 12 månader.',
          ],
        },
        {
          jobTitle: 'Full-stack Developer',
          company: 'Lunar Bank',
          location: 'Stockholm',
          startDate: '2019-08',
          endDate: '2023-01',
          description: 'Arbetade på merchant dashboard (React + Java backend).',
          tasks: [
            'Byggde realtidsdashboard för fraud-regler som används dagligen av 200+ merchants.',
            'Reducerade dashboardets TTI från 4,8 s till 1,6 s genom code-splitting och cache-strategi.',
            'Införde Storybook + visual regression testing i frontend-teamet.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Civilingenjör Datateknik',
          institution: 'KTH (Kungliga Tekniska Högskolan)',
          location: 'Stockholm',
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
        heading: 'Vad tech-rekryterare skannar efter på 6 sekunder',
        body:
          'Rekryterare på Klarna, Spotify, Tink och Stripe Sverige skannar utvecklar-CV efter tre saker samtidigt: primärt språk/ramverk, kända arbetsgivare och konkret impact i siffror. Sätt din huvudsakliga stack (språk + ramverk + cloud) på rad 1 i din profil — inte i en skills-tag längst ner. Undvik "passionerad om kodning" och klichéer som "lagspelare"; svenska rekryterare ser sådant tusen gånger om dagen och filtrerar bort det aggressivt.',
      },
      {
        heading: 'Punkter med siffror slår punkter med uppgifter',
        body:
          'Jämför "Arbetade på refund-tjänsten" med "Migrerade refund-tjänsten från monolit till event-driven microservice — minskade handläggning från 4 h till 90 s för 18M transaktioner/månad". Den andra vinner varje gång. Gå igenom varje punkt och fråga: vad förändrades mätbart? Latens, throughput, felfrekvens, teamkapacitet, kostnad. Om du inte har en siffra, beskriv omfattningen ("används dagligen av 200+ merchants").',
      },
      {
        heading: 'Vad hör INTE hemma på ett svenskt utvecklar-CV',
        body:
          'Skill-balkar (att betygsätta sig själv 4/5 i Excel — ingen rekryterare tar det på allvar). Ikoner intill e-post eller telefon. Ett foto är inte konvention i Sverige för tech-roller — utelämna det om du inte har goda skäl. GitHub som en naken länk utan kontext — för varje relevant projekt, nämn stacken och din roll. Hobbyprojekt bara om de är genuint relevanta för rollen; annars stryk dem. Håll ditt CV till max två sidor.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    functie: 'Sjuksköterska',
    title: 'CV-exempel: Sjuksköterska',
    description:
      'Professionellt CV-exempel för legitimerade sjuksköterskor. ATS-vänlig layout, fokuserad på regionsjukhus, privata vårdgivare och kommunal vård i Sverige. Inkluderar tips om Socialstyrelsens legitimation och specialisering.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Anna',
      lastName: 'Lindberg',
      email: 'anna.lindberg@example.se',
      phone: '+46 70 987 65 43',
      city: 'Stockholm',
      summary:
        'Legitimerad sjuksköterska med 9 års erfarenhet inom intensivvård och kardiologi. Vana vid journalsystemen Cosmic och TakeCare, BLS/ACLS-certifierad. Specialisering inom hjärtsvikt och postoperativ vård. Handledare för sjuksköterskestudenter termin 5 och 6.',
      experiences: [
        {
          jobTitle: 'IVA-sjuksköterska',
          company: 'Karolinska Universitetssjukhuset',
          location: 'Stockholm',
          startDate: '2021-09',
          current: true,
          description:
            'IVA vuxen, thoraxkirurgisk avdelning. Del av ett team om 14 intensivvårdssjuksköterskor.',
          tasks: [
            'Mottagande och stabilisering av postoperativa patienter efter hjärtkirurgi (i snitt 4 patienter per pass).',
            'Övervakade extubationer och weaning från mekanisk ventilation.',
            'Handledare för 5 sjuksköterskestudenter (termin 5-6) under de senaste 2 åren.',
            'Medlem i kvalitetskommittén; ledde revideringen av protokollet för smärthantering post-CABG.',
          ],
        },
        {
          jobTitle: 'Kardiologisjuksköterska',
          company: 'Södersjukhuset',
          location: 'Stockholm',
          startDate: '2016-02',
          endDate: '2021-08',
          description:
            'Avdelning C2 — Kardiologi. Allmän vård och monitorering av hjärtsvikt, arytmier och post-PCI-patienter.',
          tasks: [
            'Ansvarig för 8-10 patienter per pass; koordination med kardiologer och fysioterapi.',
            'Förberedelse och eftervård av patienter inför hjärtkateterisering och pacemakerimplantation.',
            'Förstainsats vid hjärtstopp; medlem i akutteamet.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Sjuksköterskeexamen (kandidatexamen)',
          institution: 'Karolinska Institutet',
          location: 'Stockholm',
          startDate: '2012-09',
          endDate: '2016-01',
        },
        {
          degree: 'Specialistsjuksköterskeexamen Intensivvård',
          institution: 'Karolinska Institutet',
          location: 'Stockholm',
          startDate: '2022-01',
          endDate: '2023-06',
        },
      ],
      skills: [
        'Socialstyrelsens legitimation',
        'BLS / ACLS',
        'Cosmic',
        'TakeCare',
        'Postoperativ vård',
        'Hjärtsvikt',
        'Klinisk handledning',
        'Triage',
      ],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Legitimation + specialisering först',
        body:
          'För regionsjukhus och privata vårdgivare är tre saker direkt avgörande: din legitimation (skriv "leg. sjuksköterska" eller "Socialstyrelsens legitimation" explicit), din specialisering och vilken avdelning/setting du har arbetat på. Sätt den informationen på första raden i din profil. Specificera för varje arbetsgivare avdelning och patientgrupp — en generisk "sjuksköterska på sjukhus X" säger ingenting, "IVA-sjuksköterska, thoraxavdelning X" är direkt tydligt.',
      },
      {
        heading: 'Kontinuitet och certifieringar väger tungt',
        body:
          'Svenska sjukhus värdesätter längre anställningstider högt — gör god employer-tenure synlig. Nämn specialistutbildningar, handledarutbildningar och fortbildning (BLS, ACLS, ALS, EPALS, NLS) i en egen certifieringssektion eller integrera dem med utbildning. Journalsystemerfarenhet (Cosmic, TakeCare, Melior, NCS Cross) är ett verkligt filter för många regioner — lista dem under kompetenser.',
      },
      {
        heading: 'Handledning och kvalitetsarbete som plus',
        body:
          'Klinisk handledning av sjuksköterskestudenter, plats i kvalitetskommittéer, protokollutveckling — det är alla starka signaler för vårdenhetschefer som söker erfarna sjuksköterskor. Nämn dem konkret ("5 sjuksköterskestudenter termin 5-6 under de senaste 2 åren"), inte vagt ("erfarenhet av handledning").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'leraar',
    functie: 'Lärare',
    title: 'CV-exempel: Lärare (Gymnasium / Grundskola)',
    description:
      'CV-exempel för lärare i grundskola, gymnasium och högskola. Med tips om lärarlegitimation, mentorskap och kursplaneutveckling på ditt CV.',
    templateId: 'modern',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Daniel',
      lastName: 'Bergström',
      email: 'daniel.bergstrom@example.se',
      phone: '+46 70 223 34 45',
      city: 'Göteborg',
      summary:
        'Legitimerad ämneslärare i historia med 11 års erfarenhet på Hvitfeldtska gymnasiet i Göteborg (åk 1-3). Mentor för en åk 2-klass, utvecklare av kursplanen för Historia 1b och medlem i ämnesgruppen för historia. Andel godkända på Historia 2 konstant över riksgenomsnittet.',
      experiences: [
        {
          jobTitle: 'Ämneslärare Historia (gy 1-3)',
          company: 'Hvitfeldtska gymnasiet',
          location: 'Göteborg',
          startDate: '2018-08',
          current: true,
          description:
            'Undervisning i åk 1-3 i historia och samhällskunskap. Mentor för åk 2. 90 % tjänst.',
          tasks: [
            'Mentor för åk 2 i 4 efterföljande kohorter; i snitt 28 elever per klass.',
            'Andel godkända A-C på Historia 2: 96 % (riksgenomsnitt: 89 %) mätt över 5 kohorter.',
            'Utvecklade kursplanen för Historia 1b 2022 — införd skolan över av alla 6 historielärare.',
            'Medlem i ämnesgruppen historia: uppföljning av kursmål och interna bedömningsmatriser.',
          ],
        },
        {
          jobTitle: 'Lärare Historia & Samhällskunskap',
          company: 'Schillerska gymnasiet',
          location: 'Göteborg',
          startDate: '2014-08',
          endDate: '2018-07',
          description: 'Undervisning i åk 1-2 i historia och samhällskunskap.',
          tasks: [
            'Initiativtagare till programmet "Historia i staden": elever undersöker Göteborgs industriarv.',
            'Mentor för 2 nyutexaminerade lärare som del av introduktionsprogrammet.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Ämneslärarexamen (masterexamen, historia)',
          institution: 'Göteborgs universitet',
          location: 'Göteborg',
          startDate: '2013-09',
          endDate: '2018-06',
        },
      ],
      skills: [
        'Lärarlegitimation (ämneslärare)',
        'Mentorskap gymnasiet',
        'Kursutvecklingsarbete',
        'Kursplaneutveckling',
        'Schoolsoft',
        'InfoMentor',
        'Differentierad undervisning',
      ],
      template: 'modern',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Legitimation, ämne och stadium på första raden',
        body:
          'Rektorer och HR skannar efter tre saker: legitimation (lärarlegitimation / ämneslärarexamen), ditt ämne och vilket stadium du undervisar (åk F-3 / 4-6 / 7-9 / gymnasiet / vuxenutbildning). Sätt den kombinationen på första raden i din profil. Undvik "passionerad för undervisning" — rektorer känner igen det mönstret omedelbart som en mallformulering.',
      },
      {
        heading: 'Resultat i siffror, även inom utbildning',
        body:
          'Tabut kring siffror i utbildning är förlegat. Andel godkända över riksgenomsnitt, meritvärde, restider, kvarvarande andel — om du har en siffra, ta med den. "Historia 2: 96 % godkända (riks 89 %) över 5 kohorter" är en stark signal om att du är genuint effektiv som lärare, inte bara närvarande.',
      },
      {
        heading: 'Kursutvecklingsarbete och mentorskap väger tungt',
        body:
          'Rektorer söker lärare som gör mer än undervisar: kursplaneutveckling, ämnesgrupper, mentorskap, coachning av nyutexaminerade lärare. Nämn dessa roller konkret med siffror ("mentor för 4 efterföljande åk 2-kohorter"). Det skiljer dig från hundratals CV som bara säger "undervisningserfarenhet".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'accountant',
    functie: 'Auktoriserad revisor',
    title: 'CV-exempel: Auktoriserad revisor',
    description:
      'CV-exempel för auktoriserade revisorer, controllers och ekonomispecialister i Sverige. Skräddarsytt för ansökningar till Big 4, mellansegmentet och börsbolag.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Eleonora',
      lastName: 'Hellström',
      email: 'eleonora.hellstrom@example.se',
      phone: '+46 70 135 24 68',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/eleonorahellstrom',
      summary:
        'Auktoriserad revisor med 8 års revisionserfarenhet på Big 4, specialiserad på finansiella institutioner och retail (revisionsuppdrag >5 mdr SEK omsättning). Påskrivande revisor för 14 lagstadgade revisioner per säsong. Stark erfarenhet av IFRS-övergångar och SOX-compliance-program.',
      experiences: [
        {
          jobTitle: 'Audit Manager — Financial Services',
          company: 'KPMG Sverige',
          location: 'Stockholm',
          startDate: '2022-09',
          current: true,
          description:
            'Ansvarig för genomförandet av revisionsuppdrag hos banker och försäkringsbolag. Leder team om 6-12 revisorer.',
          tasks: [
            'Påskrivande revisor för 4 stora financial services-klienter med sammanlagd omsättning 28 mdr SEK.',
            'Ledde IFRS 17-övergångsprojekt hos försäkringsklient; leverans i tid och ren revisionsberättelse.',
            'Coachade 3 senior associates genom slutexamen Revisorsexamen; alla 3 klarade vid första försöket.',
          ],
        },
        {
          jobTitle: 'Senior Associate Audit',
          company: 'EY Sverige',
          location: 'Stockholm',
          startDate: '2018-08',
          endDate: '2022-08',
          description: 'Revisionsuppdrag hos retail- och konsumentvaruklienter.',
          tasks: [
            'Fältarbetskoordinator på lagstadgade revisioner upp till 8 mdr SEK omsättning (ICA-leverantör, börsnoterad detaljhandel).',
            'Författare till intern kvalitetspromemoria om lagercykler; införd i svensk revisionsmetodik.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Revisorsexamen (FAR)',
          institution: 'FAR',
          location: 'Stockholm',
          startDate: '2018-09',
          endDate: '2022-06',
        },
        {
          degree: 'Civilekonomexamen, inriktning redovisning',
          institution: 'Handelshögskolan i Stockholm',
          location: 'Stockholm',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      skills: ['Auktoriserad revisor', 'IFRS', 'SOX', 'Audit Command Language (ACL)', 'Power BI', 'Caseware', 'IDEA', 'Påskrivande revisor'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Behörighet, nisch och senioritet först',
        body:
          'Big 4 och medelstora byråer screenar på tre filter: auktorisation (auktoriserad revisor / godkänd revisor / under utbildning), sektorspecialisering (Financial Services, Retail, Public Sector) och din ledarbana. Sätt den informationen explicit på rad 1 i din profil. Den som skriver audit manager utan sektorsspecifik bakgrund väcker omedelbart tvivel.',
      },
      {
        heading: 'Siffror och namn är okej — diskretion lever inom sekretessavtal',
        body:
          'Revisorer är ofta försiktiga med klientnamn på grund av tystnadsplikt — med rätta. Men omsättningsintervall och sektorskontext ("ICA-leverantör", "börsnoterad försäkring") är vanligen tillåtna och kraftfulla. Inkludera även slutprestationer (CFO-presentationer, IFRS-övergångar levererade, rena revisionsberättelser) där de mätbart bidrog.',
      },
      {
        heading: 'Befordringsbana och coaching-impact',
        body:
          'På manager-nivå och uppåt är din förmåga att lyfta människor lika viktig som teknisk kvalitet. "Coachade 3 senior associates genom slutexamen Revisorsexamen; alla 3 klarade vid första försöket" är en stark signal om den professionella kvalitet som delägare vill se.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    functie: 'Marknadschef',
    title: 'CV-exempel: Marknadschef',
    description:
      'CV-exempel för (senior) marknadschefer inom B2B och B2C. Konkreta skrivtips, exempelpunkter och rekommenderad layout för rekryterarskanning.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Olivia',
      lastName: 'Mårtensson',
      email: 'olivia.martensson@example.se',
      phone: '+46 70 445 56 67',
      city: 'Göteborg',
      linkedIn: 'linkedin.com/in/oliviamartensson',
      summary:
        'B2B SaaS-marknadschef med 6 års erfarenhet hos svenska scale-ups inom fintech och HR-tech. Ansvarig för paid acquisition-funneln från pre-Series A till 15M USD ARR. Sänkte CAC med 38 % hos en low-code-plattform på 2 år genom retargeting och LinkedIn Ads-optimering.',
      experiences: [
        {
          jobTitle: 'Senior Marketing Manager — Demand Generation',
          company: 'IFS',
          location: 'Göteborg',
          startDate: '2022-04',
          current: true,
          description:
            'Ansvarig för EMEA demand-gen-funneln för enterprise-plattformen. Chef över 3 specialister (Paid, Content, ABM).',
          tasks: [
            'Sänkte Customer Acquisition Cost från 1 420 EUR till 880 EUR på 18 månader genom retargeting och funnelsegmentering.',
            'Lanserade ett ABM-program riktat mot 200 enterprise-konton; genererade 4,2M EUR pipeline inom 9 månader.',
            'Chef över ett team på 3; alla tre fick "exceeds expectations" i årssamtalet.',
          ],
        },
        {
          jobTitle: 'Marketing Manager',
          company: 'Visma',
          location: 'Stockholm',
          startDate: '2019-06',
          endDate: '2022-03',
          description: 'B2B-marknadsföring för HR-mjukvara i SMB-segmentet.',
          tasks: [
            'Byggde en content marketing-motor från 0 till 60 000 organiska månadsbesökare på 24 månader.',
            'Lanserade en MQL-to-SQL scoringmodell i HubSpot; förbättrade konvertering från 4 % till 11 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Masterexamen Marknadsföring',
          institution: 'Handelshögskolan i Stockholm',
          location: 'Stockholm',
          startDate: '2017-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Demand Generation', 'HubSpot', 'Salesforce', 'Google Ads', 'LinkedIn Ads', 'ABM', 'GA4', 'SQL (grundläggande)'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Funnelsiffror är valutan',
        body:
          'Rekryterare för (senior) marknadsföringsroller letar efter en sak: kan du mätbart förbättra funneln. Sätt hårda siffror i varje punkt: CAC, MQL-to-SQL-konvertering, genererad pipeline, ROAS, tillagt ARR. "Ansvarig för marknadsstrategin" är ordbrus; "Sänkte CAC från 1 420 EUR till 880 EUR på 18 månader" är en intervjutrigger.',
      },
      {
        heading: 'Kanalmix + verktygsstack explicit',
        body:
          'Nämn konkreta kanaler (LinkedIn Ads, Google Ads, retargeting, ABM, content, partnerskap) och verktygen du faktiskt använder dagligen (HubSpot, Salesforce, Marketo, GA4, Looker). Vagt "marketing automation" utan verktygsnamn är en röd flagga — svenska rekryterare antar då att du bara känner till det på pappret.',
      },
      {
        heading: 'Team- och stakeholderledarskap',
        body:
          'För seniora roller är det viktigt om du kan bygga och leda ett team. "Chef över 3 specialister" är starkare än "samarbetade med teamet". Nämn exakt vilka du är chef över (roller och antal), och som bonus: prestationer hos teamet ("alla tre exceeds expectations").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verkoper',
    functie: 'Säljare / Account Manager',
    title: 'CV-exempel: Säljare / Account Manager',
    description:
      'CV-exempel för säljare, account managers och säljspecialister. Med kvotuppfyllnadsexempel och tips för B2B vs B2C-ansökningar i Sverige.',
    templateId: 'modern',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Henrik',
      lastName: 'Fältström',
      email: 'henrik.faltstrom@example.se',
      phone: '+46 70 778 89 90',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/henrikfaltstrom',
      summary:
        'B2B Account Executive med 5 års erfarenhet av SaaS-försäljning — full cycle från prospect till close. Uppnådde 138 % av kvot 2025 hos Salesforce Nordics (affärsstorlek 0,5-1,6 MSEK, säljcykel 4-7 månader). Stark erfarenhet av multi-stakeholder enterprise-affärer inom finans och retail.',
      experiences: [
        {
          jobTitle: 'Account Executive — Mid-Market',
          company: 'Salesforce Nordics',
          location: 'Stockholm',
          startDate: '2023-01',
          current: true,
          description:
            'Full cycle-försäljning: från outbound prospect till signerat kontrakt. Fokus på mid-market-klienter (0,5-5 mdr SEK omsättning).',
          tasks: [
            'Kvotuppfyllnad 2025: 138 % (21 MSEK ARR closed mot 15 MSEK mål).',
            '#3 på Nordic Mid-Market-leaderboard av 22 AE:s under H1 2025.',
            'Vann största Nordic Mid-Market-affären Q4 2024: 3,4 MSEK ARR, 6-månaders cykel, 7 stakeholders.',
          ],
        },
        {
          jobTitle: 'Sales Development Representative',
          company: 'Personio Nordics',
          location: 'Stockholm',
          startDate: '2020-08',
          endDate: '2022-12',
          description: 'Outbound prospecting i Norden och DACH. Genererade MQL:er till AE-teamet.',
          tasks: [
            '147 % av SQL-mål 2022; teamrekord för outbound-möten i en månad (38).',
            'Skrev playbook för cold outreach i fintech-nischen; intern adoption av 14 SDR:er.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidatexamen Företagsekonomi',
          institution: 'Lunds universitet',
          location: 'Lund',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['B2B SaaS Sales', 'Salesforce CRM', 'MEDDPICC', 'Outreach.io', 'LinkedIn Sales Navigator', 'Forecasting', 'Stakeholder mapping'],
      template: 'modern',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Kvotuppfyllnad är DEN nyckelmetriken',
        body:
          'Inget övertygar säljrekryterare som konkret kvotuppfyllnad per år. Skriv det exakt: "138 % av kvot 2025 (21 MSEK ARR closed mot 15 MSEK mål)". Lägg till ranking om du jobbat i team ("#3 på Nordic Mid-Market-leaderboard av 22 AE:s"). Undvik vaga termer som "framgångsrika säljresultat".',
      },
      {
        heading: 'Affärsstorlek, cykellängd, antal stakeholders',
        body:
          'För enterprise-roller är det avgörande om du kan stänga multi-stakeholder-affärer. För stora vinster, nämn affärsstorlek, säljcykel och antal stakeholders ("3,4 MSEK ARR, 6-månaders cykel, 7 stakeholders"). Det är så säljledare bedömer om du matchar deras genomsnittliga ACV och affärskomplexitet.',
      },
      {
        heading: 'Metodik och verktyg räknas',
        body:
          'Nämn säljmetodiken du tränats i (MEDDPICC, MEDDIC, BANT, Challenger, SPIN) och CRM/verktyg du aktivt hanterar (Salesforce, HubSpot, Outreach, Gong). En AE utan metodikreferenser på senior nivå är en röd flagga på svenska marknaden.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'office-manager',
    functie: 'Office Manager',
    title: 'CV-exempel: Office Manager / Executive Assistant',
    description:
      'CV-exempel för office managers, executive assistants och ledningsassistenter. Konkret och operativt — med tips på hur du gör ditt värde mätbart.',
    templateId: 'minimalist',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Sofia',
      lastName: 'Bengtsson',
      email: 'sofia.bengtsson@example.se',
      phone: '+46 70 556 67 78',
      city: 'Stockholm',
      summary:
        'Office Manager med 12 års erfarenhet hos scale-ups och advokatbyråer. Ansvarig för VD:ns och 3 direktörers kalender, facility för ett kontor med 140 anställda och alla onboarding-processer. Vana vid BambooHR, Notion, Asana och Concur.',
      experiences: [
        {
          jobTitle: 'Office Manager',
          company: 'Klarna',
          location: 'Stockholm',
          startDate: '2021-02',
          current: true,
          description:
            'Ansvarig för huvudkontorets drift (140 FTE) och kalendern för VD och 3 direktörer.',
          tasks: [
            'Hantering av VD:ns kalender inklusive internationella resor (i snitt 2 resor/månad till EU-hubbar).',
            'Onboardingkoordinator: 38 nyanställda 2024 — 100 % day-one readiness.',
            'Omförhandlade kontorshyresavtalet: årlig besparing på 720 000 SEK vid motsvarande yta.',
            'Owner av facility-leverantörspoolen (catering, städ, kontorsmaterial) — 6 kontrakt.',
          ],
        },
        {
          jobTitle: 'Executive Assistant',
          company: 'Mannheimer Swartling',
          location: 'Stockholm',
          startDate: '2014-09',
          endDate: '2021-01',
          description: 'Stöd till 4 delägare och deras team inom M&A-gruppen.',
          tasks: [
            'Hantering av delägarnas kalendrar och klientkorrespondens (svenska/engelska).',
            'Koordination av closing-möten vid större transaktioner — i snitt 8 closings per år.',
            'Medlem i kontorsutvecklingsteamet; omdesignade onboardingprocessen för biträdande jurister.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Yrkeshögskoleexamen Administration & Ledning',
          institution: 'Yrkeshögskolan Stockholm',
          location: 'Stockholm',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: ['BambooHR', 'Notion', 'Asana', 'Concur', 'Microsoft 365', 'Leverantörshantering', 'Onboarding', 'Flytande engelska'],
      template: 'minimalist',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Operativ scope före personliga egenskaper',
        body:
          'Det klichéartade office manager-CV:t inleds med "organiserad, kommunikativ, lugn under press". Svenska rekryterare tror på det först när de kan se den operativa scopen. Sätt skalan på rad 1: antal anställda du täcker facility för, antal direktörer vars kalender du hanterar, antal leverantörer i din pool.',
      },
      {
        heading: 'Gör ditt värde mätbart',
        body:
          'Office management-arbete verkar mjukt men låter sig ofta översättas till siffror: årlig besparing på kontrakt, antal onboardings per år, % day-one readiness, ledtid på facility-ärenden. En konkret siffra i en punkt ("720 000 SEK årlig besparing vid motsvarande yta") är starkare än fem adjektiv.',
      },
      {
        heading: 'Verktygsstack explicit',
        body:
          'Nämn de exakta systemen du använder dagligen (BambooHR, Workday, Concur, Notion, Asana, Slack, MS365). För scale-up-rekryterare är det ett direkt filter — de vill ha någon produktiv dag 1, inte någon som först behöver verktygsträning.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'projectmanager',
    functie: 'Projektledare',
    title: 'CV-exempel: Projektledare',
    description:
      'CV-exempel för projektledare inom IT, bygg och konsultverksamhet. Med tips om budgetimpact, metodikreferenser och stakeholderhantering.',
    templateId: 'executive',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Rebecka',
      lastName: 'Holmberg',
      email: 'rebecka.holmberg@example.se',
      phone: '+46 70 889 90 01',
      city: 'Göteborg',
      linkedIn: 'linkedin.com/in/rebeckaholmberg',
      summary:
        'Senior PMP-certifierad projektledare med 10 års erfarenhet av att leverera digitala transformationsprogram hos finansiella institutioner. Levererat: 4 stora ERP-implementationer och ett PSD2-compliance-program, total budget 175 MSEK. Stark erfarenhet av agile/scrum och hybrida vattenfallsmiljöer.',
      experiences: [
        {
          jobTitle: 'Senior Project Manager — Digital Transformation',
          company: 'SEB',
          location: 'Stockholm',
          startDate: '2022-03',
          current: true,
          description:
            'Programledning för modernisering av core banking. Stakeholderhantering på ledningsnivå.',
          tasks: [
            'Ledde moderniseringen av betalplattformen: 28 FTE, 60 MSEK budget, levererat 3 månader före plan.',
            'Styrgruppssekreterare med CFO + CIO + COO som medlemmar; månatlig rapportering till styrelsen.',
            'Coach för 4 mid-level PM:s i bankens PM-akademi.',
          ],
        },
        {
          jobTitle: 'Project Manager — IT Programmes',
          company: 'Folksam',
          location: 'Stockholm',
          startDate: '2017-09',
          endDate: '2022-02',
          description: 'IT-programledning inom Liv & Pension-divisionen.',
          tasks: [
            'Ansvarig för PSD2-compliance-programmet (30 MSEK budget, 18 månader, 14 FTE); 100 % revisionsrent.',
            'Salesforce Marketing Cloud-implementation: utrullning till 4 BU:s, ROI break-even i månad 9.',
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
          degree: 'Civilekonomexamen',
          institution: 'Handelshögskolan vid Göteborgs universitet',
          location: 'Göteborg',
          startDate: '2011-09',
          endDate: '2013-08',
        },
      ],
      skills: ['PMP', 'PRINCE2', 'Agile / Scrum', 'JIRA', 'Confluence', 'MS Project', 'Stakeholderhantering', 'Riskhantering'],
      template: 'executive',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Budget, scope och tidsplan — alla tre',
        body:
          'För PM-roller är tre mätetal valutan: projektbudget, FTE/scope och leverans vs plan. "Ledde moderniseringen av betalplattformen: 28 FTE, 60 MSEK budget, levererat 3 månader före plan" säger mer än en halv sida adjektiv. Om du levererade on-budget och on-time, nämn det. Om du levererade före plan är det en intervjutrigger.',
      },
      {
        heading: 'Metodik + certifiering',
        body:
          'PMP, PRINCE2, AgilePM och Scrum Master hör hemma under dina kompetenser eller i en separat certifieringssektion. För enterprise-roller i Sverige är PMP eller PRINCE2 ofta ett hårt filter. Nämn metodiken du faktiskt använder (Agile/Scrum, Vattenfall, hybrid) och verktygen (JIRA, MS Project, Asana).',
      },
      {
        heading: 'Styrgrupp och stakeholder-nivå',
        body:
          'På seniornivå söker ledningar efter någon som kan agera i styrgrupper. Ange konkret på vilken nivå du rapporterade ("styrgrupp med CFO + CIO + COO", "månatlig rapportering till styrelsen"). Det skiljer junior från senior PM på några sekunder.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'stagiair',
    functie: 'Praktikant',
    title: 'CV-exempel: Praktik-CV (Universitet)',
    description:
      'Gratis CV-exempel för universitetsstudenter som söker praktik eller exjobb. Inkluderar tips för vad du gör när du har begränsad arbetslivserfarenhet.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Amelia',
      lastName: 'Pettersson',
      email: 'amelia.pettersson@example.se',
      phone: '+46 70 112 23 34',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/ameliapettersson',
      summary:
        'Tredjeårsstudent i företagsekonomi vid Handelshögskolan i Stockholm med starkt intresse för strategikonsulting. Ordförande för Marknadsföreningen (560 medlemmar), casefinalist på McKinsey Insight-programmet 2025 och 3 års deltidserfarenhet från ICA. Tillgänglig för 5 månaders praktik från februari 2026.',
      experiences: [
        {
          jobTitle: 'Ordförande',
          company: 'SSE Marketing Association',
          location: 'Stockholm',
          startDate: '2024-09',
          current: true,
          description: 'Leder en kommitté på 6 personer. 560 medlemmar, årlig budget 1,4 MSEK.',
          tasks: [
            'Förhandlade sponsoravtal med BCG (3-årskontrakt, 450 000 SEK/år).',
            'Organiserade årliga "Marketing Battle"-eventet: 220 deltagare, 14 företagspartners.',
            'Veckovisa 1-to-1s med 5 kommittémedlemmar; coachning i ledarskap.',
          ],
        },
        {
          jobTitle: 'Kassa- och butiksbiträde',
          company: 'ICA Maxi',
          location: 'Stockholm',
          startDate: '2022-09',
          endDate: '2024-08',
          description: 'Deltidsroll vid sidan av studier. Butiksarbete och kassa.',
          tasks: [
            'Befordrad till skiftcoach för nya studentkollegor (efter 8 månader).',
            'Owner av sortimentsbyten vid säsongskampanjer.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidatexamen Företagsekonomi',
          institution: 'Handelshögskolan i Stockholm',
          location: 'Stockholm',
          startDate: '2023-09',
          endDate: '2026-08',
          description: 'Förväntad examen sommaren 2026. Toppbetyg. Dean\'s List 2024-25.',
        },
        {
          degree: 'Gymnasieexamen (Naturvetenskap, MVG/A)',
          institution: 'Östra Real',
          location: 'Stockholm',
          startDate: '2020-09',
          endDate: '2023-06',
        },
      ],
      skills: ['Excel (medel)', 'PowerPoint', 'Python (grund)', 'Tableau (grund)', 'Franska (C1)', 'Spanska (B2)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Arbetserfarenhetsparadoxen: ledarskap slår strötjobb',
        body:
          'Som student har du lite arbetslivserfarenhet — det är okej. Det rekryterare på McKinsey, Bain, Goldman Sachs och Unilever söker hos praktikkandidater är inte år av erfarenhet utan SIGNALER på ledarskap, ägarskap och intellektuell nyfikenhet. En roll som ordförande för en studentförening (med konkreta siffror: antal medlemmar, budget, sponsoravtal) väger tyngre än två år i kassan.',
      },
      {
        heading: 'Betygsprognoser, honorsprogram och case-tävlingar',
        body:
          'För strategikonsulting och investment banking är betyg bokstavligen ett filter (topp 5-10 % av din kohort). Nämn din betygsprognos, din dean\'s list-status och case-tävlingsresultat ("McKinsey Insight 2025 casefinalist" — detta utlöser en konversation). Att explicit ange tillgänglighet ("från februari 2026, 5 månader") hjälper rekryterare att passa in dig i sin planering.',
      },
      {
        heading: 'Göra små jobb stora — ärligt',
        body:
          'Ett studentjobb på ICA kan vara en stark berättelse om du gör det konkret: "Befordrad till skiftcoach efter 8 månader" visar att du stack ut; "Owner av sortimentsbyten" visar ägarskap. Undvik överdrifter ("revolutionerade butiken") — svenska rekryterare ser igenom det direkt.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'consultant',
    functie: 'Konsult',
    title: 'CV-exempel: Management Consultant',
    description:
      'CV-exempel för management consultants och strategirådgivare. Inkluderar MBB-stilformat, case-impactpunkter och sektorsreferenser.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Edvard',
      lastName: 'Ahlström',
      email: 'edvard.ahlstrom@example.se',
      phone: '+46 70 334 45 56',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/edvardahlstrom',
      summary:
        'Senior konsult med 6 års erfarenhet hos McKinsey & Company Stockholm, specialiserad på financial services och post-merger integration. Lead på 3 PMI-uppdrag (totalt affärsvärde 38 mdr SEK). Stanford MBA. Gästföreläsare för MBA-kursen "Value Creation in M&A" vid Handelshögskolan i Stockholm.',
      experiences: [
        {
          jobTitle: 'Engagement Manager',
          company: 'McKinsey & Company',
          location: 'Stockholm',
          startDate: '2022-08',
          current: true,
          description:
            'Lead consultant på högprofilerade uppdrag inom Banking & Insurance practice. Leder 3-5 associates per case.',
          tasks: [
            'Ledde PMI för fusionen mellan två nordiska banker (22 mdr SEK affär): levererat 6 månader före mål.',
            'Kostnadstransformationsprogram hos nordiskt försäkringsbolag: 1,1 mdr SEK årlig run-rate-besparing identifierad, 825 MSEK implementerat.',
            'Coachade 4 associates mot Engagement Manager-befordran; 3 lyckades vid första försöket.',
          ],
        },
        {
          jobTitle: 'Associate',
          company: 'McKinsey & Company',
          location: 'Stockholm',
          startDate: '2019-09',
          endDate: '2022-07',
          description: 'Uppdrag främst inom Public Sector och Financial Services.',
          tasks: [
            'Kvantitativ modellering för styrelsepresentationer; författare till 3 klientexponerade Excel-modeller.',
            'Initiativtagare till intern research om "post-COVID retail banking" — publicerad av Nordic Banking Practice.',
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
          degree: 'Civilekonomexamen (med utmärkelse)',
          institution: 'Handelshögskolan i Stockholm',
          location: 'Stockholm',
          startDate: '2013-09',
          endDate: '2016-06',
        },
      ],
      skills: ['M&A / PMI', 'Finansiell modellering', 'Stakeholderhantering', 'Workshop-facilitering', 'Excel/PowerPoint', 'Engelska / Franska / Tyska'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'MBB-CV: "Little Black Dress"-formatet',
        body:
          'Hos MBB (McKinsey, BCG, Bain) och tier-1-strategibyråer är formatet striktare än på andra håll: en sida, svartvitt, konservativ typografi, ingen färg, inget foto. Zakelijk- eller Executive-mallen i ResuBox passar detta. Siffror och namn där det är möjligt — McKinsey läser en case-punkt utan siffra som obevisad.',
      },
      {
        heading: 'Case med affärsvärde, scope och impact',
        body:
          'Beskriv case längs tre dimensioner: scope (affärsvärde, FTE-impact, geografisk täckning), din roll (analyst / associate / EM) och konkret impact ("825 MSEK implementerat"). NDA-frågor: sektor och affärsstorlek är vanligen tillåtna utan klientnamn — vid tveksamhet, anonymisera ("nordiskt försäkringsbolag") och håll dig konkret med siffror.',
      },
      {
        heading: 'MBA, GMAT, språk — ja eller nej',
        body:
          'För strategikonsulting väger utbildning tungt. Topp-MBA-program (Stanford, INSEAD, LBS, IESE, Harvard) nämn alltid — starkt filter. GMAT-poäng endast om över 720. Utmärkelser/honorsprogram alltid med. Språk på C-nivå eller modersmål (EN/FR/DE/ES) är ofta en verklig plus för internationella uppdrag — lista dem.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'logistiek-medewerker',
    functie: 'Lagerarbetare',
    title: 'CV-exempel: Lagerarbetare',
    description:
      'CV-exempel för lagerarbetare hos distributionscentraler, transport och lager. Med truckkort, WMS-kunskap och tips för bemanningsanställning.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Lukas',
      lastName: 'Holmgren',
      email: 'lukas.holmgren@example.se',
      phone: '+46 70 112 23 35',
      city: 'Jönköping',
      summary:
        'Erfaren lagerarbetare med 7 års arbetslivserfarenhet inom livsmedelsdistribution och e-handelsfulfilment. Truckkort A+B och skjutstativtruck, erfaren av WMS-systemen Manhattan och Astro. Fast anställd på PostNord Logistics sedan 2020 med flera skiftcoachansvar.',
      experiences: [
        {
          jobTitle: 'Senior Plockare / Skiftcoach',
          company: 'PostNord Logistics',
          location: 'Jönköping',
          startDate: '2020-04',
          current: true,
          description: 'Distributionscentral för ICA-leverantörer. Tvåskiftsschema (06:00-14:30 / 14:30-23:00).',
          tasks: [
            'Plockning och konsolidering av order med VR-headset (Honeywell A700x); i snitt 220 plock/timme.',
            'Skiftcoach för team om 8 bemanningsanställda; första kontakt vid driftstörningar.',
            'Cykelinventering: noggrannhet 99,4 % över kalenderår 2024.',
          ],
        },
        {
          jobTitle: 'Truckförare',
          company: 'Amazon Fulfilment',
          location: 'Eskilstuna',
          startDate: '2018-02',
          endDate: '2020-03',
          description: 'Inbound varuflöde vid ett av Sveriges största fulfilment-center.',
          tasks: [
            'Lossning av containrar (i snitt 6 per skift); inbokning via Manhattan WMS.',
            'Förflyttning av pallar till olika lagerplatser med skjutstativtruck.',
            'Olycksfri rekord över 24 månader.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Yrkesexamen Lager & Terminal',
          institution: 'Yrkesgymnasiet Jönköping',
          location: 'Jönköping',
          startDate: '2015-09',
          endDate: '2017-06',
        },
      ],
      skills: ['Truckkort A+B', 'Skjutstativtruck (C)', 'Manhattan WMS', 'Astro WMS', 'VR-plockning (Honeywell)', 'Arbetsmiljöutbildning (BAM)'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Certifikat på rad 1 i din profil',
        body:
          'Logistikarbetsgivare skannar efter en sak: kan den här personen börja i morgon? Sätt dina certifikat (truckkort, ADR, BAM, heta arbeten) och WMS-system högst upp. Undvik vaga profiler som "hårt arbetande proffs"; ange att du är certifierad och vilka system du använt.',
      },
      {
        heading: 'Siffror där det är möjligt',
        body:
          'Plock per timme, noggrannhetsprocent, olycksfria år, antal containrar per skift — varje mätbar datapunkt räknas. Logistikrekryterare hos PostNord, Amazon, ICA och DSV letar specifikt efter dessa siffror eftersom de är direkt jämförbara mellan kandidater.',
      },
      {
        heading: 'Skiftcoach / arbetsledarerfarenhet explicit',
        body:
          'Många lagerarbetare får coachansvar för bemanningsanställda eller nya kollegor efter 1-2 år. Ange det konkret ("skiftcoach för team om 8 bemanningsanställda"). Det signalerar potential för befordran till arbetsledarroller.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'monteur',
    functie: 'Mekaniker / Servicetekniker',
    title: 'CV-exempel: Mekaniker / Servicetekniker',
    description:
      'CV-exempel för elektriker, fordonsmekaniker och VVS-tekniker i Sverige. Med certifieringar, arbetsgivare och tips för egenföretagande.',
    templateId: 'zakelijk',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Robin',
      lastName: 'Sundberg',
      email: 'robin.sundberg@example.se',
      phone: '+46 70 223 34 46',
      city: 'Västerås',
      summary:
        'Senior VVS-/energitekniker med 12 års erfarenhet av gaspannor, värmepumpar och solvärmesystem hos NIBE och lokala installationsföretag. Behörig gasinstallatör, F-Gas-certifierad, ECY-licens. Hos NIBE ansvarig för interna kompetensprogrammet om hybridvärmepumpar.',
      experiences: [
        {
          jobTitle: 'Senior Servicetekniker',
          company: 'NIBE',
          location: 'Västerås',
          startDate: '2019-06',
          current: true,
          description: 'Installation och service av gaspannor, hybridvärmepumpar och frånluftssystem hos privatkunder och bostadsbolag.',
          tasks: [
            'Huvudtekniker för i snitt 4 installationer per vecka; kundnöjdhet 4,8/5,0 under 2024.',
            'Utbildare för 6 nya kollegor 2023-2024 om hybridvärmepumpar.',
            'Medlem i det regionala jourteamet (2 nätter per månad).',
          ],
        },
        {
          jobTitle: 'VVS-tekniker',
          company: 'Sundbergs VVS AB',
          location: 'Västerås',
          startDate: '2013-08',
          endDate: '2019-05',
          description: 'Familjeföretag — installationer av centralvärme och rörmokeri för privatkunder.',
          tasks: [
            'Installation och underhåll av pannor från NIBE, Bosch och CTC.',
            'Renoveringsprojekt i kulturminnesmärkta byggnader inklusive rördragning och badrum.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Yrkesexamen VVS- och fastighetsprogrammet',
          institution: 'Carlforsska gymnasiet',
          location: 'Västerås',
          startDate: '2009-09',
          endDate: '2013-07',
        },
      ],
      skills: ['Behörig gasinstallatör', 'F-Gas Kat. I', 'ECY-licens', 'Hybridvärmepumpar', 'NIBE / Bosch / CTC', 'Rörmokeri', 'B-körkort'],
      template: 'zakelijk',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Certifikat som hårt filter',
        body:
          'Svenska installationsföretag kan inte erbjuda arbete utan behörighet eller F-Gas; nämn dem i din profil. För värmepumpar specifikt: certifierad montör eller tillverkarutbildning (NIBE, Bosch, CTC) är värt att lista. Ange även körkort (B-körkort krävs vanligen för servicetekniker).',
      },
      {
        heading: 'Kundnöjdhet och pålitlighet räknas',
        body:
          'Arbetsgivare som NIBE, Bravida och Vattenfall bedömer tekniker delvis på kundfeedback. Har du en poäng från ditt serviceledningssystem? Nämn den. Ingen poäng? Lista olycksfria år, andel leverans i tid eller First-Time-Fix-procent.',
      },
      {
        heading: 'Hybridvärmepump-specialisering är vinnande kompetens för 2026',
        body:
          'Energiomställningen och utfasningen av oljepannor gör värmepumpsinstallation till tillväxtnischen i Sverige. Om du har erfarenhet eller utbildning, skriv det explicit. Rekryterare på NIBE, Bosch Thermotechnik och Mitsubishi Electric letar aktivt efter detta.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'horeca-medewerker',
    functie: 'Servitör / Hovmästare',
    title: 'CV-exempel: Restaurang (Servitör / Kock / Bartender)',
    description:
      'CV-exempel för restaurang- och hotellpersonal. Med tips om säsongsarbete, dricksinkomst och befordran till skiftledare.',
    templateId: 'creatief',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Isabella',
      lastName: 'Reinholdsson',
      email: 'isabella.reinholdsson@example.se',
      phone: '+46 70 334 45 57',
      city: 'Stockholm',
      summary:
        'Allround restaurangmedarbetare med 6 års fine dining-serviceerfarenhet på Frantzén (2 stjärnor) och bistron Operakällaren. Sommelierutbildning på WSET 2024. Befordrad till skiftledare på Operakällaren: leder 4 kollegor under service med 80+ täckningar.',
      experiences: [
        {
          jobTitle: 'Skiftledare — Service',
          company: 'Operakällaren',
          location: 'Stockholm',
          startDate: '2022-04',
          current: true,
          description: 'Klassisk restaurang i Operahuset. Lunch och middag, 80-100 täckningar per service.',
          tasks: [
            'Leder 4 teammedlemmar per pass; ansvarig för runnerflöde och menyförklaring.',
            'Ger vinråd och sätter ihop vinpairing med köket; flaskomsättning +18 % under 2024.',
            'Coach för nyanställda under deras första 6 veckor.',
          ],
        },
        {
          jobTitle: 'Servitör',
          company: 'Frantzén**',
          location: 'Stockholm',
          startDate: '2019-08',
          endDate: '2022-03',
          description: 'Tvåstjärnig Michelin-restaurang i Gamla stan. À la carte och kockens meny.',
          tasks: [
            'Levererade à la carte-service och vinpairing för 7-rätters kockens meny.',
            'Kommunikation på svenska, engelska och franska med internationell klientel.',
            'Medlem i öppningsteamet för sommarterrass-editionen 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'WSET Level 2 Award in Wines',
          institution: 'Wine & Spirit Education Trust',
          location: 'Stockholm',
          startDate: '2024-01',
          endDate: '2024-06',
        },
        {
          degree: 'Yrkesexamen Restaurang & Livsmedel',
          institution: 'Restaurangakademien',
          location: 'Stockholm',
          startDate: '2016-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Vinpairing', 'Flytande franska', 'Konversation italienska', 'POS Caspeco', 'Allergenutbildning', 'Serveringstillstånd'],
      template: 'creatief',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Specialisering + nivå på rad 1',
        body:
          'Svenska restauranger (Frantzén, Operakällaren, Sturehof, PM & Vänner, Esperanto) screenar på nivå: fine dining vs bistro vs snabbservice. Specificera var du arbetat (Michelin-restaurang, hotellkedja, lokal bistro). Ange språk — franska eller italienska för internationell klientel i Stockholm är en verklig differentierare.',
      },
      {
        heading: 'Befordran och ansvar',
        body:
          'Många i restaurangbranschen befordras internt till skiftledare, supervisor eller hovmästare. Nämn den titeln om du haft den — arbetsgivare ser att andra redan befordrat dig. Att vara del av ett öppningsteam för en ny verksamhet är också en stark signal.',
      },
      {
        heading: 'Siffror där det går: omsättning, täckningar, dricks',
        body:
          'Vinomsättning +%, dricksinkomster, genomsnittliga täckningar per service. Inte alla siffror är tillgängliga men har du en, använd den. "+18 % flaskomsättning 2024" säger mycket mer än "passionerad om vin".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'data-analist',
    functie: 'Dataanalytiker',
    title: 'CV-exempel: Dataanalytiker',
    description:
      'CV-exempel för dataanalytiker med SQL, Python, Tableau och Power BI. Med tips om portfolio, affärsimpact och utveckling till analytics engineer.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Hanna',
      lastName: 'Persson',
      email: 'hanna.persson@example.se',
      phone: '+46 70 445 56 68',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/hannapersson',
      summary:
        'Dataanalytiker med 4 års erfarenhet av retail analytics hos ICA och Axfood. SQL, Python (pandas, scikit-learn) och dbt för pipelines; Tableau och Power BI för stakeholderrapportering. Owner av veckovis prognosdashboard som 12 kategorichefer använde för inköpsbeslut.',
      experiences: [
        {
          jobTitle: 'Data Analyst — Category & Pricing',
          company: 'Axfood',
          location: 'Stockholm',
          startDate: '2023-08',
          current: true,
          description: 'Analyticsteam inom Commerce, stöd till 12 kategorichefer med datadrivna inköps- och prissättningsbeslut.',
          tasks: [
            'Byggde en prognosdashboard i Tableau som används veckovis av 12 kategorichefer för inköpsbeslut.',
            'Migrerade 8 legacy-rapporter från Excel till dbt + Looker; genomsnittlig refresh-tid från 3h till 8min.',
            'A/B-testanalys för kampanjmekanik; identifierade att 2-för-1 på färskvaror presterade 23 % bättre än rabatt.',
          ],
        },
        {
          jobTitle: 'Junior Data Analyst',
          company: 'ICA',
          location: 'Solna',
          startDate: '2021-09',
          endDate: '2023-07',
          description: 'Del av Customer Insights-teamet inom ICA Online.',
          tasks: [
            'SQL-queries och dashboards i Power BI för marknadsteamet.',
            'RFM-segmentering av ICA-kundkortskunder; pilot resulterade i +3,5 MSEK inkrementell intäkt.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Masterexamen Business Analytics',
          institution: 'Stockholms universitet',
          location: 'Stockholm',
          startDate: '2019-09',
          endDate: '2021-08',
        },
      ],
      skills: ['SQL (avancerad)', 'Python (pandas, scikit-learn)', 'dbt', 'Tableau', 'Power BI', 'Looker', 'A/B-testning', 'Statistisk analys'],
      template: 'tech',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Verktyg + impact, inte bara verktyg',
        body:
          'Alla skriver "SQL och Python". Det som skiljer dig: vad gjorde du med dem och vad förändrades mätbart? "Byggde en prognosdashboard som används veckovis av 12 kategorichefer" är starkare än "Tableau-erfarenhet".',
      },
      {
        heading: 'Impactens skala i siffror',
        body:
          'För dataanalytikerroller är tre siffror kung: intäkts-/kostnadsimpact (kr), effektivitetsvinster (sparade timmar, refresh-tid) och datastorlek/användare (12 stakeholders, 500K kunder, 8M rader). Välj en per punkt.',
      },
      {
        heading: 'Verktygsöverlapp med målrollen — matcha exakt',
        body:
          'Rekryterare på Klarna, Spotify, Axfood, Boozt använder keyword matching. Om annonsen nämner dbt + Looker och du har det, skriv exakt de orden. Inte "bygger transformationer" — "bygger dbt-modeller".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'hr-manager',
    functie: 'HR-chef',
    title: 'CV-exempel: HR-chef / HR-rådgivare',
    description:
      'CV-exempel för HR-chefer och HR-rådgivare. Med tips om employee engagement, ATS-verktyg och utveckling från HR Generalist till chef.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Viktoria',
      lastName: 'Lundberg',
      email: 'viktoria.lundberg@example.se',
      phone: '+46 70 556 67 79',
      city: 'Uppsala',
      linkedIn: 'linkedin.com/in/viktorialundberg',
      summary:
        'PA-certifierad HR-chef med 9 års erfarenhet hos scale-ups och mellansegmentet (50-400 FTE) inom tech och vård. Ansvarig för hela HR-cykeln hos IFS Sverige: rekrytering, onboarding, performance, comp & ben och exit. Sänkte personalomsättning från 18 % till 11 % på 18 månader genom strukturerat onboardingprogram och kvartalsvisa check-ins.',
      experiences: [
        {
          jobTitle: 'HR Manager Sverige',
          company: 'IFS',
          location: 'Uppsala',
          startDate: '2022-01',
          current: true,
          description: 'Ansvarig för svenska organisationen (180 FTE). Rapporterar direkt till VP People.',
          tasks: [
            'Sänkte personalomsättning från 18 % till 11 % på 18 månader genom redesign av onboarding och kvartalsvis 1:1-cykel.',
            'Implementerade Workday (migration från BambooHR); leverans i tid på 4-månadersprojekt utan datafel.',
            'Chef över 2 HR Business Partners och 1 People Ops Specialist.',
          ],
        },
        {
          jobTitle: 'HR Business Partner',
          company: 'Capio',
          location: 'Stockholm',
          startDate: '2017-04',
          endDate: '2021-12',
          description: 'Vårdorganisation med 1 200 FTE på 8 enheter.',
          tasks: [
            'Primär HR-kontakt för 3 kliniska avdelningar (240 FTE).',
            'Ledde fackliga förhandlingar med Vårdförbundet; löste 11 punkter under 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Masterexamen Personal- och arbetslivsprogrammet',
          institution: 'Uppsala universitet',
          location: 'Uppsala',
          startDate: '2015-09',
          endDate: '2017-08',
        },
      ],
      skills: ['Workday', 'BambooHR', 'Greenhouse ATS', 'Kollektivavtalsförhandling', 'Svensk arbetsrätt (mellan)', 'Performance management', 'PA-certifiering'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Scope: antal anställda och sektor först',
        body:
          'HR-rekryterare på SAS, Ericsson, AstraZeneca och Folksam screenar omedelbart på organisationsstorlek (50? 500? 5 000?) och sektorsspecifika kollektivavtal. Sätt scopen på rad 1: "HR-chef för svensk organisation med 180 FTE" slår "Erfaren HR-specialist".',
      },
      {
        heading: 'Verktyg — Workday är den gröna flaggan',
        body:
          'Workday, SuccessFactors, BambooHR, Greenhouse, Lever, Personio — ange vilka verktyg du aktivt hanterar. För enterprise-roller (SEB, SAS, Region Stockholm) är Workday-erfarenhet ofta ett filter. Undvik vagt "HRIS-erfarenhet".',
      },
      {
        heading: 'Mätbar HR-impact väger tungt',
        body:
          'Sänkt personalomsättning, sänkt time-to-hire, ökad eNPS, sjukfrånvaro under branschsnittet — varje datapunkt räknas. "Sänkte personalomsättning från 18 % till 11 % på 18 månader" är en intervjutrigger.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    functie: 'Undersköterska',
    title: 'CV-exempel: Undersköterska / Senior undersköterska',
    description:
      'CV-exempel för undersköterskor och senior undersköterskor. För äldreboenden, hemtjänst och LSS-verksamhet. Med tips om vårdutbildning och IVO.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Naomi',
      lastName: 'Sandgren',
      email: 'naomi.sandgren@example.se',
      phone: '+46 70 667 78 89',
      city: 'Malmö',
      summary:
        'Undersköterska med specialistkompetens demensvård och 11 års erfarenhet av demensvård och äldreomsorg hos Attendo och Vardaga. Lead-undersköterska för 8 boende med demens. Mentor för undersköterskelärlingar — handlett 12 lärlingar under de senaste 5 åren, alla klarade.',
      experiences: [
        {
          jobTitle: 'Senior undersköterska — Demensavdelning',
          company: 'Attendo',
          location: 'Malmö',
          startDate: '2019-08',
          current: true,
          description: 'Äldreboende för personer med demens. Småskalig boendeenhet med 8 boende.',
          tasks: [
            'Lead-undersköterska för 8 boende: skriva och revidera vårdplaner, primär kontakt för anhöriga.',
            'Mentor för undersköterskelärlingar; 12 lärlingar handledda under de senaste 5 åren (100 % godkända).',
            'Medlem i kvalitetskommittén för fallprevention; reviderade fallprotokollet 2023.',
          ],
        },
        {
          jobTitle: 'Undersköterska',
          company: 'Vardaga',
          location: 'Lund',
          startDate: '2014-01',
          endDate: '2019-07',
          description: 'LSS-verksamhet för vuxna med måttliga till svåra behov.',
          tasks: [
            'Personlig omvårdnad och dagligt stöd för 6 boende med måttlig till svår funktionsvariation.',
            'Koordination av helgutflykter och anhörigbesök.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Yrkesexamen Vård- och omsorgsprogrammet',
          institution: 'Komvux Malmö',
          location: 'Malmö',
          startDate: '2011-09',
          endDate: '2013-12',
        },
      ],
      skills: ['Skyddad yrkestitel undersköterska', 'Lead-undersköterska', 'Lärlingshandledning', 'Demensvård', 'Phoniro Care', 'BPSD-utmaningar', 'Fallriskbedömning'],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Utbildning + nivå + vårdsetting på rad 1',
        body:
          'Vårdgivare filtrerar på: vårdutbildning (Vård- och omsorgsprogrammet, specialistutbildning), nivå (undersköterska / senior / arbetsledare) och vårdsetting (demens / äldreomsorg / LSS / hemtjänst). Sätt den kombinationen på första raden. Att ange en senior- eller lead-undersköterskeroll signalerar omedelbart senioritet.',
      },
      {
        heading: 'Vårdplaneringssystem explicit',
        body:
          'Phoniro Care, Treserva, Procapita, Combine — vilka system har du använt? För vårdgivare är detta ett filter — ny personal som kan jobba i deras system från dag 1 föredras. Lista det under kompetenser.',
      },
      {
        heading: 'Lärlingshandledning är en differentierare',
        body:
          'Att handleda undersköterskelärlingar är en stark statussignal — vårdgivare värderar personer som kan föra vidare kunskap. Ange antal lärlingar handledda och andel godkända om du har det.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'designer',
    functie: 'Designer (UX / Grafisk)',
    title: 'CV-exempel: UX-designer / Grafisk designer',
    description:
      'CV-exempel för UX-designers och grafiska designers. Med portfolio-länkar, Figma-kompetenser och tips för byrå vs in-house-ansökningar.',
    templateId: 'creatief',
    colorSchemeId: 'rose',
    cv: buildExampleCV({
      firstName: 'Iben',
      lastName: 'Hagberg',
      email: 'iben.hagberg@example.se',
      phone: '+46 70 778 89 91',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/ibenhagberg',
      summary:
        'Senior produktdesigner med 6 års erfarenhet av B2C app-design hos Klarna och Tink. Specialisering inom betalflöden och onboardingoptimering. Owner av designsystemet på Klarna sedan 2023: 80+ komponenter, används av 14 engineers och 4 designers.',
      experiences: [
        {
          jobTitle: 'Senior Product Designer',
          company: 'Klarna',
          location: 'Stockholm',
          startDate: '2023-03',
          current: true,
          description: 'Merchant Dashboard-teamet — onboarding och konfigurationsflöden för betalningar.',
          tasks: [
            'Owner av Klarnas designsystem (80+ komponenter i Figma); används av 14 engineers och 4 designers.',
            'Redesign av onboarding: merchant sign-up completion rate +24 % under de första 6 månaderna.',
            'Användarstudier med 12 enskilda firmor; ledde till förenkling av KYC-processen.',
          ],
        },
        {
          jobTitle: 'Product Designer',
          company: 'Tink',
          location: 'Stockholm',
          startDate: '2019-09',
          endDate: '2023-02',
          description: 'Mobilappdesign — fokus på sparande och split-payments-funktioner.',
          tasks: [
            'Lead designer för lanseringen av investeringsfunktionen (2021); 60 000+ Premium-användare aktiva första året.',
            'Design lead för redesign av betalningsförfrågningsflödet; konvertering +18 %.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidatexamen Grafisk design och kommunikation',
          institution: 'Beckmans Designhögskola',
          location: 'Stockholm',
          startDate: '2015-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Figma (avancerad)', 'Designsystem', 'Användarforskning', 'Prototyping', 'A/B-testning', 'Webflow', 'Flytande engelska'],
      template: 'creatief',
      colorScheme: 'rose',
    }),
    advice: [
      {
        heading: 'Portfolio-länk i din profil och per projekt',
        body:
          'Designrekryterare klickar igenom till din portfolio inom 5 sekunder. Sätt den URL:en framträdande i headern på ditt CV och länka till specifika case från relevanta erfarenhetspunkter. Undvik generiska portfolios med "allt på dem"; rekryterare vill ha 3-5 case som är relevanta för rollen du söker.',
      },
      {
        heading: 'Specialisering + verktygsstack',
        body:
          'B2C app-design är inte B2B SaaS-design är inte branding. Specificera var du är stark. Verktygsstack explicit: Figma + Webflow + Notion / Maze / Hotjar. Designsystemserfarenhet är ett filter för enterprise-roller (Telia Design, SVT Design, Ericsson).',
      },
      {
        heading: 'Mätbar impact: konvertering, completion, retention',
        body:
          'Senior designers bedöms på affärsimpact, inte bara output. "Redesign av onboarding: completion rate +24 % under de första 6 månaderna" är en intervjutrigger. Nämn användarforskningssiffror (antal intervjuer, NPS-förändringar).',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'financieel-medewerker',
    functie: 'Ekonomiassistent',
    title: 'CV-exempel: Ekonomiassistent / Redovisningsassistent',
    description:
      'CV-exempel för ekonomiassistenter, redovisningsassistenter och ekonomihandläggare. Med mjukvaruverktyg och utveckling till financial controller.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Beatrice',
      lastName: 'Sjödin',
      email: 'beatrice.sjodin@example.se',
      phone: '+46 70 889 90 02',
      city: 'Linköping',
      summary:
        'Allround ekonomiassistent med 8 års erfarenhet hos små och medelstora företag (omsättning 50-500 MSEK) inom tillverkning och grossist. Ansvarig för hela kundreskontran och leverantörsreskontran, momsdeklarationer och stöd vid årsbokslut. Fortnox och Visma Administration superanvändare.',
      experiences: [
        {
          jobTitle: 'Ekonomiassistent',
          company: 'Spendrups Bryggeri',
          location: 'Linköping',
          startDate: '2020-06',
          current: true,
          description: 'Bryggeri i mellansegmentet. Del av ekonomiteamet om 6 personer.',
          tasks: [
            'Hela hanteringen av kundreskontra och leverantörsreskontra (i snitt 800 fakturor per månad).',
            'Månatliga momsdeklarationer och kvartalsvisa EU-försäljningslistor.',
            'Stöd vid årsbokslut tillsammans med externa revisorer (Deloitte Linköping).',
            'Implementation av Basware automatisk fakturahantering; minskade manuell bokföring med 60 %.',
          ],
        },
        {
          jobTitle: 'Redovisningsassistent',
          company: 'Sjödin Grossist AB',
          location: 'Linköping',
          startDate: '2016-02',
          endDate: '2020-05',
          description: 'Familjeföretag inom teknisk grossist; omsättning 180 MSEK.',
          tasks: [
            'Hantering av in- och utgående fakturor, bankavstämningar, handkassa.',
            'Förberedelse av månatliga ledningsrapporter till styrelsen.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Yrkeshögskoleexamen Redovisningsekonom',
          institution: 'IHM Business School',
          location: 'Linköping',
          startDate: '2012-09',
          endDate: '2016-01',
        },
      ],
      skills: ['Fortnox', 'Visma Administration', 'Basware', 'QuickBooks', 'Momsdeklarationer', 'EU-försäljningslistor', 'Microsoft Excel (avancerad)'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Mjukvarustack explicit',
        body:
          'Mindre företag och redovisningsbyråer screenar ekonomi-CV efter verktygserfarenhet: Fortnox, Visma, Hogia, Pyramid, Wint. Ange vilka du aktivt använder. För redovisningsbyråer: en bonus är Caseware (revisionsverktyg) eller Capego.',
      },
      {
        heading: 'Scope: omsättning, fakturavolym, sektor',
        body:
          'En ekonomiassistent hos ett 50 MSEK-företag är väldigt annorlunda än hos ett 500 MSEK-företag. Specificera skala: genomsnittliga fakturor per månad, bolagets omsättning (om offentlig) eller sektor. "800 fakturor per månad" är konkret.',
      },
      {
        heading: 'Automation / processförbättring sticker ut',
        body:
          'Många ekonomimedarbetare gör rutinarbete; den som initierar processförbättring (Basware-implementation, automatiska bankflöden, faktura-OCR) sticker ut omedelbart. "60 % reduktion av manuell bokföring" är en intervjutrigger för controller-track-konversationer.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'klantenservice-medewerker',
    functie: 'Kundtjänstmedarbetare',
    title: 'CV-exempel: Kundtjänstmedarbetare',
    description:
      'CV-exempel för kundtjänstmedarbetare på kontaktcenter, e-handel och B2B. Med First-Contact-Resolution, CSAT-siffror och utvecklingstips.',
    templateId: 'minimalist',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Adam',
      lastName: 'Mansour',
      email: 'adam.mansour@example.se',
      phone: '+46 70 990 01 12',
      city: 'Örebro',
      summary:
        'Kundtjänstmedarbetare med 5 års erfarenhet inom e-handel och telekom. Hos Elgiganten: topp 5 % First-Contact-Resolution-poäng under 2024 och NPS 9,2 (teamsnitt 8,4). Floor coach för nya kollegor under deras första 4 veckor i telefonen.',
      experiences: [
        {
          jobTitle: 'Senior Kundtjänstmedarbetare / Coach',
          company: 'Elgiganten',
          location: 'Örebro',
          startDate: '2022-08',
          current: true,
          description: 'Webcare- och telefoniteam för avdelningen Vitvaror.',
          tasks: [
            'First-Contact-Resolution-andel 76 % (teamsnitt 68 %); topp 5 % av en avdelning med 220 personer.',
            'NPS 9,2 under 2024 (teamsnitt 8,4); del av topp 10 för kundnöjdhet Q4.',
            'Floor coach för nya kollegor under deras första 4 veckor i telefonen; 14 kollegor onboardade.',
          ],
        },
        {
          jobTitle: 'Kundtjänstmedarbetare',
          company: 'Telia',
          location: 'Örebro',
          startDate: '2020-03',
          endDate: '2022-07',
          description: 'Inbound-team för mobil- och bredbandsabonnemang.',
          tasks: [
            'Hantering av inkommande samtal om produktfrågor, fakturor och fel.',
            'Identifiering av merförsäljningsmöjligheter inom befintliga abonnemang.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Gymnasieexamen Ekonomiprogrammet',
          institution: 'Karolinska gymnasiet',
          location: 'Örebro',
          startDate: '2016-09',
          endDate: '2020-02',
        },
      ],
      skills: ['Zendesk', 'Salesforce Service Cloud', 'Webcare (Twitter/Instagram)', 'SV, AR flytande', 'Deeskaleringstekniker', 'Konflikthantering'],
      template: 'minimalist',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Prestationssiffror är DEN valutan',
        body:
          'Kundtjänst är ett mätbart fält: FCR (First-Contact-Resolution), CSAT, NPS, AHT (Average Handle Time), genomsnittliga samtal per pass. Ange de mätbara siffror du hade. "NPS 9,2 vs teamsnitt 8,4" är mycket starkare än "kundfokuserad".',
      },
      {
        heading: 'Mjukvarustack och kanaler',
        body:
          'Zendesk, Salesforce Service Cloud, Freshdesk, Intercom — vilket CRM/ärendesystem har du använt? Telefon, chatt, webcare (Twitter/Instagram), e-post? Arbetsgivare som Elgiganten, NetOnNet, Telia och Tele2 vill veta om du kan vara produktiv dag ett.',
      },
      {
        heading: 'Coachning visar ledarskap',
        body:
          'Många kundtjänstmedarbetare tar floor coach-ansvar efter 1-2 år. Ange det konkret ("14 nya kollegor onboardade"). För teamledarbanor är detta den mest avgörande signalen.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'recruiter',
    functie: 'Rekryterare / Talent Acquisition',
    title: 'CV-exempel: Rekryterare / Talent Acquisition',
    description:
      'CV-exempel för in-house- och konsultbolagsrekryterare. Med time-to-hire-metrik, ATS-verktyg och tips för byte mellan konsultbolag och corporate.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Maja',
      lastName: 'Donelius',
      email: 'maja.donelius@example.se',
      phone: '+46 70 001 12 23',
      city: 'Stockholm',
      linkedIn: 'linkedin.com/in/majadonelius',
      summary:
        'Tech-rekryterare med 5 års erfarenhet; 3 hos rekryteringsbolaget Academic Work och 2 in-house hos Spotify. Specialisering inom seniora mjukvaruingenjörer och dataspecialister. 2024: 38 hires levererade (mål 30), genomsnittlig time-to-hire 28 dagar (avdelningssnitt 41).',
      experiences: [
        {
          jobTitle: 'Senior Talent Acquisition Partner',
          company: 'Spotify',
          location: 'Stockholm',
          startDate: '2023-04',
          current: true,
          description: 'Tech-rekrytering, fokus på seniora engineering- och dataroller.',
          tasks: [
            '38 hires levererade 2024 (mål 30); time-to-hire 28 dagar (avdelningssnitt 41).',
            'Hiring manager-partnerskap för 4 engineering-team; veckovisa intake- och kalibreringssessioner.',
            'Ägarskap för svenska employer branding-samarbetet med marknadsavdelningen.',
          ],
        },
        {
          jobTitle: 'Rekryterare',
          company: 'Academic Work',
          location: 'Stockholm',
          startDate: '2020-09',
          endDate: '2023-03',
          description: 'Tech-rekryteringsbolag. Egen klientportfölj med 12 företagskunder.',
          tasks: [
            'Egen portfölj med 12 företagskunder (i snitt 17 MSEK årsintäkt).',
            'Q4 2022: #1 på Nordic Tech-leaderboard med 31 placeringar.',
          ],
        },
      ],
      educations: [
        {
          degree: 'Kandidatexamen Personal- och arbetslivsprogrammet',
          institution: 'Umeå universitet',
          location: 'Umeå',
          startDate: '2016-09',
          endDate: '2020-06',
        },
      ],
      skills: ['Greenhouse ATS', 'LinkedIn Recruiter', 'SmartRecruiters', 'Hireflix', 'Boolean search', 'Tech recruiting (Java/Go/Python stack)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'Time-to-hire och placeringsantal är din kvot',
        body:
          'Rekrytering är ett mätbart fält. Time-to-hire, placeringsantal, offer-acceptance-rate, kandidat-NPS. Skriv siffrorna exakt: "38 hires 2024 (mål 30); time-to-hire 28 dagar (avdelningssnitt 41)". Det är så TA-chefer rankar dig.',
      },
      {
        heading: 'ATS-verktyg och sourcingstack',
        body:
          'Vilket ATS har du aktivt använt? Greenhouse, Workable, SmartRecruiters, Teamtailor, Lever. Vilka sourcing-verktyg? LinkedIn Recruiter, Hiretual/SeekOut, GitHub-sökning för tech, Boolean för LinkedIn Free. För in-house corporate-roller är detta ett filter.',
      },
      {
        heading: 'Sektorsspecialisering och senioritet',
        body:
          'Tech-rekryterare, finance-rekryterare, vårdrekryterare — nischspecialisering väger tungt. Ange vilken typ av roller och vilka kompetenser/stackar du aktivt rekryterar för. "Seniora mjukvaruingenjörer Java/Go" är starkare än "tech-roller".',
      },
    ],
  },
];

export default EXAMPLES_SV;
export const EXAMPLE_BY_SLUG_SV: Record<string, FunctieExample> = Object.fromEntries(
  EXAMPLES_SV.map((e) => [e.slug, e])
);
export const EXAMPLE_SLUGS_SV = EXAMPLES_SV.map((e) => e.slug);
