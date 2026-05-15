import { TemplateId, CVData, ColorScheme, ColorSchemeId } from '@/types/cv';
import type { Locale } from '@/i18n/routing';

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
  /** Locale used to render section labels and dates. Defaults to 'nl'. */
  locale?: Locale | string;
}
