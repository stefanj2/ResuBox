'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { Input, TextArea, Button, Card } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptyExperience, Experience } from '@/types/cv';

// AI Suggesties voor taken per functietitel
const taskSuggestions: Record<string, string[]> = {
  'default': [
    'Verantwoordelijk voor dagelijkse operationele werkzaamheden',
    'Samenwerken met cross-functionele teams om projectdoelen te behalen',
    'Bijdragen aan proces verbeteringen en efficiëntie optimalisatie',
    'Rapporteren aan management over voortgang en resultaten',
    'Onderhouden van klantrelaties en stakeholder communicatie',
  ],
  'manager': [
    'Leiding geven aan een team van 10+ medewerkers',
    'Opstellen en bewaken van afdelingsbudget (€500K+)',
    'Implementeren van nieuwe processen die productiviteit met 25% verhoogden',
    'Voeren van functioneringsgesprekken en ontwikkelen van teamleden',
    'Strategische planning en uitvoering van bedrijfsdoelstellingen',
  ],
  'developer': [
    'Ontwikkelen van schaalbare webapplicaties met moderne frameworks',
    'Code reviews uitvoeren en junior developers begeleiden',
    'Optimaliseren van applicatie performance met 40% snellere laadtijden',
    'Implementeren van CI/CD pipelines voor geautomatiseerde deployments',
    'Samenwerken met UX designers voor optimale gebruikerservaring',
  ],
  'sales': [
    'Behalen van 120% van de jaarlijkse sales targets',
    'Acquireren van 50+ nieuwe B2B klanten per jaar',
    'Onderhandelen en sluiten van deals tot €1M',
    'Onderhouden van een portfolio van 200+ klanten',
    'Ontwikkelen van nieuwe marktstrategieën',
  ],
};

export function ExperienceSection() {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVData();
  const [expandedId, setExpandedId] = useState<string | null>(
    cvData.experience.length > 0 ? cvData.experience[0].id : null
  );
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExp = createEmptyExperience();
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  const getSuggestionsForTitle = (title: string): string[] => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('manager') || lowerTitle.includes('lead') || lowerTitle.includes('hoofd')) {
      return taskSuggestions.manager;
    }
    if (lowerTitle.includes('developer') || lowerTitle.includes('engineer') || lowerTitle.includes('programmeur')) {
      return taskSuggestions.developer;
    }
    if (lowerTitle.includes('sales') || lowerTitle.includes('verkoop') || lowerTitle.includes('account')) {
      return taskSuggestions.sales;
    }
    return taskSuggestions.default;
  };

  const handleAddTask = (experienceId: string, task: string) => {
    const exp = cvData.experience.find(e => e.id === experienceId);
    if (exp && !exp.tasks.includes(task)) {
      updateExperience(experienceId, { tasks: [...exp.tasks, task] });
    }
  };

  const handleRemoveTask = (experienceId: string, taskIndex: number) => {
    const exp = cvData.experience.find(e => e.id === experienceId);
    if (exp) {
      const newTasks = exp.tasks.filter((_, i) => i !== taskIndex);
      updateExperience(experienceId, { tasks: newTasks });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Werkervaring</h2>
        <p className="text-slate-600">
          Voeg je relevante werkervaring toe, beginnend met je meest recente baan.
        </p>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {cvData.experience.map((exp, index) => (
          <Card key={exp.id} padding="none" className="overflow-hidden">
            {/* Header - Always visible */}
            <button
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {exp.jobTitle || 'Nieuwe werkervaring'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {exp.company || 'Bedrijfsnaam'}
                    {exp.startDate && ` • ${exp.startDate}`}
                    {exp.endDate && ` - ${exp.endDate}`}
                    {exp.current && ' - Heden'}
                  </p>
                </div>
              </div>
              {expandedId === exp.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Expanded Content */}
            {expandedId === exp.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Functietitel"
                    placeholder="Marketing Manager"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                    required
                  />
                  <Input
                    label="Bedrijf"
                    placeholder="Bedrijfsnaam B.V."
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Locatie"
                  placeholder="Amsterdam"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="month"
                    label="Startdatum"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                  <div>
                    <Input
                      type="month"
                      label="Einddatum"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.current}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { 
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : exp.endDate
                        })}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600">Ik werk hier nog</span>
                    </label>
                  </div>
                </div>

                <TextArea
                  label="Beschrijving"
                  placeholder="Beschrijf je rol en verantwoordelijkheden..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  rows={3}
                />

                {/* Tasks with AI Suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Belangrijkste taken
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Sparkles}
                      onClick={() => setShowSuggestions(showSuggestions === exp.id ? null : exp.id)}
                    >
                      Suggesties tonen
                    </Button>
                  </div>

                  {/* AI Suggestions */}
                  {showSuggestions === exp.id && (
                    <div className="mb-3 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                      <p className="text-xs font-medium text-emerald-700 mb-2">
                        Klik om toe te voegen:
                      </p>
                      <div className="space-y-1">
                        {getSuggestionsForTitle(exp.jobTitle).map((task, i) => (
                          <button
                            key={i}
                            onClick={() => handleAddTask(exp.id, task)}
                            disabled={exp.tasks.includes(task)}
                            className={`w-full text-left text-sm p-2 rounded transition-colors ${
                              exp.tasks.includes(task)
                                ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed'
                                : 'bg-white hover:bg-emerald-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {exp.tasks.includes(task) && <Check className="w-4 h-4" />}
                              {task}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Added tasks */}
                  <div className="space-y-2">
                    {exp.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg group"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span className="flex-1 text-sm text-slate-700">{task}</span>
                        <button
                          onClick={() => handleRemoveTask(exp.id, taskIndex)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add custom task */}
                  <Input
                    placeholder="Voeg een taak toe en druk Enter..."
                    className="mt-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleAddTask(exp.id, e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Delete button */}
                <div className="pt-4 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Verwijder deze werkervaring
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Experience Button */}
      <Button
        variant="outline"
        icon={Plus}
        onClick={handleAddExperience}
        fullWidth
      >
        Werkervaring toevoegen
      </Button>
    </div>
  );
}
