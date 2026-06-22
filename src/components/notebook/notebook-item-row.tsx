import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { NotebookItem } from "./types";

const statusTextVariants = cva("text-[10px] font-semibold", {
  variants: {
    status: {
      new: "text-text-muted",
      learning: "text-text-secondary",
      review: "text-warning-foreground",
      mastered: "text-success-foreground",
      locked: "text-text-muted",
    },
  },
  defaultVariants: { status: "new" },
});

export type NotebookItemRowProps = {
  item: NotebookItem;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

function NotebookItemRow({
  item,
  selected = false,
  onClick,
  className,
}: NotebookItemRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-transparent hover:bg-muted/50",
        className
      )}
      aria-current={selected ? "true" : undefined}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-text-primary">
            {item.word}
          </span>
          {item.reading ? (
            <span className="text-xs text-text-muted">{item.reading}</span>
          ) : null}
        </div>
        {item.meaning ? (
          <div className="mt-0.5 truncate text-xs text-text-secondary">
            {item.meaning}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        {item.statusLabel ? (
          <span
            className={statusTextVariants({ status: item.status ?? "new" })}
          >
            {item.statusLabel}
          </span>
        ) : null}
        {item.addedAt ? (
          <span className="text-[10px] text-text-muted">{item.addedAt}</span>
        ) : null}
      </div>
    </button>
  );
}

export { NotebookItemRow };
