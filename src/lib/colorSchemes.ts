import { ColorScheme, ColorSchemeId } from '@/types/cv';

// Mooie kleurschema's met bijpassende gradients
export const COLOR_SCHEMES: Record<ColorSchemeId, ColorScheme> = {
  emerald: {
    id: 'emerald',
    name: 'Smaragd',
    primary: '#059669',      // emerald-600
    primaryLight: '#d1fae5', // emerald-100
    primaryDark: '#065f46',  // emerald-800
    gradient: {
      from: '#059669',       // emerald-600
      via: '#047857',        // emerald-700
      to: '#065f46',         // emerald-800
    },
  },
  blue: {
    id: 'blue',
    name: 'Oceaan',
    primary: '#2563eb',      // blue-600
    primaryLight: '#dbeafe', // blue-100
    primaryDark: '#1e40af',  // blue-800
    gradient: {
      from: '#2563eb',       // blue-600
      via: '#1d4ed8',        // blue-700
      to: '#1e40af',         // blue-800
    },
  },
  violet: {
    id: 'violet',
    name: 'Lavendel',
    primary: '#7c3aed',      // violet-600
    primaryLight: '#ede9fe', // violet-100
    primaryDark: '#5b21b6',  // violet-800
    gradient: {
      from: '#7c3aed',       // violet-600
      via: '#6d28d9',        // violet-700
      to: '#5b21b6',         // violet-800
    },
  },
  rose: {
    id: 'rose',
    name: 'Roos',
    primary: '#e11d48',      // rose-600
    primaryLight: '#ffe4e6', // rose-100
    primaryDark: '#9f1239',  // rose-800
    gradient: {
      from: '#e11d48',       // rose-600
      via: '#be123c',        // rose-700
      to: '#9f1239',         // rose-800
    },
  },
  amber: {
    id: 'amber',
    name: 'Goud',
    primary: '#d97706',      // amber-600
    primaryLight: '#fef3c7', // amber-100
    primaryDark: '#92400e',  // amber-800
    gradient: {
      from: '#d97706',       // amber-600
      via: '#b45309',        // amber-700
      to: '#92400e',         // amber-800
    },
  },
  slate: {
    id: 'slate',
    name: 'Grafiet',
    primary: '#475569',      // slate-600
    primaryLight: '#f1f5f9', // slate-100
    primaryDark: '#1e293b',  // slate-800
    gradient: {
      from: '#475569',       // slate-600
      via: '#334155',        // slate-700
      to: '#1e293b',         // slate-800
    },
  },
  teal: {
    id: 'teal',
    name: 'Aqua',
    primary: '#0d9488',      // teal-600
    primaryLight: '#ccfbf1', // teal-100
    primaryDark: '#115e59',  // teal-800
    gradient: {
      from: '#0d9488',       // teal-600
      via: '#0f766e',        // teal-700
      to: '#115e59',         // teal-800
    },
  },
  orange: {
    id: 'orange',
    name: 'Oranje',
    primary: '#ea580c',      // orange-600
    primaryLight: '#ffedd5', // orange-100
    primaryDark: '#9a3412',  // orange-800
    gradient: {
      from: '#ea580c',       // orange-600
      via: '#c2410c',        // orange-700
      to: '#9a3412',         // orange-800
    },
  },
};

// Helper om een kleurschema op te halen
export function getColorScheme(id: ColorSchemeId): ColorScheme {
  return COLOR_SCHEMES[id] || COLOR_SCHEMES.emerald;
}

// Lijst van alle beschikbare kleurschema's voor de picker
export const COLOR_SCHEME_LIST = Object.values(COLOR_SCHEMES);

// Tailwind class mappings voor templates die nog Tailwind classes gebruiken
export const TAILWIND_COLORS: Record<ColorSchemeId, {
  bg: string;
  bgLight: string;
  bgDark: string;
  text: string;
  textLight: string;
  border: string;
  borderLight: string;
  ring: string;
}> = {
  emerald: {
    bg: 'bg-emerald-600',
    bgLight: 'bg-emerald-100',
    bgDark: 'bg-emerald-800',
    text: 'text-emerald-600',
    textLight: 'text-emerald-200',
    border: 'border-emerald-600',
    borderLight: 'border-emerald-200',
    ring: 'ring-emerald-500',
  },
  blue: {
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-100',
    bgDark: 'bg-blue-800',
    text: 'text-blue-600',
    textLight: 'text-blue-200',
    border: 'border-blue-600',
    borderLight: 'border-blue-200',
    ring: 'ring-blue-500',
  },
  violet: {
    bg: 'bg-violet-600',
    bgLight: 'bg-violet-100',
    bgDark: 'bg-violet-800',
    text: 'text-violet-600',
    textLight: 'text-violet-200',
    border: 'border-violet-600',
    borderLight: 'border-violet-200',
    ring: 'ring-violet-500',
  },
  rose: {
    bg: 'bg-rose-600',
    bgLight: 'bg-rose-100',
    bgDark: 'bg-rose-800',
    text: 'text-rose-600',
    textLight: 'text-rose-200',
    border: 'border-rose-600',
    borderLight: 'border-rose-200',
    ring: 'ring-rose-500',
  },
  amber: {
    bg: 'bg-amber-600',
    bgLight: 'bg-amber-100',
    bgDark: 'bg-amber-800',
    text: 'text-amber-600',
    textLight: 'text-amber-200',
    border: 'border-amber-600',
    borderLight: 'border-amber-200',
    ring: 'ring-amber-500',
  },
  slate: {
    bg: 'bg-slate-600',
    bgLight: 'bg-slate-100',
    bgDark: 'bg-slate-800',
    text: 'text-slate-600',
    textLight: 'text-slate-200',
    border: 'border-slate-600',
    borderLight: 'border-slate-200',
    ring: 'ring-slate-500',
  },
  teal: {
    bg: 'bg-teal-600',
    bgLight: 'bg-teal-100',
    bgDark: 'bg-teal-800',
    text: 'text-teal-600',
    textLight: 'text-teal-200',
    border: 'border-teal-600',
    borderLight: 'border-teal-200',
    ring: 'ring-teal-500',
  },
  orange: {
    bg: 'bg-orange-600',
    bgLight: 'bg-orange-100',
    bgDark: 'bg-orange-800',
    text: 'text-orange-600',
    textLight: 'text-orange-200',
    border: 'border-orange-600',
    borderLight: 'border-orange-200',
    ring: 'ring-orange-500',
  },
};
