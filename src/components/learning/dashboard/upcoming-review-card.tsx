import * as React from "react";
import { Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { SkillBadge } from "@/components/shared/badges/skill-badge";
import { EmptyState } from "@/components/shared/feedback/empty-state";

import type { ReviewQueueItem } from "./types";

export type UpcomingReviewCardProps = {
  items: ReviewQueueItem[];
  className?: string;
};

function UpcomingReviewCard({ items, className }: UpcomingReviewCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Sắp đến hạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="Không có từ sắp đến hạn"
            align="center"
            className="min-h-0 py-4"
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted"
              >
                <span className="flex-1 truncate text-sm font-medium text-text-primary">
                  {item.word}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="size-3 shrink-0" aria-hidden />
                  {item.dueLabel}
                </span>
                <SkillBadge skill={item.skillKey} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export { UpcomingReviewCard };
