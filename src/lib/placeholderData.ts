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

// Check if a section has been "started" (user has entered any data)
function isPersonalSectionStarted(cvData: CVData): boolean {
  const p = cvData.personal;
  return hasUserData(p.firstName) || hasUserData(p.lastName) || hasUserData(p.email) ||
         hasUserData(p.phone) || hasUserData(p.address) || hasUserData(p.city) ||
         hasUserData(p.postalCode) || hasUserData(p.houseNumber);
}

// Get merged data - shows placeholders for untouched sections, hides empty optional fields in started sections
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
  // Check if sections have been started
  const personalStarted = isPersonalSectionStarted(cvData);
  const profileStarted = hasUserData(cvData.profile.summary);
  const experienceStarted = hasUserArrayData(cvData.experience);
  const educationStarted = hasUserArrayData(cvData.education);
  const skillsStarted = hasUserArrayData(cvData.skills);

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
    summary: !profileStarted,
    experience: !experienceStarted,
    education: !educationStarted,
    skills: !skillsStarted,
  };

  // For personal section: if not started, show all placeholders. If started, only show user data.
  const getPersonalValue = (userValue: string | undefined | null, placeholderValue: string): string => {
    if (hasUserData(userValue)) return userValue!;
    if (!personalStarted) return placeholderValue; // Show placeholder if section not started
    return ''; // Hide if section started but field empty
  };

  const mergedData: CVData = {
    ...cvData,
    personal: {
      ...cvData.personal,
      firstName: getPersonalValue(cvData.personal.firstName, placeholderData.personal.firstName),
      lastName: getPersonalValue(cvData.personal.lastName, placeholderData.personal.lastName),
      email: getPersonalValue(cvData.personal.email, placeholderData.personal.email),
      phone: getPersonalValue(cvData.personal.phone, placeholderData.personal.phone),
      address: getPersonalValue(cvData.personal.address, placeholderData.personal.address),
      city: getPersonalValue(cvData.personal.city, placeholderData.personal.city),
      linkedIn: getPersonalValue(cvData.personal.linkedIn, placeholderData.personal.linkedIn),
      website: getPersonalValue(cvData.personal.website, placeholderData.personal.website),
      dateOfBirth: getPersonalValue(cvData.personal.dateOfBirth, placeholderData.personal.dateOfBirth),
      profilePhoto: cvData.personal.profilePhoto, // Don't use placeholder photo
    },
    profile: {
      // If profile not started, show placeholder. If started, show user data.
      summary: profileStarted ? cvData.profile.summary : placeholderData.profile.summary,
    },
    // Experience, education, skills - show placeholders if not started, otherwise show user data
    experience: experienceStarted ? cvData.experience : placeholderData.experience,
    education: educationStarted ? cvData.education : placeholderData.education,
    skills: skillsStarted ? cvData.skills : placeholderData.skills,
  };

  return { data: mergedData, isPlaceholder };
}
