import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export type TodayGoalCardProps = {
  targetCount: number;
  completedCount: number;
  unit?: string;
  className?: string;
};

function TodayGoalCard({
  targetCount,
  completedCount,
  unit = "từ",
  className,
}: TodayGoalCardProps) {
  const pct =
    targetCount > 0 ? Math.round((completedCount / targetCount) * 100) : 0;
  const isDone = completedCount >= targetCount;

  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Mục tiêu hôm nay
        </CardTitle>
        {isDone ? (
          <Badge className="rounded-pill bg-success-soft text-success-foreground text-xs">
            Hoàn thành!
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress
          value={pct}
          aria-label={`${completedCount}/${targetCount} ${unit}`}
          className="h-2"
        />
        <span className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{completedCount}</span>
          /{targetCount} {unit}
        </span>
      </CardContent>
    </Card>
  );
}

export { TodayGoalCard };
