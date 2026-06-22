# CLAUDE.md — LexiPath Frontend Rules

You are working in `lexipath-frontend`.

Follow this file first. External skills are helpers, not replacements for project rules.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react, TanStack Query, Zustand, React Hook Form, Zod, TanStack Table, TanStack Virtual, Recharts, next-intl, Vitest, Testing Library, Playwright, MSW.

Backend: Java Spring Boot.

HTTP rule: use project `fetch` wrapper, not Axios/SWR/Ky. Use TanStack Query for server state.

Design source:

```txt
DESIGN_SOURCE_DIR=./lexipath-vocabulary-web-kit
```

## Required Skills

Use installed project skills when relevant:

* `/frontend-ui-engineering`: UI, layout, UX, responsive, accessibility, visual polish.
* `/vercel-react-best-practices`: Next.js/React architecture, Server/Client Components, data fetching, performance.
* `shadcn` skill: use automatically for shadcn/ui work; inspect `components.json`, use existing shadcn/Radix primitives before custom UI.

Priority:

1. `CLAUDE.md`
2. Existing codebase conventions
3. Backend API contract
4. shadcn/ui conventions
5. Vercel React/Next.js best practices
6. Frontend UI engineering polish

## Core Rules

* New React components must be `.tsx`.
* Type all props. Avoid `any`; if unavoidable, explain why.
* Use alias imports `@/`.
* Do not create large prototype files. Split components over ~200 lines.
* Do not add `"use client"` unless required by hooks, events, browser APIs, forms, Zustand, TanStack Query, or interactive Radix/shadcn components.
* Keep Client Component boundaries as low as possible.
* Use `next/link` and `next/image` where appropriate.

## UI Rules

Prefer libraries over hand-written primitives:

* Button/Card/Badge/Input/Select/Dialog/Sheet/Popover/Tooltip/Tabs/Accordion/Table/Form → shadcn/ui
* Icons → `lucide-react`
* Forms → React Hook Form + Zod + shadcn Form
* Tables → TanStack Table + shadcn Table
* Large lists → TanStack Virtual
* Charts → Recharts
* Variants → `class-variance-authority`
* className merge → `cn()`

Do not use:

* Inline style for normal layout/color/spacing
* CSS modules
* styled-components
* one-off component CSS files
* CDN icons
* `window.lucide`
* `dangerouslySetInnerHTML`
* clickable `div`

Use Tailwind v4 utilities, CSS variables, `cn()`, `cva()`, `hover:`, `focus-visible:`, `data-[state=...]`, `aria-*`.

## API / Type Rules

Separate clearly:

```txt
src/features/<feature>/
├── api/
│   ├── <feature>.api.ts
│   ├── <feature>.dto.ts
│   └── <feature>.mapper.ts
├── components/
├── hooks/
├── schemas/
├── types/
└── index.ts
```

Rules:

* DTO = backend Spring Boot JSON contract.
* UI/domain type = component-facing model.
* Mapper = DTO → UI/domain model.
* Components must not call APIs directly.
* Components should not depend on DTOs when DTO shape differs from UI needs.
* Zod schemas live in `schemas/`.
* TanStack Query hooks live in `hooks/`.
* Zustand is for local/session UI state only, not server state.

## Accessibility

* Icon buttons need `aria-label`.
* Dialog/Sheet need title.
* Form fields need label and error message.
* Clickable cards must use `button` or `Link`.
* Include loading, empty, error, disabled states where relevant.
* Preserve keyboard/focus behavior with shadcn/Radix.

## LexiPath Identity

Do not make generic SaaS dashboard UI.

Preserve LexiPath concepts:

* learning path / journey / checkpoint
* Golden Time
* skill lanes
* next best step
* exam-to-SRS loop
* vocabulary progress
* review queue
* English / Japanese / Chinese learning context

Migrate design intent, not raw prototype HTML/CSS.

## Migration Workflow

When migrating from `DESIGN_SOURCE_DIR`:

1. Read source design.
2. Identify UI intent.
3. Rebuild with TSX + Tailwind + shadcn.
4. Replace prototype styles/icons/scripts.
5. Split large components.
6. Add types, DTOs, mappers, schemas, query hooks if data is involved.
7. Preserve LexiPath identity.
8. Run checks.

## Done Means

Before saying done, run:

```bash
npm run lint
npm run typecheck
```

If tests are relevant:

```bash
npm run test
```

Done only when:

* TSX + typed props
* shadcn/Radix/lucide/cn/cva used where suitable
* no prototype inline styling
* no CDN/window icons
* API DTO and UI types separated
* mapper exists when needed
* client/server boundary is intentional
* accessibility basics are covered
* LexiPath identity is preserved
* lint/typecheck pass

## Useful Prompts

```txt
Use /frontend-ui-engineering and /vercel-react-best-practices.
Migrate this component from DESIGN_SOURCE_DIR. Follow CLAUDE.md strictly. Use shadcn/ui first, keep Client Components minimal, separate DTO/UI types if data is involved, preserve LexiPath identity, then run lint/typecheck.
```

```txt
Build this LexiPath page as production UI. Use shadcn/ui primitives, Tailwind v4, typed TSX, minimal client boundary, TanStack Query for server state, and run lint/typecheck.
```
