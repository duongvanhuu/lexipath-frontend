import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Lock,
  Star,
} from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

import type { CheckpointNodeProps, CheckpointState } from "../types";

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

const checkpointVariants = cva(
  "flex items-center gap-3 rounded-card border p-3 transition-colors",
  {
    variants: {
      state: {
        current:
          "border-primary/30 bg-primary-soft text-primary-soft-foreground",
        due: "border-golden/40 bg-golden-soft text-golden-foreground",
        weak: "border-danger/30 bg-danger-soft text-danger-foreground",
        premium: "border-border bg-surface-muted text-text-secondary",
        completed: "border-border/60 bg-card text-text-secondary",
        locked: "border-border bg-surface-muted text-text-muted opacity-50",
        available:
          "border-border bg-card text-text-primary hover:border-primary/30 hover:bg-primary-soft/40",
      },
    },
    defaultVariants: {
      state: "available",
    },
  }
);

/* -------------------------------------------------------------------------- */
/* State icon map                                                              */
/* -------------------------------------------------------------------------- */

const STATE_ICONS: Record<CheckpointState, React.ReactElement> = {
  current: <ChevronRight className="size-4 shrink-0" aria-hidden />,
  due: <Circle className="size-4 shrink-0" aria-hidden />,
  weak: <AlertTriangle className="size-4 shrink-0" aria-hidden />,
  premium: <Star className="size-4 shrink-0" aria-hidden />,
  completed: <CheckCircle2 className="size-4 shrink-0" aria-hidden />,
  locked: <Lock className="size-4 shrink-0" aria-hidden />,
  available: <Circle className="size-4 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* Inner content                                                               */
/* -------------------------------------------------------------------------- */

function CheckpointNodeContent({
  state,
  label,
  sublabel,
}: Pick<CheckpointNodeProps, "state" | "label" | "sublabel">) {
  return (
    <>
      {STATE_ICONS[state]}
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        {sublabel ? (
          <span className="block truncate text-xs opacity-70">{sublabel}</span>
        ) : null}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* CheckpointNode                                                              */
/* -------------------------------------------------------------------------- */

/**
 * CheckpointNode — a single step on a learning path.
 *
 * Rendering rules:
 *   - If `href` is provided and state != "locked" → renders as <Link>.
 *   - If locked or no href/onClick → renders as a plain <div> (aria-disabled
 *     when locked).
 *
 * Note: onClick handlers are intentionally NOT wired here to keep this a
 * Server Component. Parents that need non-navigation click behavior should
 * wrap this node inside a Client Component boundary.
 */
function CheckpointNode({
  state,
  label,
  sublabel,
  href,
  className,
}: CheckpointNodeProps) {
  const base = cn(checkpointVariants({ state }), className);

  if (href && state !== "locked") {
    return (
      <Link href={href as Route} className={base}>
        <CheckpointNodeContent
          state={state}
          label={label}
          {...(sublabel !== undefined ? { sublabel } : {})}
        />
      </Link>
    );
  }

  return (
    <div
      className={base}
      aria-disabled={state === "locked" ? true : undefined}
      role={state === "locked" ? "presentation" : undefined}
    >
      <CheckpointNodeContent
        state={state}
        label={label}
        {...(sublabel !== undefined ? { sublabel } : {})}
      />
    </div>
  );
}

export { CheckpointNode, checkpointVariants };
