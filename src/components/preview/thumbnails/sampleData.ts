import { CVData } from '@/types/cv';

// Professional placeholder photo - using a reliable avatar service
// This provides a realistic, professional-looking female portrait
const sampleProfilePhoto = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face";

export const sampleCVData: CVData = {
  id: 'sample',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    firstName: 'Anna',
    lastName: 'de Vries',
    email: 'anna.devries@email.nl',
    phone: '06-12345678',
    address: 'Hoofdstraat 123',
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
      tasks: [
        'Leiding geven aan een team van 8 ontwikkelaars',
        'Beheren van projectbudgetten tot €500K',
      ],
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
      tasks: [
        'Succesvolle oplevering van 15+ projecten',
      ],
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
  meta: {
    isPaid: false,
    paidAt: '',
    invoiceId: '',
    magicLinkToken: '',
    magicLinkSentAt: '',
    magicLinkConfirmed: false,
    selectedTemplate: 'modern',
    selectedColorScheme: 'emerald',
  },
};
