import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { ReviewReasonChip } from "@/components/lexipath";
import { SkillBadge } from "@/components/shared/badges/skill-badge";

import type { ReviewQueueItem } from "./types";

export type GoldenTimeQueueItemProps = {
  item: ReviewQueueItem;
  className?: string;
};

function GoldenTimeQueueItem({ item, className }: GoldenTimeQueueItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-golden-soft/40",
        className
      )}
    >
      <span className="flex-1 truncate text-sm font-medium text-text-primary">
        {item.word}
      </span>
      <ReviewReasonChip reason={item.reason} />
      <SkillBadge skill={item.skillKey} />
    </div>
  );
}

export { GoldenTimeQueueItem };
