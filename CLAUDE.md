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
- `/faq`, `/contact`, `/privacy`, `/voorwaarden` - Static pages

### Component Organization

```
src/components/
├── editor/           # CV form editing
│   ├── EditorLayout.tsx    # Main split-view layout (editor + preview)
│   ├── Sidebar.tsx         # Section navigation with completion indicators
│   └── sections/           # Individual form sections (Personal, Profile, etc.)
├── preview/          # Live A4 CV preview
│   ├── CVPreview.tsx       # Template router based on meta.selectedTemplate
│   └── templates/          # 6 template components (Modern, Zakelijk, Creatief, etc.)
├── templateSelector/ # Template and color scheme picker
├── download/         # Download flow with payment agreement
├── landing/          # Marketing page components
└── ui/               # Reusable components (Button, Input, TextArea, Modal, Card)
```

### Template System

Templates are in `src/components/preview/templates/`. Each template:
- Implements `TemplateProps` interface (`cvData: CVData`, `colorScheme?: ColorScheme`)
- Renders at A4 dimensions (210mm × 297mm) with inline styles for PDF export
- Uses color values from `ColorScheme` passed via props

Template IDs: `modern`, `zakelijk`, `creatief`, `minimalist`, `executive`, `tech`
Color schemes defined in `src/lib/colorSchemes.ts`: emerald, blue, violet, rose, amber, slate, teal, orange

### API Routes

`POST /api/optimize-cv` - Vacancy-based CV optimization
- Accepts vacancy URL/text, fetches and extracts keywords
- Returns optimized profile/experience/skills with change diffs and match score

### PDF Export

Uses jspdf + html2canvas + html-to-image for generating downloadable PDFs from the preview component.

### Type Definitions

CV data types are defined in `src/types/cv.ts`:
- `CVData` - Root type containing all sections plus metadata (`CVMeta`)
- `CVMeta` - Stores template selection, color scheme, payment status, magic link tokens
- Helper functions: `createEmptyCVData()`, `createEmptyExperience()`, `createEmptyEducation()`, `createEmptySkill()`

### Import Aliases

Use `@/*` to import from `src/*` (configured in tsconfig.json).
