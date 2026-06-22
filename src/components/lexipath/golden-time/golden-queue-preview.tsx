import * as React from "react";

import { SkillBadge } from "@/components/shared/badges/skill-badge";
import { cn } from "@/lib/utils/cn";

import type { GoldenQueueItem } from "../types";
import { ReviewReasonChip } from "./review-reason-chip";

/* -------------------------------------------------------------------------- */
/* GoldenQueuePreview                                                          */
/* -------------------------------------------------------------------------- */

export type GoldenQueuePreviewProps = {
  items: GoldenQueueItem[];
  maxVisible?: number;
  showMore?: boolean;
  className?: string;
};

/**
 * GoldenQueuePreview — a compact list of words queued in the Golden Time
 * review queue. Shows word, review reason chip, and skill badge per item.
 */
function GoldenQueuePreview({
  items,
  maxVisible = 5,
  showMore = true,
  className,
}: GoldenQueuePreviewProps) {
  if (items.length === 0) {
    return (
      <p className={cn("text-sm text-text-muted", className)}>
        Không có từ trong hàng đợi
      </p>
    );
  }

  const visible = items.slice(0, maxVisible);
  const hiddenCount = items.length - visible.length;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ol className="flex flex-col gap-1.5">
        {visible.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
              {item.word}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              {item.dueLabel ? (
                <span className="text-xs text-text-muted">{item.dueLabel}</span>
              ) : null}
              <ReviewReasonChip reason={item.reason} />
              <SkillBadge skill={item.skillKey} />
            </div>
          </li>
        ))}
      </ol>

      {showMore && hiddenCount > 0 ? (
        <p className="text-xs text-text-muted">
          +{hiddenCount} từ khác
        </p>
      ) : null}
    </div>
  );
}

export { GoldenQueuePreview };
