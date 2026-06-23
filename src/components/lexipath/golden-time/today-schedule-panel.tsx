import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { GoldenTimeScheduleItem, GoldenTimeScheduleItemReason } from "@/features/golden-time/types";

/* -------------------------------------------------------------------------- */
/* Reason labels                                                               */
/* -------------------------------------------------------------------------- */

const REASON_LABELS: Record<GoldenTimeScheduleItemReason, string> = {
  weak: "Kỹ năng yếu",
  overdue: "Quá hạn",
  exam_mistake: "Sai bài thi",
  newly_learned: "Từ mới",
};

const REASON_COLORS: Record<GoldenTimeScheduleItemReason, string> = {
  weak: "bg-warning-soft text-warning-foreground",
  overdue: "bg-danger-soft text-danger-foreground",
  exam_mistake: "bg-golden-soft text-golden-foreground",
  newly_learned: "bg-primary-soft text-primary-soft-foreground",
};

/* -------------------------------------------------------------------------- */
/* TodaySchedulePanel                                                          */
/* -------------------------------------------------------------------------- */

export type TodaySchedulePanelProps = {
  items: GoldenTimeScheduleItem[];
  title?: string;
  subtitle?: string;
  className?: string;
};

/**
 * TodaySchedulePanel — a lightweight vertical timeline of today's SRS/Golden
 * Time review windows. Each row shows a time label, session title, word count,
 * and an optional reason chip. The "now" item is visually highlighted in golden.
 */
function TodaySchedulePanel({
  items,
  title = "Lịch ôn tập hôm nay",
  subtitle = "Các mốc Golden Time/SRS còn lại trong ngày",
  className,
}: TodaySchedulePanelProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-text-primary">
          {title}
        </CardTitle>
        {subtitle ? (
          <CardDescription className="text-xs text-text-muted">
            {subtitle}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">
            Hôm nay chưa có lịch ôn thêm.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isNow = item.status === "now";
              const isCompleted = item.status === "completed";

              return (
                <div key={item.id} className="flex gap-3">
                  {/* Timeline indicator column */}
                  <div className="flex shrink-0 flex-col items-center">
                    {/* Dot */}
                    <div
                      className={cn(
                        "mt-1 size-3.5 shrink-0 rounded-full border-2",
                        isNow
                          ? "border-golden-strong bg-golden-strong ring-2 ring-golden/25"
                          : isCompleted
                            ? "border-success-foreground bg-success-foreground"
                            : "border-border bg-card"
                      )}
                      aria-hidden
                    />
                    {/* Connecting line */}
                    {!isLast ? (
                      <div
                        className={cn(
                          "mt-1 w-0.5 flex-1",
                          isNow ? "bg-golden/30" : "bg-border"
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      "flex flex-1 flex-wrap items-start gap-x-2 gap-y-1 pb-4",
                      isLast && "pb-0"
                    )}
                  >
                    <div className="flex w-full flex-wrap items-center gap-2">
                      {/* Time label */}
                      <span
                        className={cn(
                          "min-w-[5.5rem] text-sm font-semibold",
                          isNow
                            ? "text-golden-foreground"
                            : isCompleted
                              ? "text-text-muted line-through"
                              : "text-text-secondary"
                        )}
                      >
                        {item.timeLabel}
                      </span>

                      {/* Session title */}
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          isNow ? "font-semibold text-golden-foreground" : "text-text-primary",
                          isCompleted && "text-text-muted line-through"
                        )}
                      >
                        {item.title}
                      </span>

                      {/* Word count badge */}
                      <span
                        className={cn(
                          "shrink-0 rounded-pill px-2 py-0.5 text-xs font-medium",
                          isNow
                            ? "bg-golden-strong/15 text-golden-foreground"
                            : "bg-surface text-text-muted"
                        )}
                      >
                        {item.itemCount} từ
                      </span>
                    </div>

                    {/* Status / reason row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isNow && (
                        <span className="rounded-pill bg-golden-strong/20 px-2 py-0.5 text-xs font-semibold text-golden-foreground">
                          Đang mở
                        </span>
                      )}
                      {isCompleted && (
                        <CheckCircle2
                          className="size-3.5 text-success-foreground"
                          aria-label="Đã hoàn thành"
                        />
                      )}
                      {item.reason ? (
                        <span
                          className={cn(
                            "rounded-pill px-2 py-0.5 text-xs font-medium",
                            REASON_COLORS[item.reason]
                          )}
                        >
                          {REASON_LABELS[item.reason]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { TodaySchedulePanel };
