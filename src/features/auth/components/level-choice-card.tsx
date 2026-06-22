"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type LevelChoiceCardProps = {
  /** Short code shown prominently, e.g. "A1", "N5", "HSK1". */
  displayCode: string;
  label: string;
  hint?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

/**
 * LevelChoiceCard — selectable tile for choosing a proficiency level during
 * onboarding. Displays the standard level code (A1, N5, HSK1…) prominently
 * with a friendly Vietnamese label and an optional exam-context hint.
 */
function LevelChoiceCard({
  displayCode,
  label,
  hint,
  selected = false,
  onSelect,
  className,
}: LevelChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-card border p-4 text-center transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-card hover:border-primary/40",
        className
      )}
    >
      <span
        className={cn(
          "text-lg font-bold leading-none",
          selected ? "text-primary" : "text-text-primary"
        )}
      >
        {displayCode}
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          selected ? "text-primary-soft-foreground" : "text-text-primary"
        )}
      >
        {label}
      </span>
      {hint ? (
        <span className="text-[11px] leading-tight text-text-muted">{hint}</span>
      ) : null}
    </button>
  );
}

export { LevelChoiceCard };
