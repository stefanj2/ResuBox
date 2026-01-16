# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint (uses eslint-config-next with TypeScript)
npm start        # Start production server
```

## Architecture

This is a Next.js 16 CV builder application written in Dutch (nl_NL locale). It uses the App Router with React 19 and Tailwind CSS v4.

### Key Data Flow

All CV data is managed through `CVContext` (`src/context/CVContext.tsx`) which provides:
- State management for all CV sections (personal, profile, experience, education, skills)
- Auto-save to localStorage with 300ms debounce
- Magic link session restoration via URL token parameter
- CRUD operations for array-based sections (experience, education, skills)

### Route Structure

- `/` - Landing page with Hero, USPSection, FAQ, Footer components
- `/builder` - Main CV editor wrapped in `CVProvider`

### Component Organization

```
src/components/
├── editor/           # CV form editing
│   ├── EditorLayout.tsx    # Main split-view layout (editor + preview)
│   ├── Sidebar.tsx         # Section navigation with completion indicators
│   └── sections/           # Individual form sections (Personal, Profile, etc.)
├── preview/          # Live A4 CV preview
│   └── PreviewA4.tsx       # Renders CV in A4 dimensions (210mm × 297mm)
├── download/         # Download flow with payment agreement
│   └── DownloadModal.tsx   # Invoice-based download (€42 via factuur achteraf)
├── landing/          # Marketing page components
└── ui/               # Reusable components (Button, Input, TextArea, Modal, Card)
```

### Type Definitions

CV data types are defined in `src/types/cv.ts`:
- `CVData` - Root type containing all sections plus metadata
- Helper functions: `createEmptyCVData()`, `createEmptyExperience()`, `createEmptyEducation()`, `createEmptySkill()`

### Import Aliases

Use `@/*` to import from `src/*` (configured in tsconfig.json).
