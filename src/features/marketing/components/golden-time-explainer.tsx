import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type GoldenTimeExplainerProps = {
  title: string;
  description?: string;
  /** Hours after a study session when the review window opens. */
  windowHours?: number;
  /** Reason chips, e.g. ["Từ vựng (Meaning)", "Phát âm (Listening)"]. */
  reasons?: string[];
  className?: string;
};

/**
 * GoldenTimeExplainer — the marketing explainer for the Golden Time review
 * concept: a warm-gold surface with the review-window framing and reason chips.
 * The learner app uses `GoldenTimeWindow` instead.
 */
function GoldenTimeExplainer({
  title,
  description,
  windowHours = 4,
  reasons = [],
  className,
}: GoldenTimeExplainerProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-golden/40 bg-golden-soft p-6 shadow-golden",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-golden-strong text-white">
          <Clock className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wide text-golden-foreground uppercase">
            Golden Time Window
          </span>
          <span className="text-xs text-golden-foreground/80">
            Cửa sổ ôn tập tối ưu · {windowHours}h sau buổi học
          </span>
        </div>
      </div>

      <h3 className="font-heading text-2xl font-bold text-text-primary">
        {title}
      </h3>
      {description ? (
        <p className="mt-2.5 text-base text-text-secondary">{description}</p>
      ) : null}

      {reasons.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <span
              key={reason}
              className="rounded-pill bg-golden/20 px-2.5 py-1 text-xs font-medium text-golden-foreground"
            >
              {reason}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { GoldenTimeExplainer };
