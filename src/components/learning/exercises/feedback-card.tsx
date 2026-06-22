import * as React from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { cva } from "class-variance-authority";

import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { FeedbackState } from "@/components/learning/types";

const feedbackVariants = cva(
  "flex items-start gap-3.5 rounded-sm border-l-[3px] px-5 py-4",
  {
    variants: {
      state: {
        correct: "border-success bg-success-soft text-success-foreground",
        incorrect: "border-danger bg-danger-soft text-danger-foreground",
        partial: "border-warning bg-warning-soft text-warning-foreground",
        hint: "border-border bg-muted text-text-secondary",
      },
    },
    defaultVariants: { state: "correct" },
  }
);

const ICON_MAP: Record<FeedbackState, React.ReactElement> = {
  correct: <CheckCircle2 className="size-5 shrink-0" aria-hidden />,
  incorrect: <XCircle className="size-5 shrink-0" aria-hidden />,
  partial: <AlertTriangle className="size-5 shrink-0" aria-hidden />,
  hint: <Lightbulb className="size-5 shrink-0" aria-hidden />,
};

const DEFAULT_TITLE: Record<FeedbackState, string> = {
  correct: "Chính xác!",
  incorrect: "Chưa đúng",
  partial: "Gần đúng",
  hint: "Gợi ý",
};

export type FeedbackCardProps = {
  state: FeedbackState;
  title?: string;
  explanation?: string;
  continueLabel?: string;
  onContinue?: () => void;
  className?: string;
};

function FeedbackCard({
  state,
  title,
  explanation,
  continueLabel = "Tiếp tục",
  onContinue,
  className,
}: FeedbackCardProps) {
  return (
    <div className={cn(feedbackVariants({ state }), className)}>
      {ICON_MAP[state]}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-base font-semibold">{title ?? DEFAULT_TITLE[state]}</p>
        {explanation ? (
          <p className="text-sm leading-normal opacity-85">{explanation}</p>
        ) : null}
      </div>
      {onContinue ? (
        <LexiButton
          variant="primary"
          size="sm"
          onClick={onContinue}
          className="shrink-0 self-start"
        >
          {continueLabel}
        </LexiButton>
      ) : null}
    </div>
  );
}

export { FeedbackCard, feedbackVariants };
