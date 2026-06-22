import * as React from "react";
import { BookMarked, CheckCircle2, Clock, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { CollectionStats } from "./types";

export type CollectionStatsCardProps = {
  stats: CollectionStats;
  className?: string;
};

type StatTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "primary" | "success" | "warning";
};

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-text-primary",
  primary: "text-primary",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
};

function StatTile({ icon, label, value, tone = "default" }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-card border border-border bg-surface-muted p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="[&_svg]:size-3.5" aria-hidden>
          {icon}
        </span>
        {label}
      </div>
      <span className={cn("text-2xl font-bold tabular-nums", TONE_CLASSES[tone])}>
        {value}
      </span>
    </div>
  );
}

function CollectionStatsCard({ stats, className }: CollectionStatsCardProps) {
  const accuracyDisplay = `${Math.round(stats.averageAccuracy)}%`;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Thống kê bộ từ</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={<BookMarked />}
            label="Tổng từ"
            value={stats.totalWords.toLocaleString()}
          />
          <StatTile
            icon={<CheckCircle2 />}
            label="Đã thành thạo"
            value={stats.masteredWords.toLocaleString()}
            tone="success"
          />
          <StatTile
            icon={<Clock />}
            label="Cần ôn tập"
            value={stats.reviewDue.toLocaleString()}
            tone="warning"
          />
          <StatTile
            icon={<Target />}
            label="Độ chính xác TB"
            value={accuracyDisplay}
            tone="primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export { CollectionStatsCard };
