import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";
import { ReviewReasonChip } from "@/components/lexipath";
import { SkillBadge } from "@/components/shared/badges/skill-badge";
import { EmptyState } from "@/components/shared/feedback/empty-state";

import type { ReviewQueueItem } from "./types";

export type OverdueCardProps = {
  items: ReviewQueueItem[];
  totalCount?: number;
  onReviewHref?: string;
  className?: string;
};

function OverdueCard({ items, totalCount, onReviewHref, className }: OverdueCardProps) {
  const displayItems = items.slice(0, 3);
  const count = totalCount ?? items.length;

  return (
    <Card
      className={cn(
        "rounded-card shadow-card border-danger/30",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-danger-foreground">
          Quá hạn
        </CardTitle>
        {count > 0 ? (
          <Badge className="rounded-pill bg-danger-soft text-danger-foreground text-xs">
            {count}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {displayItems.length === 0 ? (
          <EmptyState
            title="Không có từ quá hạn"
            description="Tuyệt vời! Bạn đang ôn tập đúng hạn."
            align="center"
            className="min-h-0 py-4"
          />
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted"
                >
                  <span className="flex-1 truncate text-sm font-medium text-text-primary">
                    {item.word}
                  </span>
                  <ReviewReasonChip reason={item.reason} />
                  <SkillBadge skill={item.skillKey} />
                </li>
              ))}
            </ul>
            {onReviewHref ? (
              <Button
                asChild
                size="sm"
                className={cn(buttonToneVariants({ tone: "nextStep" }), "w-full")}
              >
                <a href={onReviewHref}>Ôn tập ngay</a>
              </Button>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { OverdueCard };
