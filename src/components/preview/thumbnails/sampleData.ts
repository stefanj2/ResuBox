import { CVData } from '@/types/cv';

// Professional placeholder photo - using a reliable avatar service
const sampleProfilePhoto = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face";

const baseMeta = {
  isPaid: false,
  paidAt: '',
  invoiceId: '',
  magicLinkToken: '',
  magicLinkSentAt: '',
  magicLinkConfirmed: false,
  selectedTemplate: 'modern' as const,
  selectedColorScheme: 'emerald' as const,
};

const nlSample: CVData = {
  id: 'sample-nl',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    firstName: 'Anna',
    lastName: 'de Vries',
    email: 'anna.devries@email.nl',
    phone: '06-12345678',
    address: 'Hoofdstraat',
    houseNumber: '123',
    city: 'Amsterdam',
    postalCode: '1012 AB',
    dateOfBirth: '15-03-1990',
    nationality: 'Nederlands',
    linkedIn: 'linkedin.com/in/annadevries',
    website: 'annadevries.nl',
    profilePhoto: sampleProfilePhoto,
  },
  profile: {
    summary: 'Enthousiaste en resultaatgerichte professional met 5+ jaar ervaring in projectmanagement en teamleiding. Sterk in het optimaliseren van processen en het behalen van doelstellingen.',
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Projectmanager',
      company: 'Tech Solutions BV',
      location: 'Amsterdam',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Verantwoordelijk voor het leiden van cross-functionele teams.',
      tasks: ['Leiding geven aan een team van 8 ontwikkelaars', 'Beheren van projectbudgetten tot €500K'],
    },
    {
      id: '2',
      jobTitle: 'Projectmanager',
      company: 'Digital Agency',
      location: 'Rotterdam',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Coördineren van webontwikkeling projecten.',
      tasks: ['Succesvolle oplevering van 15+ projecten'],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Master Bedrijfskunde',
      institution: 'Universiteit van Amsterdam',
      location: 'Amsterdam',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      description: 'Specialisatie in Digital Business & Innovation',
    },
  ],
  skills: [
    { id: '1', name: 'Projectmanagement', level: 'expert', category: '' },
    { id: '2', name: 'Agile/Scrum', level: 'gevorderd', category: '' },
    { id: '3', name: 'Stakeholder Management', level: 'expert', category: '' },
    { id: '4', name: 'Budgetbeheer', level: 'gevorderd', category: '' },
  ],
  meta: { ...baseMeta, locale: 'nl' },
};

const enSample: CVData = {
  ...nlSample,
  id: 'sample-en',
  personal: {
    ...nlSample.personal,
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@email.co.uk',
    phone: '+44 7700 900123',
    address: 'High Street',
    houseNumber: '42',
    city: 'London',
    postalCode: 'SW1A 1AA',
    nationality: 'British',
    linkedIn: 'linkedin.com/in/emmathompson',
    website: 'emmathompson.co.uk',
  },
  profile: {
    summary: 'Enthusiastic, results-driven professional with 5+ years of experience in project management and team leadership. Strong in process optimisation and delivering against objectives.',
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Project Manager',
      company: 'Tech Solutions Ltd',
      location: 'London',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Leading cross-functional teams across multiple product lines.',
      tasks: ['Leading a team of 8 engineers', 'Managing project budgets up to £500K'],
    },
    {
      id: '2',
      jobTitle: 'Project Manager',
      company: 'Digital Agency',
      location: 'Manchester',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Coordinating web development projects.',
      tasks: ['Successfully delivered 15+ projects on time and budget'],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'MSc Business Administration',
      institution: 'University of London',
      location: 'London',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      description: 'Specialisation in Digital Business & Innovation',
    },
  ],
  skills: [
    { id: '1', name: 'Project management', level: 'expert', category: '' },
    { id: '2', name: 'Agile/Scrum', level: 'gevorderd', category: '' },
    { id: '3', name: 'Stakeholder management', level: 'expert', category: '' },
    { id: '4', name: 'Budget management', level: 'gevorderd', category: '' },
  ],
  meta: { ...baseMeta, locale: 'en' },
};

const deSample: CVData = {
  ...nlSample,
  id: 'sample-de',
  personal: {
    ...nlSample.personal,
    firstName: 'Sophie',
    lastName: 'Schäfer',
    email: 'sophie.schaefer@email.de',
    phone: '+49 151 12345678',
    address: 'Hauptstraße',
    houseNumber: '12',
    city: 'München',
    postalCode: '80331',
    nationality: 'Deutsch',
    linkedIn: 'linkedin.com/in/sophieschaefer',
    website: 'sophieschaefer.de',
  },
  profile: {
    summary: 'Engagierte, ergebnisorientierte Fachkraft mit über 5 Jahren Erfahrung in Projektmanagement und Teamleitung. Stark in Prozessoptimierung und Zielerreichung.',
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Projektmanager',
      company: 'Tech Solutions GmbH',
      location: 'München',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Verantwortlich für die Leitung funktionsübergreifender Teams.',
      tasks: ['Führung eines Teams von 8 Entwicklern', 'Verwaltung von Projektbudgets bis 500.000 €'],
    },
    {
      id: '2',
      jobTitle: 'Projektmanager',
      company: 'Digital Agency',
      location: 'Berlin',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Koordination von Webentwicklungsprojekten.',
      tasks: ['Erfolgreiche Lieferung von über 15 Projekten'],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Master Betriebswirtschaftslehre',
      institution: 'LMU München',
      location: 'München',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      description: 'Spezialisierung Digital Business & Innovation',
    },
  ],
  skills: [
    { id: '1', name: 'Projektmanagement', level: 'expert', category: '' },
    { id: '2', name: 'Agile/Scrum', level: 'gevorderd', category: '' },
    { id: '3', name: 'Stakeholder-Management', level: 'expert', category: '' },
    { id: '4', name: 'Budgetverwaltung', level: 'gevorderd', category: '' },
  ],
  meta: { ...baseMeta, locale: 'de' },
};

