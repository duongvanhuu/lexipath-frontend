"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ExamFilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  dotColor?: string;
  showDot?: boolean;
}

function ExamFilterChip({
  label,
  active,
  onClick,
  dotColor,
  showDot = false,
}: ExamFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary-soft font-semibold text-primary"
          : "border-border bg-card text-text-secondary hover:border-primary hover:text-primary"
      )}
    >
      {showDot && (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : (dotColor ?? "var(--color-text-muted)") }}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}

export { ExamFilterChip };
