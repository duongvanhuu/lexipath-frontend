import { cva, type VariantProps } from "class-variance-authority";

/**
 * LexiPath card tones — colour/elevation overrides layered on top of the
 * shadcn `Card` surface (which already supplies `bg-card`, `ring-1`,
 * `rounded-xl`). `cn()` merges these last so `tailwind-merge` lets them win.
 *
 * Tones carry identity meaning — pick the semantic surface, don't default
 * every learner card to `default`:
 * - `path`     — left brand rail; path-step / lesson cards.
 * - `golden`   — warm Golden Time surface.
 * - `primary`  — brand-soft tinted surface.
 * - `insight`  — data-insight surface (brand-soft + single action).
 * - `muted`    — dense admin surfaces.
 * - `floating` — elevated next-step / hero cards.
 */
export const cardToneVariants = cva("", {
  variants: {
    tone: {
      default: "",
      path: "border-l-4 border-l-primary",
      golden: "bg-golden-soft text-golden-foreground ring-golden/30 shadow-golden",
      primary: "bg-primary-soft text-primary-soft-foreground ring-primary/20",
      insight: "bg-primary-soft text-primary-soft-foreground ring-primary/20",
      muted: "bg-surface-muted text-text-secondary",
      floating: "shadow-pop",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export type LexiCardTone = NonNullable<
  VariantProps<typeof cardToneVariants>["tone"]
>;
