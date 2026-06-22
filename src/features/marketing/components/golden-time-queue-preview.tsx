import * as React from "react";
import { Clock } from "lucide-react";

import { skillBadgeVariants } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

import type { GoldenTimeQueueWord } from "../types/marketing.types";

export type GoldenTimeQueuePreviewProps = {
  title?: string;
  items: GoldenTimeQueueWord[];
  /** Total words waiting — shown in the header pill. */
  count?: number;
  className?: string;
};

/**
 * GoldenTimeQueuePreview — a compact golden-toned panel showing the words
 * waiting in the Golden Time review queue. Makes the concept tangible on the
 * landing page; the learner app uses the real queue components.
 */
function GoldenTimeQueuePreview({
  title = "Hàng chờ ôn tập",
  items,
  count,
  className,
}: GoldenTimeQueuePreviewProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-golden/40 bg-golden-soft p-5 shadow-golden",
        className
      )}
    >
      <div className="mb-3.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-golden-foreground">
          <Clock className="size-4" aria-hidden />
          {title}
        </span>
        {count != null ? (
          <span className="rounded-pill bg-golden-strong px-2 py-0.5 text-xs font-bold text-white">
            {count} từ
          </span>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.word}
            className="flex items-center justify-between gap-2 rounded-[10px] bg-card p-2.5"
          >
            <span className="min-w-0">
              <span className="text-base font-semibold text-text-primary">
                {item.word}
              </span>
              {item.meaning ? (
                <span className="ml-2 text-xs text-text-muted">
                  {item.meaning}
                </span>
              ) : null}
            </span>
            <span className={skillBadgeVariants({ skill: item.skillTone })}>
              {item.skillLabel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { GoldenTimeQueuePreview };
