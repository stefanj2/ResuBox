'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, X, Sparkles } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptySkill, SkillLevel } from '@/types/cv';
import type { Locale } from '@/i18n/routing';

interface SkillCategoryData {
  label: string;
  items: string[];
}

const SKILL_SUGGESTIONS: Record<Locale, SkillCategoryData[]> = {
  nl: [
    { label: 'Soft Skills', items: ['Communicatie', 'Teamwork', 'Leiderschap', 'Probleemoplossend vermogen', 'Timemanagement', 'Creativiteit', 'Flexibiliteit', 'Stressbestendigheid'] },
    { label: 'Talen', items: ['Nederlands (moedertaal)', 'Engels (vloeiend)', 'Duits (basis)', 'Frans (gemiddeld)', 'Spaans (basis)'] },
    { label: 'Software', items: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello', 'Jira', 'Notion', 'Figma'] },
    { label: 'Technisch', items: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'AWS'] },
  ],
  en: [
    { label: 'Soft skills', items: ['Communication', 'Teamwork', 'Leadership', 'Problem solving', 'Time management', 'Creativity', 'Adaptability', 'Resilience'] },
    { label: 'Languages', items: ['English (native)', 'French (fluent)', 'German (basic)', 'Spanish (intermediate)', 'Mandarin (basic)'] },
    { label: 'Software', items: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello', 'Jira', 'Notion', 'Figma'] },
    { label: 'Technical', items: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'AWS'] },
  ],
  de: [
    { label: 'Soft Skills', items: ['Kommunikation', 'Teamarbeit', 'Führung', 'Problemlösung', 'Zeitmanagement', 'Kreativität', 'Flexibilität', 'Belastbarkeit'] },
    { label: 'Sprachen', items: ['Deutsch (Muttersprache)', 'Englisch (fließend)', 'Französisch (Grundkenntnisse)', 'Spanisch (mittel)'] },
    { label: 'Software', items: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello', 'Jira', 'Notion', 'Figma'] },
    { label: 'Technisch', items: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'AWS'] },
  ],
  sv: [
    { label: 'Mjuka färdigheter', items: ['Kommunikation', 'Lagarbete', 'Ledarskap', 'Problemlösning', 'Tidshantering', 'Kreativitet', 'Anpassningsförmåga', 'Stresstålighet'] },
    { label: 'Språk', items: ['Svenska (modersmål)', 'Engelska (flytande)', 'Tyska (grund)', 'Spanska (mellan)'] },
    { label: 'Programvara', items: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello', 'Jira', 'Notion', 'Figma'] },
    { label: 'Tekniskt', items: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'AWS'] },
  ],
  da: [
    { label: 'Bløde færdigheder', items: ['Kommunikation', 'Teamwork', 'Lederskab', 'Problemløsning', 'Tidsstyring', 'Kreativitet', 'Fleksibilitet', 'Robusthed'] },
    { label: 'Sprog', items: ['Dansk (modersmål)', 'Engelsk (flydende)', 'Tysk (basis)', 'Spansk (mellem)'] },
    { label: 'Software', items: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello', 'Jira', 'Notion', 'Figma'] },
    { label: 'Teknisk', items: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'AWS'] },
  ],
};

export function SkillsSection() {
  const { cvData, addSkill, updateSkill, removeSkill } = useCVData();
  const t = useTranslations('Builder.skillsSection');
  const locale = useLocale() as Locale;
  const [newSkillName, setNewSkillName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const skillLevels: { value: SkillLevel; labelKey: string; color: string }[] = [
    { value: 'beginner', labelKey: 'levels.beginner', color: 'bg-slate-200' },
    { value: 'gemiddeld', labelKey: 'levels.gemiddeld', color: 'bg-blue-400' },
    { value: 'gevorderd', labelKey: 'levels.gevorderd', color: 'bg-emerald-400' },
    { value: 'expert', labelKey: 'levels.expert', color: 'bg-amber-400' },
  ];

  const categories = SKILL_SUGGESTIONS[locale] ?? SKILL_SUGGESTIONS.nl;

  const handleAddSkill = (name: string, category: string = '') => {
    if (!name.trim()) return;
    if (cvData.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    const skill = createEmptySkill();
    skill.name = name.trim();
    skill.category = category;
    addSkill(skill);
    setNewSkillName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkillName.trim()) {
      handleAddSkill(newSkillName);
    }
  };

  const groupedSkills = cvData.skills.reduce((acc, skill) => {
    const category = skill.category || t('otherCategory');
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof cvData.skills>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      <div>
        <Button
          variant="outline"
          icon={Sparkles}
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="mb-4"
        >
          {showSuggestions ? t('hideSuggestions') : t('showSuggestions')}
        </Button>

        {showSuggestions && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.label
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {activeCategory && (
              <div className="flex flex-wrap gap-2">
                {categories.find((c) => c.label === activeCategory)?.items.map((skill) => {
                  const isAdded = cvData.skills.some((s) => s.name === skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => !isAdded && handleAddSkill(skill, activeCategory)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {isAdded && '✓ '}{skill}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder={t('placeholder')}
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => handleAddSkill(newSkillName)}
          disabled={!newSkillName.trim()}
        >
          {t('addButton')}
        </Button>
      </div>

      {cvData.skills.length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-slate-500 mb-3">{category}</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 group"
                  >
                    <span className="flex-1 font-medium text-slate-900">{skill.name}</span>

                    <div className="flex items-center gap-1">
                      {skillLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => updateSkill(skill.id, { level: level.value })}
                          className={`w-8 h-2 rounded-full transition-all ${
                            skill.level === level.value
                              ? level.color
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          title={t(level.labelKey)}
                        />
                      ))}
                    </div>

                    <span className="text-xs text-slate-500 w-20">
                      {t(skillLevels.find((l) => l.value === skill.level)?.labelKey ?? 'levels.beginner')}
                    </span>

                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {cvData.skills.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>{t('emptyTitle')}</p>
          <p className="text-sm mt-1">{t('emptyHint')}</p>
        </div>
      )}

      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
        <h4 className="font-medium text-amber-900 mb-2">{t('tipTitle')}</h4>
        <p className="text-sm text-amber-800">{t('tipBody')}</p>
      </div>
    </div>
  );
}
