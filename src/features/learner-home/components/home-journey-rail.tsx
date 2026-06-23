import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { Check, ChevronRight, Clock, Lock } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type HomeJourneyStepState =
  | "completed"
  | "current"
  | "available"
  | "locked"
  | "due";

export type HomeJourneyStep = {
  id: string;
  label: string;
  sub: string;
  state: HomeJourneyStepState;
  ctaLabel?: string;
  ctaHref?: string;
  isGolden?: boolean;
};

export type HomeJourneyRailProps = {
  lessonTitle: string;
  steps: HomeJourneyStep[];
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* StepCircle                                                                  */
/* -------------------------------------------------------------------------- */

function StepCircle({ state }: { state: HomeJourneyStepState }) {
  const base =
    "flex size-[34px] shrink-0 items-center justify-center rounded-full font-bold transition-all";

  switch (state) {
    case "completed":
      return (
        <div className={cn(base, "bg-primary text-white")}>
          <Check className="size-4" aria-hidden />
        </div>
      );
    case "current":
      return (
        <div
          className={cn(base, "bg-primary text-white")}
          style={{
            boxShadow:
              "0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)",
          }}
        >
          <ChevronRight className="size-4" aria-hidden />
        </div>
      );
    case "due":
      return (
        <div
          className={cn(base, "bg-golden text-white")}
          style={{
            boxShadow:
              "0 0 0 4px color-mix(in srgb, var(--golden) 20%, transparent)",
          }}
        >
          <Clock className="size-4" aria-hidden />
        </div>
      );
    case "locked":
      return (
        <div className={cn(base, "bg-border text-text-muted")}>
          <Lock className="size-3.5" aria-hidden />
        </div>
      );
    default:
      return (
        <div className={cn(base, "border-2 border-border bg-card")}>
          <div className="size-2 rounded-full bg-border" />
        </div>
      );
  }
}

/* -------------------------------------------------------------------------- */
/* StepConnector                                                               */
/* -------------------------------------------------------------------------- */

function StepConnector({ prevState }: { prevState: HomeJourneyStepState }) {
  if (prevState === "completed") {
    return (
      <div
        className="mt-[17px] h-0.5 flex-1 rounded-full bg-primary"
        aria-hidden
      />
    );
  }
  if (prevState === "due") {
    return (
      <div
        className="mt-[17px] h-0.5 flex-1 rounded-full bg-golden"
        aria-hidden
      />
    );
  }
  return (
    <div
      className="mt-[17px] h-0.5 flex-1 rounded-full"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--border) 0 6px, transparent 6px 10px)",
      }}
      aria-hidden
    />
  );
}

/* -------------------------------------------------------------------------- */
/* HomeJourneyRail                                                             */
/* -------------------------------------------------------------------------- */

function HomeJourneyRail({ lessonTitle, steps, className }: HomeJourneyRailProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">
          Hành trình hôm nay
        </span>
        <span className="text-xs font-medium text-text-secondary">
          {lessonTitle}
        </span>
      </div>

      {/* Rail */}
      <div
        className="flex items-start"
        role="list"
        aria-label="Các bước học hôm nay"
      >
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Step column */}
            <div
              className="flex min-w-0 flex-1 flex-col items-center"
              role="listitem"
            >
              <StepCircle state={step.state} />
              <div className="mt-2.5 w-full px-1 text-center">
                <p
                  className={cn(
                    "overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] font-semibold",
                    step.state === "locked"
                      ? "text-text-muted"
                      : "text-text-primary"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10.5px] text-text-muted">{step.sub}</p>
                {step.ctaLabel && step.ctaHref ? (
                  <Link
                    href={step.ctaHref as Route}
                    className={cn(
                      "mt-1.5 inline-block rounded-lg px-2.5 py-1 text-[10.5px] font-semibold no-underline transition-opacity hover:opacity-80",
                      step.isGolden
                        ? "bg-golden-soft text-golden-foreground"
                        : "bg-primary-soft text-primary-soft-foreground"
                    )}
                  >
                    {step.ctaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Connector between steps */}
            {i < steps.length - 1 ? (
              <StepConnector prevState={step.state} />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { HomeJourneyRail };
