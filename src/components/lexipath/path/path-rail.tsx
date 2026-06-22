import * as React from "react";

import { cn } from "@/lib/utils/cn";

import type { CheckpointNodeProps } from "../types";
import { CheckpointNode } from "./checkpoint-node";

/* -------------------------------------------------------------------------- */
/* PathRail                                                                    */
/* -------------------------------------------------------------------------- */

export type PathRailProps = {
  checkpoints: CheckpointNodeProps[];
  className?: string;
};

/**
 * PathRail — a vertical flex column of CheckpointNodes connected by a dashed
 * left rail line. Each node gets a small circle connector that overlaps the
 * line.
 */
function PathRail({ checkpoints, className }: PathRailProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {checkpoints.map((cp, i) => (
        <li key={`${cp.label}-${i}`} className="relative flex items-stretch">
          {/* Rail line + circle connector */}
          <div className="relative mr-4 flex flex-col items-center">
            {/* Vertical line — hidden for the last item */}
            <div
              className={cn(
                "absolute top-0 bottom-0 left-1/2 w-0 -translate-x-1/2 border-l-2 border-dashed border-border/60",
                i === checkpoints.length - 1 && "hidden"
              )}
              aria-hidden
            />
            {/* Circle connector dot */}
            <div
              className="relative z-10 mt-3.5 size-2 shrink-0 rounded-full bg-border"
              aria-hidden
            />
          </div>

          {/* Checkpoint node */}
          <div className="flex-1 pb-3">
            <CheckpointNode {...cp} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export { PathRail };
