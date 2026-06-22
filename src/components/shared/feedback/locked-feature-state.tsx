import * as React from "react";
import { Lock } from "lucide-react";

import { ActionButton } from "@/components/shared/action-button";
import { cn } from "@/lib/utils/cn";

import type { EmptyStateAction } from "./types";

export type LockedFeatureStateProps = {
  title?: string;
  description?: string;
  /** Upgrade / unlock call-to-action. Defaults to the golden (premium) tone. */
  action?: EmptyStateAction;
  className?: string;
};

/**
 * LockedFeatureState — placeholder for premium / gated features. Uses the
 * LexiPath golden (premium) accent and a dashed frame to read as "unlockable",
 * not "broken".
 */
function LockedFeatureState({
  title = "Tính năng Premium",
  description,
  action,
  className,
}: LockedFeatureStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-50 flex-col items-center justify-center rounded-card border border-dashed border-golden/50 bg-golden-soft/40 px-6 py-12 text-center",
        className
      )}
    >
      <span className="mb-4 inline-flex size-13 items-center justify-center rounded-panel bg-card text-golden-strong shadow-card [&_svg]:size-6">
        <Lock aria-hidden />
      </span>
      <h3 className="text-lg font-semibold text-golden-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-5">
          <ActionButton action={{ variant: "golden", ...action }} />
        </div>
      ) : null}
    </div>
  );
}

export { LockedFeatureState };
