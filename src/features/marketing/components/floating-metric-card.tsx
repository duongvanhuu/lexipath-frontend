import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type FloatingMetricCardProps = {
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  metric: string;
  label: string;
  /**
   * Positioning is left to the caller (the parent must be `relative`), e.g.
   * `className="absolute -left-6 top-12"`.
   */
  className?: string;
};

/**
 * FloatingMetricCard — small stat chip overlaid on {@link HeroProductMockup} to
 * highlight a single number ("2.847 từ đã học"). Not for the learner dashboard.
 */
function FloatingMetricCard({
  icon,
  metric,
  label,
  className,
}: FloatingMetricCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-[140px] items-center gap-2.5 rounded-card border border-border bg-card p-2.5 shadow-pop",
        className
      )}
    >
      {icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <span className="flex flex-col">
        <span className="text-sm font-bold text-text-primary">{metric}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </span>
    </div>
  );
}

export { FloatingMetricCard };
