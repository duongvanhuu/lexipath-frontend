import * as React from "react";
import { Award, BookOpen, Clock, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { LessonDetailView } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* LessonProgressSummary                                                       */
/* -------------------------------------------------------------------------- */

export type LessonProgressSummaryProps = {
  lesson: LessonDetailView;
  className?: string;
};

function LessonProgressSummary({ lesson, className }: LessonProgressSummaryProps) {
  const { itemCount, completedCount, estimatedMinutes, accuracy, status } = lesson;
  const pct = itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;
  const isDone = status === "completed";

  const tiles = [
    {
      Icon: TrendingUp,
      iconClass: "bg-success-soft text-success-foreground",
      value: `${pct}%`,
      label: "Hoàn thành",
    },
    {
      Icon: BookOpen,
      iconClass: "bg-info-soft text-info-foreground",
      value: `${completedCount}/${itemCount}`,
      label: "Từ đã học",
    },
    {
      Icon: Award,
      iconClass: isDone
        ? "bg-success-soft text-success-foreground"
        : "bg-surface-muted text-text-muted",
      value: isDone
        ? itemCount.toString()
        : typeof accuracy === "number"
          ? `${accuracy}%`
          : "—",
      label: isDone ? "Đã thành thạo" : "Độ chính xác",
    },
    {
      Icon: Clock,
      iconClass: "bg-warning-soft text-warning-foreground",
      value: `~${estimatedMinutes} phút`,
      label: "Ước tính",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-4",
        className
      )}
    >
      {tiles.map(({ Icon, iconClass, value, label }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 bg-card p-3 sm:p-4"
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              iconClass
            )}
            aria-hidden
          >
            <Icon className="size-3.5" />
          </span>
          <div>
            <div className="text-sm font-bold leading-tight text-text-primary">
              {value}
            </div>
            <div className="text-[10.5px] text-text-secondary">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { LessonProgressSummary };
