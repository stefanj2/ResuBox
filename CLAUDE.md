# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint (uses eslint-config-next with TypeScript)
npm start            # Start production server
npx tsc --noEmit     # Type-check without emitting files
npm run db:generate  # Generate Drizzle migration from src/db/schema.ts
npm run db:migrate   # Apply migrations to the Neon database
npm run db:studio    # Open Drizzle Studio (browser GUI for the DB)
```

## Architecture

This is a Next.js 16 CV builder application (ResuBox) written in Dutch (nl_NL locale). Uses App Router with React 19 and Tailwind CSS v4.

### External Services

- **Neon (Postgres via Vercel)**: Database for orders, actions, and analytics. Schema managed via Drizzle ORM (`src/db/schema.ts`) and drizzle-kit migrations (`src/db/migrations/`).
- **Stripe**: Payment processing via Stripe Checkout (iDEAL, creditcard, Bancontact) - €42 per CV download, €82 na incasso
- **Resend**: Transactional emails (confirmation, invoices, reminders, incasso)
- **Justus Collect**: Incassobureau integratie voor onbetaalde dossiers na WIK-brief

Required environment variables:
- `DATABASE_URL` (Neon Postgres connection string — set automatically by the Vercel ↔ Neon integration; pull locally via `vercel env pull .env.local`)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `FROM_EMAIL_INCASSO`
- `JUSTUS_API_KEY` (Justus Collect incasso integratie)
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

- `POST /api/optimize-cv` - AI-powered CV optimization against job vacancies (10 req/min)
- `POST /api/orders` - Create a new order (used by client checkout/test flows, 20 req/min)
- `GET /api/admin/orders` - List orders with optional `status`/`search` filters
- `GET /api/admin/orders/stats` - Aggregated order statistics
- `GET|PATCH|DELETE /api/admin/orders/[id]` - Read/update/delete a single order
- `PATCH /api/admin/orders/[id]/status` - Update order status with action log
- `POST /api/admin/orders/[id]/actions` - Append an action entry to an order's history
- `POST /api/email/send` - Send transactional emails via Resend (10 req/min)
- `POST /api/stripe/create-checkout` - Create Stripe Checkout Session (iDEAL, card, Bancontact)
- `POST /api/stripe/webhook` - Stripe payment webhook (signature verified, no rate limit)
- `POST /api/justus/webhook` - Justus Collect incasso webhook (API key auth, no rate limit)
- `POST /api/admin/login` - Admin authentication (5 req/15min)
- `GET /api/cron/process-orders` - Scheduled order processing (no rate limit, CRON_SECRET auth)
- `POST /api/analytics/track` - Track analytics events (100 req/min)
- `GET /api/analytics/stats` - Fetch analytics statistics (30 req/min)
- `GET /api/postcode/lookup` - Dutch postal code address lookup via PDOK (30 req/min)

### Rate Limiting

In-memory sliding-window rate limiter per IP (`src/lib/rate-limit.ts`). Returns 429 when exceeded. Not applied to trusted/authenticated routes (Stripe webhook, cron).

### Order Flow

Orders use status pipeline defined in `src/lib/orderStatusConfig.ts`:
`nieuw` → `bevestigd` → `factuur_verstuurd` → `herinnering_1` → `herinnering_2` → `incasso_overgedragen` → `betaald` (or `afgeboekt`)

After the WIK-brief (herinnering_2), if unpaid after 28 days total, the order is automatically transferred to Justus Collect incasso. The amount increases from €42 to €82 (incl. wettelijke incassokosten). If payment is received directly after incasso transfer, the Justus case is automatically withdrawn.

Order operations live in `src/lib/orders.ts` (server-only, Drizzle) and are reachable from the browser via thin fetch wrappers in `src/lib/api/orders.ts`. Client components must import from `@/lib/api/orders`, never directly from `@/lib/orders`.

### Database Layer

- Schema: `src/db/schema.ts` (Drizzle table definitions for `cv_orders`, `order_actions`, `analytics_events`)
- Client: `src/lib/db.ts` (Neon HTTP driver via `@neondatabase/serverless`, wrapped by Drizzle, `server-only`)
- Migrations: generated into `src/db/migrations/` with `npm run db:generate`, applied with `npm run db:migrate`
- Setup: in the Vercel dashboard, add Neon via Storage → Marketplace, connect to this project (auto-sets `DATABASE_URL` across envs), then `vercel env pull .env.local` and `npm run db:migrate`

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
