"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { WeekDay } from "@/features/stats";

type MetricId = "xp" | "learned" | "reviewed" | "mins";

const METRICS: { id: MetricId; label: string; unit: string; max: number }[] = [
  { id: "xp",       label: "XP",        unit: "XP",    max: 200 },
  { id: "learned",  label: "Từ mới",    unit: "từ",    max: 20  },
  { id: "reviewed", label: "Lượt ôn",   unit: "từ",    max: 30  },
  { id: "mins",     label: "Phút học",  unit: "phút",  max: 40  },
];

export type StatsWeeklyMetricListProps = {
  days: WeekDay[];
  langName: string;
};

function StatsWeeklyMetricList({ days }: StatsWeeklyMetricListProps) {
  const [metric, setMetric] = React.useState<MetricId>("xp");
  const am = METRICS.find((m) => m.id === metric)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Chỉ số xem">
        {METRICS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={metric === m.id}
            onClick={() => setMetric(m.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              metric === m.id
                ? "border-primary bg-primary-soft text-primary-soft-foreground"
                : "border-border bg-background text-text-secondary hover:border-primary/40"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {days.map((d, i) => {
          const v = d[metric] ?? 0;
          const pct = Math.min(100, Math.round((v / am.max) * 100));
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 px-5 py-3",
                i < days.length - 1 && "border-b border-border",
                d.isToday && "bg-primary-soft"
              )}
            >
              <div className="w-12 shrink-0">
                <div
                  className={cn(
                    "text-sm",
                    d.isToday
                      ? "font-bold text-primary"
                      : d.active
                        ? "font-medium text-text-primary"
                        : "font-normal text-text-muted"
                  )}
                >
                  {d.day}
                </div>
                <div className="text-[10px] text-text-muted">{d.date}</div>
              </div>

              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500",
                      d.isToday ? "bg-primary" : v === 0 ? "" : "bg-green-400"
                    )}
                    style={{ width: `${pct}%` }}
                    role="presentation"
                  />
                </div>
              </div>

              <span
                className={cn(
                  "w-20 shrink-0 text-right text-sm font-semibold",
                  v === 0
                    ? "text-text-muted"
                    : d.isToday
                      ? "text-primary"
                      : "text-text-primary"
                )}
              >
                {v === 0
                  ? "—"
                  : `${metric === "xp" ? "+" : ""}${v} ${am.unit}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { StatsWeeklyMetricList };
