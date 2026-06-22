import * as React from "react";

import { cn } from "@/lib/utils/cn";

import type { JourneyCheckpoint } from "../types";
import { JourneyCheckpointCard } from "./journey-checkpoint-card";

/* -------------------------------------------------------------------------- */
/* JourneyRail                                                                 */
/* -------------------------------------------------------------------------- */

export type JourneyRailProps = {
  checkpoints: JourneyCheckpoint[];
  className?: string;
};

/**
 * JourneyRail — a macro-level vertical rail of journey checkpoints.
 * The left border thickness and colour reflect overall progress:
 *   - Some completed → primary tint
 *   - All completed → success tint
 *   - None completed → default border
 */
function JourneyRail({ checkpoints, className }: JourneyRailProps) {
  const completedCount = checkpoints.filter(
    (cp) => cp.state === "completed"
  ).length;
  const total = checkpoints.length;
  const allDone = total > 0 && completedCount === total;
  const someDone = completedCount > 0;

  const railClass = cn(
    "border-l-4",
    allDone
      ? "border-success"
      : someDone
        ? "border-primary/50"
        : "border-border/60"
  );

  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {checkpoints.map((checkpoint, i) => (
        <li key={checkpoint.id} className="relative flex items-stretch">
          {/* Left progress rail */}
          <div
            className={cn(
              "mr-4 w-0",
              railClass,
              "self-stretch"
            )}
            aria-hidden
          />

          {/* Card */}
          <div className="flex-1">
            <JourneyCheckpointCard
              checkpoint={checkpoint}
              isLast={i === checkpoints.length - 1}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

export { JourneyRail };
