import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

import type { SkillKey, SkillLaneData } from "../types";
import { SKILL_LABELS } from "../constants/lexipath.constants";

/* -------------------------------------------------------------------------- */
/* Variants & lookup maps                                                      */
/* -------------------------------------------------------------------------- */

const skillLaneVariants = cva("rounded-md p-3 flex flex-col gap-2", {
  variants: {
    skill: {
      meaning: "bg-skill-meaning-soft",
      listening: "bg-skill-listening-soft",
      spelling: "bg-skill-spelling-soft",
      usage: "bg-skill-usage-soft",
      collocation: "bg-skill-collocation-soft",
    },
  },
  defaultVariants: {
    skill: "meaning",
  },
});

const SKILL_PROGRESS_FILL: Record<SkillKey, string> = {
  meaning: "bg-skill-meaning",
  listening: "bg-skill-listening",
  spelling: "bg-skill-spelling",
  usage: "bg-skill-usage",
  collocation: "bg-skill-collocation",
};

const SKILL_FG_TEXT: Record<SkillKey, string> = {
  meaning: "text-skill-meaning-foreground",
  listening: "text-skill-listening-foreground",
  spelling: "text-skill-spelling-foreground",
  usage: "text-skill-usage-foreground",
  collocation: "text-skill-collocation-foreground",
};

/* -------------------------------------------------------------------------- */
/* SkillProgressLane                                                           */
/* -------------------------------------------------------------------------- */

export type SkillProgressLaneProps = SkillLaneData & {
  className?: string;
};

/**
 * SkillProgressLane — a coloured surface card for one skill lane showing
 * mastery count, accuracy, and a custom progress bar.
 */
function SkillProgressLane({
  skill,
  masteredCount,
  totalCount,
  accuracyPct,
  className,
}: SkillProgressLaneProps) {
  const pct =
    totalCount > 0 ? Math.min(100, Math.round((masteredCount / totalCount) * 100)) : 0;

  return (
    <div className={cn(skillLaneVariants({ skill }), className)}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-sm font-semibold", SKILL_FG_TEXT[skill])}>
          {SKILL_LABELS[skill]}
        </span>
        <span className={cn("text-xs font-medium", SKILL_FG_TEXT[skill])}>
          {masteredCount}/{totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-pill bg-border/40"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${SKILL_LABELS[skill]}: ${pct}%`}
      >
        <div
          className={cn("h-full rounded-pill transition-all", SKILL_PROGRESS_FILL[skill])}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Accuracy */}
      {typeof accuracyPct === "number" ? (
        <span className={cn("text-xs", SKILL_FG_TEXT[skill], "opacity-70")}>
          Độ chính xác: {accuracyPct}%
        </span>
      ) : null}
    </div>
  );
}

export { SkillProgressLane };
