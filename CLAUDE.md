# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint (uses eslint-config-next with TypeScript)
npm start        # Start production server
npx tsc --noEmit # Type-check without emitting files
```

## Architecture

This is a Next.js 16 CV builder application (ResuBox) written in Dutch (nl_NL locale). Uses App Router with React 19 and Tailwind CSS v4.

### External Services

- **Supabase**: Database for orders and CV data (with localStorage fallback)
- **Mollie**: Payment processing (€42 per CV download)
- **Resend**: Transactional emails (confirmation, invoices, reminders)

Required environment variables (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `MOLLIE_API_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` (simple admin auth)
- `NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`

### Key Data Flow

All CV data is managed through `CVContext` (`src/context/CVContext.tsx`) which provides:
- State management for all CV sections (personal, profile, experience, education, skills)
- Auto-save to localStorage with 300ms debounce
- Magic link session restoration via URL token parameter
- CRUD operations for array-based sections (experience, education, skills)

### Route Structure

- `/` - Landing page with Hero, USPSection, FAQ, Footer components
- `/builder` - Main CV editor wrapped in `CVProvider`
- `/admin` - Order management dashboard (requires login)
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
├── admin/            # Admin dashboard components
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

- `POST /api/optimize-cv` - AI-powered CV optimization against job vacancies
- `POST /api/email/send` - Send transactional emails via Resend
- `POST /api/mollie/webhook` - Mollie payment status webhook
- `POST /api/admin/login` - Admin authentication
- `GET /api/cron/process-orders` - Scheduled order processing (every 15 min via Vercel cron, see `vercel.json`)
- `GET /api/postcode/lookup` - Dutch postal code address lookup

### Order Flow

Orders use status pipeline defined in `src/lib/orderStatusConfig.ts`:
`nieuw` → `bevestigd` → `factuur_verstuurd` → `herinnering_1` → `herinnering_2` → `betaald` (or `afgeboekt`)

Order operations in `src/lib/orders.ts` handle both Supabase and localStorage fallback.

### PDF Export

Uses jspdf + html2canvas + html-to-image for generating downloadable PDFs from the preview component.

### Type Definitions

CV data types are defined in `src/types/cv.ts`:
- `CVData` - Root type containing all sections plus metadata (`CVMeta`)
- `CVMeta` - Stores template selection, color scheme, payment status, magic link tokens
- Helper functions: `createEmptyCVData()`, `createEmptyExperience()`, `createEmptyEducation()`, `createEmptySkill()`

Admin types in `src/types/admin.ts`: `CVOrder`, `OrderStatus`, `OrderAction`, `OrderStatistics`

### Import Aliases

Use `@/*` to import from `src/*` (configured in tsconfig.json).

### Admin Authentication

Simple token-based auth in `src/lib/auth.ts`. Tokens stored in localStorage with 24-hour expiry. Sessions auto-extend on each authenticated request.
