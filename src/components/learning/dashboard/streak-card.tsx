import * as React from "react";
import { Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { StreakHeatmap } from "./streak-heatmap";
import type { StreakData } from "./types";

export type StreakCardProps = {
  streak: StreakData;
  className?: string;
};

function StreakCard({ streak, className }: StreakCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Flame className="size-4 text-golden-foreground" aria-hidden />
          Chuỗi ngày học
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end gap-3">
          <div className="flex flex-col">
            <span className="text-4xl font-bold leading-none text-golden-foreground">
              {streak.currentDays}
            </span>
            <span className="mt-1 text-xs text-text-muted">ngày liên tiếp</span>
          </div>
          <div className="mb-0.5 flex flex-col">
            <span className="text-xs text-text-muted">Dài nhất</span>
            <span className="text-sm font-semibold text-text-primary">
              {streak.longestDays} ngày
            </span>
          </div>
        </div>
        <StreakHeatmap weekActive={streak.weekActive} />
      </CardContent>
    </Card>
  );
}

export { StreakCard };
