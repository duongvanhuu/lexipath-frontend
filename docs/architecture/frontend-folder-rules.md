# Frontend Folder Rules

Authoritative layout rules for `lexipath-frontend`. Complements
[`folder-rules.md`](./folder-rules.md) and
[`frontend-architecture.md`](./frontend-architecture.md).

## Top-level `src/`

```txt
src/
├── app/          # Next.js App Router (routes, layouts, server entry)
├── components/   # shared UI
│   ├── ui/       # shadcn/ui primitives (generated)
│   └── lexipath/ # LexiPath identity components (journey, golden time, skill lane…)
├── features/     # business feature modules (see below)
├── lib/          # cross-cutting infra: api/, utils/, styles/
├── providers/    # app-level providers (QueryClient, theme, intl…)
├── hooks/        # shared hooks (not feature-specific)
├── config/       # env/config access
├── constants/    # shared constant values
├── styles/       # globals.css + design tokens
└── types/        # shared TS types (not feature-specific)
```

## Feature module shape

Every feature under `src/features/<feature>/` follows the same internal layout:

```txt
src/features/<feature>/
├── api/
│   ├── <feature>.api.ts      # endpoint calls via httpClient (owns URLs)
│   ├── <feature>.dto.ts      # Spring Boot JSON contract types
│   └── <feature>.mapper.ts   # DTO -> UI/domain model
├── components/               # feature-scoped components
├── hooks/                    # TanStack Query hooks + feature hooks
├── schemas/                  # Zod schemas
├── types/                    # UI/domain types (component-facing)
└── index.ts                  # public surface of the feature
```

## Rules

- **New React components are `.tsx`** with typed props. Avoid `any`.
- **Imports use the `@/` alias.** No deep relative chains (`../../../`).
- **Split components over ~200 lines.** No large prototype files.
- **`"use client"` only when required** (hooks, events, browser APIs, forms,
  Zustand, TanStack Query, interactive Radix/shadcn). Keep the client boundary
  as low in the tree as possible.
- **shadcn primitives live in `src/components/ui`**; do not hand-roll primitives
  that shadcn provides.
- **LexiPath identity components live in `src/components/lexipath`** and are
  shared across learner features (Golden Time, skill lanes, next best step,
  journey/checkpoint, review queue, exam→SRS loop).
- **Business logic lives in `src/features`**, not in `app/` route files.
- **All HTTP goes through `src/lib/api/http-client.ts`.** Components never call
  `fetch`/`ky` directly and never import a DTO they don't need.
- A feature's `index.ts` is its only public entry; other features import from
  the barrel, not from internal paths.

## Navigation rules

- Learner UI **must not** use a sidebar.
- Admin UI **may** use a sidebar.
- Focus learning (e.g. Golden Time review) **must not** show main navigation.
