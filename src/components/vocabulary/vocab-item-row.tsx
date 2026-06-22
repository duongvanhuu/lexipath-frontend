import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

import type { VocabularyItem } from "./types";

/* -------------------------------------------------------------------------- */
/* Status badge class map                                                      */
/* -------------------------------------------------------------------------- */

const STATUS_CLASS: Record<
  NonNullable<VocabularyItem["learningStatus"]>,
  string
> = {
  new: "bg-primary text-primary-foreground",
  learning: "bg-golden text-golden-foreground",
  review: "bg-warning text-warning-foreground",
  mastered: "bg-success text-success-foreground",
};

const STATUS_LABEL: Record<
  NonNullable<VocabularyItem["learningStatus"]>,
  string
> = {
  new: "Mới",
  learning: "Đang học",
  review: "Ôn tập",
  mastered: "Thành thạo",
};

/* -------------------------------------------------------------------------- */
/* VocabItemRow                                                                */
/* -------------------------------------------------------------------------- */

export type VocabItemRowProps = {
  item: VocabularyItem;
  className?: string;
};

/**
 * VocabItemRow — compact horizontal list/table row for a vocabulary word.
 * Server Component — no interactivity; wrapping in a Link is the parent's
 * responsibility.
 */
function VocabItemRow({ item, className }: VocabItemRowProps) {
  const { word, partOfSpeech, meaning, learningStatus } = item;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
        className
      )}
    >
      {/* Word */}
      <span className="min-w-24 shrink-0 font-medium text-text-primary">
        {word}
      </span>

      {/* Part of speech */}
      {partOfSpeech ? (
        <Badge
          variant="secondary"
          className="shrink-0 rounded-pill bg-surface-muted text-xs text-text-secondary"
        >
          {partOfSpeech}
        </Badge>
      ) : null}

      {/* Meaning */}
      {meaning ? (
        <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">
          {meaning}
        </span>
      ) : (
        <span className="flex-1" aria-hidden />
      )}

      {/* Status */}
      {learningStatus ? (
        <Badge
          className={cn(
            "shrink-0 rounded-pill",
            STATUS_CLASS[learningStatus]
          )}
        >
          {STATUS_LABEL[learningStatus]}
        </Badge>
      ) : null}
    </div>
  );
}

export { VocabItemRow };
