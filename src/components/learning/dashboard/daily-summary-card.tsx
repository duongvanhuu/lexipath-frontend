import * as React from "react";
import { Flame, BookOpen, CheckCircle2, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { StatTile } from "./stat-tile";
import type { DailyStats } from "./types";

export type DailySummaryCardProps = {
  stats: DailyStats;
  goalTarget: number;
  streakDays: number;
  className?: string;
};

function DailySummaryCard({
  stats,
  goalTarget,
  streakDays,
  className,
}: DailySummaryCardProps) {
  const goalReached = stats.reviewedCount + stats.learnedCount >= goalTarget;

  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Tổng kết hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Headline */}
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-golden-soft text-golden-foreground [&_svg]:size-5">
            <Flame aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold leading-none text-golden-foreground">
              {streakDays}
            </span>
            <span className="text-xs text-text-muted">ngày liên tiếp</span>
          </div>
          {goalReached ? (
            <span className="ml-auto rounded-pill bg-success-soft px-2 py-0.5 text-xs font-medium text-success-foreground">
              Mục tiêu đạt!
            </span>
          ) : null}
        </div>

        {/* Sub-stats grid */}
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
          <StatTile
            label="Đã ôn"
            value={stats.reviewedCount}
            icon={<BookOpen />}
            tone="default"
          />
          <StatTile
            label="Đã học"
            value={stats.learnedCount}
            icon={<CheckCircle2 />}
            tone="success"
          />
          <StatTile
            label="Độ chính xác"
            value={`${stats.accuracyPct}%`}
            icon={<Target />}
            tone="default"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export { DailySummaryCard };
