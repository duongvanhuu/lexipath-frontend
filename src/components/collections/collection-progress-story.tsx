import * as React from "react";
import { History } from "lucide-react";

import { EmptyState } from "@/components/shared/feedback/empty-state";
import { cn } from "@/lib/utils/cn";

import type { CollectionProgressEntry } from "./types";

export type CollectionProgressStoryProps = {
  entries: CollectionProgressEntry[];
  className?: string;
};

function ProgressEntryRow({ entry }: { entry: CollectionProgressEntry }) {
  return (
    <div className="relative flex items-start gap-4 pb-4">
      {/* Timeline dot */}
      <div className="relative z-10 mt-1 flex size-3 shrink-0 items-center justify-center">
        <span className="size-2.5 rounded-full bg-primary" />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-card border border-border bg-card px-3 py-2">
        <time className="text-xs font-medium text-muted-foreground">
          {entry.date}
        </time>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-primary">
            <span className="font-semibold">{entry.learnedCount}</span>{" "}
            <span className="text-muted-foreground">từ đã học</span>
          </span>
          <span className="text-border">·</span>
          <span className="text-text-primary">
            <span className="font-semibold text-primary">
              {entry.masteredCount}
            </span>{" "}
            <span className="text-muted-foreground">thành thạo</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CollectionProgressStory({
  entries,
  className,
}: CollectionProgressStoryProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<History />}
        title="Chưa có lịch sử tiến độ"
        description="Bắt đầu học để theo dõi hành trình của bạn."
        {...(className !== undefined ? { className } : {})}
      />
    );
  }

  return (
    <div className={cn("relative flex flex-col", className)}>
      {/* Vertical timeline line */}
      <div
        className="absolute left-1.5 top-0 h-full w-px translate-x-[-0.5px] bg-border"
        aria-hidden
      />

      <ol>
        {entries.map((entry, i) => (
          <li key={`${entry.date}-${i}`}>
            <ProgressEntryRow entry={entry} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export { CollectionProgressStory };
