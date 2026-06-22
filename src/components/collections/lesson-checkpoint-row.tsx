import * as React from "react";

import { CheckpointNode } from "@/components/lexipath";
import { cn } from "@/lib/utils/cn";

import type { LessonSummary } from "./types";
import type { CheckpointState } from "@/components/lexipath";

export type LessonCheckpointRowProps = {
  lesson: LessonSummary;
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

function LessonCheckpointRow({ lesson, className }: LessonCheckpointRowProps) {
  const state = lessonStatusToCheckpointState(lesson.status);
  const isLocked = lesson.status === "locked";
  const pct =
    lesson.itemCount > 0
      ? Math.round((lesson.completedCount / lesson.itemCount) * 100)
      : 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <CheckpointNode
        state={state}
        label={lesson.title}
        sublabel={`${lesson.completedCount}/${lesson.itemCount} từ · ${pct}%`}
        {...(!isLocked && lesson.href !== undefined
          ? { href: lesson.href }
          : {})}
        className="flex-1"
      />
    </div>
  );
}

export { LessonCheckpointRow };
