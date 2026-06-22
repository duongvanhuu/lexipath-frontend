import * as React from "react";
import { Map } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JourneyRail } from "@/components/lexipath";
import { cn } from "@/lib/utils/cn";

import type { CollectionSummary, LessonSummary } from "./types";
import type { JourneyCheckpoint, CheckpointState } from "@/components/lexipath";

export type CollectionJourneyCardProps = {
  collection: CollectionSummary;
  lessons: LessonSummary[];
  className?: string;
};

function lessonStatusToCheckpointState(
  status: LessonSummary["status"]
): CheckpointState {
  switch (status) {
    case "locked":
      return "locked";
    case "available":
      return "available";
    case "current":
      return "current";
    case "completed":
      return "completed";
  }
}

function CollectionJourneyCard({
  collection,
  lessons,
  className,
}: CollectionJourneyCardProps) {
  const pct = Math.min(100, Math.max(0, collection.progressPercent));

  const checkpoints: JourneyCheckpoint[] = lessons.map((lesson) => {
    const href =
      lesson.status !== "locked" && lesson.href !== undefined
        ? lesson.href
        : undefined;
    return {
      id: lesson.id,
      label: lesson.title,
      sublabel: `${lesson.completedCount}/${lesson.itemCount} từ`,
      state: lessonStatusToCheckpointState(lesson.status),
      ...(href !== undefined ? { href } : {}),
    };
  });

  return (
    <Card className={cn("flex flex-col gap-0 overflow-hidden", className)}>
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-start gap-2">
          <Map className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{collection.title}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Progress
                value={pct}
                aria-label={`Tiến độ ${pct}%`}
                className="h-1.5 flex-1"
              />
              <span className="shrink-0 text-xs font-medium text-primary">
                {pct}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        {checkpoints.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có bài học nào.</p>
        ) : (
          <JourneyRail checkpoints={checkpoints} />
        )}
      </CardContent>
    </Card>
  );
}

export { CollectionJourneyCard };
