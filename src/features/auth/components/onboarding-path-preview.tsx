import * as React from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type OnboardingCheckpointState =
  | "complete"
  | "current"
  | "available"
  | "locked";

export type OnboardingCheckpoint = {
  label: string;
  sublabel?: string;
  state: OnboardingCheckpointState;
};

export type OnboardingPathSummary = {
  language?: string;
  goal?: string;
  daily?: string;
};

export type OnboardingPathPreviewProps = {
  /** Selected setup shown as chips at the top. */
  summary?: OnboardingPathSummary;
  checkpoints?: OnboardingCheckpoint[];
  className?: string;
};

const nodeClass: Record<OnboardingCheckpointState, string> = {
  complete: "bg-primary text-primary-foreground",
  current: "bg-primary text-primary-foreground ring-4 ring-primary/25",
  available: "border-2 border-primary/60 bg-card text-primary",
  locked: "border-2 border-border bg-card text-text-muted",
};

/**
 * OnboardingPathPreview — the companion panel of {@link OnboardingJourneyShell}.
 * Shows the LexiPath learning path being assembled from the learner's choices:
 * setup chips + a vertical checkpoint rail. Reinforces the journey/checkpoint
 * identity. Presentational (Server Component).
 */
function OnboardingPathPreview({
  summary,
  checkpoints = [],
  className,
}: OnboardingPathPreviewProps) {
  return (
    <Card className={cn("gap-4 p-5 shadow-card", className)}>
      {summary &&
      (summary.language || summary.goal || summary.daily) ? (
        <div className="flex flex-wrap gap-1.5">
          {summary.language ? (
            <span className="rounded-pill bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground">
              {summary.language}
            </span>
          ) : null}
          {summary.goal ? (
            <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
              {summary.goal}
            </span>
          ) : null}
          {summary.daily ? (
            <span className="rounded-pill bg-golden-soft px-2.5 py-1 text-xs font-medium text-golden-foreground">
              {summary.daily}
            </span>
          ) : null}
        </div>
      ) : null}

      <ol className="flex flex-col">
        {checkpoints.map((c, i) => {
          const last = i === checkpoints.length - 1;
          const railActive = c.state === "complete" || c.state === "current";
          return (
            <li key={c.label} className="flex gap-3">
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "flex size-7.5 items-center justify-center rounded-full text-xs font-bold",
                    nodeClass[c.state]
                  )}
                >
                  {c.state === "complete" ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                {!last ? (
                  <span
                    className={cn(
                      "my-1 w-0.5 flex-1 rounded-full",
                      railActive ? "bg-primary" : "bg-border"
                    )}
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1 pt-1", last ? "pb-0" : "pb-3.5")}>
                <span
                  className={cn(
                    "block text-sm",
                    c.state === "current"
                      ? "font-semibold text-primary"
                      : c.state === "locked"
                        ? "font-medium text-text-muted"
                        : "font-medium text-text-primary"
                  )}
                >
                  {c.label}
                </span>
                {c.sublabel ? (
                  <span className="mt-0.5 block text-xs text-text-muted">
                    {c.sublabel}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export { OnboardingPathPreview };
