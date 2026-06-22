# CLAUDE.md — LexiPath Frontend Rules

You are working in `lexipath-frontend`.

Follow this file first. Skills, agents, screenshots and prototypes are helpers, not replacements.

---

## 1. Product Identity

LexiPath is a vocabulary learning and exam practice app for English, Japanese and Chinese.

Preserve these concepts:

```txt
learning path / journey / checkpoint
Golden Time
skill lanes
next best step
vocabulary progress
review queue
exam-to-SRS loop
multilingual learning context
```

Do not create generic SaaS dashboard UI.

---

## 2. Stack

Use:

```txt
Next.js 16
React 19
TypeScript
Tailwind CSS v4
shadcn/ui
Radix UI
lucide-react
TanStack Query
Zustand
React Hook Form
Zod
TanStack Table
TanStack Virtual
Recharts
next-intl
Vitest
Testing Library
Playwright
MSW
```

Backend: Java Spring Boot.

HTTP rules:

```txt
Use the project fetch wrapper.
Use TanStack Query for server state.
Do not use Axios.
Do not use SWR.
Do not add Ky unless explicitly approved.
```

---

## 3. Project Structure

This is a single-source project.

Use:

```txt
src/
  app/
  components/
  features/
  hooks/
  lib/
  providers/
  styles/
  types/
  constants/
  config/
```

Do not create:

```txt
apps/
packages/
workspace packages
monorepo structure
```

Placement rules:

```txt
src/components/ui
  shadcn primitives.

src/components/common
  AppButton, AppCard, AppBadge, EmptyState, LoadingState, ErrorState.

src/components/layout
  MarketingShell, AuthShell, LearnerShell, FocusShell, AdminShell.

src/components/<domain>
  learner, learning, vocabulary, notebook, exam, admin, payment, security.

src/features/<feature>
  api, DTO, mapper, hooks, schemas, types, feature components.
```

---

## 4. Design Sources

Use:

```txt
DESIGN_SOURCE_DIR=./LexiPath Web Design
SCREENSHOT_SOURCE_DIR=./screenshots
DATABASE_SOURCE=./database-final.sql
```

Workflow:

```txt
1. Read relevant design files from DESIGN_SOURCE_DIR.
2. Read relevant screenshots from SCREENSHOT_SOURCE_DIR.
3. Inspect existing components in src/components.
4. Inspect existing feature folders in src/features.
5. Use database-final.sql only to understand data shape.
6. Rebuild design intent with TSX + Tailwind v4 + shadcn/ui.
7. Do not copy raw prototype HTML/CSS/scripts.
```

Screenshot rule:

```txt
Do not assume screenshots are wrong because they look similar.
Use folder name, file name, viewport name and visible content to identify page/state.
If screenshot detail is insufficient, cross-check with DESIGN_SOURCE_DIR and existing components.
```

---

## 5. Skills / Agents

Use installed skills when relevant:

```txt
next-best-practices
  App Router, Server/Client Components, metadata, routing, performance.

shadcn/ui
  Inspect components.json.
  Use existing shadcn/Radix primitives before custom UI.

web-quality-skills
  Accessibility, responsive quality, UX polish, performance.

agent-skills
  Planning, architecture, migration, refactor, quality review.
```

Priority:

```txt
1. CLAUDE.md
2. Existing codebase conventions
3. Existing src/components
4. Backend/database contract
5. LexiPath Web Design
6. screenshots
7. shadcn/ui conventions
8. Next.js/React best practices
9. Web quality skills
```

---

## 6. Core Coding Rules

```txt
New React components must be .tsx.
Type all props.
Avoid any; if unavoidable, explain why.
Use alias imports @/.
Search src/components before creating new components.
Reuse existing components first.
Improve incomplete components instead of duplicating them.
Keep files small; split large components.
Prefer Server Components by default.
Add "use client" only for hooks, browser APIs, events, forms, Zustand, TanStack Query or interactive UI.
Use next/link and next/image where appropriate.
```

---

## 7. UI / Design System Rules

Use:

```txt
shadcn/ui:
  Button, Card, Badge, Input, Textarea, Select, Dialog, Sheet, Popover, Tooltip,
  Tabs, Accordion, Table, Form, Dropdown, Separator, Skeleton, Progress, Avatar.

lucide-react:
  Icons.

React Hook Form + Zod + shadcn Form:
  Forms.

TanStack Table + shadcn Table:
  Complex tables.

TanStack Virtual:
  Large lists.

Recharts:
  Charts.

cva():
  Variants.

cn():
  className merging.
```

shadcn components are primitives. Product wrappers should be used when available:

```txt
src/components/ui/button.tsx
  shadcn primitive.

src/components/common/app-button.tsx
  LexiPath product wrapper.
```

Do not use:

```txt
inline style for normal layout/color/spacing
CSS modules
styled-components
one-off component CSS files
CDN icons
window.lucide
dangerouslySetInnerHTML
clickable div
direct API calls inside UI components
hardcoded API URLs inside components
```

Use Tailwind v4 utilities, CSS variables, `hover:`, `focus-visible:`, `data-[state=...]`, `aria-*`.

