'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { ColorSchemeId } from '@/types/cv';
import { COLOR_SCHEME_LIST } from '@/lib/colorSchemes';
import { useCVData } from '@/context/CVContext';

interface ColorPickerProps {
  compact?: boolean;
}

export function ColorPicker({ compact = false }: ColorPickerProps) {
  const { cvData, setColorScheme } = useCVData();
  const t = useTranslations('ColorPicker');
  const selectedColor: ColorSchemeId = cvData.meta.selectedColorScheme ?? 'emerald';

  return (
    <div>
      <h3 className={`font-semibold text-slate-900 ${compact ? 'text-sm mb-3 mt-4' : 'text-sm sm:text-base mb-3'}`}>
        {t('heading')}
      </h3>

      {/* Mobile: Simple color circles */}
      <div className="flex justify-between sm:hidden">
        {COLOR_SCHEME_LIST.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => setColorScheme(scheme.id)}
            className="relative p-1"
            title={t(`names.${scheme.id}`)}
          >
            <div
              className={`w-8 h-8 rounded-full transition-all ${
                selectedColor === scheme.id
                  ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{
                background: `linear-gradient(135deg, ${scheme.gradient.from}, ${scheme.gradient.to})`,
              }}
            />
            {selectedColor === scheme.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            {scheme.id === 'emerald' && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-amber-600 font-bold whitespace-nowrap">
                {t('popular')}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Desktop: Full buttons with labels */}
      <div className="hidden sm:flex flex-wrap justify-center lg:justify-between gap-3 pt-1">
        {COLOR_SCHEME_LIST.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => setColorScheme(scheme.id)}
            className={`group relative flex items-center gap-2 rounded-xl border-2 transition-all ${
              compact ? 'px-3 py-2' : 'px-3 py-2'
            } ${
              selectedColor === scheme.id
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title={t(`names.${scheme.id}`)}
          >
            {scheme.id === 'emerald' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10">
                {t('mostChosen')}
              </div>
            )}

            <div
              className="rounded-full w-5 h-5"
              style={{
                background: `linear-gradient(135deg, ${scheme.gradient.from}, ${scheme.gradient.to})`,
              }}
            />

            <span className="font-medium text-sm text-slate-700">
              {t(`names.${scheme.id}`)}
            </span>

            {selectedColor === scheme.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
