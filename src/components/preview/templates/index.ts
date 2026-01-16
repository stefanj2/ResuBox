import { TemplateId } from '@/types/cv';
import { TemplateConfig } from './types';

export { ModernTemplate } from './ModernTemplate';
export { ZakelijkTemplate } from './ZakelijkTemplate';
export { CreatiefTemplate } from './CreatiefTemplate';
export { MinimalistTemplate } from './MinimalistTemplate';
export { ExecutiveTemplate } from './ExecutiveTemplate';
export { TechTemplate } from './TechTemplate';
export type { TemplateConfig, TemplateProps } from './types';

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  modern: {
    id: 'modern',
    nameNL: 'Modern',
    descriptionNL: 'Gekleurde zijbalk met persoonlijke info, hoofdinhoud rechts',
    features: ['Gekleurde zijbalk', 'Ronde profielfoto', 'Sans-serif'],
    accentColor: 'emerald',
  },
  zakelijk: {
    id: 'zakelijk',
    nameNL: 'Zakelijk',
    descriptionNL: 'Traditionele opmaak, serif koppen, professioneel en compact',
    features: ['Klassieke indeling', 'Grijze lijnen', 'Serif koppen'],
    accentColor: 'slate',
  },
  creatief: {
    id: 'creatief',
    nameNL: 'Creatief',
    descriptionNL: 'Opvallende header, moderne grid, iconen bij secties',
    features: ['Grote naam-header', 'Unieke grid', 'Sectie-iconen'],
    accentColor: 'violet',
  },
  minimalist: {
    id: 'minimalist',
    nameNL: 'Minimalist',
    descriptionNL: 'Ultra-clean design met veel witruimte en elegante lijnen',
    features: ['Veel witruimte', 'Subtiele accenten', 'Elegant & rustig'],
    accentColor: 'rose',
  },
  executive: {
    id: 'executive',
    nameNL: 'Executive',
    descriptionNL: 'Premium donkere header met gouden accenten, directieniveau',
    features: ['Donkere header', 'Gouden accenten', 'Premium uitstraling'],
    accentColor: 'amber',
  },
  tech: {
    id: 'tech',
    nameNL: 'Tech',
    descriptionNL: 'Moderne tech-look met donkere zijbalk en gradient accenten',
    features: ['Dark mode zijbalk', 'Skill progress bars', 'Gradient kleuren'],
    accentColor: 'teal',
  },
};
