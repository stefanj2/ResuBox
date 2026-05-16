import { FunctieExample } from './types';
import { buildExampleCV } from './builder';

const EXAMPLES_EN: FunctieExample[] = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'developer',
    functie: 'Software Developer / Engineer',
    title: 'CV Example: Software Developer / Engineer',
    description:
      'Free CV example for software developers and engineers. Recruiter-focused layout for applications at UK scale-ups, FAANG and corporate tech. Includes writing tips.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'James',
      lastName: 'Carter',
      email: 'james.carter@example.co.uk',
      phone: '+44 7700 123456',
      city: 'London',
      linkedIn: 'linkedin.com/in/jamescarter',
      summary:
        'Backend engineer with 7 years of experience in TypeScript and Go at scale-ups in fintech and travel. Reduced API latency by 42% through targeted query optimisation and caching. Comfortable with code reviews, production debugging and mentoring junior developers.',
      experiences: [
        {
          jobTitle: 'Senior Backend Engineer',
          company: 'Skyscanner',
          location: 'London',
          startDate: '2023-02',
          current: true,
          description:
            'Part of the Payments platform team (12 engineers). Owner of the refund service domain.',
          tasks: [
            'Migrated the refund service from monolith to event-driven microservice (Kafka) — reduced refund turnaround from 4 hours to 90 seconds for 18M transactions/month.',
            'Wrote PR templates and code-review guidelines that were adopted team-wide.',
            'Mentored 2 junior engineers; both promoted to mid-level after 12 months.',
          ],
        },
        {
          jobTitle: 'Full-stack Developer',
          company: 'Worldpay',
          location: 'London',
          startDate: '2019-08',
          endDate: '2023-01',
          description: 'Worked on the merchant dashboard (React + Java backend).',
          tasks: [
            'Built real-time fraud-rules dashboard used daily by 200+ merchants.',
            'Reduced dashboard TTI from 4.8s to 1.6s through code-splitting and caching strategy.',
            'Introduced Storybook + visual regression testing in the front-end team.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BSc Computer Science',
          institution: 'Imperial College London',
          location: 'London',
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
        heading: 'What tech recruiters scan for in 6 seconds',
        body:
          'Recruiters at Monzo, Revolut, Wise and Stripe scan developer CVs for three things at once: primary language/framework, recognisable employers, and concrete impact in numbers. Put your primary stack (language + framework + cloud) on line 1 of your profile — not in a skills tag at the bottom. Avoid "passionate about coding" and clichés like "team player"; UK recruiters see those a thousand times a day and filter them out aggressively.',
      },
      {
        heading: 'Bullets with numbers beat bullets with tasks',
        body:
          'Compare "Worked on refund service" with "Migrated refund service from monolith to event-driven microservice — reduced turnaround from 4h to 90s for 18M transactions/month". The second wins every time. Go through every bullet and ask: what changed measurably? Latency, throughput, error rate, team capacity, cost. If you don\'t have a number, describe the scope ("used daily by 200+ merchants").',
      },
      {
        heading: 'What does NOT belong on a UK developer CV',
        body:
          'Skill bars (rating yourself 4/5 in Excel — no recruiter takes that seriously). Icons next to email or phone. A photo (the UK convention is to omit photos, unlike many European markets). GitHub as a bare link without context — for every relevant project, mention the stack and what your role was. Hobby projects only if they\'re genuinely relevant to the role; otherwise cut them. Keep your CV to two pages maximum.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    functie: 'Nurse',
    title: 'CV Example: Nurse',
    description:
      'Professional CV example for registered nurses. ATS-friendly layout, focused on NHS trusts, private hospitals and community care in the UK. Includes tips on NMC registration and specialisations.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Charlotte',
      lastName: 'Hughes',
      email: 'charlotte.hughes@example.co.uk',
      phone: '+44 7700 987654',
      city: 'Manchester',
      summary:
        'NMC-registered nurse with 9 years of experience in Intensive Care and cardiology. Familiar with Cerner Millennium and Epic EPR systems, BLS/ACLS-certified. Specialism in heart failure and post-operative care. Practice supervisor for 2nd and 3rd-year nursing students.',
      experiences: [
        {
          jobTitle: 'ICU Nurse',
          company: 'Manchester Royal Infirmary',
          location: 'Manchester',
          startDate: '2021-09',
          current: true,
          description:
            'Adult ICU, cardiothoracic surgery ward. Part of a team of 14 ICU nurses.',
          tasks: [
            'Initial reception and stabilisation of post-operative patients following cardiac surgery (average 4 patients per shift).',
            'Supervised extubation procedures and weaning from mechanical ventilation.',
            'Practice supervisor for 5 nursing students (years 2-3) over the past 2 years.',
            'Member of the quality committee; led revision of the post-CABG pain management protocol.',
          ],
        },
        {
          jobTitle: 'Cardiology Nurse',
          company: 'Wythenshawe Hospital',
          location: 'Manchester',
          startDate: '2016-02',
          endDate: '2021-08',
          description:
            'Ward C2 — Cardiology. General care and monitoring for heart failure, arrhythmias and post-PCI patients.',
          tasks: [
            'Responsible for 8-10 patients per shift; coordination with cardiologists and physiotherapy.',
            'Preparation and aftercare of patients for cardiac catheterisation and pacemaker implantation.',
            'First responder for resuscitations; member of the crash team.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BSc (Hons) Adult Nursing',
          institution: 'University of Manchester',
          location: 'Manchester',
          startDate: '2012-09',
          endDate: '2016-01',
        },
        {
          degree: 'Post-Registration Critical Care Nursing',
          institution: 'University of Manchester',
          location: 'Manchester',
          startDate: '2022-01',
          endDate: '2023-06',
        },
      ],
      skills: [
        'NMC registration',
        'BLS / ACLS',
        'Cerner Millennium',
        'Epic EPR',
        'Post-operative care',
        'Heart failure',
        'Practice supervision',
        'Triage',
      ],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'NMC pin + specialism first',
        body:
          'For NHS trusts and private hospitals three things are immediately decisive: your NMC registration (state "NMC pin" or "NMC-registered" explicitly), your specialism and which ward/setting you have worked in. Put that information on the first line of your profile. For each employer, specify the ward and patient population — a generic "nurse at hospital X" says nothing, "ICU nurse, cardiothoracic ward at X" is instantly clear.',
      },
      {
        heading: 'Continuity and certifications weigh heavily',
        body:
          'NHS trusts highly value longer tenure — make good employer-tenure visible. Mention post-registration courses, mentorship qualifications and continuing professional development (BLS, ACLS, ALS, EPALS, NLS) in a dedicated certifications section or integrate them with education. EPR experience (Cerner, Epic, SystmOne, EMIS) is a real filter for many trusts — list it under skills.',
      },
      {
        heading: 'Practice supervision and quality work as a plus',
        body:
          'Practice supervision of student nurses, sitting on quality committees, protocol development — these are all strong signals for ward managers looking for senior nurses. Mention them concretely ("5 nursing students years 2-3 in the past 2 years"), not vaguely ("experience with mentoring").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'leraar',
    functie: 'Teacher',
    title: 'CV Example: Teacher',
    description:
      'CV example for teachers in primary, secondary and higher education. With tips on QTS, form tutoring and curriculum development on your CV.',
    templateId: 'modern',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Daniel',
      lastName: 'Whitfield',
      email: 'daniel.whitfield@example.co.uk',
      phone: '+44 7700 223344',
      city: 'Birmingham',
      summary:
        'QTS-qualified History teacher with 11 years of experience at King Edward VI School Birmingham (Key Stage 4-5). Form tutor for Year 12, developer of the Key Stage 3 scheme of work, and member of the History examination board. A-level History pass rate consistently above the national average.',
      experiences: [
        {
          jobTitle: 'History Teacher (KS3-5)',
          company: 'King Edward VI School',
          location: 'Birmingham',
          startDate: '2018-08',
          current: true,
          description:
            'Teaching Years 9-13 across History and Politics. Form tutor for Year 12. 0.9 FTE contract.',
          tasks: [
            'Form tutor for Year 12 for 4 consecutive cohorts; average 28 students per form.',
            'A-level History pass rate: 96% (national average: 89%) measured across 5 cohorts.',
            'Developed KS3 History scheme of work in 2022 — implemented school-wide by all 6 History teachers.',
            'Member of the History examination board: monitoring exam specifications and internal assessment grids.',
          ],
        },
        {
          jobTitle: 'History & Citizenship Teacher (NQT to MPS3)',
          company: 'Bishop Vesey\'s Grammar School',
          location: 'Birmingham',
          startDate: '2014-08',
          endDate: '2018-07',
          description: 'Teaching KS3-4 History and Citizenship.',
          tasks: [
            'Initiator of the "History in the City" programme: pupils research Birmingham\'s industrial heritage.',
            'Mentor for 2 early-career teachers as part of the induction programme.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MA Education (subject specialism History)',
          institution: 'UCL Institute of Education',
          location: 'London',
          startDate: '2016-09',
          endDate: '2018-06',
        },
        {
          degree: 'PGCE Secondary History (with QTS)',
          institution: 'University of Birmingham',
          location: 'Birmingham',
          startDate: '2013-09',
          endDate: '2014-06',
        },
      ],
      skills: [
        'QTS (Qualified Teacher Status)',
        'KS5 form tutoring',
        'Examination board work',
        'Curriculum development',
        'SIMS',
        'Arbor MIS',
        'Differentiation in teaching',
      ],
      template: 'modern',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'QTS, subject and key stage on the first line',
        body:
          'Head teachers and HR scan for three things: qualification (QTS / QTLS / NPQ), your subject area, and which key stage you teach (KS1 / KS2 / KS3 / KS4 / KS5 / FE / HE). Put that combination on the first line of your profile. Avoid "passionate about education" — head teachers spot that pattern immediately as a template phrase.',
      },
      {
        heading: 'Results in numbers, even in education',
        body:
          'The taboo around numbers in education is outdated. A pass rate above the national average, progress 8 scores, value-added measures, retention rates — if you have one, include it. "A-level History 96% pass rate (national 89%) over 5 cohorts" is a strong signal that you are genuinely effective as a teacher, not just present.',
      },
      {
        heading: 'Curriculum work and form tutoring carry weight',
        body:
          'Head teachers look for teachers who do more than teach: curriculum development, examination boards, KS5 form tutoring, coaching ECTs. Mention these roles concretely with numbers ("form tutor for 4 consecutive Year 12 cohorts"). This sets you apart from hundreds of CVs that only say "teaching experience".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'accountant',
    functie: 'Accountant',
    title: 'CV Example: Accountant',
    description:
      'CV example for accountants, controllers and finance professionals in the UK. Tailored for applications at Big 4, mid-tier firms and corporates.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Eleanor',
      lastName: 'Whitmore',
      email: 'eleanor.whitmore@example.co.uk',
      phone: '+44 7700 135246',
      city: 'London',
      linkedIn: 'linkedin.com/in/eleanorwhitmore',
      summary:
        'ACA-qualified accountant with 8 years of audit experience at Big 4, specialising in financial institutions and retail (audit engagements >£500M revenue). Responsible audit manager for 14 statutory audits per season. Strong experience with IFRS transitions and SOX compliance programmes.',
      experiences: [
        {
          jobTitle: 'Audit Manager — Financial Services',
          company: 'KPMG UK',
          location: 'London',
          startDate: '2022-09',
          current: true,
          description:
            'Responsible for the delivery of audit engagements at banks and insurers. Managing teams of 6-12 auditors.',
          tasks: [
            'Audit-responsible for 4 major financial services clients with combined revenue of £2.8bn.',
            'Led IFRS 17 transition project at an insurance client; on-time delivery and clean audit opinion.',
            'Coached 3 senior associates through final ACA exams; all 3 passed at first attempt.',
          ],
        },
        {
          jobTitle: 'Senior Associate Audit',
          company: 'EY UK',
          location: 'London',
          startDate: '2018-08',
          endDate: '2022-08',
          description: 'Audit engagements at retail and consumer-goods clients.',
          tasks: [
            'Fieldwork coordinator on statutory audits up to £800M revenue (Tesco supplier, FTSE-listed retailer).',
            'Author of internal quality memo on inventory cycles; incorporated into UK audit methodology.',
          ],
        },
      ],
      educations: [
        {
          degree: 'ACA — Chartered Accountant (ICAEW)',
          institution: 'ICAEW',
          location: 'London',
          startDate: '2018-09',
          endDate: '2022-06',
        },
        {
          degree: 'MSc Accounting and Finance',
          institution: 'London School of Economics',
          location: 'London',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      skills: ['ACA', 'IFRS', 'SOX', 'Audit Command Language (ACL)', 'Power BI', 'Caseware', 'IDEA', 'Lead auditor'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Qualification, niche and seniority first',
        body:
          'Big 4 and mid-tier firms screen for three filters: ACA/ACCA/CIMA qualification (or in-progress), sector specialism (Financial Services, Retail, Public Sector), and your management track. Put that information explicitly on line 1 of your profile. Anyone writing audit manager without sector-specific work history immediately raises doubt.',
      },
      {
        heading: 'Numbers and names are fine — discretion lives within NDAs',
        body:
          'Auditors are often cautious with client names because of confidentiality obligations — rightly so. But revenue ranges and sector context ("Tesco supplier", "FTSE-listed insurer") are usually permitted and powerful. Also include final-exam achievements (CFO presentations, IFRS transitions delivered, clean audit opinions) where they measurably contributed.',
      },
      {
        heading: 'Promotion track and coaching impact',
        body:
          'At manager level and above, your ability to pull people up is as important as technical quality. "Coached 3 senior associates through final ACA exams; all 3 passed at first attempt" is a strong signal of the professional quality partners want to see.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    functie: 'Marketing Manager',
    title: 'CV Example: Marketing Manager',
    description:
      'CV example for (senior) marketing managers in B2B and B2C. Concrete writing tips, sample bullets and the recommended layout for recruiter scanning.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Olivia',
      lastName: 'Mitchell',
      email: 'olivia.mitchell@example.co.uk',
      phone: '+44 7700 445566',
      city: 'Bristol',
      linkedIn: 'linkedin.com/in/oliviamitchell',
      summary:
        'B2B SaaS marketing manager with 6 years of experience at UK scale-ups in fintech and HR-tech. Owner of the paid-acquisition funnel from pre-Series A to £15M ARR. Reduced CAC by 38% at a low-code platform in 2 years through retargeting and LinkedIn Ads optimisation.',
      experiences: [
        {
          jobTitle: 'Senior Marketing Manager — Demand Generation',
          company: 'Mendix (Siemens)',
          location: 'Bristol',
          startDate: '2022-04',
          current: true,
          description:
            'Owner of the EMEA demand-gen funnel for the low-code platform. Manager of 3 specialists (Paid, Content, ABM).',
          tasks: [
            'Reduced Customer Acquisition Cost from £1,420 to £880 in 18 months through retargeting and funnel segmentation.',
            'Launched an ABM programme targeting 200 enterprise accounts; generated £4.2M pipeline within 9 months.',
            'Manager of a team of 3; all three received "exceeds expectations" in the annual review.',
          ],
        },
        {
          jobTitle: 'Marketing Manager',
          company: 'Sage UK',
          location: 'Newcastle',
          startDate: '2019-06',
          endDate: '2022-03',
          description: 'B2B marketing for HR software in the SME segment.',
          tasks: [
            'Built a content-marketing engine from 0 to 60K monthly organic visitors in 24 months.',
            'Launched an MQL-to-SQL scoring model in HubSpot; improved conversion from 4% to 11%.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MSc Marketing',
          institution: 'University of Bristol',
          location: 'Bristol',
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
        heading: 'Funnel numbers are the currency',
        body:
          'Recruiters for (senior) marketing roles are looking for one thing: can you measurably improve the funnel. Put hard numbers in every bullet: CAC, MQL-to-SQL conversion, pipeline generated, ROAS, ARR added. "Responsible for marketing strategy" is word noise; "Reduced CAC from £1,420 to £880 in 18 months" is an interview trigger.',
      },
      {
        heading: 'Channel mix + tool stack explicit',
        body:
          'Mention concrete channels (LinkedIn Ads, Google Ads, retargeting, ABM, content, partnerships) and the tools you actually use day-to-day (HubSpot, Salesforce, Marketo, GA4, Looker). Vague "marketing automation" without a tool name is a red flag — UK recruiters will assume you know it only on paper.',
      },
      {
        heading: 'Team and stakeholder leadership',
        body:
          'For senior roles, whether you can build and lead a team matters. "Manager of 3 specialists" is stronger than "collaborated with team". Mention exactly who you manage (roles and headcount), and as a bonus: achievements of those team members ("all three exceeds expectations").',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verkoper',
    functie: 'Sales Representative / Account Manager',
    title: 'CV Example: Sales Representative / Account Manager',
    description:
      'CV example for sales representatives, account managers and sales professionals. With quota-attainment examples and tips for B2B vs B2C applications in the UK.',
    templateId: 'modern',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Harry',
      lastName: 'Fletcher',
      email: 'harry.fletcher@example.co.uk',
      phone: '+44 7700 778899',
      city: 'London',
      linkedIn: 'linkedin.com/in/harryfletcher',
      summary:
        'B2B Account Executive with 5 years of experience in SaaS sales — full-cycle from prospect to close. Achieved 138% of quota in 2025 at Salesforce UK (deal size £55-160K, sales cycle 4-7 months). Strong experience with multi-stakeholder enterprise deals in the finance and retail sectors.',
      experiences: [
        {
          jobTitle: 'Account Executive — Mid-Market',
          company: 'Salesforce UK',
          location: 'London',
          startDate: '2023-01',
          current: true,
          description:
            'Full-cycle sales: from outbound prospect to signed contract. Focus on mid-market clients (£50M-£500M revenue).',
          tasks: [
            'Quota attainment 2025: 138% (£2.1M ARR closed vs £1.5M target).',
            '#3 on the UK Mid-Market leaderboard out of 22 AEs in H1 2025.',
            'Won largest UK Mid-Market deal Q4 2024: £340K ARR, 6-month cycle, 7 stakeholders.',
          ],
        },
        {
          jobTitle: 'Sales Development Representative',
          company: 'Personio UK',
          location: 'London',
          startDate: '2020-08',
          endDate: '2022-12',
          description: 'Outbound prospecting in UK&I and the Nordics. Generating MQLs for the AE team.',
          tasks: [
            '147% of SQL target in 2022; team record for outbound meetings in a single month (38).',
            'Wrote the playbook for cold outreach in the fintech niche; adopted internally by 14 SDRs.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BA Business Management',
          institution: 'University of Leeds',
          location: 'Leeds',
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
        heading: 'Quota attainment is THE key metric',
        body:
          'Nothing convinces sales recruiters like concrete quota attainment per year. Write it precisely: "138% of quota 2025 (£2.1M ARR closed vs £1.5M target)". Add ranking if you worked in a team ("#3 on the UK Mid-Market leaderboard out of 22 AEs"). Avoid vague terms like "successful sales results".',
      },
      {
        heading: 'Deal size, cycle length, stakeholder count',
        body:
          'For enterprise roles, whether you can close multi-stakeholder deals matters. For big wins, mention deal size, sales cycle and stakeholder count ("£340K ARR, 6-month cycle, 7 stakeholders"). This is how sales leaders gauge whether you fit their average ACV and deal complexity.',
      },
      {
        heading: 'Methodology and tools count',
        body:
          'Mention the sales methodology you have been trained in (MEDDPICC, MEDDIC, BANT, Challenger, SPIN) and the CRM/tooling you actively manage (Salesforce, HubSpot, Outreach, Gong). An AE without methodology references at senior level is a red flag in the UK market.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'office-manager',
    functie: 'Office Manager',
    title: 'CV Example: Office Manager / Executive Assistant',
    description:
      'CV example for office managers, executive assistants and management assistants. Concrete and operational — with tips for making your value measurable.',
    templateId: 'minimalist',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Sophie',
      lastName: 'Bennett',
      email: 'sophie.bennett@example.co.uk',
      phone: '+44 7700 556677',
      city: 'London',
      summary:
        'Office Manager with 12 years of experience in scale-ups and law firms. Responsible for the diary of the CEO and 3 directors, facilities for a 140-employee office, and all onboarding processes. Familiar with BambooHR, Notion, Asana and Concur.',
      experiences: [
        {
          jobTitle: 'Office Manager',
          company: 'Monzo Bank',
          location: 'London',
          startDate: '2021-02',
          current: true,
          description:
            'Responsible for headquarters operations (140 FTE) and the diary of the CEO and 3 directors.',
          tasks: [
            'Management of the CEO\'s diary including international travel (average 2 trips/month to EU hubs).',
            'Onboarding coordinator: 38 new starters in 2024 — 100% day-one readiness.',
            'Renegotiated office lease: annual saving of £62K at equivalent square footage.',
            'Owner of the facilities supplier pool (catering, cleaning, office supplies) — 6 contracts.',
          ],
        },
        {
          jobTitle: 'Executive Assistant',
          company: 'Linklaters',
          location: 'London',
          startDate: '2014-09',
          endDate: '2021-01',
          description: 'Supporting 4 partners and their teams within the M&A practice group.',
          tasks: [
            'Management of partner diaries and client correspondence (English/French).',
            'Coordination of closing meetings on major transactions — averaging 8 closings per year.',
            'Member of the office-improvement team; redesigned the onboarding process for trainees.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BTEC Level 5 Diploma in Management',
          institution: 'Pitman Training London',
          location: 'London',
          startDate: '2010-09',
          endDate: '2014-06',
        },
      ],
      skills: ['BambooHR', 'Notion', 'Asana', 'Concur', 'Microsoft 365', 'Vendor management', 'Onboarding', 'Fluent French'],
      template: 'minimalist',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Operational scope before personal qualities',
        body:
          'The cliché office manager CV opens with "organised, communicative, calm under pressure". UK recruiters only believe that when they can see the operational scope. Put the scale on line 1: number of employees you cover facilities for, number of directors whose diary you manage, number of suppliers in your pool.',
      },
      {
        heading: 'Make your value measurable',
        body:
          'Office management work seems soft but often translates well into numbers: annual savings on contracts, number of onboardings per year, % day-one readiness, lead time on facility issues. One concrete number in a bullet ("£62K annual saving at equivalent square footage") is stronger than five adjectives.',
      },
      {
        heading: 'Tooling explicit',
        body:
          'Mention the exact systems you use daily (BambooHR, Workday, Concur, Notion, Asana, Slack, MS365). For scale-up recruiters this is a direct filter — they want someone productive on day 1, not someone who needs tool training first.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'projectmanager',
    functie: 'Project Manager',
    title: 'CV Example: Project Manager',
    description:
      'CV example for project managers in IT, construction and consulting. With tips on budget impact, methodology references and stakeholder management.',
    templateId: 'executive',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Rebecca',
      lastName: 'Holloway',
      email: 'rebecca.holloway@example.co.uk',
      phone: '+44 7700 889900',
      city: 'Edinburgh',
      linkedIn: 'linkedin.com/in/rebeccaholloway',
      summary:
        'Senior PMP-certified project manager with 10 years of experience delivering digital-transformation programmes at financial institutions. Delivered: 4 major ERP implementations and a PSD2 compliance programme, total budget £16M. Strong experience with agile/scrum and hybrid waterfall environments.',
      experiences: [
        {
          jobTitle: 'Senior Project Manager — Digital Transformation',
          company: 'Lloyds Banking Group',
          location: 'Edinburgh',
          startDate: '2022-03',
          current: true,
          description:
            'Programme management for core-banking modernisation. Stakeholder management at executive level.',
          tasks: [
            'Led the modernisation of the payments platform: 28 FTE, £5.6M budget, delivered 3 months ahead of plan.',
            'Steering committee secretary with CFO + CIO + COO as members; monthly reporting to the board.',
            'Coach for 4 mid-level PMs in the bank\'s PM academy.',
          ],
        },
        {
          jobTitle: 'Project Manager — IT Programmes',
          company: 'Aviva',
          location: 'York',
          startDate: '2017-09',
          endDate: '2022-02',
          description: 'IT programme management within the Life & Pensions division.',
          tasks: [
            'Lead of the PSD2 compliance programme (£2.8M budget, 18 months, 14 FTE); 100% audit-clean.',
            'Salesforce Marketing Cloud implementation: rollout to 4 BUs, ROI break-even in month 9.',
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
          institution: 'University of Edinburgh',
          location: 'Edinburgh',
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
        heading: 'Budget, scope and timeline — all three',
        body:
          'For PM roles three metrics are the currency: project budget, FTE/scope, and delivery vs. plan. "Led modernisation of the payments platform: 28 FTE, £5.6M budget, delivered 3 months ahead of plan" says more than half a page of adjectives. If you delivered on-budget and on-time, mention it. If you delivered ahead of plan, that\'s an interview trigger.',
      },
      {
        heading: 'Methodology + certification',
        body:
          'PMP, PRINCE2, AgilePM and Scrum Master belong in your skills or in a separate certifications section. For enterprise roles in the UK, PMP or PRINCE2 is often a hard filter. Mention the methodology you actually use (Agile/Scrum, Waterfall, hybrid) and which tools (JIRA, MS Project, Asana).',
      },
      {
        heading: 'Steering committee and stakeholder level',
        body:
          'At senior level, executives are looking for someone who can operate in steering committees. State concretely at what level you reported ("steering committee with CFO + CIO + COO", "monthly reporting to the board"). This distinguishes junior from senior PMs in seconds.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'stagiair',
    functie: 'Intern',
    title: 'CV Example: Internship CV (University)',
    description:
      'Free CV example for university students looking for an internship or placement. Includes tips for what to do when you have limited work experience.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Amelia',
      lastName: 'Pemberton',
      email: 'amelia.pemberton@example.co.uk',
      phone: '+44 7700 112233',
      city: 'London',
      linkedIn: 'linkedin.com/in/ameliapemberton',
      summary:
        'Third-year Business Management student at the London School of Economics with a strong interest in strategy consulting. President of the Marketing Society (560 members), case finalist at the McKinsey Insight programme 2025, and 3 years of part-time work experience at Tesco. Available for a 5-month placement from February 2026.',
      experiences: [
        {
          jobTitle: 'President',
          company: 'LSE Marketing Society',
          location: 'London',
          startDate: '2024-09',
          current: true,
          description: 'Leading a 6-person committee. 560 members, annual budget £120K.',
          tasks: [
            'Negotiated sponsor deal with BCG (3-year contract, £40K/year).',
            'Organised the annual "Marketing Battle" event: 220 participants, 14 corporate partners.',
            'Weekly 1-to-1s with 5 committee members; coaching on leadership skills.',
          ],
        },
        {
          jobTitle: 'Customer Assistant (Tills & Floor)',
          company: 'Tesco',
          location: 'London',
          startDate: '2022-09',
          endDate: '2024-08',
          description: 'Part-time role alongside studies. Shop-floor work and tills.',
          tasks: [
            'Promoted to shift coach for new student colleagues (after 8 months).',
            'Owner of the assortment reset process during seasonal campaign switches.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BSc Business Management',
          institution: 'London School of Economics',
          location: 'London',
          startDate: '2023-09',
          endDate: '2026-08',
          description: 'Expected completion summer 2026. Predicted First-class honours. Dean\'s List 2024-25.',
        },
        {
          degree: 'A-Levels (A*A*A*)',
          institution: 'Westminster School',
          location: 'London',
          startDate: '2017-09',
          endDate: '2023-07',
        },
      ],
      skills: ['Excel (intermediate)', 'PowerPoint', 'Python (basic)', 'Tableau (basic)', 'French (C1)', 'Spanish (B2)'],
      template: 'modern',
      colorScheme: 'emerald',
    }),
    advice: [
      {
        heading: 'The work-experience paradox: leadership beats odd jobs',
        body:
          'As a student you have little work experience — that\'s fine. What recruiters at McKinsey, Bain, Goldman Sachs and Unilever look for in placement candidates is not years of experience but SIGNALS of leadership, ownership and intellectual curiosity. A role as president of a student society (with concrete numbers: member count, budget, sponsor deals) weighs more heavily than two years on tills.',
      },
      {
        heading: 'Predicted grades, honours tracks and case competitions',
        body:
          'For strategy consulting and investment banking, grades are literally a filter (top 5-10% of your cohort). Mention your predicted classification (First / 2:1), your dean\'s list status, and case-competition results ("McKinsey Insight 2025 case finalist" — this triggers a conversation). Stating availability explicitly ("from February 2026, 5 months") helps recruiters slot you into their planning.',
      },
      {
        heading: 'Making small jobs big — honestly',
        body:
          'A student job at Tesco can be a strong story if you make it concrete: "Promoted to shift coach after 8 months" shows you stood out; "Owner of the assortment reset process" shows ownership. Avoid overclaiming ("revolutionised the store") — UK recruiters spot that immediately.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'consultant',
    functie: 'Consultant',
    title: 'CV Example: Management Consultant',
    description:
      'CV example for management consultants and strategy advisers. Includes MBB-style format, case-impact bullets and sector references.',
    templateId: 'executive',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Edward',
      lastName: 'Ashworth',
      email: 'edward.ashworth@example.co.uk',
      phone: '+44 7700 334455',
      city: 'London',
      linkedIn: 'linkedin.com/in/edwardashworth',
      summary:
        'Senior consultant with 6 years of experience at McKinsey & Company London, specialising in financial services and post-merger integration. Lead on 3 PMI engagements (total deal value £3.6bn). Stanford MBA. Visiting lecturer for the MBA course "Value Creation in M&A" at London Business School.',
      experiences: [
        {
          jobTitle: 'Engagement Manager',
          company: 'McKinsey & Company',
          location: 'London',
          startDate: '2022-08',
          current: true,
          description:
            'Lead consultant on high-stakes engagements in the Banking & Insurance practice. Managing 3-5 associates per case.',
          tasks: [
            'Led PMI for the merger between two UK banks (£2.1bn deal): delivered 6 months earlier than target.',
            'Cost-transformation programme at a European insurer: £105M annual run-rate savings identified, £78M implemented.',
            'Coached 4 associates towards Engagement Manager promotion; 3 succeeded at first attempt.',
          ],
        },
        {
          jobTitle: 'Associate',
          company: 'McKinsey & Company',
          location: 'London',
          startDate: '2019-09',
          endDate: '2022-07',
          description: 'Engagements primarily in Public Sector and Financial Services.',
          tasks: [
            'Quantitative modelling for board presentations; author of 3 client-facing Excel models.',
            'Initiator of internal research on "post-COVID retail banking" — published by the UK Banking Practice.',
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
          degree: 'BSc Economics (First-class honours)',
          institution: 'London School of Economics',
          location: 'London',
          startDate: '2013-09',
          endDate: '2016-06',
        },
      ],
      skills: ['M&A / PMI', 'Financial modelling', 'Stakeholder management', 'Workshop facilitation', 'Excel/PowerPoint', 'English / French / German'],
      template: 'executive',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'MBB CV: the "Little Black Dress" format',
        body:
          'At MBB (McKinsey, BCG, Bain) and tier-1 strategy firms the format is stricter than elsewhere: one page, black-and-white, conservative typography, no colour, no photo. The Zakelijk or Executive template in ResuBox aligns with this. Numbers and names wherever possible — McKinsey reads a case bullet without a number as unproven.',
      },
      {
        heading: 'Cases with deal value, scope and impact',
        body:
          'Describe cases along three dimensions: scope (deal value, FTE impact, geographic coverage), your role (analyst / associate / EM), and concrete impact ("£78M implemented"). NDA issues: sector and deal size are usually permissible without a client name — if in doubt, anonymise ("European insurer") and stay concrete with numbers.',
      },
      {
        heading: 'MBA, GMAT, languages — yes or no',
        body:
          'For strategy consulting, education carries weight. Top MBA programmes (Stanford, INSEAD, LBS, IESE, Harvard) always mention — strong filter. GMAT score only if above 720. First-class honours / honours tracks always state. Languages at C-level or native (EN/FR/DE/ES) are often a real plus for international engagements — list them.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'logistiek-medewerker',
    functie: 'Warehouse Operative',
    title: 'CV Example: Warehouse Operative',
    description:
      'CV example for warehouse operatives in distribution centres, transport and warehousing. With forklift certifications, WMS knowledge and tips for temp contracts.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Lewis',
      lastName: 'Holland',
      email: 'lewis.holland@example.co.uk',
      phone: '+44 7700 112233',
      city: 'Leeds',
      summary:
        'Experienced warehouse operative with 7 years of work experience in food distribution and e-commerce fulfilment. Forklift and reach-truck certified, experienced with WMS systems Manhattan and Centric. Permanent employee at DSV Solutions since 2020 with multiple shift-coach responsibilities.',
      experiences: [
        {
          jobTitle: 'Senior Order Picker / Shift Coach',
          company: 'DSV Solutions',
          location: 'Leeds',
          startDate: '2020-04',
          current: true,
          description: 'Distribution centre for Tesco suppliers. Two-shift pattern (06:00-14:30 / 14:30-23:00).',
          tasks: [
            'Picking and consolidating orders using VR headset (Honeywell A700x); average 220 picks/hour.',
            'Shift coach for a team of 8 agency workers; first point of contact for breakdowns.',
            'Cycle counting: accuracy 99.4% over calendar year 2024.',
          ],
        },
        {
          jobTitle: 'Forklift Driver',
          company: 'Amazon Fulfilment',
          location: 'Wakefield',
          startDate: '2018-02',
          endDate: '2020-03',
          description: 'Inbound goods flow at one of the largest fulfilment centres in the UK.',
          tasks: [
            'Unloading containers (average 6 per shift); booking in via Manhattan WMS.',
            'Moving pallets to various storage locations using reach truck.',
            'Zero-accident record over 24 months.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BTEC Level 2 Diploma in Warehousing & Storage',
          institution: 'Leeds City College',
          location: 'Leeds',
          startDate: '2015-09',
          endDate: '2017-06',
        },
      ],
      skills: ['Counterbalance forklift licence', 'Reach truck licence', 'Manhattan WMS', 'Centric WMS', 'VR picking (Honeywell)', 'IOSH Working Safely'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Certifications on line 1 of your profile',
        body:
          'Logistics employers screen for one thing: can this person start tomorrow? Put your certifications (forklift, reach truck, IOSH, ADR) and WMS systems right at the top. Avoid vague profiles like "hard-working professional"; state that you are certified and which systems you have used.',
      },
      {
        heading: 'Numbers wherever possible',
        body:
          'Picks per hour, accuracy percentage, zero-accident records, number of containers per shift — every measurable data point counts. Logistics recruiters at DSV, Amazon, Tesco and Royal Mail look specifically for these numbers because they are directly comparable across candidates.',
      },
      {
        heading: 'Shift-coach / team-leader experience explicit',
        body:
          'Many warehouse operatives gain coach responsibility for agency workers or new colleagues after 1-2 years. State it concretely ("shift coach for a team of 8 agency workers"). This signals promotion potential into team-leader roles.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'monteur',
    functie: 'Mechanic / Engineer',
    title: 'CV Example: Mechanic / Engineer',
    description:
      'CV example for electricians, vehicle mechanics and building services engineers in the UK. With certifications, employers and tips for self-employed tradespeople.',
    templateId: 'zakelijk',
    colorSchemeId: 'orange',
    cv: buildExampleCV({
      firstName: 'Ryan',
      lastName: 'Cooper',
      email: 'ryan.cooper@example.co.uk',
      phone: '+44 7700 223344',
      city: 'Cardiff',
      summary:
        'Senior heating engineer with 12 years of experience in gas boilers, heat pumps and solar thermal systems at British Gas and local installation firms. Gas Safe registered, F-Gas certified, City & Guilds 18th Edition. At British Gas responsible for the in-house upskilling programme on hybrid heat pumps.',
      experiences: [
        {
          jobTitle: 'Senior Heating Engineer',
          company: 'British Gas',
          location: 'Cardiff & South Wales',
          startDate: '2019-06',
          current: true,
          description: 'Installation and service of gas boilers, hybrid heat pumps and HRe systems at domestic customers and housing associations.',
          tasks: [
            'Lead engineer for an average of 4 installations per week; customer satisfaction 4.8/5.0 across 2024.',
            'Trainer for 6 new colleagues in 2023-2024 on hybrid heat pumps.',
            'Member of the regional out-of-hours breakdown team (2 nights per month).',
          ],
        },
        {
          jobTitle: 'Heating Engineer',
          company: 'Cooper Heating Services',
          location: 'Cardiff',
          startDate: '2013-08',
          endDate: '2019-05',
          description: 'Family business — domestic central heating and plumbing installations.',
          tasks: [
            'Installation and maintenance of Worcester Bosch, Vaillant and Ideal boilers.',
            'Renovation projects in listed buildings including pipework and bathrooms.',
          ],
        },
      ],
      educations: [
        {
          degree: 'NVQ Level 3 Diploma in Domestic Plumbing and Heating',
          institution: 'Cardiff and Vale College',
          location: 'Cardiff',
          startDate: '2009-09',
          endDate: '2013-07',
        },
      ],
      skills: ['Gas Safe registration', 'F-Gas Cat. I', 'City & Guilds 18th Edition', 'Hybrid heat pumps', 'Worcester Bosch / Vaillant / Ideal', 'Plumbing', 'Full UK driving licence'],
      template: 'zakelijk',
      colorScheme: 'orange',
    }),
    advice: [
      {
        heading: 'Certifications as a hard filter',
        body:
          'UK installation businesses cannot offer work without Gas Safe or F-Gas; mention them in your profile. For heat pumps specifically: MCS accreditation or manufacturer training (Worcester Bosch, Vaillant) is worth listing. Also state your driving licence (a full UK licence is usually required for service engineers).',
      },
      {
        heading: 'Customer satisfaction and reliability count',
        body:
          'Employers like British Gas, OVO Energy and E.ON judge engineers partly on customer feedback. Have a score from your service-management system? Mention it. No score? List zero-accident years, on-time completion rate or First-Time-Fix percentage.',
      },
      {
        heading: 'Hybrid heat pump specialism is the winning skill for 2026',
        body:
          'The energy transition and gas-boiler phase-out make heat-pump installation the growth niche in the UK. If you have experience or training, write it explicitly. Recruiters at Octopus Energy, British Gas and Mitsubishi Electric are actively looking for this.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'horeca-medewerker',
    functie: 'Hospitality Worker',
    title: 'CV Example: Hospitality (Waiter / Chef / Bartender)',
    description:
      'CV example for hospitality staff in restaurants, hotels and catering. With tips on seasonal work, tronc earnings and progression to shift leader.',
    templateId: 'creatief',
    colorSchemeId: 'amber',
    cv: buildExampleCV({
      firstName: 'Isla',
      lastName: 'Reynolds',
      email: 'isla.reynolds@example.co.uk',
      phone: '+44 7700 334455',
      city: 'London',
      summary:
        'All-round hospitality professional with 6 years of fine-dining service experience at The Ledbury (2 stars) and bistro The Clove Club. Completed Sommelier course at WSET in 2024. Progressed to shift leader at The Clove Club: leading 4 colleagues during services of 80+ covers.',
      experiences: [
        {
          jobTitle: 'Shift Leader — Front of House',
          company: 'The Clove Club',
          location: 'London',
          startDate: '2022-04',
          current: true,
          description: 'Farm-to-table restaurant in Shoreditch Town Hall. Lunch and dinner, 80-100 covers per service.',
          tasks: [
            'Leading 4 team members per shift; responsible for runner flow and menu explanation.',
            'Providing wine advice and setting up wine pairings with the kitchen; bottle revenue +18% in 2024.',
            'Coach for new starters during their first 6 weeks.',
          ],
        },
        {
          jobTitle: 'Front of House',
          company: 'The Ledbury**',
          location: 'London',
          startDate: '2019-08',
          endDate: '2022-03',
          description: 'Michelin-starred restaurant in Notting Hill. À la carte and chef\'s menu dining.',
          tasks: [
            'Delivering à la carte service and wine pairing for the 7-course chef\'s menu.',
            'Communicating in English, French and Italian with international clientele.',
            'Member of the opening team for the summer terrace edition 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'WSET Level 2 Award in Wines',
          institution: 'Wine & Spirit Education Trust',
          location: 'London',
          startDate: '2024-01',
          endDate: '2024-06',
        },
        {
          degree: 'Level 3 Diploma in Hospitality Supervision',
          institution: 'Westminster Kingsway College',
          location: 'London',
          startDate: '2016-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Wine pairing', 'Fluent French', 'Conversational Italian', 'POS Lightspeed', 'Allergen training', 'Personal Licence holder'],
      template: 'creatief',
      colorScheme: 'amber',
    }),
    advice: [
      {
        heading: 'Specialism + level on line 1',
        body:
          'UK hospitality employers (The Ledbury, Sketch, The Wolseley, Soho House group, Hilton) screen on level: fine-dining vs. brasserie vs. fast service. Specify where you have worked (Michelin-starred restaurant, hotel chain, local bistro). State your languages — French or Italian for international clientele in London is a real differentiator.',
      },
      {
        heading: 'Progression and responsibility',
        body:
          'Many hospitality staff progress internally to shift leader, supervisor or head waiter. Mention that title if you held it — employers see that others have already promoted you. Also: being part of an opening team for a new venue is a strong signal.',
      },
      {
        heading: 'Numbers where possible: revenue, covers, tronc',
        body:
          'Wine revenue +%, tronc earnings, average covers per service. Not all numbers are available but if you have one, use it. "+18% bottle revenue 2024" says far more than "passionate about wine".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'data-analist',
    functie: 'Data Analyst',
    title: 'CV Example: Data Analyst',
    description:
      'CV example for data analysts with SQL, Python, Tableau and Power BI. With tips on portfolio, business impact and progression to analytics engineer.',
    templateId: 'tech',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Hannah',
      lastName: 'Pritchard',
      email: 'hannah.pritchard@example.co.uk',
      phone: '+44 7700 445566',
      city: 'Manchester',
      linkedIn: 'linkedin.com/in/hannahpritchard',
      summary:
        'Data analyst with 4 years of experience in retail analytics at Tesco and Ocado. SQL, Python (pandas, scikit-learn) and dbt for pipelines; Tableau and Power BI for stakeholder reporting. Owner of the weekly forecasting dashboard that 12 category managers used for buying decisions.',
      experiences: [
        {
          jobTitle: 'Data Analyst — Category & Pricing',
          company: 'Ocado',
          location: 'Hatfield',
          startDate: '2023-08',
          current: true,
          description: 'Analytics team within Commerce, supporting 12 category managers with data-driven buying and pricing decisions.',
          tasks: [
            'Built a forecasting dashboard in Tableau used weekly by 12 category managers for buying decisions.',
            'Migrated 8 legacy reports from Excel to dbt + Looker; average refresh time from 3h to 8min.',
            'A/B test analysis for promotional mechanics; identified that BOGOF on fresh produce performed 23% better than discount.',
          ],
        },
        {
          jobTitle: 'Junior Data Analyst',
          company: 'Tesco',
          location: 'Welwyn Garden City',
          startDate: '2021-09',
          endDate: '2023-07',
          description: 'Part of the Customer Insights team within Tesco Online.',
          tasks: [
            'SQL queries and dashboards in Power BI for the marketing team.',
            'RFM segmentation of Clubcard customers; pilot resulted in +£320K incremental revenue.',
          ],
        },
      ],
      educations: [
        {
          degree: 'MSc Business Analytics',
          institution: 'Alliance Manchester Business School',
          location: 'Manchester',
          startDate: '2019-09',
          endDate: '2021-08',
        },
      ],
      skills: ['SQL (advanced)', 'Python (pandas, scikit-learn)', 'dbt', 'Tableau', 'Power BI', 'Looker', 'A/B testing', 'Statistical analysis'],
      template: 'tech',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Tools + impact, not just tools',
        body:
          'Everyone writes "SQL and Python". What sets you apart: what did you do with them and what changed measurably? "Built a forecasting dashboard used weekly by 12 category managers" is stronger than "Tableau experience".',
      },
      {
        heading: 'Scale of impact in numbers',
        body:
          'For data-analyst roles three numbers are king: revenue/cost impact (£), efficiency gains (hours saved, refresh time), and dataset size/users (12 stakeholders, 500K customers, 8M rows). Pick one per bullet.',
      },
      {
        heading: 'Tool overlap with your target role — match exactly',
        body:
          'Recruiters at Skyscanner, Monzo, Ocado, Boohoo use keyword matching. If the job ad mentions dbt + Looker and you have it, write exactly those words. Not "building transformations" — "building dbt models".',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'hr-manager',
    functie: 'HR Manager',
    title: 'CV Example: HR Manager / Adviser',
    description:
      'CV example for HR managers and HR advisers. With tips on employee engagement, ATS tooling and progression from HR Generalist to Manager.',
    templateId: 'modern',
    colorSchemeId: 'violet',
    cv: buildExampleCV({
      firstName: 'Victoria',
      lastName: 'Clarkson',
      email: 'victoria.clarkson@example.co.uk',
      phone: '+44 7700 556677',
      city: 'Birmingham',
      linkedIn: 'linkedin.com/in/victoriaclarkson',
      summary:
        'CIPD-qualified HR Manager with 9 years of experience in scale-ups and mid-market (50-400 FTE) in tech and healthcare. Owner of the entire HR cycle at Mendix UK: recruitment, onboarding, performance, comp & ben and exit. Reduced employee turnover from 18% to 11% over 18 months through a structured onboarding programme and quarterly check-ins.',
      experiences: [
        {
          jobTitle: 'HR Manager UK',
          company: 'Mendix (Siemens)',
          location: 'Birmingham',
          startDate: '2022-01',
          current: true,
          description: 'Responsible for the UK organisation (180 FTE). Reporting directly to the VP People.',
          tasks: [
            'Reduced employee turnover from 18% to 11% over 18 months through onboarding redesign and quarterly 1:1 cycle.',
            'Implemented Workday (BambooHR migration); on-time delivery of 4-month project with 0 data issues.',
            'Manager of 2 HR Business Partners and 1 People Ops Specialist.',
          ],
        },
        {
          jobTitle: 'HR Business Partner',
          company: 'Bupa',
          location: 'Salford',
          startDate: '2017-04',
          endDate: '2021-12',
          description: 'Healthcare organisation with 1,200 FTE across 8 sites.',
          tasks: [
            'Primary HR point of contact for 3 clinical departments (240 FTE).',
            'Led union consultations with RCN; brought 11 points to resolution in 2020.',
          ],
        },
      ],
      educations: [
        {
          degree: 'CIPD Level 7 Advanced Diploma in Human Resource Management',
          institution: 'Aston University',
          location: 'Birmingham',
          startDate: '2015-09',
          endDate: '2017-08',
        },
      ],
      skills: ['Workday', 'BambooHR', 'Greenhouse ATS', 'TUPE / consultation', 'UK employment law (intermediate)', 'Performance management', 'CIPD Level 7'],
      template: 'modern',
      colorScheme: 'violet',
    }),
    advice: [
      {
        heading: 'Scope: headcount and sector first',
        body:
          'HR recruiters at British Airways, BT, AstraZeneca and Aviva screen immediately on organisation size (50? 500? 5,000?) and sector-specific employment frameworks. Put the scope on line 1: "HR Manager for UK organisation of 180 FTE" beats "Experienced HR professional".',
      },
      {
        heading: 'Tooling — Workday is the green flag',
        body:
          'Workday, SuccessFactors, BambooHR, Greenhouse, Lever, Personio — state which tools you actively manage. For enterprise roles (Lloyds, BT, NHS) Workday experience is often a filter. Avoid vague "HRIS experience".',
      },
      {
        heading: 'Measurable HR impact carries weight',
        body:
          'Turnover reduced, time-to-hire reduced, eNPS up, sickness absence below sector average — every data point counts. "Reduced employee turnover from 18% to 11% over 18 months" is an interview trigger.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    functie: 'Care Assistant',
    title: 'CV Example: Senior Care Assistant',
    description:
      'CV example for care assistants and senior carers. For nursing homes, domiciliary care and learning-disability services. With tips on care qualifications and CQC.',
    templateId: 'zakelijk',
    colorSchemeId: 'blue',
    cv: buildExampleCV({
      firstName: 'Naomi',
      lastName: 'Sanders',
      email: 'naomi.sanders@example.co.uk',
      phone: '+44 7700 667788',
      city: 'Glasgow',
      summary:
        'NVQ Level 3 Senior Carer with 11 years of experience in dementia care and long-term care at Barchester Healthcare and Care UK. Lead carer for 8 residents with dementia. Mentor for Level 2 health and social care apprentices — supervised 12 apprentices over the last 5 years, all passed.',
      experiences: [
        {
          jobTitle: 'Senior Carer — Dementia Unit',
          company: 'Barchester Healthcare',
          location: 'Glasgow',
          startDate: '2019-08',
          current: true,
          description: 'Care home for people with dementia. Small-scale residential unit of 8 residents.',
          tasks: [
            'Lead carer for 8 residents: writing and reviewing care plans, primary contact for families.',
            'Mentor for Level 2 health and social care apprentices; 12 apprentices supervised over the last 5 years (100% pass rate).',
            'Member of the falls-prevention quality committee; revised falls protocol in 2023.',
          ],
        },
        {
          jobTitle: 'Care Assistant',
          company: 'Care UK',
          location: 'Edinburgh',
          startDate: '2014-01',
          endDate: '2019-07',
          description: 'Learning-disability service for adults with moderate to severe needs.',
          tasks: [
            'Personal care and daily support for 6 residents with moderate to severe learning disabilities.',
            'Coordination of weekend outings and family visits.',
          ],
        },
      ],
      educations: [
        {
          degree: 'NVQ Level 3 Diploma in Health and Social Care (Adults)',
          institution: 'Glasgow Kelvin College',
          location: 'Glasgow',
          startDate: '2011-09',
          endDate: '2013-12',
        },
      ],
      skills: ['NVQ Level 3', 'Lead Carer / Senior Carer', 'Apprentice mentoring', 'Dementia care', 'Person Centred Software', 'Behaviours that challenge', 'Falls risk assessment'],
      template: 'zakelijk',
      colorScheme: 'blue',
    }),
    advice: [
      {
        heading: 'Qualification + level + care setting on line 1',
        body:
          'Care providers filter on: care qualification (NVQ 2 / 3, Level 3 Diploma), level (Care Assistant / Senior Carer / Team Leader), and care setting (dementia / nursing / learning disability / domiciliary). Put that combination on the first line. Stating a Senior Carer / Lead Carer role immediately signals seniority.',
      },
      {
        heading: 'Care planning systems explicit',
        body:
          'Person Centred Software, Nourish, Log my Care, KareInn — which systems have you used? For care providers this is a filter — new staff who can work in their system from day 1 are preferred. List it under skills.',
      },
      {
        heading: 'Apprentice mentoring is a differentiator',
        body:
          'Mentoring Level 2 apprentices is a strong status marker — care providers value people who can pass on knowledge. State the number of apprentices supervised and pass rate if you have it.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'designer',
    functie: 'Designer (UX / Graphic)',
    title: 'CV Example: UX Designer / Graphic Designer',
    description:
      'CV example for UX designers and graphic designers. With portfolio links, Figma skills and tips for agency vs in-house applications.',
    templateId: 'creatief',
    colorSchemeId: 'rose',
    cv: buildExampleCV({
      firstName: 'Imogen',
      lastName: 'Harper',
      email: 'imogen.harper@example.co.uk',
      phone: '+44 7700 778899',
      city: 'London',
      linkedIn: 'linkedin.com/in/imogenharper',
      summary:
        'Senior product designer with 6 years of experience in B2C app design at Revolut and Monzo. Specialism in payment flows and onboarding optimisation. Owner of the design system at Revolut since 2023: 80+ components, used by 14 engineers and 4 designers.',
      experiences: [
        {
          jobTitle: 'Senior Product Designer',
          company: 'Revolut',
          location: 'London',
          startDate: '2023-03',
          current: true,
          description: 'Merchant Dashboard team — onboarding and payment configuration flows.',
          tasks: [
            'Owner of the Revolut design system (80+ components in Figma); used by 14 engineers and 4 designers.',
            'Onboarding redesign: merchant sign-up completion rate +24% in the first 6 months.',
            'User research with 12 sole traders; led to simplification of the KYC process.',
          ],
        },
        {
          jobTitle: 'Product Designer',
          company: 'Monzo',
          location: 'London',
          startDate: '2019-09',
          endDate: '2023-02',
          description: 'Mobile app design — focus on investments and split-payments features.',
          tasks: [
            'Lead designer for the Investments feature launch (2021); 60K+ Premium users active in the first year.',
            'Design lead for the redesign of the payment-request flow; conversion +18%.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BA (Hons) Graphic Communication Design',
          institution: 'Central Saint Martins, UAL',
          location: 'London',
          startDate: '2015-09',
          endDate: '2019-06',
        },
      ],
      skills: ['Figma (advanced)', 'Design systems', 'User research', 'Prototyping', 'A/B testing', 'Webflow', 'Fluent English'],
      template: 'creatief',
      colorScheme: 'rose',
    }),
    advice: [
      {
        heading: 'Portfolio link in your profile and per project',
        body:
          'Design recruiters click through to your portfolio within 5 seconds. Put that URL prominently in the header of your CV and link to specific cases from relevant experience bullets. Avoid generic portfolios with "everything on them"; recruiters want 3-5 cases that are relevant to the role you\'re applying for.',
      },
      {
        heading: 'Specialism + tool stack',
        body:
          'B2C app design is not B2B SaaS design is not branding. Specify where you are strong. Tool stack explicit: Figma + Webflow + Notion / Maze / Hotjar. Design systems experience is a filter for enterprise roles (BT, Sky, Barclays Design).',
      },
      {
        heading: 'Measurable impact: conversion, completion, retention',
        body:
          'Senior designers are judged on business impact, not just output. "Onboarding redesign: completion rate +24% in the first 6 months" is an interview trigger. Mention user-research numbers (number of interviews, NPS changes).',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'financieel-medewerker',
    functie: 'Finance Assistant',
    title: 'CV Example: Finance Assistant / Bookkeeper',
    description:
      'CV example for finance assistants, bookkeepers and finance support staff. With software tooling and progression to financial controller.',
    templateId: 'zakelijk',
    colorSchemeId: 'slate',
    cv: buildExampleCV({
      firstName: 'Bethany',
      lastName: 'Sutton',
      email: 'bethany.sutton@example.co.uk',
      phone: '+44 7700 889900',
      city: 'Birmingham',
      summary:
        'All-round finance assistant with 8 years of experience at SMEs (turnover £5-50M) in manufacturing and wholesale. Responsible for the full accounts receivable and payable function, VAT returns and supporting the year-end close. Xero and Sage 50 superuser.',
      experiences: [
        {
          jobTitle: 'Finance Assistant',
          company: 'Aston Manor Brewery',
          location: 'Birmingham',
          startDate: '2020-06',
          current: true,
          description: 'Family-owned brewery. Part of the 6-person finance team.',
          tasks: [
            'Full processing of accounts receivable and payable (average 800 invoices per month).',
            'Monthly VAT returns and quarterly EC Sales List filings.',
            'Supporting year-end close alongside external auditors (Deloitte Birmingham).',
            'Implementation of Basware automatic invoice processing; reduced manual bookkeeping by 60%.',
          ],
        },
        {
          jobTitle: 'Accounts Administrator',
          company: 'Sutton Wholesale Ltd',
          location: 'Birmingham',
          startDate: '2016-02',
          endDate: '2020-05',
          description: 'Family business in technical wholesale; turnover £18M.',
          tasks: [
            'Processing of incoming and outgoing invoices, bank reconciliations, petty cash.',
            'Preparation of monthly management reports for the directors.',
          ],
        },
      ],
      educations: [
        {
          degree: 'AAT Level 4 Diploma in Accounting',
          institution: 'BMet Birmingham',
          location: 'Birmingham',
          startDate: '2012-09',
          endDate: '2016-01',
        },
      ],
      skills: ['Xero', 'Sage 50', 'Basware', 'QuickBooks', 'VAT returns', 'EC Sales List', 'Microsoft Excel (advanced)'],
      template: 'zakelijk',
      colorScheme: 'slate',
    }),
    advice: [
      {
        heading: 'Software stack explicit',
        body:
          'SMEs and accountancy firms screen finance CVs for tool experience: Xero, Sage 50/200, QuickBooks, FreeAgent, Pandle. State which ones you actively use. For accountancy firms: a bonus is Caseware (audit tool) or IRIS practice software.',
      },
      {
        heading: 'Scope: turnover, invoice volume, sector',
        body:
          'A finance assistant at a £5M turnover SME is very different from one at £50M. Specify scale: average invoices per month, company turnover (if public), or sector. "800 invoices per month" is concrete.',
      },
      {
        heading: 'Automation / process improvement stands out',
        body:
          'Many finance people do routine work; someone who initiates process improvement (Basware implementation, automated bank feeds, invoice OCR) immediately stands out. "60% reduction in manual bookkeeping" is an interview trigger for controller-track conversations.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'klantenservice-medewerker',
    functie: 'Customer Service Advisor',
    title: 'CV Example: Customer Service Advisor',
    description:
      'CV example for customer service advisors in contact centres, e-commerce and B2B. With First-Contact-Resolution, CSAT figures and progression tips.',
    templateId: 'minimalist',
    colorSchemeId: 'teal',
    cv: buildExampleCV({
      firstName: 'Adam',
      lastName: 'Mansoor',
      email: 'adam.mansoor@example.co.uk',
      phone: '+44 7700 990011',
      city: 'Leeds',
      summary:
        'Customer service advisor with 5 years of experience in e-commerce and telecoms. At Currys: top 5% First-Contact-Resolution score over 2024 and NPS 9.2 (team average 8.4). Floor coach for new colleagues during their first 4 weeks on the phones.',
      experiences: [
        {
          jobTitle: 'Senior Customer Service Advisor / Coach',
          company: 'Currys',
          location: 'Sheffield',
          startDate: '2022-08',
          current: true,
          description: 'Webcare and telephony team for the Small Domestic Appliances department.',
          tasks: [
            'First-Contact-Resolution rate 76% (team average 68%); top 5% of a 220-person department.',
            'NPS 9.2 over 2024 (team average 8.4); part of the top 10 for customer satisfaction in Q4.',
            'Floor coach for new colleagues during their first 4 weeks on the phones; 14 colleagues onboarded.',
          ],
        },
        {
          jobTitle: 'Customer Service Advisor',
          company: 'BT',
          location: 'Leeds',
          startDate: '2020-03',
          endDate: '2022-07',
          description: 'Inbound team for mobile and broadband subscriptions.',
          tasks: [
            'Processing inbound calls for product queries, billing and faults.',
            'Identifying upsell opportunities within existing subscriptions.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BTEC Level 3 Diploma in Business',
          institution: 'Leeds City College',
          location: 'Leeds',
          startDate: '2016-09',
          endDate: '2020-02',
        },
      ],
      skills: ['Zendesk', 'Salesforce Service Cloud', 'Webcare (Twitter/Instagram)', 'EN, AR fluent', 'De-escalation techniques', 'Conflict resolution'],
      template: 'minimalist',
      colorScheme: 'teal',
    }),
    advice: [
      {
        heading: 'Performance figures are THE currency',
        body:
          'Customer service is a measurable field: FCR (First-Contact-Resolution), CSAT, NPS, AHT (Average Handle Time), average calls per shift. State the measurable figures you had. "NPS 9.2 vs team average 8.4" is far stronger than "customer-focused".',
      },
      {
        heading: 'Software stack and channels',
        body:
          'Zendesk, Salesforce Service Cloud, Freshdesk, Intercom — which CRM/ticketing system have you used? Phone, chat, webcare (Twitter/Instagram), email? Employers like Currys, John Lewis, BT and Sky want to know whether you can be productive on day one.',
      },
      {
        heading: 'Coaching demonstrates leadership',
        body:
          'Many customer-service advisors take on floor-coach responsibility after 1-2 years. State it concretely ("14 new colleagues onboarded"). For team-leader trajectories this is the most decisive signal.',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'recruiter',
    functie: 'Recruiter / Talent Acquisition',
    title: 'CV Example: Recruiter / Talent Acquisition',
    description:
      'CV example for in-house and agency recruiters. With time-to-hire metrics, ATS tooling and tips for switching between agency and corporate.',
    templateId: 'modern',
    colorSchemeId: 'emerald',
    cv: buildExampleCV({
      firstName: 'Megan',
      lastName: 'Donovan',
      email: 'megan.donovan@example.co.uk',
      phone: '+44 7700 001122',
      city: 'London',
      linkedIn: 'linkedin.com/in/megandonovan',
      summary:
        'Tech recruiter with 5 years of experience; 3 at agency Hays and 2 in-house at Skyscanner. Specialism in senior software engineers and data professionals. 2024: 38 hires delivered (target 30), average time-to-hire 28 days (department average 41).',
      experiences: [
        {
          jobTitle: 'Senior Talent Acquisition Partner',
          company: 'Skyscanner',
          location: 'London',
          startDate: '2023-04',
          current: true,
          description: 'Tech recruitment, focus on senior engineering and data roles.',
          tasks: [
            '38 hires delivered in 2024 (target 30); time-to-hire 28 days (department average 41).',
            'Hiring manager partnership for 4 engineering teams; weekly intake and calibration sessions.',
            'Ownership of UK employer branding collaboration with the marketing department.',
          ],
        },
        {
          jobTitle: 'Recruiter',
          company: 'Hays',
          location: 'London',
          startDate: '2020-09',
          endDate: '2023-03',
          description: 'Tech recruitment agency. Own client portfolio of 12 corporate accounts.',
          tasks: [
            'Own portfolio of 12 corporate accounts (average £1.6M annual revenue).',
            'Q4 2022: #1 on the UK Tech leaderboard with 31 placements.',
          ],
        },
      ],
      educations: [
        {
          degree: 'BA (Hons) Human Resource Management',
          institution: 'University of Westminster',
          location: 'London',
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
        heading: 'Time-to-hire and placement numbers are your quota',
        body:
          'Recruitment is a measurable field. Time-to-hire, placement count, offer-acceptance rate, candidate NPS. Write the numbers exactly: "38 hires in 2024 (target 30); time-to-hire 28 days (department average 41)". This is how TA leaders rank you.',
      },
      {
        heading: 'ATS tooling and sourcing stack',
        body:
          'Which ATS have you actively used? Greenhouse, Workable, SmartRecruiters, Recruitee, Lever. Which sourcing tools? LinkedIn Recruiter, Hiretual/SeekOut, GitHub search for tech, Boolean for LinkedIn Free. For in-house corporate roles this is a filter.',
      },
      {
        heading: 'Sector specialism and seniority',
        body:
          'Tech recruiter, finance recruiter, healthcare recruiter — niche specialism carries weight. State which type of roles and which skills/stacks you actively recruit for. "Senior software engineers Java/Go" is stronger than "tech roles".',
      },
    ],
  },
];

export default EXAMPLES_EN;
export const EXAMPLE_BY_SLUG_EN: Record<string, FunctieExample> = Object.fromEntries(
  EXAMPLES_EN.map((e) => [e.slug, e])
);
export const EXAMPLE_SLUGS_EN = EXAMPLES_EN.map((e) => e.slug);
