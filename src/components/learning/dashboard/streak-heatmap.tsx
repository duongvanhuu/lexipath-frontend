import * as React from "react";

import { cn } from "@/lib/utils/cn";

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export type StreakHeatmapProps = {
  weekActive: boolean[];
  className?: string;
};

function StreakHeatmap({ weekActive, className }: StreakHeatmapProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="grid grid-cols-7 gap-1">
        {weekActive.slice(0, 7).map((active, index) => (
          <div
            key={index}
            aria-label={`${DAY_LABELS[index]}: ${active ? "hoạt động" : "không hoạt động"}`}
            className={cn(
              "size-5 rounded-sm",
              active
                ? "bg-primary"
                : "border border-border/40 bg-surface-muted"
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <span
            key={label}
            className="text-center text-[10px] text-text-muted"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export { StreakHeatmap };
