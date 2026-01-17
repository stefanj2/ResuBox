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
  showPopularBadge?: boolean;
}

export function TemplateCard({ template, isSelected, onSelect, compact = false, showPopularBadge = false }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`relative flex flex-col items-center rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
        compact ? 'p-1.5 sm:p-3' : 'p-3'
      } ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 ring-2 sm:ring-4 ring-emerald-500/20'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Popular badge */}
      {showPopularBadge && (
        <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap z-10">
          Populair
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className={`absolute ${compact ? 'top-1 right-1 w-4 h-4 sm:top-2 sm:right-2 sm:w-5 sm:h-5' : 'top-2 right-2 w-5 h-5'} bg-emerald-500 rounded-full flex items-center justify-center`}>
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      )}

      {/* Thumbnail */}
      <div className={compact ? 'mb-1' : 'mb-4'}>
        <div className="sm:hidden">
          <TemplateThumbnail templateId={template.id} scale={0.09} />
        </div>
        <div className="hidden sm:block">
          <TemplateThumbnail templateId={template.id} scale={compact ? 0.12 : 0.2} />
        </div>
      </div>

      {/* Template Info */}
      <div className="text-center">
        <h3 className={`font-semibold ${compact ? 'text-[10px] sm:text-sm' : 'text-lg'} ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
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
