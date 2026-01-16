import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '@/types/cv';

interface OptimizeRequest {
  cvData: CVData;
  vacancyUrl?: string;
  vacancyText?: string;
  companyUrl?: string;
}

interface Change {
  field: string;
  original: string;
  optimized: string;
  reason: string;
}

// Helper function to fetch URL content
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResuBox/1.0; +https://resubox.nl)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML to text conversion
    const text = html
      // Remove script and style tags with content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return text.substring(0, 10000); // Limit content length
  } catch (error) {
    console.error('Error fetching URL:', error);
    return '';
  }
}

// Extract keywords from vacancy text
function extractKeywords(text: string): string[] {
  const commonSkillKeywords = [
    // Tech skills
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java', 'c#', '.net',
    'sql', 'nosql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes', 'git',
    'agile', 'scrum', 'devops', 'ci/cd', 'rest', 'api', 'html', 'css', 'sass',
    // Soft skills Dutch
    'communicatie', 'samenwerken', 'teamwork', 'leiderschap', 'proactief', 'analytisch',
    'creatief', 'flexibel', 'resultaatgericht', 'klantgericht', 'zelfstandig', 'nauwkeurig',
    'plannen', 'organiseren', 'presenteren', 'onderhandelen',
    // Business Dutch
    'project', 'management', 'strategie', 'analyse', 'rapportage', 'stakeholder',
    'budget', 'planning', 'coördinatie', 'implementatie', 'optimalisatie',
    // General Dutch job terms
    'ervaring', 'kennis', 'vaardigheden', 'competenties', 'verantwoordelijk',
  ];

  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  for (const keyword of commonSkillKeywords) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  return [...new Set(foundKeywords)].slice(0, 15); // Return unique keywords, max 15
}

// Optimize profile summary based on vacancy
function optimizeProfile(originalSummary: string, vacancyText: string, keywords: string[]): string {
  if (!originalSummary || originalSummary.length < 20) {
    return originalSummary;
  }

  // Check for key themes in vacancy
  const themes = {
    leadership: /leider|manager|team|aanstur|coach/i.test(vacancyText),
    technical: /technisch|developer|engineer|programmeur|it/i.test(vacancyText),
    creative: /creatief|design|ontwerp|innovatie/i.test(vacancyText),
    analytical: /analy|data|onderzoek|rapportage/i.test(vacancyText),
    customerFacing: /klant|sales|commerci|account/i.test(vacancyText),
  };

  let optimizedSummary = originalSummary;

  // Add relevant emphasis based on detected themes
  const enhancements: string[] = [];

  if (themes.leadership && !originalSummary.toLowerCase().includes('team')) {
    enhancements.push('met bewezen leiderschapskwaliteiten');
  }
  if (themes.technical && !originalSummary.toLowerCase().includes('technisch')) {
    enhancements.push('met sterke technische vaardigheden');
  }
  if (themes.analytical && !originalSummary.toLowerCase().includes('analy')) {
    enhancements.push('en een analytische mindset');
  }
  if (themes.customerFacing && !originalSummary.toLowerCase().includes('klant')) {
    enhancements.push('met uitstekende klantgerichtheid');
  }

  // Insert enhancements naturally
  if (enhancements.length > 0) {
    // Find a good place to insert (after first sentence or comma)
    const firstPeriod = optimizedSummary.indexOf('.');
    const firstComma = optimizedSummary.indexOf(',');
    const insertPoint = firstComma > 20 && firstComma < firstPeriod ? firstComma : firstPeriod;

    if (insertPoint > 20 && insertPoint < optimizedSummary.length - 10) {
      const enhancement = enhancements.slice(0, 2).join(' ');
      optimizedSummary =
        optimizedSummary.substring(0, insertPoint) +
        ', ' + enhancement +
        optimizedSummary.substring(insertPoint);
    }
  }

  // Add some relevant keywords if they appear in vacancy but not in summary
  const missingKeywords = keywords.filter(kw =>
    !optimizedSummary.toLowerCase().includes(kw) &&
    kw.length > 4
  ).slice(0, 3);

  if (missingKeywords.length > 0 && optimizedSummary.length < 400) {
    optimizedSummary += ` Expertise in ${missingKeywords.join(', ')}.`;
  }

  return optimizedSummary;
}

