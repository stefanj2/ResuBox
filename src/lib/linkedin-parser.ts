import 'server-only';
import { Experience, Education, Skill, createEmptyExperience, createEmptyEducation, createEmptySkill } from '@/types/cv';

/**
 * Parse a LinkedIn "Save to PDF" profile export.
 *
 * LinkedIn's PDF export is well-structured but not stable across years. This
 * parser handles the common 2022-2026 format. Falls back gracefully — partial
 * data is better than nothing; user can edit afterwards.
 */

export interface ParsedLinkedIn {
  personal: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    city?: string;
    linkedIn?: string;
    website?: string;
  };
  profile?: { summary: string };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

// ──────────────────────────────────────────────────────────────────
// Date parsing

const MONTHS_EN: Record<string, string> = {
  january: '01', jan: '01',
  february: '02', feb: '02',
  march: '03', mar: '03',
  april: '04', apr: '04',
  may: '05',
  june: '06', jun: '06',
  july: '07', jul: '07',
  august: '08', aug: '08',
  september: '09', sep: '09', sept: '09',
  october: '10', oct: '10',
  november: '11', nov: '11',
  december: '12', dec: '12',
};

/**
 * Parse "January 2023" or "Jan 2023" or "2023" → "2023-01" / "2023-01"
 * Returns empty string on failure.
 */
function parseMonthYear(input: string): string {
  const m = input.toLowerCase().trim();
  // "Month YYYY"
  const mY = m.match(/^([a-z]+)\.?\s+(\d{4})$/);
  if (mY) {
    const month = MONTHS_EN[mY[1]];
    if (month) return `${mY[2]}-${month}`;
  }
  // "YYYY" alone
  const yOnly = m.match(/^(\d{4})$/);
  if (yOnly) return `${yOnly[1]}-01`;
  return '';
}

/**
 * Parse "Jan 2020 - Present" or "January 2020 — Apr 2023" or "2018 - 2020"
 */
function parseDateRange(input: string): { startDate: string; endDate: string; current: boolean } {
  const cleaned = input.replace(/[—–-]/g, '-').replace(/\s+/g, ' ').trim();
  const parts = cleaned.split('-').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return { startDate: '', endDate: '', current: false };

  const startDate = parseMonthYear(parts[0]);
  const endRaw = parts[1] ?? '';
  const isCurrent = /present|heden|nu|current/i.test(endRaw);
  const endDate = isCurrent ? '' : parseMonthYear(endRaw);
  return { startDate, endDate, current: isCurrent };
}

// ──────────────────────────────────────────────────────────────────
// Personal info

function extractEmail(text: string): string | undefined {
  const m = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return m?.[0];
}

function extractPhone(text: string): string | undefined {
  // Match common formats: +31 6..., 06-..., (06) ..., etc.
  const m = text.match(/(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,3}\)?[\s-]?){2,4}\d{2,4}/);
  return m?.[0]?.trim();
}

function extractLinkedInUrl(text: string): string | undefined {
  const m = text.match(/(?:https?:\/\/)?(?:[a-z]+\.)?linkedin\.com\/[\w\-\/]+/i);
  return m?.[0];
}

function extractWebsite(text: string): string | undefined {
  // Match http(s)://... or www.* that is not linkedin
  const matches = Array.from(text.matchAll(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi));
  for (const m of matches) {
    const url = m[0];
    if (!/linkedin\.com|@/.test(url)) return url;
  }
  return undefined;
}

// ──────────────────────────────────────────────────────────────────
// Section splitting

const SECTION_HEADERS = [
  'Summary',
  'Top Skills',
  'Skills',
  'Languages',
  'Certifications',
  'Honors-Awards',
  'Honors & Awards',
  'Experience',
  'Education',
  'Volunteer Experience',
  'Publications',
  'Projects',
  'Contact',
];

