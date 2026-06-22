import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { ExamToSrsStep } from "../types/marketing.types";

export type ExamToSrsFlowProps = {
  steps: ExamToSrsStep[];
  className?: string;
};

const accentClass: Record<ExamToSrsStep["tone"], string> = {
  primary: "border-t-primary text-primary",
  danger: "border-t-danger text-danger",
  golden: "border-t-golden-strong text-golden-strong",
  success: "border-t-success text-success",
};

/**
 * ExamToSrsFlow — visualises the exam→SRS loop: a wrong answer in an exam is
 * detected, queued into Golden Time, and mastered over time. Landing-page
 * explainer for the "Luyện thi thông minh" section.
 */
function ExamToSrsFlow({ steps, className }: ExamToSrsFlowProps) {
  return (
    <ol
      className={cn(
        "flex flex-col items-stretch gap-3 sm:flex-row sm:gap-2",
        className
      )}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <li
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-card border border-t-4 border-border bg-card p-5 text-center",
              accentClass[step.tone]
            )}
          >
            <span className="[&_svg]:size-7">{step.icon}</span>
            <span className="text-sm font-semibold text-text-primary">
              {step.label}
            </span>
            <span className="text-xs text-text-muted">{step.sub}</span>
          </li>
          {i < steps.length - 1 ? (
            <li className="flex items-center justify-center" aria-hidden>
              <ChevronRight className="size-5 rotate-90 text-text-muted sm:rotate-0" />
            </li>
          ) : null}
        </React.Fragment>
      ))}
    </ol>
  );
}

export { ExamToSrsFlow };
