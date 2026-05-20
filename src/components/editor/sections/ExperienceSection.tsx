'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Check, Wand2, Loader2 } from 'lucide-react';
import { Input, TextArea, Card, FieldTooltip } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptyExperience } from '@/types/cv';
import type { Locale } from '@/i18n/routing';

type SuggestionCategory = 'default' | 'manager' | 'developer' | 'sales';

const TASK_SUGGESTIONS: Record<Locale, Record<SuggestionCategory, string[]>> = {
  nl: {
    default: ['Dagelijkse operaties aansturen', 'Samenwerken in cross-functionele teams', 'Processen verbeteren en optimaliseren', 'Rapportages opstellen voor management', 'Klantrelaties onderhouden'],
    manager: ['Team van 10+ medewerkers aansturen', 'Budget van €500K+ beheren', 'Productiviteit met 25% verhoogd', 'Teamleden coachen en ontwikkelen', 'Strategische doelen realiseren'],
    developer: ['Webapplicaties ontwikkelen en onderhouden', 'Code reviews en junior developers begeleiden', 'Performance 40% verbeterd', 'CI/CD pipelines opgezet', 'Samenwerken met UX/design team'],
    sales: ['120% van sales targets behaald', '50+ nieuwe klanten per jaar geworven', 'Deals tot €1M gesloten', 'Portfolio van 200+ klanten beheerd', 'Nieuwe markten aangeboord'],
  },
  en: {
    default: ['Drive day-to-day operations', 'Collaborate across cross-functional teams', 'Improve and optimise processes', 'Produce management reporting', 'Maintain key client relationships'],
    manager: ['Lead a team of 10+ direct reports', 'Manage budgets of £500K+', 'Lifted team productivity by 25%', 'Coach and develop team members', 'Deliver against strategic objectives'],
    developer: ['Build and maintain production web applications', 'Conduct code reviews and mentor juniors', 'Improved application performance by 40%', 'Set up CI/CD pipelines', 'Partner with UX and design teams'],
    sales: ['Achieved 120% of sales targets', 'Won 50+ new accounts annually', 'Closed deals worth up to £1M', 'Managed a portfolio of 200+ clients', 'Opened up new markets and territories'],
  },
  de: {
    default: ['Tägliches Tagesgeschäft steuern', 'Mit funktionsübergreifenden Teams zusammenarbeiten', 'Prozesse verbessern und optimieren', 'Reportings für das Management erstellen', 'Schlüsselkundenbeziehungen pflegen'],
    manager: ['Team mit 10+ direkten Mitarbeitenden geführt', 'Budgets über 500.000 € verantwortet', 'Produktivität um 25 % gesteigert', 'Teammitglieder gecoacht und entwickelt', 'Strategische Ziele realisiert'],
    developer: ['Produktive Webanwendungen entwickelt und gepflegt', 'Code-Reviews durchgeführt und Junioren betreut', 'Performance um 40 % verbessert', 'CI/CD-Pipelines aufgebaut', 'Mit UX/Design eng zusammengearbeitet'],
    sales: ['120 % der Vertriebsziele erreicht', '50+ Neukunden pro Jahr gewonnen', 'Abschlüsse bis 1 Mio. € realisiert', 'Portfolio von 200+ Kunden betreut', 'Neue Märkte erschlossen'],
  },
  sv: {
    default: ['Drev daglig verksamhet', 'Samarbetade i tvärfunktionella team', 'Förbättrade och optimerade processer', 'Tog fram rapporter till ledning', 'Underhöll viktiga kundrelationer'],
    manager: ['Ledde team om 10+ personer', 'Hanterade budgetar över 5 MSEK', 'Ökade teamets produktivitet med 25 %', 'Coachade och utvecklade teammedlemmar', 'Levererade strategiska mål'],
    developer: ['Utvecklade och underhöll produktiva webbapplikationer', 'Genomförde kodgranskningar och mentorerade juniorer', 'Förbättrade prestanda med 40 %', 'Byggde CI/CD-pipelines', 'Samarbetade med UX/design'],
    sales: ['Levererade 120 % av säljmålen', 'Värvade 50+ nya kunder årligen', 'Stängde affärer värda upp till 10 MSEK', 'Hanterade portfölj med 200+ kunder', 'Öppnade upp nya marknader'],
  },
  da: {
    default: ['Drev daglig drift', 'Samarbejdede på tværs af funktioner', 'Forbedrede og optimerede processer', 'Udarbejdede rapporter til ledelsen', 'Vedligeholdt nøglekundeforhold'],
    manager: ['Ledte team på 10+ medarbejdere', 'Ansvarlig for budgetter over 3,5 mio. kr.', 'Øgede teamets produktivitet med 25 %', 'Coachede og udviklede teammedlemmer', 'Realiserede strategiske mål'],
    developer: ['Udviklede og vedligeholdt produktionswebapplikationer', 'Udførte kodegennemgang og mentorerede juniorer', 'Forbedrede performance med 40 %', 'Opbyggede CI/CD-pipelines', 'Arbejdede tæt med UX/design'],
    sales: ['Leverede 120 % af salgsmålene', 'Vandt 50+ nye kunder årligt', 'Lukkede aftaler op til 7 mio. kr.', 'Plejede portefølje på 200+ kunder', 'Åbnede nye markeder'],
  },
};