function splitIntoSections(text: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = text.split('\n');
  let currentHeader = '__PREAMBLE__';
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (SECTION_HEADERS.includes(trimmed)) {
      sections.set(currentHeader, buffer.join('\n').trim());
      currentHeader = trimmed;
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  sections.set(currentHeader, buffer.join('\n').trim());
  return sections;
}

// ──────────────────────────────────────────────────────────────────
// Section parsers

function parseExperienceSection(text: string): Experience[] {
  if (!text) return [];
  const entries: Experience[] = [];
  // LinkedIn structure: blank line separates entries. Within an entry:
  //   line 1: Job title
  //   line 2: Company · Employment type (or just Company)
  //   line 3: Date range (sometimes also includes total duration)
  //   line 4+: Location, description, bullets
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const jobTitle = lines[0];
    let companyLine = lines[1];
    companyLine = companyLine.split('·')[0].trim().replace(/Full-time|Part-time|Contract|Internship|Freelance/gi, '').trim();

    // Find a line that looks like a date range
    let dateLine = '';
    let locationLine = '';
    let descStart = 2;
    for (let i = 2; i < Math.min(lines.length, 6); i++) {
      if (/\d{4}.*(present|heden|nu|\d{4})/i.test(lines[i]) || /^\w+\s+\d{4}\s*[-—–]/i.test(lines[i])) {
        dateLine = lines[i];
        descStart = i + 1;
        // Location may follow
        if (lines[i + 1] && !/^\s*$/.test(lines[i + 1]) && !/^[•\-]/.test(lines[i + 1])) {
          // Heuristic: if it looks like a place (no numbers, comma-separated) treat as location
          if (!/\d/.test(lines[i + 1]) && lines[i + 1].length < 80) {
            locationLine = lines[i + 1];
            descStart = i + 2;
          }
        }
        break;
      }
    }

    const { startDate, endDate, current } = parseDateRange(dateLine);

    // Description: remaining lines, treat lines starting with • or - as tasks
    const rest = lines.slice(descStart);
    const descLines: string[] = [];
    const tasks: string[] = [];
    for (const l of rest) {
      const taskMatch = l.match(/^[•\-\*]\s*(.+)/);
      if (taskMatch) tasks.push(taskMatch[1].trim());
      else descLines.push(l);
    }

    entries.push({
      ...createEmptyExperience(),
      jobTitle,
      company: companyLine,
      location: locationLine,
      startDate,
      endDate,
      current,
      description: descLines.join(' ').trim(),
      tasks,
    });
  }

  return entries;
}

function parseEducationSection(text: string): Education[] {
  if (!text) return [];
  const entries: Education[] = [];
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    // LinkedIn education:
    //   line 1: Institution
    //   line 2: Degree, Field of study  (comma-separated)
    //   line 3: Date range
    const institution = lines[0];
    const degreeLine = lines[1];
    let dateLine = '';
    for (let i = 2; i < Math.min(lines.length, 5); i++) {
      if (/\d{4}/.test(lines[i])) {
        dateLine = lines[i];
        break;
      }
    }
    const { startDate, endDate, current } = parseDateRange(dateLine);

    entries.push({
      ...createEmptyEducation(),
      institution,
      degree: degreeLine,
      location: '',
      startDate,
      endDate,
      current,
    });
  }

  return entries;
}

function parseSkillsSection(text: string): Skill[] {
  if (!text) return [];
  // LinkedIn lists each skill on its own line; Top Skills has max ~5
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const skills: Skill[] = [];
  for (const line of lines) {
    // Skip lines that are clearly not skills (e.g. "23 endorsements")
    if (/^\d+\s+endorsement/i.test(line)) continue;
    if (line.length > 60) continue;
    skills.push({ ...createEmptySkill(), name: line });
  }
  return skills;
}

function parsePersonalFromPreamble(preamble: string, text: string): ParsedLinkedIn['personal'] {
  const result: ParsedLinkedIn['personal'] = {};
  const lines = preamble.split('\n').map((l) => l.trim()).filter(Boolean);

  // Name is typically the first non-empty line
  if (lines[0]) {
    const nameParts = lines[0].split(/\s+/);
    if (nameParts.length >= 2) {
      result.firstName = nameParts[0];
      result.lastName = nameParts.slice(1).join(' ');
    } else if (nameParts[0]) {
      result.firstName = nameParts[0];
    }
  }

  result.email = extractEmail(text);
  result.phone = extractPhone(preamble);
  result.linkedIn = extractLinkedInUrl(text);
  result.website = extractWebsite(text);

  // Location: often appears as a line under the name (e.g. "Amsterdam, Noord-Holland, Nederland")
  for (let i = 1; i < Math.min(lines.length, 5); i++) {
    if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s*,\s*[A-Z][\w-]+)+$/.test(lines[i])) {
      result.city = lines[i].split(',')[0].trim();
      break;
    }
  }

  return result;
}

// ──────────────────────────────────────────────────────────────────
// Main parser

export function parseLinkedInPdf(text: string): ParsedLinkedIn {
  // Normalize whitespace; preserve newlines
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');

  const sections = splitIntoSections(cleaned);

  const preamble = sections.get('__PREAMBLE__') ?? '';
  const personal = parsePersonalFromPreamble(preamble, cleaned);

  const summary = sections.get('Summary')?.trim();
  const profile = summary ? { summary } : undefined;

  const experience = parseExperienceSection(sections.get('Experience') ?? '');
  const education = parseEducationSection(sections.get('Education') ?? '');
  const skills = parseSkillsSection(sections.get('Top Skills') ?? sections.get('Skills') ?? '');

  return { personal, profile, experience, education, skills };
}
