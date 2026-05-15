import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { CVData, Experience } from '@/types/cv';
import { getAnthropic, MODEL } from './anthropic';
import {
  PROFILE_GENERATOR_SYSTEM,
  BULLET_IMPROVER_SYSTEM,
  VACANCY_MATCH_SYSTEM,
} from './prompts';

// ──────────────────────────────────────────────────────────────────
// Profile generator

export interface GenerateProfileInput {
  experience: Experience[];
  education: CVData['education'];
  skills: CVData['skills'];
}

export interface GenerateProfileResult {
  profile: string;
  usage: { input: number; cached: number; output: number };
}

export async function generateProfile(
  input: GenerateProfileInput
): Promise<GenerateProfileResult> {
  const client = getAnthropic();

  // Compact CV summary for the prompt — keep it tight to maximize signal
  const experienceSummary = input.experience.slice(0, 6).map((e) => ({
    role: e.jobTitle,
    company: e.company,
    period: `${e.startDate}${e.current ? ' — heden' : e.endDate ? ` — ${e.endDate}` : ''}`,
    description: e.description,
    tasks: e.tasks.slice(0, 4),
  }));

  const educationSummary = input.education.slice(0, 3).map((e) => ({
    degree: e.degree,
    institution: e.institution,
    period: `${e.startDate} — ${e.current ? 'heden' : e.endDate}`,
  }));

  const skillsSummary = input.skills.slice(0, 15).map((s) => s.name);

  const userMessage = `Schrijf de profielsamenvatting voor deze CV.

# Werkervaring
${JSON.stringify(experienceSummary, null, 2)}

# Opleiding
${JSON.stringify(educationSummary, null, 2)}

# Skills
${skillsSummary.join(', ')}

Output: alleen de 2-3 zinnen profieltekst.`;

  const response = await client.messages.create({
    model: MODEL.fast,
    max_tokens: 400,
    system: [
      {
        type: 'text',
        text: PROFILE_GENERATOR_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
    // Strip stray quotes if the model wrapped output
    .replace(/^["']+|["']+$/g, '')
    .trim();

  return {
    profile: text,
    usage: {
      input: response.usage.input_tokens,
      cached: response.usage.cache_read_input_tokens ?? 0,
      output: response.usage.output_tokens,
    },
  };
}

// ──────────────────────────────────────────────────────────────────
// Bullet improver

export interface ImproveBulletInput {
  bullet: string;
  jobTitle: string;
  company: string;
  description?: string;
}

export interface ImproveBulletResult {
  bullet: string;
  usage: { input: number; cached: number; output: number };
}

export async function improveBullet(input: ImproveBulletInput): Promise<ImproveBulletResult> {
  const client = getAnthropic();
  const userMessage = `Origineel: ${input.bullet}
Context: ${input.jobTitle}${input.company ? ` bij ${input.company}` : ''}${input.description ? ` — ${input.description}` : ''}

Herschrijf de bullet.`;

  const response = await client.messages.create({
    model: MODEL.fast,
    max_tokens: 200,
    system: [
      {
        type: 'text',
        text: BULLET_IMPROVER_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
    .replace(/^["']+|["']+$/g, '')
    .replace(/^[•\-\*]\s*/, '')
    .trim();

  return {
    bullet: text,
    usage: {
      input: response.usage.input_tokens,
      cached: response.usage.cache_read_input_tokens ?? 0,
      output: response.usage.output_tokens,
    },
  };
}

// ──────────────────────────────────────────────────────────────────
// Vacancy match — structured output via JSON schema

export interface VacancyMatchInput {
  cvData: CVData;
  vacancyText: string;
}

export interface BulletSuggestion {
  experienceIndex: number;
  originalBullet: string | null;
  suggestedBullet: string;
  reason: string;
}

export interface VacancyMatchResult {
  matchScore: number;
  gradeReason: string;
  missingKeywords: string[];
  profileSuggestion: string;
  bulletSuggestions: BulletSuggestion[];
  overallAdvice: string;
  usage: { input: number; cached: number; output: number };
}

const MATCH_SCHEMA = {
  type: 'object',
  properties: {
    matchScore: { type: 'integer', description: '0-100 score' },
    gradeReason: { type: 'string' },
    missingKeywords: { type: 'array', items: { type: 'string' } },
    profileSuggestion: { type: 'string' },
    bulletSuggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          experienceIndex: { type: 'integer' },
          originalBullet: { type: ['string', 'null'] },
          suggestedBullet: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['experienceIndex', 'originalBullet', 'suggestedBullet', 'reason'],
        additionalProperties: false,
      },
    },
    overallAdvice: { type: 'string' },
  },
  required: [
    'matchScore',
    'gradeReason',
    'missingKeywords',
    'profileSuggestion',
    'bulletSuggestions',
    'overallAdvice',
  ],
  additionalProperties: false,
} as const;

export async function matchVacancy(input: VacancyMatchInput): Promise<VacancyMatchResult> {
  const client = getAnthropic();

  const cvSummary = {
    profile: input.cvData.profile?.summary ?? '',
    experience: input.cvData.experience.map((e, i) => ({
      index: i,
      jobTitle: e.jobTitle,
      company: e.company,
      period: `${e.startDate}${e.current ? ' — heden' : e.endDate ? ` — ${e.endDate}` : ''}`,
      description: e.description,
      tasks: e.tasks,
    })),
    education: input.cvData.education.map((e) => ({
      degree: e.degree,
      institution: e.institution,
    })),
    skills: input.cvData.skills.map((s) => s.name),
  };

  const truncatedVacancy = input.vacancyText.slice(0, 8000);

  const userMessage = `# CV
${JSON.stringify(cvSummary, null, 2)}

# Vacaturetekst
${truncatedVacancy}

Analyseer en geef je gestructureerde JSON-output.`;

  const response = await client.messages.create({
    model: MODEL.smart,
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: {
        type: 'json_schema',
        schema: MATCH_SCHEMA,
      },
    },
    system: [
      {
        type: 'text',
        text: VACANCY_MATCH_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: Omit<VacancyMatchResult, 'usage'>;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Kon de AI-respons niet als JSON parsen: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return {
    ...parsed,
    usage: {
      input: response.usage.input_tokens,
      cached: response.usage.cache_read_input_tokens ?? 0,
      output: response.usage.output_tokens,
    },
  };
}
