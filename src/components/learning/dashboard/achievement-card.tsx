import * as React from "react";
import { Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { AchievementItem } from "./types";

export type AchievementCardProps = {
  achievement: AchievementItem;
  className?: string;
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

function AchievementCard({ achievement, className }: AchievementCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardContent className="flex items-start gap-3 p-4">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-golden-soft text-golden-foreground [&_svg]:size-5">
          <Trophy aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-text-primary">
            {achievement.title}
          </span>
          {achievement.description ? (
            <span className="text-xs text-text-secondary">
              {achievement.description}
            </span>
          ) : null}
          {achievement.earnedAt ? (
            <span className="text-xs text-text-muted">
              {formatDate(achievement.earnedAt)}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { AchievementCard };