function classifyTitle(title: string): SuggestionCategory {
  const lower = title.toLowerCase();
  if (lower.includes('manager') || lower.includes('lead') || lower.includes('hoofd') || lower.includes('leiter') || lower.includes('chef')) return 'manager';
  if (lower.includes('developer') || lower.includes('engineer') || lower.includes('programmeur') || lower.includes('entwickler') || lower.includes('utvecklare') || lower.includes('udvikler')) return 'developer';
  if (lower.includes('sales') || lower.includes('verkoop') || lower.includes('account') || lower.includes('vertrieb') || lower.includes('sälj') || lower.includes('salg')) return 'sales';
  return 'default';
}

export function ExperienceSection() {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVData();
  const t = useTranslations('Builder.experienceSection');
  const tip = useTranslations('Builder.experienceSection.tooltips');
  const tProfile = useTranslations('Builder.profileSection');
  const tPersonal = useTranslations('Builder.personalSection');
  const locale = useLocale() as Locale;
  const [expandedId, setExpandedId] = useState<string | null>(
    cvData.experience.length > 0 ? cvData.experience[0].id : null
  );
  const [hiddenSuggestions, setHiddenSuggestions] = useState<Set<string>>(new Set());
  const [improvingKey, setImprovingKey] = useState<string | null>(null);
  const autoCreatedRef = useRef(false);

  // Empty-state fix: when the user lands on this step with no experience entries,
  // auto-create the first one expanded so they never face a blank "+ Add" wall.
  useEffect(() => {
    if (autoCreatedRef.current) return;
    if (cvData.experience.length === 0) {
      autoCreatedRef.current = true;
      const first = createEmptyExperience();
      addExperience(first);
      setExpandedId(first.id);
    } else {
      autoCreatedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImproveTask = async (experienceId: string, taskIndex: number) => {
    const exp = cvData.experience.find((e) => e.id === experienceId);
    if (!exp) return;
    const current = exp.tasks[taskIndex];
    if (!current) return;

    const key = `${experienceId}:${taskIndex}`;
    setImprovingKey(key);
    try {
      const res = await fetch('/api/ai/bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({
          bullet: current,
          jobTitle: exp.jobTitle,
          company: exp.company,
          description: exp.description,
          locale,
        }),
      });
      const json = await res.json();
      if (res.ok && json.bullet) {
        const newTasks = [...exp.tasks];
        newTasks[taskIndex] = json.bullet;
        updateExperience(experienceId, { tasks: newTasks });
      }
    } catch (err) {
      console.error('Improve bullet failed:', err);
    } finally {
      setImprovingKey(null);
    }
  };

  const handleAddExperience = () => {
    const newExp = createEmptyExperience();
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  const getSuggestions = (title: string): string[] => {
    const category = classifyTitle(title);
    const localeSet = TASK_SUGGESTIONS[locale] ?? TASK_SUGGESTIONS.nl;
    return localeSet[category];
  };

  const handleAddTask = (experienceId: string, task: string) => {
    const exp = cvData.experience.find((e) => e.id === experienceId);
    if (exp && !exp.tasks.includes(task)) {
      updateExperience(experienceId, { tasks: [...exp.tasks, task] });
    }
  };

  const handleRemoveTask = (experienceId: string, taskIndex: number) => {
    const exp = cvData.experience.find((e) => e.id === experienceId);
    if (exp) {
      const newTasks = exp.tasks.filter((_, i) => i !== taskIndex);
      updateExperience(experienceId, { tasks: newTasks });
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      {/* Always-visible Add button — sticks to the top of the scroll viewport
          so it stays accessible no matter how many entries the user has. */}
      <button
        type="button"
        onClick={handleAddExperience}
        className="sticky top-0 z-10 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/90 hover:bg-emerald-50/80 backdrop-blur text-slate-600 hover:text-emerald-700 text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t('addNew')}
      </button>

      <div className="space-y-3">
        {cvData.experience.map((exp, index) => (
          <Card key={exp.id} padding="none" className="overflow-hidden">
            <div className="flex items-center gap-1 hover:bg-slate-50 transition-colors">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="flex-1 min-w-0 flex items-center gap-3 text-left p-3.5"
                aria-expanded={expandedId === exp.id}
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <h3 className="font-medium text-slate-900 truncate min-w-0">
                  {exp.company || t('newEntry')}
                </h3>
              </button>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="p-2 mr-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                aria-label={t('delete')}
                title={t('delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="p-2 mr-1 text-slate-400 hover:text-slate-600 flex-shrink-0"
                aria-label={expandedId === exp.id ? 'Inklappen' : 'Uitklappen'}
              >
                {expandedId === exp.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {expandedId === exp.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label={t('jobTitle')}
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                    required
                    tooltip={tip('jobTitle')}
                    showValidCheck
                  />
                  <Input
                    label={t('company')}
                    placeholder={t('companyPlaceholder')}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    required
                    tooltip={tip('company')}
                    showValidCheck
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-3 gap-y-3">
                  <Input
                    type="month"
                    label={t('startDate')}
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                  <Input
                    type="month"
                    label={t('endDate')}
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    disabled={exp.current}
                  />
                  <Input
                    label={`${t('location')} ${tPersonal('optionalSuffix')}`}
                    placeholder={t('locationPlaceholder')}
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    className="col-span-2 sm:col-span-1"
                  />
                </div>
                <label className="flex items-center gap-2 -mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) =>
                      updateExperience(exp.id, {
                        current: e.target.checked,
                        endDate: e.target.checked ? '' : exp.endDate,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600">{t('currentPosition')}</span>
                </label>

                <TextArea
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  rows={2}
                  tooltip={tip('description')}
                />

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 inline-flex items-center">
                    {t('tasks')}
                    <FieldTooltip content={tip('tasks')} label={`Uitleg ${t('tasks')}`} />
                  </label>

                  <div className="space-y-2">
                    {exp.tasks.map((task, taskIndex) => {
                      const key = `${exp.id}:${taskIndex}`;
                      const isImproving = improvingKey === key;
                      return (
                        <div
                          key={taskIndex}
                          className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg group"
                        >
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span className="flex-1 text-sm text-slate-700">{task}</span>
                          <button
                            onClick={() => handleImproveTask(exp.id, taskIndex)}
                            disabled={isImproving}
                            title={t('improveBullet')}
                            className="opacity-0 group-hover:opacity-100 disabled:opacity-100 text-slate-400 hover:text-violet-600 transition-all disabled:text-violet-600"
                          >
                            {isImproving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Wand2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveTask(exp.id, taskIndex)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <Input
                    placeholder={t('addTaskPlaceholder')}
                    className="mt-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleAddTask(exp.id, e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />

                  {!hiddenSuggestions.has(exp.id) && (
                    <div className="mt-3 rounded-lg bg-emerald-50/60 border border-emerald-200 px-3 py-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
                          <Sparkles className="w-3.5 h-3.5" />
                          {t('aiHint')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHiddenSuggestions((prev) => new Set(prev).add(exp.id))}
                          className="text-emerald-400 hover:text-emerald-600"
                          aria-label="Verberg suggesties"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {getSuggestions(exp.jobTitle).map((task, i) => {
                          const added = exp.tasks.includes(task);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddTask(exp.id, task)}
                              disabled={added}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                                added
                                  ? 'bg-emerald-200/60 text-emerald-700 cursor-not-allowed'
                                  : 'bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200'
                              }`}
                            >
                              {added ? (
                                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <Plus className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                              )}
                              <span className="line-clamp-1">{task}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hiddenSuggestions.has(exp.id) && (
                    <button
                      type="button"
                      onClick={() =>
                        setHiddenSuggestions((prev) => {
                          const next = new Set(prev);
                          next.delete(exp.id);
                          return next;
                        })
                      }
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('showSuggestions')}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
}