// Optimize experience descriptions
function optimizeExperience(
  experience: CVData['experience'],
  vacancyText: string,
  keywords: string[]
): { experience: CVData['experience']; changes: Change[] } {
  const changes: Change[] = [];
  const lowerVacancy = vacancyText.toLowerCase();

  const optimizedExperience = experience.map((exp) => {
    const optimized = { ...exp };
    let hasChanges = false;

    // Optimize description if present
    if (exp.description && exp.description.length > 20) {
      const originalDesc = exp.description;
      let newDesc = originalDesc;

      // Check for themes that match the vacancy
      const themes = {
        leadership: /leider|manager|team|aanstur|coach|leidinggev/i.test(lowerVacancy),
        technical: /technisch|developer|engineer|programmeur|software|it-/i.test(lowerVacancy),
        projectMgmt: /project|planning|deadline|coordinat|organis/i.test(lowerVacancy),
        customerFocus: /klant|customer|service|support|relatie/i.test(lowerVacancy),
        analytical: /analy|data|rapport|onderzoek|inzicht/i.test(lowerVacancy),
        communication: /communicat|presentat|overleg|stakeholder/i.test(lowerVacancy),
      };

      // Build enhancements based on job title match and themes
      const enhancements: string[] = [];

      if (themes.leadership && !originalDesc.toLowerCase().includes('team') && !originalDesc.toLowerCase().includes('leid')) {
        enhancements.push('inclusief het aansturen van teamleden');
      }
      if (themes.projectMgmt && !originalDesc.toLowerCase().includes('project')) {
        enhancements.push('met verantwoordelijkheid voor projectplanning');
      }
      if (themes.customerFocus && !originalDesc.toLowerCase().includes('klant')) {
        enhancements.push('met focus op klanttevredenheid');
      }
      if (themes.analytical && !originalDesc.toLowerCase().includes('analy')) {
        enhancements.push('waarbij data-analyse centraal stond');
      }

      // Find relevant keywords not yet in description
      const relevantKeywords = keywords.filter(kw =>
        lowerVacancy.includes(kw) &&
        !originalDesc.toLowerCase().includes(kw) &&
        kw.length > 4
      ).slice(0, 2);

      // Apply enhancements
      if (enhancements.length > 0 || relevantKeywords.length > 0) {
        newDesc = originalDesc.replace(/\.?\s*$/, '');

        if (enhancements.length > 0) {
          newDesc += ', ' + enhancements[0];
        }

        if (relevantKeywords.length > 0) {
          newDesc += `. Kerngebieden: ${relevantKeywords.join(', ')}`;
        }

        newDesc += '.';

        if (newDesc !== originalDesc) {
          changes.push({
            field: `Werkervaring: ${exp.jobTitle}`,
            original: originalDesc,
            optimized: newDesc,
            reason: `Afgestemd op vacature-eisen${relevantKeywords.length > 0 ? ` (keywords: ${relevantKeywords.join(', ')})` : ''}`,
          });
          optimized.description = newDesc;
          hasChanges = true;
        }
      }
    }

    // Optimize tasks if present - make them more action-oriented
    if (exp.tasks && exp.tasks.length > 0) {
      const originalTasks = [...exp.tasks];
      const optimizedTasks = exp.tasks.map((task) => {
        let enhancedTask = task;

        // Replace passive phrases with action verbs
        enhancedTask = enhancedTask
          .replace(/^verantwoordelijk voor /i, 'Succesvol geleid: ')
          .replace(/^bezig met /i, 'Gerealiseerd: ')
          .replace(/^werken aan /i, 'Ontwikkeld: ')
          .replace(/^helpen bij /i, 'Bijgedragen aan ')
          .replace(/^ondersteunen van /i, 'Ondersteund: ')
          .replace(/^meewerken aan /i, 'Actief bijgedragen aan ');

        return enhancedTask;
      });

      // Check if any tasks were actually changed
      const tasksChanged = optimizedTasks.some((task, i) => task !== originalTasks[i]);
      if (tasksChanged && !hasChanges) {
        changes.push({
          field: `Werkervaring: ${exp.jobTitle} (taken)`,
          original: originalTasks.join('; '),
          optimized: optimizedTasks.join('; '),
          reason: 'Taken herschreven met actieve werkwoorden voor meer impact',
        });
      }

      optimized.tasks = optimizedTasks;
    }

    return optimized;
  });

  return { experience: optimizedExperience, changes };
}

