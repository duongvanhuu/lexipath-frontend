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
 * GoldenQueuePreview — a compact panel listing words queued in the Golden Time
 * review queue. Shows headword, optional reading and meaning, reason chip, and
 * skill badge per item.
 */
function GoldenQueuePreview({
  items,
  maxVisible = 5,
  showMore = true,
  className,
}: GoldenQueuePreviewProps) {
  const visible = items.slice(0, maxVisible);
  const hiddenCount = items.length - visible.length;

  return (
    <div className={cn("rounded-card border border-border bg-card", className)}>
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Hàng chờ ôn tập
        </span>
        {items.length > 0 ? (
          <span className="rounded-pill bg-golden-soft px-2 py-0.5 text-xs font-semibold text-golden-foreground">
            {items.length} từ
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-text-muted">
          Không có từ trong hàng đợi
        </p>
      ) : (
        <>
          <ol className="flex flex-col divide-y divide-border">
            {visible.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-2 px-4 py-3"
              >
                {/* Headword + reading + meaning */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-sm font-bold text-text-primary">
                      {item.word}
                    </span>
                    {item.reading ? (
                      <span className="text-xs text-text-muted">
                        {item.reading}
                      </span>
                    ) : null}
                  </div>
                  {item.meaningVi ? (
                    <span className="text-xs text-text-secondary">
                      {item.meaningVi}
                    </span>
                  ) : null}
                </div>

                {/* Chips */}
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {item.dueLabel ? (
                    <span className="text-xs text-text-muted">
                      {item.dueLabel}
                    </span>
                  ) : null}
                  <ReviewReasonChip reason={item.reason} />
                  <SkillBadge skill={item.skillKey} />
                </div>
              </li>
            ))}
          </ol>

          {showMore && hiddenCount > 0 ? (
            <div className="border-t border-border px-4 py-2.5">
              <p className="text-xs text-text-muted">
                +{hiddenCount} từ khác trong hàng chờ
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export { GoldenQueuePreview };
