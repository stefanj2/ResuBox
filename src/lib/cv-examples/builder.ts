import { CVData, TemplateId, ColorSchemeId } from '@/types/cv';

interface CompactExperience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  tasks: string[];
}

interface CompactEducation {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface BuildArgs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  linkedIn?: string;
  summary: string;
  experiences: CompactExperience[];
  educations: CompactEducation[];
  skills: string[];
  template: TemplateId;
  colorScheme: ColorSchemeId;
}

export function buildExampleCV(args: BuildArgs): CVData {
  const now = new Date('2026-01-01').toISOString();
  return {
    id: `example-${args.firstName}-${args.lastName}`.toLowerCase(),
    createdAt: now,
    updatedAt: now,
    personal: {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      address: '',
      houseNumber: '',
      city: args.city,
      postalCode: '',
      dateOfBirth: '',
      nationality: '',
      linkedIn: args.linkedIn ?? '',
      website: '',
      profilePhoto: '',
    },
    profile: { summary: args.summary },
    experience: args.experiences.map((e, i) => ({
      id: `exp-${i}`,
      jobTitle: e.jobTitle,
      company: e.company,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate ?? '',
      current: e.current ?? false,
      description: e.description,
      tasks: e.tasks,
    })),
    education: args.educations.map((e, i) => ({
      id: `edu-${i}`,
      degree: e.degree,
      institution: e.institution,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: false,
      description: e.description ?? '',
    })),
    skills: args.skills.map((name, i) => ({
      id: `skill-${i}`,
      name,
      level: 'gevorderd' as const,
      category: '',
    })),
    meta: {
      isPaid: false,
      paidAt: '',
      invoiceId: '',
      magicLinkToken: '',
      magicLinkSentAt: '',
      magicLinkConfirmed: false,
      selectedTemplate: args.template,
      selectedColorScheme: args.colorScheme,
    },
  };
}
