// CV Data Types - Uitbreidbare structuur voor de CV Builder

// Template type voor het template systeem
export type TemplateId = 'modern' | 'zakelijk' | 'creatief' | 'minimalist' | 'executive' | 'tech';

// Kleurschema type voor customization
export type ColorSchemeId = 'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'slate' | 'teal' | 'orange';

export interface ColorScheme {
  id: ColorSchemeId;
  name: string;
  primary: string;       // Main accent color (e.g., emerald-600)
  primaryLight: string;  // Lighter variant (e.g., emerald-100)
  primaryDark: string;   // Darker variant (e.g., emerald-800)
  gradient: {
    from: string;
    via?: string;
    to: string;
  };
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  nationality: string;
  linkedIn: string;
  website: string;
  profilePhoto: string;
}

export interface ProfileSummary {
  summary: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  tasks: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export type SkillLevel = 'beginner' | 'gemiddeld' | 'gevorderd' | 'expert';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
}

export interface CVMeta {
  isPaid: boolean;
  paidAt: string;
  invoiceId: string;
  magicLinkToken: string;
  magicLinkSentAt: string;
  magicLinkConfirmed: boolean;
  selectedTemplate: TemplateId;
  selectedColorScheme: ColorSchemeId;
}

export interface CVData {
  id: string;
  createdAt: string;
  updatedAt: string;
  personal: PersonalInfo;
  profile: ProfileSummary;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  meta: CVMeta;
}

// Default/Empty CV Data
export const createEmptyCVData = (): CVData => ({
  id: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    dateOfBirth: '',
    nationality: '',
    linkedIn: '',
    website: '',
    profilePhoto: '',
  },
  profile: {
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
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
});

// Helper om lege ervaring te maken
export const createEmptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  tasks: [],
});

// Helper om lege opleiding te maken
export const createEmptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

// Helper om lege vaardigheid te maken
export const createEmptySkill = (): Skill => ({
  id: crypto.randomUUID(),
  name: '',
  level: 'gemiddeld',
  category: '',
});
