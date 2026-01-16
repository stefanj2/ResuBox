'use client';

import React from 'react';
import { TemplateId } from '@/types/cv';
import {
  ModernTemplate,
  ZakelijkTemplate,
  CreatiefTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  TechTemplate,
} from '../templates';
import { sampleCVData } from './sampleData';

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  zakelijk: ZakelijkTemplate,
  creatief: CreatiefTemplate,
  minimalist: MinimalistTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
} as const;

interface TemplateThumbnailProps {
  templateId: TemplateId;
  scale?: number;
}

export function TemplateThumbnail({ templateId, scale = 0.22 }: TemplateThumbnailProps) {
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];
  const sampleData = { ...sampleCVData, meta: { ...sampleCVData.meta, selectedTemplate: templateId } };

  // A4 dimensions in mm: 210 x 297
  // At scale 0.22, this becomes roughly 46.2mm x 65.3mm which is about 175px x 248px
  const containerWidth = 210 * scale;
  const containerHeight = 297 * scale;

  return (
    <div
      className="relative overflow-hidden bg-white rounded-lg shadow-md"
      style={{
        width: `${containerWidth}mm`,
        height: `${containerHeight}mm`,
      }}
    >
      <div
        className="pointer-events-none origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: '210mm',
          height: '297mm',
        }}
      >
        <TemplateComponent cvData={sampleData} />
      </div>
    </div>
  );
}
