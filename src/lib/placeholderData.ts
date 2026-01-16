import { CVData, Experience, Education, Skill } from '@/types/cv';

// Placeholder data for when the user hasn't entered their own information
export const placeholderData = {
  personal: {
    firstName: 'Jan',
    lastName: 'de Vries',
    email: 'jan.devries@email.nl',
    phone: '06-12345678',
    address: 'Voorbeeldstraat 123',
    city: 'Amsterdam',
    postalCode: '1012 AB',
    dateOfBirth: '15-03-1990',
    nationality: 'Nederlands',
    linkedIn: 'linkedin.com/in/jandevries',
    website: 'jandevries.nl',
  },
  profile: {
    summary: 'Ervaren professional met een passie voor het behalen van resultaten. Sterke communicatieve vaardigheden en een bewezen track record in het leiden van projecten en teams.',
  },
  experience: [
    {
      id: 'placeholder-1',
      jobTitle: 'Senior Consultant',
      company: 'Voorbeeldbedrijf BV',
      location: 'Amsterdam',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Verantwoordelijk voor het adviseren van klanten over strategische vraagstukken.',
      tasks: [
        'Leiden van projectteams van 5-10 personen',
        'Ontwikkelen van strategische adviezen',
        'Onderhouden van klantrelaties',
      ],
    },
    {
      id: 'placeholder-2',
      jobTitle: 'Consultant',
      company: 'Ander Bedrijf',
      location: 'Rotterdam',
      startDate: '2017-06',
      endDate: '2019-12',
      current: false,
      description: 'Uitvoeren van analyses en ondersteunen van senior consultants.',
      tasks: [
        'Uitvoeren van marktonderzoek',
        'Opstellen van rapportages',
      ],
    },
  ] as Experience[],
  education: [
    {
      id: 'placeholder-edu-1',
      degree: 'Master Bedrijfskunde',
      institution: 'Universiteit van Amsterdam',
      location: 'Amsterdam',
      startDate: '2015-09',
      endDate: '2017-06',
      current: false,
      description: 'Afgestudeerd met specialisatie in Strategie & Organisatie',
    },
    {
      id: 'placeholder-edu-2',
      degree: 'Bachelor Economie',
      institution: 'Hogeschool Rotterdam',
      location: 'Rotterdam',
      startDate: '2012-09',
      endDate: '2015-06',
      current: false,
      description: '',
    },
  ] as Education[],
  skills: [
    { id: 'placeholder-skill-1', name: 'Projectmanagement', level: 'expert', category: '' },
    { id: 'placeholder-skill-2', name: 'Communicatie', level: 'expert', category: '' },
    { id: 'placeholder-skill-3', name: 'Microsoft Office', level: 'gevorderd', category: '' },
    { id: 'placeholder-skill-4', name: 'Data-analyse', level: 'gevorderd', category: '' },
    { id: 'placeholder-skill-5', name: 'Presenteren', level: 'expert', category: '' },
  ] as Skill[],
};

// Helper to check if a string field has user data
export function hasUserData(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

// Helper to check if an array has user data
export function hasUserArrayData<T extends { id: string }>(arr: T[] | undefined | null): boolean {
  if (!arr || arr.length === 0) return false;
  // Check if any item has a non-placeholder ID
  return arr.some(item => !item.id.startsWith('placeholder-'));
}

// Get display value - returns user value or placeholder
export function getDisplayValue(userValue: string | undefined | null, placeholderValue: string): string {
  return hasUserData(userValue) ? userValue! : placeholderValue;
}

// Check if the CV has any real user data
export function hasAnyCVData(cvData: CVData): boolean {
  const { personal, profile, experience, education, skills } = cvData;

  return (
    hasUserData(personal.firstName) ||
    hasUserData(personal.lastName) ||
    hasUserData(personal.email) ||
    hasUserData(personal.phone) ||
    hasUserData(personal.city) ||
    hasUserData(profile.summary) ||
    hasUserArrayData(experience) ||
    hasUserArrayData(education) ||
    hasUserArrayData(skills)
  );
}

// Get merged data - uses user data where available, placeholder where not
export function getMergedCVData(cvData: CVData): {
  data: CVData;
  isPlaceholder: {
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    city: boolean;
    linkedIn: boolean;
    website: boolean;
    dateOfBirth: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
} {
  const isPlaceholder = {
    firstName: !hasUserData(cvData.personal.firstName),
    lastName: !hasUserData(cvData.personal.lastName),
    email: !hasUserData(cvData.personal.email),
    phone: !hasUserData(cvData.personal.phone),
    address: !hasUserData(cvData.personal.address),
    city: !hasUserData(cvData.personal.city),
    linkedIn: !hasUserData(cvData.personal.linkedIn),
    website: !hasUserData(cvData.personal.website),
    dateOfBirth: !hasUserData(cvData.personal.dateOfBirth),
    summary: !hasUserData(cvData.profile.summary),
    experience: !hasUserArrayData(cvData.experience),
    education: !hasUserArrayData(cvData.education),
    skills: !hasUserArrayData(cvData.skills),
  };

  const mergedData: CVData = {
    ...cvData,
    personal: {
      ...cvData.personal,
      firstName: getDisplayValue(cvData.personal.firstName, placeholderData.personal.firstName),
      lastName: getDisplayValue(cvData.personal.lastName, placeholderData.personal.lastName),
      email: getDisplayValue(cvData.personal.email, placeholderData.personal.email),
      phone: getDisplayValue(cvData.personal.phone, placeholderData.personal.phone),
      address: getDisplayValue(cvData.personal.address, placeholderData.personal.address),
      city: getDisplayValue(cvData.personal.city, placeholderData.personal.city),
      linkedIn: getDisplayValue(cvData.personal.linkedIn, placeholderData.personal.linkedIn),
      website: getDisplayValue(cvData.personal.website, placeholderData.personal.website),
      dateOfBirth: getDisplayValue(cvData.personal.dateOfBirth, placeholderData.personal.dateOfBirth),
      profilePhoto: cvData.personal.profilePhoto, // Don't use placeholder photo
    },
    profile: {
      summary: getDisplayValue(cvData.profile.summary, placeholderData.profile.summary),
    },
    experience: hasUserArrayData(cvData.experience) ? cvData.experience : placeholderData.experience,
    education: hasUserArrayData(cvData.education) ? cvData.education : placeholderData.education,
    skills: hasUserArrayData(cvData.skills) ? cvData.skills : placeholderData.skills,
  };

  return { data: mergedData, isPlaceholder };
}
