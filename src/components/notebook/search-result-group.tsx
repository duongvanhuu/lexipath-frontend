import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { DictionaryResult } from "./types";

export type SearchResultGroupProps = {
  title: string;
  items: DictionaryResult[];
  onSelect?: (item: DictionaryResult) => void;
  className?: string;
};

function SearchResultGroup({
  title,
  items,
  onSelect,
  className,
}: SearchResultGroupProps) {
  return (
    <div className={cn(className)}>
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-sm font-semibold text-text-primary">
            {item.word}
          </span>
          {item.reading ? (
            <span className="text-xs text-text-muted">{item.reading}</span>
          ) : null}
          <span className="ml-auto text-xs text-text-secondary">
            {item.meaning}
          </span>
        </button>
      ))}
    </div>
  );
}

export { SearchResultGroup };