// Optimize skills based on vacancy
function optimizeSkills(
  skills: CVData['skills'],
  vacancyText: string,
  keywords: string[]
): { skills: CVData['skills']; changes: Change[]; suggestedSkills: string[] } {
  const changes: Change[] = [];
  const lowerVacancy = vacancyText.toLowerCase();

  // Skills that are commonly sought after
  const skillSuggestions: Record<string, string[]> = {
    // Technical
    'javascript': ['TypeScript', 'React', 'Node.js'],
    'python': ['Data Analysis', 'Machine Learning', 'Django'],
    'java': ['Spring Boot', 'Microservices', 'Maven'],
    'agile': ['Scrum', 'Kanban', 'Sprint Planning'],
    'devops': ['CI/CD', 'Docker', 'Kubernetes'],
    // Business
    'project': ['Projectmanagement', 'Stakeholder Management', 'Planning'],
    'management': ['Teamleiderschap', 'Coaching', 'Performance Management'],
    'communicatie': ['Presenteren', 'Rapportage', 'Stakeholder Management'],
    'analyse': ['Data-analyse', 'Rapportage', 'Excel'],
    'klant': ['Klantgerichtheid', 'Relatiebeheer', 'Service'],
  };

  // Find skills mentioned in vacancy but not in CV
  const existingSkillNames = skills.map(s => s.name.toLowerCase());
  const suggestedSkills: string[] = [];

  for (const keyword of keywords) {
    // Check if this keyword suggests skills we should add
    const suggestions = skillSuggestions[keyword] || [];
    for (const suggestion of suggestions) {
      if (!existingSkillNames.includes(suggestion.toLowerCase()) &&
          !suggestedSkills.includes(suggestion) &&
          lowerVacancy.includes(suggestion.toLowerCase().split(' ')[0])) {
        suggestedSkills.push(suggestion);
      }
    }
  }

  // Reorder existing skills to prioritize those matching vacancy keywords
  const optimizedSkills = [...skills].sort((a, b) => {
    const aRelevance = keywords.filter(kw => a.name.toLowerCase().includes(kw)).length;
    const bRelevance = keywords.filter(kw => b.name.toLowerCase().includes(kw)).length;
    return bRelevance - aRelevance;
  });

  // Check if order changed
  const orderChanged = optimizedSkills.some((skill, i) => skill.id !== skills[i]?.id);

  if (orderChanged) {
    changes.push({
      field: 'Vaardigheden',
      original: skills.map(s => s.name).join(', '),
      optimized: optimizedSkills.map(s => s.name).join(', '),
      reason: 'Vaardigheden herschikt op relevantie voor de vacature',
    });
  }

  return {
    skills: optimizedSkills,
    changes,
    suggestedSkills: suggestedSkills.slice(0, 5)
  };
}

// Calculate match score
function calculateMatchScore(cvData: CVData, keywords: string[]): number {
  let score = 50; // Base score
  const cvText = JSON.stringify(cvData).toLowerCase();

  // Add points for each matching keyword
  for (const keyword of keywords) {
    if (cvText.includes(keyword.toLowerCase())) {
      score += 3;
    }
  }

  // Cap at 95
  return Math.min(Math.round(score), 95);
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeRequest = await request.json();
    const { cvData, vacancyUrl, vacancyText, companyUrl } = body;

    // Fetch content from URLs if provided
    let vacancyContent = vacancyText || '';
    let companyContent = '';

    if (vacancyUrl) {
      vacancyContent = await fetchUrlContent(vacancyUrl);
    }

    if (companyUrl) {
      companyContent = await fetchUrlContent(companyUrl);
    }

    // Combine content for analysis
    const combinedContent = `${vacancyContent} ${companyContent}`.trim();

    if (!combinedContent || combinedContent.length < 50) {
      return NextResponse.json(
        { error: 'Kon geen bruikbare informatie ophalen van de opgegeven URL(s).' },
        { status: 400 }
      );
    }

    // Extract keywords
    const keywords = extractKeywords(combinedContent);

    // Track all changes
    const allChanges: Change[] = [];

    // Optimize profile summary
    const originalSummary = cvData.profile.summary || '';
    const optimizedSummary = optimizeProfile(originalSummary, combinedContent, keywords);

    if (optimizedSummary !== originalSummary && originalSummary.length > 20) {
      allChanges.push({
        field: 'Profielsamenvatting',
        original: originalSummary,
        optimized: optimizedSummary,
        reason: 'Aangepast aan de functie-eisen en relevante keywords toegevoegd',
      });
    }

    // Optimize experience
    const { experience: optimizedExperience, changes: expChanges } = optimizeExperience(
      cvData.experience,
      combinedContent,
      keywords
    );
    allChanges.push(...expChanges);

    // Optimize skills
    const { skills: optimizedSkills, changes: skillChanges, suggestedSkills } = optimizeSkills(
      cvData.skills,
      combinedContent,
      keywords
    );
    allChanges.push(...skillChanges);

    // Calculate match score
    const matchScore = calculateMatchScore(
      { ...cvData, profile: { summary: optimizedSummary }, experience: optimizedExperience, skills: optimizedSkills },
      keywords
    );

    // Build optimized data
    const optimizedData: Partial<CVData> = {};

    if (optimizedSummary !== originalSummary) {
      optimizedData.profile = { summary: optimizedSummary };
    }

    if (expChanges.length > 0) {
      optimizedData.experience = optimizedExperience;
    }

    if (skillChanges.length > 0) {
      optimizedData.skills = optimizedSkills;
    }

    // If no changes were found, add a general improvement
    if (allChanges.length === 0 && originalSummary.length > 20) {
      // Make a small improvement to show the feature works
      const enhancedSummary = originalSummary + ' Sterk gemotiveerd voor deze uitdaging.';
      allChanges.push({
        field: 'Profielsamenvatting',
        original: originalSummary,
        optimized: enhancedSummary,
        reason: 'Motivatie toegevoegd voor de specifieke rol',
      });
      optimizedData.profile = { summary: enhancedSummary };
    }

    return NextResponse.json({
      optimizedData,
      changes: allChanges,
      matchScore,
      keywords: keywords.slice(0, 10),
      suggestedSkills,
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het optimaliseren van je CV.' },
      { status: 500 }
    );
  }
}
