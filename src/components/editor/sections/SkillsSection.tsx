'use client';

import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptySkill, SkillLevel } from '@/types/cv';

// Voorgestelde vaardigheden per categorie
const skillSuggestions = {
  'Soft Skills': [
    'Communicatie', 'Teamwork', 'Leiderschap', 'Probleemoplossend vermogen',
    'Timemanagement', 'Creativiteit', 'Flexibiliteit', 'Stressbestendigheid'
  ],
  'Talen': [
    'Nederlands (moedertaal)', 'Engels (vloeiend)', 'Duits (basis)',
    'Frans (gemiddeld)', 'Spaans (basis)'
  ],
  'Software': [
    'Microsoft Office', 'Google Workspace', 'Slack', 'Zoom',
    'Trello', 'Jira', 'Notion', 'Figma'
  ],
  'Technisch': [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
    'HTML/CSS', 'Git', 'AWS'
  ],
};

const skillLevels: { value: SkillLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-slate-200' },
  { value: 'gemiddeld', label: 'Gemiddeld', color: 'bg-blue-400' },
  { value: 'gevorderd', label: 'Gevorderd', color: 'bg-emerald-400' },
  { value: 'expert', label: 'Expert', color: 'bg-amber-400' },
];

export function SkillsSection() {
  const { cvData, addSkill, updateSkill, removeSkill } = useCVData();
  const [newSkillName, setNewSkillName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddSkill = (name: string, category: string = '') => {
    if (!name.trim()) return;
    
    // Check of vaardigheid al bestaat
    if (cvData.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

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

  // Groepeer skills per categorie
  const groupedSkills = cvData.skills.reduce((acc, skill) => {
    const category = skill.category || 'Overig';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof cvData.skills>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Vaardigheden</h2>
        <p className="text-slate-600">
          Voeg je vaardigheden toe die relevant zijn voor de functie.
        </p>
      </div>

      {/* Quick add suggestions */}
      <div>
        <Button
          variant="outline"
          icon={Sparkles}
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="mb-4"
        >
          {showSuggestions ? 'Verberg suggesties' : 'Toon suggesties'}
        </Button>

        {showSuggestions && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(skillSuggestions).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Skills for active category */}
            {activeCategory && (
              <div className="flex flex-wrap gap-2">
                {skillSuggestions[activeCategory as keyof typeof skillSuggestions].map((skill) => {
                  const isAdded = cvData.skills.some(s => s.name === skill);
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

      {/* Add custom skill */}
      <div className="flex gap-2">
        <Input
          placeholder="Voeg een vaardigheid toe..."
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
          Toevoegen
        </Button>
      </div>

      {/* Skills display */}
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
                    
                    {/* Level selector */}
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
                          title={level.label}
                        />
                      ))}
                    </div>

                    {/* Current level label */}
                    <span className="text-xs text-slate-500 w-20">
                      {skillLevels.find(l => l.value === skill.level)?.label}
                    </span>

                    {/* Remove button */}
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

      {/* Empty state */}
      {cvData.skills.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>Je hebt nog geen vaardigheden toegevoegd.</p>
          <p className="text-sm mt-1">Klik op &ldquo;Toon suggesties&rdquo; voor ideeën.</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
        <h4 className="font-medium text-amber-900 mb-2">💡 Tip</h4>
        <p className="text-sm text-amber-800">
          Focus op vaardigheden die relevant zijn voor de functie waarvoor je solliciteert. 
          5-10 vaardigheden is vaak voldoende. Kwaliteit boven kwantiteit!
        </p>
      </div>
    </div>
  );
}
