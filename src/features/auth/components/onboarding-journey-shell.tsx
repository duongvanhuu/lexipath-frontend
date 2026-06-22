import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type OnboardingJourneyShellProps = {
  /** e.g. "Bước 2 / 4". */
  stepLabel?: string;
  title: string;
  subtitle?: string;
  /** Progress descriptor for the segmented bar. */
  stepProgress?: { current: number; total: number };
  /** The main choice content (left panel). */
  children: React.ReactNode;
  /** The companion preview panel content (right panel). */
  companion: React.ReactNode;
  /** Action row (back / continue). */
  footer?: React.ReactNode;
  /** Heading for the companion panel. */
  companionLabel?: string;
  className?: string;
};

/**
 * OnboardingJourneyShell — the two-panel onboarding layout. The left panel
 * holds the active step; the right "companion" panel shows the learning journey
 * the learner's choices are building (LexiPath journey identity). Panels stack
 * on mobile (main first, companion below).
 */
function OnboardingJourneyShell({
  stepLabel,
  title,
  subtitle,
  stepProgress,
  children,
  companion,
  footer,
  companionLabel = "Lộ trình của bạn",
  className,
}: OnboardingJourneyShellProps) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-panel border border-border bg-card lg:grid-cols-[1.25fr_1fr]",
        className
      )}
    >
      {/* Main panel */}
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          {stepLabel || stepProgress ? (
            <div className="mb-3.5 flex items-center gap-2.5">
              {stepLabel ? (
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {stepLabel}
                </span>
              ) : null}
              {stepProgress ? (
                <span className="flex max-w-44 flex-1 gap-1">
                  {Array.from({ length: stepProgress.total }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        i < stepProgress.current ? "bg-primary" : "bg-surface-muted"
                      )}
                    />
                  ))}
                </span>
              ) : null}
            </div>
          ) : null}
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-md text-sm text-text-secondary">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex-1">{children}</div>

        {footer ? (
          <div className="flex items-center justify-between gap-3 pt-1">
            {footer}
          </div>
        ) : null}
      </div>

      {/* Companion preview panel */}
      <div className="relative flex flex-col justify-center gap-4 border-t border-border bg-primary-soft/40 p-6 sm:p-8 lg:border-t-0 lg:border-l">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,var(--color-primary)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="relative flex flex-col gap-3.5">
          <span className="text-xs font-semibold tracking-wide text-primary uppercase">
            {companionLabel}
          </span>
          {companion}
        </div>
      </div>
    </div>
  );
}

export { OnboardingJourneyShell };