---

## 8. Layout Rules

```txt
Learner pages:
  No sidebar.
  Use learner shell/top nav/mobile nav.
  Emphasize journey, next step, Golden Time and progress.

Admin pages:
  Sidebar allowed.
  Use tables, filters, badges, drawers, review/publish workflows.

Focus learning pages:
  No main navigation.
  Use FocusShell.
  Prioritize exercise, progress, feedback and exit flow.

Marketing/Auth pages:
  Clear value, calm UI, mobile-friendly.
```

---

## 9. API / Type Rules

For backend data, use:

```txt
src/features/<feature>/
  api/
    <feature>.api.ts
    <feature>.dto.ts
    <feature>.mapper.ts
  components/
  hooks/
  schemas/
  types/
  index.ts
```

Rules:

```txt
DTO = Spring Boot JSON contract.
UI/domain type = component-facing model.
Mapper = DTO -> UI/domain model.
Components must not call APIs directly.
Components should not depend on DTOs when DTO shape differs from UI needs.
Zod schemas live in schemas/.
TanStack Query hooks live in hooks/.
Zustand is only for local/session UI state, not server state.
All HTTP requests go through the project fetch wrapper.
```

If backend endpoint is missing:

```txt
Use typed mock data near the feature/page.
Keep mock shape close to database.
Do not block UI implementation.
Do not overbuild API integration.
```

---

## 10. Accessibility / States

Required:

```txt
Icon buttons need aria-label.
Dialog/Sheet need title.
Form fields need label and error message.
Clickable cards must be button or Link.
Interactive elements must support keyboard/focus.
Use semantic HTML where possible.
```

Include states when relevant:

```txt
loading
empty
error
disabled
success
permission denied
locked/premium
```

---

## 11. Performance / i18n

Performance:

```txt
Prefer Server Components.
Keep Client Components small.
Avoid unnecessary state/effects.
Avoid large client bundles.
Use loading.tsx and Suspense where useful.
Use next/image for image-heavy UI.
Use pagination for normal lists.
Use TanStack Virtual for large lists.
Use charts only where needed.
```

Multilingual:

```txt
Product UI copy should be Vietnamese unless existing convention differs.
Learning content follows selected learning language.
Support English, Japanese and Chinese.
Display Japanese/Chinese script and phonetic fields carefully.
Do not assume vocabulary is English-only.
Use next-intl for i18n-ready product UI.
```

---

## 12. Migration Checklist

When migrating from `LexiPath Web Design`:

```txt
1. Identify target route/page.
2. Open relevant prototype files.
3. Open relevant screenshots.
4. Inspect existing components and feature folders.
5. Map prototype sections to existing components.
6. Reuse existing components first.
7. Create small typed TSX components only when missing.
8. Use shadcn/ui, Tailwind v4, lucide-react, cn(), cva().
9. Keep client boundaries minimal.
10. Add DTO/type/mapper/query hook only when data requires it.
11. Add loading/empty/error/disabled states.
12. Check responsive desktop/tablet/mobile.
13. Run lint/typecheck.
```

Never copy a full prototype into one giant component.

---

## 13. Done Means

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

```txt
TSX + typed props.
Existing components reused where possible.
shadcn/Radix/lucide/cn/cva used where suitable.
No raw prototype HTML/CSS/scripts.
No inline styling for normal layout/color/spacing.
No CDN/window icons.
No clickable div.
No direct API calls inside UI components.
DTO/UI types separated when needed.
Mapper exists when DTO differs from UI model.
Client/server boundary is intentional.
Loading/empty/error/disabled states are covered.
Accessibility basics are covered.
Responsive desktop/tablet/mobile checked.
LexiPath identity is preserved.
lint/typecheck pass.
```

---

## 14. Useful Prompts

Migrate page/component:

```txt
Use next-best-practices, shadcn/ui skill and web-quality-skills.

Migrate this page/component from ./LexiPath Web Design into the current project.
Follow CLAUDE.md strictly.
Read relevant screenshots from ./screenshots.
Inspect existing src/components before writing new ones.
Use existing product wrappers and shadcn/ui primitives first.
Keep Client Components minimal.
Separate DTO/UI types if data is involved.
Preserve LexiPath identity.
Run lint/typecheck.
```

Build production page:

```txt
Build this LexiPath page as production UI.

Follow CLAUDE.md strictly.
Use existing components from src/components first.
Use shadcn/ui, Tailwind v4, typed TSX, lucide-react, cn() and cva().
Prefer Server Components.
Use Client Components only where required.
Use TanStack Query only for server state.
Use project fetch wrapper for HTTP.
Add loading/empty/error/disabled states.
Check responsive desktop/tablet/mobile.
Run npm run lint and npm run typecheck.
```

Quality review:

```txt
Review this page/component for CLAUDE.md compliance, component reuse, shadcn usage, Tailwind v4, accessibility, responsive behavior, client boundary, API/type separation, LexiPath identity, prototype leftovers, duplicate components and lint/typecheck readiness. Then apply safe fixes.
```
