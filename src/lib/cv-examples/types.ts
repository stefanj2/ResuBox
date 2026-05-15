import { CVData, TemplateId, ColorSchemeId } from '@/types/cv';

export interface FunctieExample {
  slug: string;
  /** Page title — also H1 */
  title: string;
  /** Meta description for SEO */
  description: string;
  /** Display name of the function */
  functie: string;
  /** Recommended template for this role */
  templateId: TemplateId;
  /** Recommended color scheme */
  colorSchemeId: ColorSchemeId;
  /** Body of the example CV — 300-500 word Dutch advice text */
  advice: Section[];
  /** The actual CV data to render in the preview */
  cv: CVData;
}

export interface Section {
  heading: string;
  body: string;
}
