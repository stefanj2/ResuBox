'use client';

import React from 'react';
import { useCVData } from '@/context/CVContext';
import { CVData, TemplateId, ColorSchemeId } from '@/types/cv';
import { getColorScheme } from '@/lib/colorSchemes';
import {
  ModernTemplate,
  ZakelijkTemplate,
  CreatiefTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  TechTemplate,
} from './templates';

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  zakelijk: ZakelijkTemplate,
  creatief: CreatiefTemplate,
  minimalist: MinimalistTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
} as const;

interface CVPreviewProps {
  templateOverride?: TemplateId;
  dataOverride?: CVData;
  colorSchemeOverride?: ColorSchemeId;
}

export function CVPreview({ templateOverride, dataOverride, colorSchemeOverride }: CVPreviewProps) {
  const { cvData } = useCVData();

  const data = dataOverride ?? cvData;
  const templateId = templateOverride ?? data.meta.selectedTemplate ?? 'modern';
  const colorSchemeId = colorSchemeOverride ?? data.meta.selectedColorScheme ?? 'emerald';
  const colorScheme = getColorScheme(colorSchemeId);
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];

  return <TemplateComponent cvData={data} colorScheme={colorScheme} />;
}
