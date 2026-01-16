'use client';

import React from 'react';
import { TemplateId } from '@/types/cv';
import { TEMPLATES } from '@/components/preview/templates';
import { TemplateCard } from './TemplateCard';
import { ColorPicker } from './ColorPicker';
import { useCVData } from '@/context/CVContext';

interface TemplateSelectorProps {
  mode: 'onboarding' | 'inline';
  onSelect?: (templateId: TemplateId) => void;
  onSkip?: () => void;
}

export function TemplateSelector({ mode, onSelect, onSkip }: TemplateSelectorProps) {
  const { cvData, setTemplate } = useCVData();
  const selectedTemplate = cvData.meta.selectedTemplate ?? 'modern';

  const handleSelect = (templateId: TemplateId) => {
    setTemplate(templateId);
    onSelect?.(templateId);
  };

  const templateList = Object.values(TEMPLATES);

  if (mode === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Kies je CV-sjabloon
            </h1>
            <p className="text-slate-600 text-lg">
              Selecteer een design dat bij jou past. Je kunt dit later altijd wijzigen.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {templateList.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* Color Picker */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
            <ColorPicker />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => onSelect?.(selectedTemplate)}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Doorgaan met {TEMPLATES[selectedTemplate].nameNL}
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="text-slate-500 hover:text-slate-700 text-sm underline underline-offset-2"
              >
                Sla over en kies later
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Inline mode (for modal)
  return (
    <div className="p-4 sm:p-6">
      <div className="text-center mb-4">
        <p className="text-slate-600 text-sm">
          Je gegevens blijven behouden wanneer je van sjabloon of kleur wisselt.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {templateList.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={handleSelect}
            compact
          />
        ))}
      </div>

      {/* Color Picker */}
      <ColorPicker compact />
    </div>
  );
}
