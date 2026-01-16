'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  FileText,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wand2,
  ArrowRight,
  Bot,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { CVData, Skill } from '@/types/cv';

interface OptimizationResult {
  optimizedData: Partial<CVData>;
  changes: {
    field: string;
    original: string;
    optimized: string;
    reason: string;
  }[];
  matchScore: number;
  keywords: string[];
  suggestedSkills?: string[];
}

type InputMode = 'url' | 'text';

export function VacancySection() {
  const { cvData, updateProfile, updateExperience, addSkill } = useCVData();

  // Input state
  const [vacancyInputMode, setVacancyInputMode] = useState<InputMode>('url');
  const [vacancyUrl, setVacancyUrl] = useState('');
  const [vacancyText, setVacancyText] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');

  // Process state
  const [status, setStatus] = useState<'input' | 'analyzing' | 'results' | 'applying' | 'done' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set([0]));
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const toggleChange = (index: number) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChanges(newExpanded);
  };

  const handleAnalyze = async () => {
    // Validation
    if (vacancyInputMode === 'url' && !vacancyUrl.trim()) {
      setErrorMessage('Vul een vacature URL in of plak de tekst.');
      return;
    }
    if (vacancyInputMode === 'text' && !vacancyText.trim()) {
      setErrorMessage('Vul de vacaturetekst in of gebruik een URL.');
      return;
    }

    setStatus('analyzing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/optimize-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          vacancyUrl: vacancyInputMode === 'url' ? vacancyUrl : undefined,
          vacancyText: vacancyInputMode === 'text' ? vacancyText : undefined,
          companyUrl: companyUrl || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Optimization failed');
      }

      const data = await response.json();
      setResult(data);
      setStatus('results');
      setExpandedChanges(new Set([0]));
    } catch (error) {
      console.error('Optimization error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis bij het analyseren. Probeer het opnieuw.');
      setStatus('error');
    }
  };

  const handleApplyChanges = async () => {
    if (!result) return;

    setStatus('applying');

    try {
      // Apply profile changes
      if (result.optimizedData.profile?.summary) {
        updateProfile(result.optimizedData.profile.summary);
      }

      // Apply experience changes
      if (result.optimizedData.experience) {
        result.optimizedData.experience.forEach((exp) => {
          updateExperience(exp.id, exp);
        });
      }

      // Apply any added suggested skills
      addedSkills.forEach((skillName) => {
        const newSkill: Skill = {
          id: crypto.randomUUID(),
          name: skillName,
          level: 'gemiddeld',
          category: '',
        };
        addSkill(newSkill);
      });

      // Small delay to show the applying state
      await new Promise(resolve => setTimeout(resolve, 500));

      setStatus('done');
    } catch (error) {
      console.error('Apply changes error:', error);
      setErrorMessage('Er ging iets mis bij het toepassen van de wijzigingen.');
      setStatus('error');
    }
  };

  const handleAddSuggestedSkill = (skillName: string) => {
    setAddedSkills((prev) => new Set([...prev, skillName]));
  };

  const handleRemoveSuggestedSkill = (skillName: string) => {
    setAddedSkills((prev) => {
      const newSet = new Set(prev);
      newSet.delete(skillName);
      return newSet;
    });
  };

  const handleReset = () => {
    setStatus('input');
    setResult(null);
    setErrorMessage('');
    setVacancyUrl('');
    setVacancyText('');
    setCompanyUrl('');
    setAddedSkills(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">CV Optimaliseren</h2>
            <p className="text-sm text-slate-500">Optioneel - pas je CV aan op de vacature</p>
          </div>
        </div>
        {/* AI Indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
          <Bot className="w-3.5 h-3.5" />
          <span>Aangedreven door AI-analyse</span>
        </div>
      </div>

      {/* Input Form */}
      {status === 'input' && (
        <div className="space-y-5">
          {/* Vacancy Input */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Vacature informatie
            </label>

            {/* Toggle between URL and Text */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setVacancyInputMode('url')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  vacancyInputMode === 'url'
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300'
                    : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                URL invoeren
              </button>
              <button
                onClick={() => setVacancyInputMode('text')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  vacancyInputMode === 'text'
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300'
                    : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Tekst plakken
              </button>
            </div>

            {vacancyInputMode === 'url' ? (
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={vacancyUrl}
                  onChange={(e) => {
                    setVacancyUrl(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="https://werkenbij.bedrijf.nl/vacature/..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                />
              </div>
            ) : (
              <textarea
                value={vacancyText}
                onChange={(e) => {
                  setVacancyText(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Plak hier de volledige vacaturetekst..."
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
              />
            )}
          </div>

          {/* Company Website (optional) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <span>Bedrijfswebsite</span>
              <span className="text-slate-400 font-normal ml-2">(optioneel)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://www.bedrijf.nl"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Voeg de website toe voor een nog betere match met de bedrijfscultuur.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100">
            <h4 className="font-medium text-violet-800 mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Wat wordt er geoptimaliseerd?
            </h4>
            <ul className="text-sm text-violet-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                Je profielsamenvatting wordt afgestemd op de functie
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                Relevante vaardigheden worden benadrukt
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                Werkervaring wordt aangepast met relevante keywords
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                Je CV scoort hoger bij ATS-systemen
              </li>
            </ul>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-600 text-sm p-4 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Analyze Button */}
          <Button
            variant="primary"
            onClick={handleAnalyze}
            icon={Sparkles}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            Analyseren en optimaliseren
          </Button>
        </div>
      )}

      {/* Analyzing State */}
      {status === 'analyzing' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-violet-100 rounded-full animate-ping opacity-25" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Analyseren...</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Vacature informatie ophalen
            </p>
            <p className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
              CV analyseren en optimaliseren
            </p>
            <p className="flex items-center justify-center gap-2 text-slate-400">
              <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block" />
              Wijzigingen voorbereiden
            </p>
          </div>
        </div>
      )}

      {/* Results State */}
      {status === 'results' && result && (
        <div className="space-y-5">
          {/* Match Score */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-emerald-800">Match Score</span>
              <span className="text-2xl font-bold text-emerald-600">{result.matchScore}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${result.matchScore}%` }}
              />
            </div>
            {result.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.keywords.slice(0, 8).map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Changes List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-slate-700">
                Voorgestelde wijzigingen ({result.changes.length})
              </h4>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                <Bot className="w-3 h-3" />
                AI
              </span>
            </div>
            <div className="space-y-3">
              {result.changes.map((change, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleChange(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 block">{change.field}</span>
                        <p className="text-xs text-slate-500">{change.reason}</p>
                      </div>
                    </div>
                    {expandedChanges.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedChanges.has(index) && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Origineel</span>
                        <p className="text-sm text-red-800 mt-1 line-through opacity-75">
                          {change.original.length > 250 ? change.original.substring(0, 250) + '...' : change.original}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                        <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Geoptimaliseerd</span>
                        <p className="text-sm text-emerald-800 mt-1">
                          {change.optimized.length > 250 ? change.optimized.substring(0, 250) + '...' : change.optimized}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Skills */}
          {result.suggestedSkills && result.suggestedSkills.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-sm font-medium text-slate-700">
                  Aanbevolen vaardigheden
                </h4>
                <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Bot className="w-3 h-3" />
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Deze vaardigheden komen overeen met de vacature. Klik om toe te voegen.
              </p>
              <div className="flex flex-wrap gap-2">
                {result.suggestedSkills.map((skill) => {
                  const isAdded = addedSkills.has(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => isAdded ? handleRemoveSuggestedSkill(skill) : handleAddSuggestedSkill(skill)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-violet-100 hover:text-violet-700'
                      }`}
                    >
                      {isAdded ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      {skill}
                    </button>
                  );
                })}
              </div>
              {addedSkills.size > 0 && (
                <p className="text-xs text-emerald-600 mt-3">
                  {addedSkills.size} vaardighe{addedSkills.size === 1 ? 'id' : 'den'} geselecteerd om toe te voegen
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              icon={RefreshCw}
              className="flex-1"
            >
              Opnieuw
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyChanges}
              icon={CheckCircle}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Wijzigingen toepassen
            </Button>
          </div>
        </div>
      )}

      {/* Applying State */}
      {status === 'applying' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Wijzigingen toepassen...</h3>
          <p className="text-slate-600">Even geduld, we passen je CV aan.</p>
        </div>
      )}

      {/* Done State */}
      {status === 'done' && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">CV geoptimaliseerd!</h3>
          <p className="text-slate-600 mb-6">Je CV is aangepast en klaar om te downloaden.</p>
          <Button
            variant="outline"
            onClick={handleReset}
            icon={RefreshCw}
          >
            Opnieuw optimaliseren
          </Button>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Er ging iets mis</h3>
          <p className="text-slate-600 mb-6">{errorMessage || 'Probeer het opnieuw.'}</p>
          <Button variant="primary" onClick={handleReset}>
            Opnieuw proberen
          </Button>
        </div>
      )}
    </div>
  );
}
