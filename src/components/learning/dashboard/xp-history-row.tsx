import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type XpHistoryRowProps = {
  day: string;
  xp: number;
  isToday?: boolean;
  className?: string;
};

/** Maximum XP used to scale the bar width (adjust to match your data range). */
const MAX_XP = 200;

function XpHistoryRow({ day, xp, isToday, className }: XpHistoryRowProps) {
  const widthPct = Math.min(100, Math.round((xp / MAX_XP) * 100));

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-2 py-1.5",
        isToday && "bg-primary-soft",
        className
      )}
    >
      <span
        className={cn(
          "w-8 shrink-0 text-xs",
          isToday
            ? "font-semibold text-primary-soft-foreground"
            : "text-text-muted"
        )}
      >
        {day}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-muted">
        <div
          className="h-full rounded-pill bg-primary transition-all"
          style={{ width: `${widthPct}%` }}
          role="presentation"
        />
      </div>
      <span
        className={cn(
          "w-12 shrink-0 text-right text-xs font-medium",
          isToday ? "text-primary-soft-foreground" : "text-text-secondary"
        )}
      >
        {xp} XP
      </span>
    </div>
  );
}

export { XpHistoryRow };
