import * as React from "react";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils/cn";

import type { CollectionSummary } from "./types";

export type CollectionProgressCardProps = {
  collection: CollectionSummary;
  className?: string;
};

function CollectionProgressCard({
  collection,
  className,
}: CollectionProgressCardProps) {
  const pct = Math.min(100, Math.max(0, collection.progressPercent));

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" aria-hidden />
          <CardTitle>Tiến độ học</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 py-4">
        <ProgressRing
          value={pct}
          max={100}
          size={96}
          strokeWidth={7}
          tone="primary"
          showLabel={false}
          aria-label={`Tiến độ ${pct}%`}
          label={
            <span className="absolute flex flex-col items-center leading-tight">
              <span className="text-2xl font-bold text-text-primary">
                {pct}%
              </span>
            </span>
          }
        />

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-text-primary">
              {collection.masteredItems}
            </span>{" "}
            / {collection.totalItems} từ đã thành thạo
          </p>
          {collection.lessonCount !== undefined ? (
            <p className="text-xs text-muted-foreground">
              {collection.lessonCount} bài học
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { CollectionProgressCard };
