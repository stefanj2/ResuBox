'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TemplateId } from '@/types/cv';
import { TemplateConfig } from '@/components/preview/templates';
import { TemplateThumbnail } from '@/components/preview/thumbnails';

interface TemplateCardProps {
  template: TemplateConfig;
  isSelected: boolean;
  onSelect: (id: TemplateId) => void;
  compact?: boolean;
}

export function TemplateCard({ template, isSelected, onSelect, compact = false }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`relative flex flex-col items-center rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
        compact ? 'p-2 sm:p-3' : 'p-4'
      } ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/20'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className={`absolute ${compact ? 'top-2 right-2 w-5 h-5' : 'top-3 right-3 w-6 h-6'} bg-emerald-500 rounded-full flex items-center justify-center`}>
          <Check className={compact ? 'w-3 h-3 text-white' : 'w-4 h-4 text-white'} />
        </div>
      )}

      {/* Thumbnail */}
      <div className={compact ? 'mb-2' : 'mb-4'}>
        <TemplateThumbnail templateId={template.id} scale={compact ? 0.14 : 0.2} />
      </div>

      {/* Template Info */}
      <div className="text-center">
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
          {template.nameNL}
        </h3>
        {!compact && (
          <>
            <p className="text-sm text-slate-600 mt-1 mb-3">
              {template.descriptionNL}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-1">
              {template.features.map((feature, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </button>
  );
}
