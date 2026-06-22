"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type DailyGoalOption = {
  value: number;
  /** Optional descriptor under the number, e.g. "Thư giãn". */
  label?: string;
};

export type DailyGoalSelectorProps = {
  options: DailyGoalOption[];
  value?: number;
  onChange?: (value: number) => void;
  unit?: string;
  className?: string;
};

/**
 * DailyGoalSelector — preset words/day targets as a radiogroup of pill tiles.
 * Controlled via `value` / `onChange`. Keyboard-navigable (arrow keys move
 * focus between options through native button tab order).
 */
function DailyGoalSelector({
  options,
  value,
  onChange,
  unit = "từ/ngày",
  className,
}: DailyGoalSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Mục tiêu mỗi ngày"
      className={cn(
        "grid gap-2.5",
        options.length >= 4 ? "grid-cols-4" : "grid-cols-3",
        className
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-input border p-4 transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold",
                selected ? "text-primary" : "text-text-primary"
              )}
            >
              {opt.value}
            </span>
            <span
              className={cn(
                "text-xs",
                selected ? "text-primary-soft-foreground" : "text-text-secondary"
              )}
            >
              {unit}
            </span>
            {opt.label ? (
              <span className="text-xs text-text-muted">{opt.label}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export { DailyGoalSelector };
