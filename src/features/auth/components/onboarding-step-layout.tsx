"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/shared/icon-button";
import { cn } from "@/lib/utils/cn";

export type OnboardingStepLayoutProps = {
  /** 1-based current step. */
  step?: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  className?: string;
};

/**
 * OnboardingStepLayout — a single-column onboarding step frame: segmented
 * progress + back control, title/description, content, and a primary "next"
 * action. Used for simpler flows that don't need the journey companion panel.
 */
function OnboardingStepLayout({
  step = 1,
  totalSteps = 4,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Tiếp tục",
  nextDisabled,
  className,
}: OnboardingStepLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col px-6 py-8",
        className
      )}
    >
      <div className="mb-8 flex items-center gap-2">
        {onBack ? (
          <IconButton label="Quay lại" variant="ghost" size="icon-sm" onClick={onBack}>
            <ChevronLeft />
          </IconButton>
        ) : (
          <span className="w-7" />
        )}
        <span className="flex flex-1 gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < step ? "bg-primary" : "bg-surface-muted"
              )}
            />
          ))}
        </span>
        <span className="w-7 text-right text-xs font-medium text-text-muted">
          {step}/{totalSteps}
        </span>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>

      <div className="mt-8">
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

export { OnboardingStepLayout };
