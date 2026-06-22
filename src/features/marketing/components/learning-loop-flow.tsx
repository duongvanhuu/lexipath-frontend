import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { LearningLoopStep } from "../types/marketing.types";

export type LearningLoopFlowProps = {
  steps: LearningLoopStep[];
  className?: string;
};

const ringClass: Record<NonNullable<LearningLoopStep["tone"]>, string> = {
  primary: "border-primary text-primary",
  golden: "border-golden text-golden-strong",
  success: "border-success text-success",
  spelling: "border-skill-spelling text-skill-spelling",
};

/**
 * LearningLoopFlow — the LexiPath learning loop as a connected row of nodes:
 * Học từ mới → Luyện tập → Golden Time → Thành thạo. Explains the product model
 * on the landing page (the app conveys the loop via real path components).
 */
function LearningLoopFlow({ steps, className }: LearningLoopFlowProps) {
  return (
    <ol
      className={cn(
        "flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0",
        className
      )}
    >
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-4 sm:gap-0">
          <div className="flex w-24 flex-col items-center gap-2.5 px-2">
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-full border-2 bg-card [&_svg]:size-6",
                ringClass[step.tone ?? "primary"]
              )}
            >
              {step.icon}
            </span>
            <span className="text-center text-sm font-medium text-text-primary">
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 ? (
            <ChevronRight
              className="size-5 shrink-0 rotate-90 text-text-muted sm:mb-7 sm:rotate-0"
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export { LearningLoopFlow };
