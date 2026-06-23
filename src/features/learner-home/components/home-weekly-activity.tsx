import * as React from "react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type HomeWeekDay = {
  label: string;
  xp: number;
  active: boolean;
  isToday?: boolean;
};

export type HomeWeeklyActivityProps = {
  days: HomeWeekDay[];
  xpTotal: number;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* HomeWeeklyActivity                                                          */
/* -------------------------------------------------------------------------- */

function HomeWeeklyActivity({
  days,
  xpTotal,
  className,
}: HomeWeeklyActivityProps) {
  const maxXp = Math.max(...days.map((d) => d.xp), 1);

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-4 py-3.5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-text-primary">
          Hoạt động tuần này
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          +{xpTotal} XP
        </span>
      </div>

      {/* Bar chart */}
      <div
        className="grid grid-cols-7 items-end gap-1.5"
        style={{ height: 56 }}
        role="img"
        aria-label="Biểu đồ hoạt động 7 ngày"
      >
        {days.map((day, i) => {
          const barHeight =
            day.xp > 0 ? Math.max(8, Math.round((day.xp / maxXp) * 44)) : 4;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-full rounded-t-sm",
                  day.isToday
                    ? "bg-primary"
                    : day.active
                      ? "bg-primary/40"
                      : "bg-border"
                )}
                style={{ height: barHeight }}
                title={`${day.label}: ${day.xp} XP`}
              />
              <span
                className={cn(
                  "text-[9.5px]",
                  day.isToday
                    ? "font-bold text-primary"
                    : "font-medium text-text-muted"
                )}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HomeWeeklyActivity };
