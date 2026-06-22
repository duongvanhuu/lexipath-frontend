# LexiPath Frontend

Vocabulary learning and exam-practice platform for English, Japanese, and Chinese.

This repository is the **base frontend project** — a runnable Next.js skeleton with
the agreed architecture, tooling, and dependencies in place. No real features are
implemented yet.

## Requirements

- **Node.js**: 24 LTS (see `.nvmrc` / `.node-version`)
- **npm**: >= 10

```bash
nvm use        # switches to Node 24 from .nvmrc
```

## Stack

| Concern        | Library                                              |
| -------------- | ---------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)                   |
| UI runtime     | React 19 / React DOM 19                              |
| Language       | TypeScript 5.9 (strict)                              |
| UI components  | shadcn/ui + Radix primitives                         |
| Styling        | Tailwind CSS, `clsx`, `tailwind-merge`, `cva`        |
| Server state   | TanStack Query                                       |
| Client state   | Zustand                                              |
| Forms          | React Hook Form + Zod                                |
| HTTP           | `ky` (via `src/lib/api/http-client.ts`)              |
| i18n           | next-intl                                            |
| Tables / virt. | TanStack Table + TanStack Virtual                    |
| Charts         | Recharts                                             |
| Testing        | Vitest + Testing Library, Playwright (e2e), MSW      |

## Project structure

```
src/
  app/         Next.js App Router (routes, layouts, loading, error, not-found)
  components/  Shared + domain components (shadcn in components/ui)
  features/    Business modules: auth, vocabulary, learning, exam, admin
  hooks/       Shared custom hooks
  lib/         API client, utils, auth, formatters, validators
  providers/   App providers (QueryClient, Theme, i18n)
  styles/      Global CSS, Tailwind, design tokens
  types/       Shared TypeScript types
  constants/   Enums, status codes, permission codes
  config/      App / route / env config
docs/
  architecture/   Architecture + folder rules
  design-system/  Design system docs
```

See [`docs/architecture/frontend-architecture.md`](docs/architecture/frontend-architecture.md)
and [`docs/architecture/folder-rules.md`](docs/architecture/folder-rules.md).

## Getting started

```bash
nvm use
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

## Scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start dev server (Turbopack)             |
| `npm run build`     | Production build                         |
| `npm run start`     | Serve production build                   |
| `npm run lint`      | Lint                                     |
| `npm run typecheck` | `tsc --noEmit`                           |
| `npm run test`      | Unit/component tests (Vitest)            |
| `npm run format`    | Prettier                                 |
| `npm run check`     | lint + typecheck + test                  |

## Architecture rules

- No monorepo, no `apps/`, no `packages/`, no workspaces, no pnpm.
- Single source root: `src/`.
- Shared UI in `src/components`; shadcn in `src/components/ui`.
- Business logic in `src/features`.
- All API requests go through `src/lib/api/http-client.ts` — never call APIs directly from UI.
- No hardcoded API URLs or hex colors scattered in components.
- Learner UI has no sidebar; admin uses a sidebar; focus-learning hides main navigation.
