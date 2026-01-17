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
    // Only update the template, don't trigger onSelect (that's for the "Doorgaan" button)
    setTemplate(templateId);
  };

  const templateList = Object.values(TEMPLATES);

  if (mode === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-3 py-6 sm:p-6">
        <div className="max-w-6xl w-full">
          {/* Header - compact on mobile */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
              Kies je CV-sjabloon
            </h1>
            <p className="text-slate-600 text-sm sm:text-lg">
              Je kunt dit later altijd wijzigen.
            </p>
          </div>

          {/* Template Grid - 6 templates on 1 row on desktop */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6 pt-2">
            {templateList.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelect}
                showPopularBadge={template.id === 'modern'}
                compact
              />
            ))}
          </div>

          {/* Color Picker */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 mb-6 sm:mb-8">
            <ColorPicker />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <button
              onClick={() => onSelect?.(selectedTemplate)}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 min-h-[48px]"
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
      {/* Mobile: Horizontal scrolling templates */}
      <div className="sm:hidden">
        <p className="text-slate-600 text-sm text-center mb-4">
          Swipe om alle sjablonen te bekijken
        </p>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {templateList.map((template) => (
              <div key={template.id} className="w-[140px] flex-shrink-0">
                <TemplateCard
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={handleSelect}
                  showPopularBadge={template.id === 'modern'}
                  compact
                />
              </div>
            ))}
          </div>
        </div>

        {/* Color Picker - Mobile */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <ColorPicker compact />
        </div>

        {/* Confirm button - Mobile */}
        <button
          onClick={() => onSelect?.(selectedTemplate)}
          className="w-full mt-6 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Toepassen
        </button>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:block">
        <div className="text-center mb-4">
          <p className="text-slate-600 text-sm">
            Je gegevens blijven behouden wanneer je van sjabloon of kleur wisselt.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={handleSelect}
              showPopularBadge={template.id === 'modern'}
              compact
            />
          ))}
        </div>

        {/* Color Picker */}
        <ColorPicker compact />
      </div>
    </div>
  );
}
