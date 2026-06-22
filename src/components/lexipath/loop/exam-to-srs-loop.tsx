import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileQuestion,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { ExamToSrsStep } from "../types";

/* -------------------------------------------------------------------------- */
/* Tone accent classes                                                         */
/* -------------------------------------------------------------------------- */

const ACCENT_CLASS: Record<ExamToSrsStep["tone"], string> = {
  primary: "border-t-primary text-primary",
  danger: "border-t-danger text-danger",
  golden: "border-t-golden-strong text-golden-strong",
  success: "border-t-success text-success",
};

/* -------------------------------------------------------------------------- */
/* Default steps                                                               */
/* -------------------------------------------------------------------------- */

const DEFAULT_STEPS: ExamToSrsStep[] = [
  {
    label: "Câu hỏi thi",
    sub: "Trả lời sai",
    icon: <FileQuestion aria-hidden />,
    tone: "danger",
  },
  {
    label: "Phát hiện",
    sub: "Hệ thống ghi nhận",
    icon: <AlertCircle aria-hidden />,
    tone: "primary",
  },
  {
    label: "Golden Time",
    sub: "Thêm vào hàng ôn",
    icon: <Clock aria-hidden />,
    tone: "golden",
  },
  {
    label: "Ghi nhớ sâu",
    sub: "SRS tối ưu hoá",
    icon: <CheckCircle2 aria-hidden />,
    tone: "success",
  },
];

/* -------------------------------------------------------------------------- */
/* ExamToSrsLoop                                                               */
/* -------------------------------------------------------------------------- */

export type ExamToSrsLoopProps = {
  steps?: ExamToSrsStep[];
  compact?: boolean;
  className?: string;
};

/**
 * ExamToSrsLoop — learner-app version of the exam→SRS loop diagram.
 * Smaller and inline-usable inside dashboard/collection pages.
 * Distinct from the marketing version (ExamToSrsFlow in features/marketing/).
 */
function ExamToSrsLoop({
  steps = DEFAULT_STEPS,
  compact = false,
  className,
}: ExamToSrsLoopProps) {
  return (
    <ol
      className={cn(
        "flex flex-col items-stretch gap-2 sm:flex-row sm:gap-1.5",
        className
      )}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <li
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 rounded-card border border-t-4 border-border bg-card text-center",
              compact ? "px-3 py-2" : "px-4 py-3",
              ACCENT_CLASS[step.tone]
            )}
          >
            <span className="[&_svg]:size-5">{step.icon}</span>
            <span
              className={cn(
                "font-semibold text-text-primary",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {step.label}
            </span>
            <span
              className={cn(
                "text-text-muted",
                compact ? "text-[10px]" : "text-xs"
              )}
            >
              {step.sub}
            </span>
          </li>
          {i < steps.length - 1 ? (
            <li
              className="flex items-center justify-center"
              aria-hidden
            >
              <ChevronRight className="size-4 rotate-90 text-text-muted sm:rotate-0" />
            </li>
          ) : null}
        </React.Fragment>
      ))}
    </ol>
  );
}

export { ExamToSrsLoop };
