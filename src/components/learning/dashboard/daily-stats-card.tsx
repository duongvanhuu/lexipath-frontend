import * as React from "react";
import { BookOpen, CheckCircle2, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { StatTile } from "./stat-tile";
import type { DailyStats } from "./types";

export type DailyStatsCardProps = {
  stats: DailyStats;
  className?: string;
};

function DailyStatsCard({ stats, className }: DailyStatsCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Thống kê hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
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

export { DailyStatsCard };
