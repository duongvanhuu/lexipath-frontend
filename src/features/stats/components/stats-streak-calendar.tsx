import * as React from "react";
import { Check, X, CircleDot } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export type StatsStreakCalendarProps = {
  calendar: boolean[];
  className?: string;
};

function StatsStreakCalendar({ calendar, className }: StatsStreakCalendarProps) {
  const weeks = 4;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Visual calendar — column headers */}
      <div className="grid grid-cols-7 gap-1" aria-hidden>
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold uppercase tracking-wide text-text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Visual calendar — cells */}
      <div className="grid grid-cols-7 gap-1.5" aria-hidden>
        {calendar.slice(0, 28).map((done, idx) => {
          const isToday = idx === 27;
          return (
            <div
              key={idx}
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

      {/* Screen-reader table — same data, accessible format */}
      <table className="sr-only">
        <caption>Lịch streak 28 ngày gần nhất</caption>
        <thead>
          <tr>
            <th scope="col">Tuần</th>
            {DAY_LABELS.map((d) => (
              <th key={d} scope="col">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: weeks }, (_, w) => (
            <tr key={w}>
              <th scope="row">{w === weeks - 1 ? "Tuần này" : `${weeks - w} tuần trước`}</th>
              {DAY_LABELS.map((_, di) => {
                const idx = w * 7 + di;
                const isToday = idx === 27;
                const done = calendar[idx];
                return (
                  <td key={di}>
                    {isToday ? "Hôm nay" : done ? "Đã học" : "Bỏ lỡ"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

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
