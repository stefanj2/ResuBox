'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { Input, TextArea, Button, Card } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptyExperience, Experience } from '@/types/cv';

// AI Suggesties voor taken per functietitel
const taskSuggestions: Record<string, string[]> = {
  'default': [
    'Dagelijkse operaties aansturen',
    'Samenwerken in cross-functionele teams',
    'Processen verbeteren en optimaliseren',
    'Rapportages opstellen voor management',
    'Klantrelaties onderhouden',
  ],
  'manager': [
    'Team van 10+ medewerkers aansturen',
    'Budget van €500K+ beheren',
    'Productiviteit met 25% verhoogd',
    'Teamleden coachen en ontwikkelen',
    'Strategische doelen realiseren',
  ],
  'developer': [
    'Webapplicaties ontwikkelen en onderhouden',
    'Code reviews en junior developers begeleiden',
    'Performance 40% verbeterd',
    'CI/CD pipelines opgezet',
    'Samenwerken met UX/design team',
  ],
  'sales': [
    '120% van sales targets behaald',
    '50+ nieuwe klanten per jaar geworven',
    'Deals tot €1M gesloten',
    'Portfolio van 200+ klanten beheerd',
    'Nieuwe markten aangeboord',
  ],
};

export function ExperienceSection() {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVData();
  const [expandedId, setExpandedId] = useState<string | null>(
    cvData.experience.length > 0 ? cvData.experience[0].id : null
  );
  const [hiddenSuggestions, setHiddenSuggestions] = useState<Set<string>>(new Set());

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
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Belangrijkste taken
                  </label>

                  {/* AI Suggestions - Shown by default */}
                  {!hiddenSuggestions.has(exp.id) && (
                    <div className="mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-emerald-900 text-sm">
                            AI Suggesties
                          </h4>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            Klik op een suggestie om deze toe te voegen aan je CV
                          </p>
                        </div>
                        <button
                          onClick={() => setHiddenSuggestions(prev => new Set(prev).add(exp.id))}
                          className="text-emerald-400 hover:text-emerald-600 transition-colors"
                          title="Verbergen"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {getSuggestionsForTitle(exp.jobTitle).map((task, i) => (
                          <button
                            key={i}
                            onClick={() => handleAddTask(exp.id, task)}
                            disabled={exp.tasks.includes(task)}
                            className={`w-full text-left text-sm p-2.5 rounded-lg transition-all ${
                              exp.tasks.includes(task)
                                ? 'bg-emerald-200/50 text-emerald-700 cursor-not-allowed'
                                : 'bg-white hover:bg-emerald-100 hover:shadow-sm text-slate-700 border border-emerald-100'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {exp.tasks.includes(task) ? (
                                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <Plus className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              )}
                              <span className="line-clamp-2">{task}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show suggestions button when hidden */}
                  {hiddenSuggestions.has(exp.id) && (
                    <button
                      onClick={() => setHiddenSuggestions(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(exp.id);
                        return newSet;
                      })}
                      className="mb-3 flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI suggesties tonen</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
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
