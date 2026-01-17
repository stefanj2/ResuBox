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

// Internal component that renders the template with provided data
function CVPreviewContent({
  data,
  templateOverride,
  colorSchemeOverride
}: {
  data: CVData;
  templateOverride?: TemplateId;
  colorSchemeOverride?: ColorSchemeId;
}) {
  const templateId = templateOverride ?? data.meta.selectedTemplate ?? 'modern';
  const colorSchemeId = colorSchemeOverride ?? data.meta.selectedColorScheme ?? 'emerald';
  const colorScheme = getColorScheme(colorSchemeId);
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];

  return <TemplateComponent cvData={data} colorScheme={colorScheme} />;
}

// Wrapper that uses context data
function CVPreviewWithContext({
  templateOverride,
  colorSchemeOverride
}: {
  templateOverride?: TemplateId;
  colorSchemeOverride?: ColorSchemeId;
}) {
  const { cvData } = useCVData();
  return (
    <CVPreviewContent
      data={cvData}
      templateOverride={templateOverride}
      colorSchemeOverride={colorSchemeOverride}
    />
  );
}

export function CVPreview({ templateOverride, dataOverride, colorSchemeOverride }: CVPreviewProps) {
  // When dataOverride is provided, render directly without context
  if (dataOverride) {
    return (
      <CVPreviewContent
        data={dataOverride}
        templateOverride={templateOverride}
        colorSchemeOverride={colorSchemeOverride}
      />
    );
  }

  // Otherwise use context
  return (
    <CVPreviewWithContext
      templateOverride={templateOverride}
      colorSchemeOverride={colorSchemeOverride}
    />
  );
}
