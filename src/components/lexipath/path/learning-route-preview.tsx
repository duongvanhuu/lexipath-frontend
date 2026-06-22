import * as React from "react";
import {
  BookOpen,
  Clock,
  FileQuestion,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { LearningRouteStep } from "../types";

/* -------------------------------------------------------------------------- */
/* Step type icon map                                                          */
/* -------------------------------------------------------------------------- */

const STEP_ICONS: Record<LearningRouteStep["type"], React.ReactElement> = {
  lesson: <BookOpen className="size-4 shrink-0" aria-hidden />,
  review: <RefreshCw className="size-4 shrink-0" aria-hidden />,
  exam: <FileQuestion className="size-4 shrink-0" aria-hidden />,
  golden: <Clock className="size-4 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* LearningRoutePreview                                                        */
/* -------------------------------------------------------------------------- */

export type LearningRoutePreviewProps = {
  title?: string;
  steps: LearningRouteStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * LearningRoutePreview — today's learning route steps in horizontal or
 * vertical layout. State-based visual treatment:
 *   - completed: opacity-50
 *   - locked: opacity-40
 *   - current: ring-2 ring-primary/40
 */
function LearningRoutePreview({
  title,
  steps,
  orientation = "horizontal",
  className,
}: LearningRoutePreviewProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      ) : null}

      <ol
        className={cn(
          "flex gap-2",
          orientation === "horizontal"
            ? "flex-row flex-wrap"
            : "flex-col"
        )}
      >
        {steps.map((step) => (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2 rounded-card border border-border bg-card px-3 py-2 text-sm transition-opacity",
              step.state === "completed" && "opacity-50",
              step.state === "locked" && "opacity-40",
              step.state === "current" && "ring-2 ring-primary/40"
            )}
          >
            <span
              className={cn(
                step.type === "golden"
                  ? "text-golden-foreground"
                  : "text-text-secondary"
              )}
            >
              {STEP_ICONS[step.type]}
            </span>
            <span className="font-medium text-text-primary">{step.label}</span>
            {typeof step.estimatedMinutes === "number" ? (
              <span className="text-xs text-text-muted">
                {step.estimatedMinutes}p
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export { LearningRoutePreview };
