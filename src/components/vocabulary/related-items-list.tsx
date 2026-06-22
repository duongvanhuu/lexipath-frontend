import * as React from "react";

import { cn } from "@/lib/utils/cn";

import type { RelatedItem } from "./types";

/* -------------------------------------------------------------------------- */
/* RelatedItemChip                                                             */
/* -------------------------------------------------------------------------- */

type RelatedItemChipProps = {
  item: RelatedItem;
};

function RelatedItemChip({ item }: RelatedItemChipProps) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-sm text-text-secondary">
      <span className="font-medium text-text-primary">{item.word}</span>
      {item.partOfSpeech ? (
        <span className="text-xs text-text-muted">{item.partOfSpeech}</span>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* RelatedItemsList                                                            */
/* -------------------------------------------------------------------------- */

export type RelatedItemsListProps = {
  items: RelatedItem[];
  title?: string;
  className?: string;
};

/**
 * RelatedItemsList — wrapping flex of word chips for related vocabulary items.
 * Shows an empty state message when no items are provided.
 */
function RelatedItemsList({ items, title, className }: RelatedItemsListProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title ? (
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-text-muted">Không có từ liên quan.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <RelatedItemChip key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export { RelatedItemsList };
