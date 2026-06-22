import * as React from "react";

import { CheckpointNode } from "@/components/lexipath";
import { cn } from "@/lib/utils/cn";

import type { LessonSummary } from "./types";
import type { CheckpointState } from "@/components/lexipath";

export type LessonRoadmapItemProps = {
  lesson: LessonSummary;
  isFirst?: boolean;
  isLast?: boolean;
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

function LessonRoadmapItem({
  lesson,
  isFirst = false,
  isLast = false,
  className,
}: LessonRoadmapItemProps) {
  const state = lessonStatusToCheckpointState(lesson.status);
  const isLocked = lesson.status === "locked";
  const sublabel = `${lesson.completedCount}/${lesson.itemCount} từ`;

  return (
    <div className={cn("relative flex flex-col", className)}>
      {/* Connector line above */}
      {!isFirst ? (
        <div
          className="absolute left-[calc(1rem-1px)] top-0 h-4 w-0.5 -translate-y-full bg-border"
          aria-hidden
        />
      ) : null}

      <CheckpointNode
        state={state}
        label={lesson.title}
        sublabel={sublabel}
        {...(!isLocked && lesson.href !== undefined
          ? { href: lesson.href }
          : {})}
      />

      {/* Connector line below */}
      {!isLast ? (
        <div
          className="absolute bottom-0 left-[calc(1rem-1px)] h-4 w-0.5 translate-y-full bg-border"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export { LessonRoadmapItem };
