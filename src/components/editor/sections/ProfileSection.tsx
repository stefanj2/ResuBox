'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { TextArea, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

export function ProfileSection() {
  const { cvData, updateProfile } = useCVData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const canGenerate =
    cvData.experience.length > 0 || cvData.education.length > 0 || cvData.skills.length > 0;

  const handleGenerateProfile = async () => {
    if (!canGenerate) {
      setError('Vul eerst werkervaring, opleiding of vaardigheden in zodat AI een passend profiel kan schrijven.');
      return;
    }
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ai/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Generatie mislukt');
        return;
      }
      if (json.profile && typeof json.profile === 'string') {
        updateProfile(json.profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onverwachte fout');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profielschets</h2>
        <p className="text-slate-600">
          Schrijf een korte samenvatting over jezelf. Dit is het eerste wat recruiters lezen.
        </p>
      </div>

      {/* AI Generate */}
      <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              AI-profiel op basis van jouw werkervaring
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Claude analyseert je ingevulde werkervaring, opleiding en skills en schrijft een
              2-3 zinnen profiel zonder clichés.
            </p>
            <Button
              variant="outline"
              icon={isGenerating ? Loader2 : Sparkles}
              onClick={handleGenerateProfile}
              disabled={isGenerating || !canGenerate}
              className={isGenerating ? '[&>svg]:animate-spin' : ''}
            >
              {isGenerating ? 'Schrijven...' : 'Schrijf voor mij'}
            </Button>
            {error && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile TextArea */}
      <TextArea
        label="Jouw profielschets"
        placeholder="Beschrijf in 2-3 zinnen wie je bent, wat je kunt en wat je zoekt. Tip: focus op je sterke punten en wat je uniek maakt."
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
