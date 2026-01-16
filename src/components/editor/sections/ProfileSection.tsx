'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { TextArea, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

// Gesimuleerde AI-gegenereerde profielschetsen
const aiSuggestions = [
  "Resultaatgerichte professional met {years} jaar ervaring in {industry}. Bewezen track record in het leiden van teams en het realiseren van ambitieuze doelstellingen. Sterk in stakeholder management en strategisch denken, met een passie voor continue verbetering en innovatie.",
  "Enthousiaste en gedreven {role} met een scherp oog voor detail en kwaliteit. Ervaren in het optimaliseren van processen en het coachen van collega's. Bekend om mijn proactieve houding en vermogen om onder druk te presteren.",
  "Creatieve denker met een analytische mindset. Combineert technische expertise met uitstekende communicatieve vaardigheden. Gedreven om complexe uitdagingen om te zetten in praktische oplossingen die waarde toevoegen.",
];

export function ProfileSection() {
  const { cvData, updateProfile } = useCVData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerateProfile = async () => {
    setIsGenerating(true);
    
    // Simuleer AI generatie
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Kies willekeurige suggestie en pas aan
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    const personalizedSuggestion = suggestion
      .replace('{years}', '5+')
      .replace('{industry}', 'de sector')
      .replace('{role}', 'professional');
    
    updateProfile(personalizedSuggestion);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profielschets</h2>
        <p className="text-slate-600">
          Schrijf een korte samenvatting over jezelf. Dit is het eerste wat recruiters lezen.
        </p>
      </div>

      {/* AI Generate Button */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          icon={isGenerating ? Loader2 : Sparkles}
          onClick={handleGenerateProfile}
          disabled={isGenerating}
          className={isGenerating ? '[&>svg]:animate-spin' : ''}
        >
          {isGenerating ? 'Even geduld...' : 'Genereer met AI'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          Bekijk voorbeelden
        </Button>
      </div>

      {/* Example suggestions */}
      {showSuggestions && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-slate-700">Klik om een voorbeeld te gebruiken:</p>
          {aiSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                updateProfile(suggestion
                  .replace('{years}', '5+')
                  .replace('{industry}', 'de sector')
                  .replace('{role}', 'professional')
                );
                setShowSuggestions(false);
              }}
              className="block w-full text-left p-3 bg-white rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              {suggestion.substring(0, 100)}...
            </button>
          ))}
        </div>
      )}

      {/* Profile TextArea */}
      <TextArea
        label="Jouw profielschets"
        placeholder="Beschrijf in 3-5 zinnen wie je bent, wat je kunt en wat je zoekt. Tip: focus op je sterke punten en wat je uniek maakt."
        value={cvData.profile.summary}
        onChange={(e) => updateProfile(e.target.value)}
        rows={6}
        hint={`${cvData.profile.summary.length}/500 karakters`}
      />

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips voor een sterk profiel</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Begin met je belangrijkste kwaliteit of specialisatie</li>
          <li>• Noem concrete resultaten of prestaties indien mogelijk</li>
          <li>• Houd het tussen de 50-150 woorden</li>
          <li>• Stem af op de functie waarvoor je solliciteert</li>
        </ul>
      </div>
    </div>
  );
}