const svSample: CVData = {
  ...nlSample,
  id: 'sample-sv',
  personal: {
    ...nlSample.personal,
    firstName: 'Anna',
    lastName: 'Lindberg',
    email: 'anna.lindberg@email.se',
    phone: '+46 70 123 45 67',
    address: 'Storgatan',
    houseNumber: '5',
    city: 'Stockholm',
    postalCode: '111 22',
    nationality: 'Svensk',
    linkedIn: 'linkedin.com/in/annalindberg',
    website: 'annalindberg.se',
  },
  profile: {
    summary: 'Driven, resultatinriktad professional med 5+ års erfarenhet av projektledning och teamleadership. Stark inom processoptimering och måluppfyllelse.',
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Projektledare',
      company: 'Tech Solutions AB',
      location: 'Stockholm',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Ansvarig för att leda tvärfunktionella team.',
      tasks: ['Leda ett team om 8 utvecklare', 'Hantera projektbudgetar upp till 5 MSEK'],
    },
    {
      id: '2',
      jobTitle: 'Projektledare',
      company: 'Digital Agency',
      location: 'Göteborg',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Koordinering av webbutvecklingsprojekt.',
      tasks: ['Lyckad leverans av 15+ projekt'],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Civilekonom',
      institution: 'Handelshögskolan i Stockholm',
      location: 'Stockholm',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      description: 'Inriktning Digital Business & Innovation',
    },
  ],
  skills: [
    { id: '1', name: 'Projektledning', level: 'expert', category: '' },
    { id: '2', name: 'Agile/Scrum', level: 'gevorderd', category: '' },
    { id: '3', name: 'Stakeholder-hantering', level: 'expert', category: '' },
    { id: '4', name: 'Budgethantering', level: 'gevorderd', category: '' },
  ],
  meta: { ...baseMeta, locale: 'sv' },
};

const daSample: CVData = {
  ...nlSample,
  id: 'sample-da',
  personal: {
    ...nlSample.personal,
    firstName: 'Sofie',
    lastName: 'Larsen',
    email: 'sofie.larsen@email.dk',
    phone: '+45 22 33 44 55',
    address: 'Hovedgade',
    houseNumber: '7',
    city: 'København',
    postalCode: '1050',
    nationality: 'Dansk',
    linkedIn: 'linkedin.com/in/sofielarsen',
    website: 'sofielarsen.dk',
  },
  profile: {
    summary: 'Engageret, resultatorienteret professionel med 5+ års erfaring i projektledelse og teamledelse. Stærk i procesoptimering og målopfyldelse.',
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Projektleder',
      company: 'Tech Solutions A/S',
      location: 'København',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Ansvarlig for at lede tværfunktionelle teams.',
      tasks: ['Lede et team på 8 udviklere', 'Forvalte projektbudgetter op til 3,5 mio. kr.'],
    },
    {
      id: '2',
      jobTitle: 'Projektleder',
      company: 'Digital Agency',
      location: 'Aarhus',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Koordinering af webudviklingsprojekter.',
      tasks: ['Vellykket levering af 15+ projekter'],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Cand.merc. Erhvervsøkonomi',
      institution: 'Copenhagen Business School',
      location: 'København',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      description: 'Specialisering i Digital Business & Innovation',
    },
  ],
  skills: [
    { id: '1', name: 'Projektledelse', level: 'expert', category: '' },
    { id: '2', name: 'Agile/Scrum', level: 'gevorderd', category: '' },
    { id: '3', name: 'Stakeholder-håndtering', level: 'expert', category: '' },
    { id: '4', name: 'Budgetstyring', level: 'gevorderd', category: '' },
  ],
  meta: { ...baseMeta, locale: 'da' },
};

const SAMPLES: Record<string, CVData> = {
  nl: nlSample,
  en: enSample,
  de: deSample,
  sv: svSample,
  da: daSample,
};

export function getSampleCVData(locale: string = 'nl'): CVData {
  return SAMPLES[locale] ?? SAMPLES.nl;
}

// Back-compat: default export still works for any consumer that doesn't yet
// pass a locale (e.g. server-side PDF generation of the homepage thumbnail).
export const sampleCVData = nlSample;
