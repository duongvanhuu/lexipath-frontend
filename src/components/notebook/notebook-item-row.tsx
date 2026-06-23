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
      forgetting: "text-destructive",
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
  const isCjk = item.lang === "ja" || item.lang === "zh";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-transparent hover:bg-muted/50",
        className
      )}
      aria-current={selected ? "true" : undefined}
    >
      {/* Urgency dot — left edge, vertically centred */}
      {item.urgency != null ? (
        <span
          aria-hidden
          className={cn(
            "absolute left-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full shrink-0",
            item.urgency === "overdue" ? "bg-destructive" : "bg-warning-foreground"
          )}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-semibold text-text-primary",
              isCjk ? "text-lg" : "text-sm"
            )}
          >
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

        {/* Review tags */}
        {(item.urgency != null || item.weakSkillLabel != null) ? (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {item.urgency === "overdue" ? (
              <span className="inline-flex items-center rounded-[4px] bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                {item.reviewLabel ?? "Ôn ngay"}
              </span>
            ) : item.urgency === "due" && item.reviewLabel != null ? (
              <span className="inline-flex items-center rounded-[4px] bg-muted px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                {item.reviewLabel}
              </span>
            ) : null}
            {item.weakSkillLabel != null ? (
              <span className="inline-flex items-center rounded-[4px] bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                {item.weakSkillLabel}
              </span>
            ) : null}
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
