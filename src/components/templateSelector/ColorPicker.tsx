'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { ColorSchemeId } from '@/types/cv';
import { COLOR_SCHEME_LIST } from '@/lib/colorSchemes';
import { useCVData } from '@/context/CVContext';

interface ColorPickerProps {
  compact?: boolean;
}

export function ColorPicker({ compact = false }: ColorPickerProps) {
  const { cvData, setColorScheme } = useCVData();
  const selectedColor = cvData.meta.selectedColorScheme ?? 'emerald';

  return (
    <div className={compact ? '' : 'mt-6 pt-6 border-t border-slate-100'}>
      <h3 className={`font-semibold text-slate-900 ${compact ? 'text-sm mb-3' : 'text-base mb-4'}`}>
        Kleurschema
      </h3>
      <div className="flex flex-wrap gap-2">
        {COLOR_SCHEME_LIST.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => setColorScheme(scheme.id)}
            className={`group relative flex items-center gap-2 rounded-xl border-2 transition-all ${
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            } ${
              selectedColor === scheme.id
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title={scheme.name}
          >
            {/* Color swatch */}
            <div
              className={`rounded-full ${compact ? 'w-5 h-5' : 'w-6 h-6'}`}
              style={{
                background: `linear-gradient(135deg, ${scheme.gradient.from}, ${scheme.gradient.to})`,
              }}
            />

            {/* Name */}
            <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} text-slate-700`}>
              {scheme.name}
            </span>

            {/* Selected indicator */}
            {selectedColor === scheme.id && (
              <div className={`absolute ${compact ? '-top-1 -right-1 w-4 h-4' : '-top-1.5 -right-1.5 w-5 h-5'} bg-slate-900 rounded-full flex items-center justify-center`}>
                <Check className={compact ? 'w-2.5 h-2.5 text-white' : 'w-3 h-3 text-white'} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
