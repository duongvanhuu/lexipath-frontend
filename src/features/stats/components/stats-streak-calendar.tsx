import * as React from "react";
import { Check, X, CircleDot } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export type StatsStreakCalendarProps = {
  calendar: boolean[];
  className?: string;
};

function StatsStreakCalendar({ calendar, className }: StatsStreakCalendarProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold uppercase tracking-wide text-text-muted">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {calendar.slice(0, 28).map((done, idx) => {
          const isToday = idx === 27;
          return (
            <div
              key={idx}
              title={isToday ? "Hôm nay" : done ? "Đã học" : "Bỏ lỡ"}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border",
                isToday
                  ? "border-transparent bg-primary"
                  : done
                    ? "border-success/30 bg-success-soft"
                    : "border-danger/30 bg-danger-soft"
              )}
            >
              {isToday ? (
                <CircleDot className="size-2 text-primary-foreground" aria-hidden />
              ) : done ? (
                <Check className="size-2.5 text-success-foreground" aria-hidden />
              ) : (
                <X className="size-2.5 text-danger-foreground" aria-hidden />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
        {[
          { bg: "bg-success-soft border-success/30", icon: <Check className="size-2.5 text-success-foreground" />, label: "Đã học" },
          { bg: "bg-danger-soft border-danger/30", icon: <X className="size-2.5 text-danger-foreground" />, label: "Bỏ lỡ" },
          { bg: "bg-primary", icon: <CircleDot className="size-2 text-primary-foreground" />, label: "Hôm nay" },
        ].map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <div className={cn("flex size-3.5 shrink-0 items-center justify-center rounded border", it.bg)}>
              {it.icon}
            </div>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { StatsStreakCalendar };
