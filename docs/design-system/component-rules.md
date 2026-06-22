# Component & Design-System Rules

LexiPath UI is built from shadcn/ui + Radix primitives, Tailwind v4 utilities,
and the design tokens in [`src/styles/globals.css`](../../src/styles/globals.css).
Do not build generic SaaS dashboard UI — preserve LexiPath identity.

## Prefer libraries over hand-rolled primitives

| Need                                | Use                                      |
| ----------------------------------- | ---------------------------------------- |
| Button/Card/Badge/Input/Select/etc. | shadcn/ui (`src/components/ui`)           |
| Icons                               | `lucide-react`                            |
| Forms                               | React Hook Form + Zod + shadcn Form       |
| Tables                              | TanStack Table + shadcn Table             |
| Large lists                         | TanStack Virtual                          |
| Charts                              | Recharts                                  |
| Variants                            | `class-variance-authority` (`cva`)        |
| className merge                     | `cn()` (`@/lib/utils/cn`)                 |

Inspect `components.json` and reuse existing shadcn/Radix primitives before
writing custom UI.

## Do not

- Inline `style` for normal layout/color/spacing.
- CSS modules, styled-components, one-off component CSS files.
- CDN icons, `window.lucide`.
- `dangerouslySetInnerHTML`.
- Clickable `div` — use `button` or `next/link`.
- Hardcoded hex/oklch in components — always go through a token.

## Design tokens

All defined in `globals.css` and consumable as Tailwind utilities or arbitrary
`var()` values.

- **Brand:** `--primary` (emerald), `--primary-hover`, `--primary-soft`.
  `--primary` is the brand emerald — **not** success-green.
- **Golden Time:** `--golden`, `--golden-strong`, `--golden-soft`,
  `--golden-foreground`, `--shadow-golden`.
- **Status:** `--success` (the only place `#22c55e`-style green is used),
  `--warning`, `--danger` (+ `-soft` / `-foreground`).
- **Surfaces/text:** `--surface`, `--surface-muted`, `--text-primary`,
  `--text-secondary`, `--text-muted` (plus shadcn `--card`, `--border`,
  `--muted`).
- **Skill lanes:** `--skill-meaning`, `--skill-listening`, `--skill-spelling`,
  `--skill-usage`, `--skill-collocation` (each with `-soft` / `-foreground`).
- **Radius:** `--radius-button`, `--radius-input`, `--radius-card`,
  `--radius-panel`, `--radius-pill`.
- **Shadow:** `--shadow-card`, `--shadow-pop`, `--shadow-golden`.
- **Spacing:** `--space-gutter`, `--space-card`, `--space-section`,
  `--space-page`.
- **Typography:** `--text-display` / `-h1` / `-h2` / `-h3` / `-body` / `-small`
  (+ matching `*-leading`).

Usage examples:

```tsx
<div className="rounded-card bg-card text-text-primary shadow-card" />
<span className="bg-golden-soft text-golden-foreground rounded-pill" />
<div className="bg-[var(--surface-muted)] p-[var(--space-card)]" />
```

## Shared cva helpers

`@/lib/styles/variants` provides LexiPath-domain variants (built on the tokens):

- `surfaceVariants` — tone/border/radius/elevation surfaces.
- `cardVariants` — default / golden / primary / muted cards.
- `badgeVariants` — neutral/primary/golden/outline badges.
- `statusBadgeVariants` — success/warning/danger/info/golden/neutral (+ `solid`).
- `skillBadgeVariants` — one per skill lane.
- `buttonToneVariants` — identity tones (`nextStep`/`golden`/`path`/`quiet`)
  applied via the shadcn `Button` className.

shadcn primitives keep their own `buttonVariants` / `badgeVariants`; the helpers
above are for domain components, not replacements.

## Accessibility

- Icon buttons need `aria-label`.
- Dialog/Sheet need a title.
- Form fields need a label and an error message.
- Clickable cards use `button` or `Link`.
- Include loading, empty, error, disabled states where relevant.
- Preserve keyboard/focus behavior provided by shadcn/Radix.

## LexiPath identity

Preserve: learning path / journey / checkpoint, Golden Time, skill lanes,
next best step, exam-to-SRS loop, vocabulary progress, review queue, and the
English / Japanese / Chinese learning context. Migrate design **intent**, not
raw prototype HTML/CSS. Reserve `--primary` for generic CTAs; use the
`nextStep` / `golden` tones for the "next best step" and Golden Time actions.
