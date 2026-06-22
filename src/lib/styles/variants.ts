import { cva, type VariantProps } from "class-variance-authority";

/**
 * LexiPath shared cva helpers.
 *
 * These build on the design tokens in `src/styles/globals.css`. They are the
 * canonical source for surface/card/badge styling so identity concepts
 * (Golden Time, skill lanes, status) stay consistent across features.
 *
 * The shadcn primitives keep their own `buttonVariants` / `badgeVariants`
 * (in `components/ui/*`). The helpers here are LexiPath-domain variants used by
 * `components/lexipath/*` and feature components — they do not replace shadcn.
 */

/* -------------------------------------------------------------------------- */
/* Surface                                                                    */
/* -------------------------------------------------------------------------- */

export const surfaceVariants = cva("bg-surface text-text-primary", {
  variants: {
    tone: {
      base: "bg-surface",
      muted: "bg-surface-muted",
      card: "bg-card",
      primarySoft: "bg-primary-soft text-primary-soft-foreground",
      goldenSoft: "bg-golden-soft text-golden-foreground",
    },
    border: {
      none: "",
      hairline: "border border-border",
    },
    radius: {
      card: "rounded-card",
      panel: "rounded-panel",
      pill: "rounded-pill",
    },
    elevation: {
      none: "",
      card: "shadow-card",
      pop: "shadow-pop",
      golden: "shadow-golden",
    },
  },
  defaultVariants: {
    tone: "base",
    border: "hairline",
    radius: "card",
    elevation: "none",
  },
});

export type SurfaceVariantProps = VariantProps<typeof surfaceVariants>;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export const cardVariants = cva(
  "flex flex-col gap-3 rounded-card border border-border bg-card p-[var(--space-card)] text-text-primary",
  {
    variants: {
      tone: {
        default: "",
        golden: "border-golden/40 bg-golden-soft text-golden-foreground shadow-golden",
        primary: "border-primary/30 bg-primary-soft text-primary-soft-foreground",
        muted: "bg-surface-muted",
      },
      interactive: {
        true: "transition-shadow hover:shadow-card focus-visible:shadow-card",
        false: "",
      },
      elevation: {
        none: "",
        card: "shadow-card",
        pop: "shadow-pop",
      },
    },
    defaultVariants: {
      tone: "default",
      interactive: false,
      elevation: "none",
    },
  }
);

export type CardVariantProps = VariantProps<typeof cardVariants>;

/* -------------------------------------------------------------------------- */
/* Badge (LexiPath base)                                                      */
/* -------------------------------------------------------------------------- */

export const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-surface-muted text-text-secondary",
        primary: "bg-primary-soft text-primary-soft-foreground",
        golden: "bg-golden-soft text-golden-foreground",
        outline: "border border-border text-text-secondary",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/* -------------------------------------------------------------------------- */
/* Status badge — success / warning / danger / info / golden                  */
/* -------------------------------------------------------------------------- */

export const statusBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      status: {
        success: "bg-success-soft text-success-foreground",
        warning: "bg-warning-soft text-warning-foreground",
        danger: "bg-danger-soft text-danger-foreground",
        info: "bg-primary-soft text-primary-soft-foreground",
        golden: "bg-golden-soft text-golden-foreground",
        neutral: "bg-surface-muted text-text-secondary",
      },
      solid: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { solid: true, status: "success", className: "bg-success text-white" },
      { solid: true, status: "warning", className: "bg-warning text-warning-foreground" },
      { solid: true, status: "danger", className: "bg-danger text-white" },
      { solid: true, status: "info", className: "bg-primary text-primary-foreground" },
      { solid: true, status: "golden", className: "bg-golden-strong text-white" },
    ],
    defaultVariants: {
      status: "neutral",
      solid: false,
    },
  }
);

export type StatusBadgeVariantProps = VariantProps<typeof statusBadgeVariants>;
export type LexiStatus = NonNullable<StatusBadgeVariantProps["status"]>;

/* -------------------------------------------------------------------------- */
/* Skill badge — one per skill lane                                           */
/* -------------------------------------------------------------------------- */

export const skillBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      skill: {
        meaning: "bg-skill-meaning-soft text-skill-meaning-foreground",
        listening: "bg-skill-listening-soft text-skill-listening-foreground",
        spelling: "bg-skill-spelling-soft text-skill-spelling-foreground",
        usage: "bg-skill-usage-soft text-skill-usage-foreground",
        collocation: "bg-skill-collocation-soft text-skill-collocation-foreground",
      },
    },
    defaultVariants: {
      skill: "meaning",
    },
  }
);

export type SkillBadgeVariantProps = VariantProps<typeof skillBadgeVariants>;
export type SkillLane = NonNullable<SkillBadgeVariantProps["skill"]>;

/* -------------------------------------------------------------------------- */
/* Button tone — LexiPath identity tones on top of the shadcn Button base.    */
/* Apply via the shadcn Button's className, e.g.                              */
/*   <Button className={buttonToneVariants({ tone: "golden" })}>             */
/* Keep `primary` reserved for generic CTAs; use nextStep/golden for the      */
/* "next best step" and Golden Time actions per LexiPath identity rules.      */
/* -------------------------------------------------------------------------- */

export const buttonToneVariants = cva("", {
  variants: {
    tone: {
      nextStep: "bg-primary text-primary-foreground hover:bg-primary-hover",
      golden: "bg-golden-strong text-white hover:bg-golden",
      path: "border border-primary/30 bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70",
      quiet: "bg-transparent text-text-secondary hover:bg-surface-muted",
    },
  },
  defaultVariants: {
    tone: "nextStep",
  },
});

export type ButtonToneVariantProps = VariantProps<typeof buttonToneVariants>;
