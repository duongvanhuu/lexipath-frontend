import * as React from "react";

import { cn } from "@/lib/utils/cn";

import type { SkillLaneData } from "../types";
import { SkillProgressLane } from "./skill-progress-lane";

/* -------------------------------------------------------------------------- */
/* SkillLaneGroup                                                              */
/* -------------------------------------------------------------------------- */

export type SkillLaneGroupProps = {
  lanes: SkillLaneData[];
  title?: string;
  compact?: boolean;
  className?: string;
};

/**
 * SkillLaneGroup — renders all skill progress lanes in a stack or 2-column
 * grid (when compact=true).
 */
function SkillLaneGroup({
  lanes,
  title,
  compact = false,
  className,
}: SkillLaneGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      ) : null}

      <div
        className={cn(
          compact ? "grid grid-cols-2 gap-2" : "flex flex-col gap-3"
        )}
      >
        {lanes.map((lane) => (
          <SkillProgressLane key={lane.skill} {...lane} />
        ))}
      </div>
    </div>
  );
}

export { SkillLaneGroup };
