import { TemplateId, CVData, ColorScheme, ColorSchemeId } from '@/types/cv';

export interface TemplateConfig {
  id: TemplateId;
  nameNL: string;
  descriptionNL: string;
  features: string[];
  accentColor: ColorSchemeId;
}

export interface TemplateProps {
  cvData: CVData;
  colorScheme?: ColorScheme;
}
