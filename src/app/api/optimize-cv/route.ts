import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CVData } from '@/types/cv';
import { rateLimiter } from '@/lib/rate-limit';
import { matchVacancy } from '@/lib/ai/cv-optimizer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const limiter = rateLimiter({ limit: 10, windowMs: 60_000 });

interface OptimizeRequest {
  cvData: CVData;
  vacancyUrl?: string;
  vacancyText?: string;
  locale?: string;
}

interface Change {
  field: string;
  original: string;
  optimized: string;
  reason: string;
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ResuBox/1.0; +https://www.resubox.com)' },
    });
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    const html = await response.text();
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
    return text.substring(0, 10000);
  } catch (err) {
    console.error('Error fetching vacancy URL:', err);
    return '';
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { cvData, vacancyUrl, vacancyText, locale } = (await request.json()) as OptimizeRequest;
    const effectiveLocale = locale ?? request.headers.get('x-locale') ?? 'nl';

    if (!cvData) {
      return NextResponse.json({ error: 'cvData ontbreekt' }, { status: 400 });
    }

    let vacancy = (vacancyText ?? '').trim();
    if (!vacancy && vacancyUrl) {
      vacancy = await fetchUrlContent(vacancyUrl);
      if (!vacancy) {
        return NextResponse.json(
          { error: 'Kon de vacaturetekst niet ophalen van die URL. Plak de tekst zelf in.' },
          { status: 400 }
        );
      }
    }
    if (!vacancy || vacancy.length < 80) {
      return NextResponse.json(
        { error: 'Vacaturetekst is te kort of leeg.' },
        { status: 400 }
      );
    }

    // Real LLM analysis
    const llm = await matchVacancy({ cvData, vacancyText: vacancy, locale: effectiveLocale });

    // Apply bullet suggestions to a copy of experience
    const optimizedExperience = cvData.experience.map((exp, idx) => {
      const suggestions = llm.bulletSuggestions.filter((s) => s.experienceIndex === idx);
      if (suggestions.length === 0) return exp;

      const tasks = [...exp.tasks];
      for (const sug of suggestions) {
        if (sug.originalBullet) {
          const matchIdx = tasks.findIndex(
            (t) =>
              t.trim() === sug.originalBullet!.trim() ||
              t.includes(sug.originalBullet!) ||
              sug.originalBullet!.includes(t.slice(0, 40))
          );
          if (matchIdx >= 0) {
            tasks[matchIdx] = sug.suggestedBullet;
          } else {
            tasks.push(sug.suggestedBullet);
          }
        } else {
          tasks.push(sug.suggestedBullet);
        }
      }
      return { ...exp, tasks };
    });

    // Build changes list for the UI
    const changes: Change[] = [];
    const currentSummary = cvData.profile?.summary ?? '';
    if (llm.profileSuggestion && llm.profileSuggestion.trim() !== currentSummary.trim()) {
      changes.push({
        field: 'Profielsamenvatting',
        original: currentSummary || '(leeg)',
        optimized: llm.profileSuggestion,
        reason: 'Aangescherpt op deze vacature',
      });
    }
    for (const sug of llm.bulletSuggestions) {
      const exp = cvData.experience[sug.experienceIndex];
      changes.push({
        field: `Werkervaring — ${exp?.jobTitle || 'item ' + (sug.experienceIndex + 1)}`,
        original: sug.originalBullet ?? '(nieuwe bullet)',
        optimized: sug.suggestedBullet,
        reason: sug.reason,
      });
    }

    // Heuristic: skills look like one or two words, capitalized or all-lower technical terms
    const skillCandidates = llm.missingKeywords.filter(
      (k) => k.length <= 30 && k.split(/\s+/).length <= 3 && !/[.!?]$/.test(k)
    );
    const existingSkillsLower = new Set(cvData.skills.map((s) => s.name.toLowerCase()));
    const suggestedSkills = skillCandidates.filter(
      (k) => !existingSkillsLower.has(k.toLowerCase())
    );

    return NextResponse.json({
      optimizedData: {
        profile: llm.profileSuggestion ? { summary: llm.profileSuggestion } : undefined,
        experience: optimizedExperience,
      },
      changes,
      matchScore: llm.matchScore,
      keywords: llm.missingKeywords.slice(0, 12),
      suggestedSkills: suggestedSkills.slice(0, 8),
      gradeReason: llm.gradeReason,
      overallAdvice: llm.overallAdvice,
      usage: llm.usage,
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'AI-service tijdelijk overbelast — probeer over een minuut opnieuw.' },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[optimize-cv] Anthropic API error:', err.status, err.message);
      return NextResponse.json(
        { error: 'AI-analyse mislukt', details: err.message },
        { status: err.status ?? 500 }
      );
    }
    console.error('[optimize-cv] error:', err);
    return NextResponse.json(
      { error: 'Analyse mislukt', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
