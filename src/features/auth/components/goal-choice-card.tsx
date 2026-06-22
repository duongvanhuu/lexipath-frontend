"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type GoalChoiceCardProps = {
  title: string;
  description?: string;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

/**
 * GoalChoiceCard — a learning-goal tile for onboarding ("Thi JLPT", "Du lịch",
 * "Công việc"…). Centered icon + title + hint. Renders a real `button`.
 */
function GoalChoiceCard({
  title,
  description,
  icon,
  selected = false,
  onSelect,
  className,
}: GoalChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-2 rounded-card border p-5 text-center transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-card hover:border-primary/40",
        className
      )}
    >
      {icon ? (
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl [&_svg]:size-5",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-surface-muted text-text-secondary"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="text-sm font-semibold text-text-primary">{title}</span>
      {description ? (
        <span className="text-xs text-text-secondary">{description}</span>
      ) : null}
    </button>
  );
}

export { GoalChoiceCard };
