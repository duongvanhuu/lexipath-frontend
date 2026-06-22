"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

const answerVariants = cva(
  "flex w-full items-center gap-3 rounded-button border-[1.5px] px-4 py-3.5 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      state: {
        idle: "border-border bg-card text-text-primary hover:border-border/80 hover:bg-muted/40",
        selected: "border-primary bg-primary/10 text-text-primary",
        correct: "border-success bg-success-soft text-success-foreground",
        incorrect: "border-danger bg-danger-soft text-danger-foreground",
        partial: "border-warning bg-warning-soft text-warning-foreground",
        disabled: "border-border bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

const keyBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[8px] text-sm font-semibold size-[30px]",
  {
    variants: {
      state: {
        idle: "bg-muted text-text-secondary",
        selected: "bg-primary text-white",
        correct: "bg-success text-white",
        incorrect: "bg-danger text-white",
        partial: "bg-warning text-white",
        disabled: "bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

export type AnswerChoiceButtonProps = {
  optionKey?: string;
  state?: ExerciseAnswerState;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

function AnswerChoiceButton({
  optionKey,
  state = "idle",
  onClick,
  className,
  children,
}: AnswerChoiceButtonProps) {
  const isDisabled =
    state === "disabled" || state === "correct" || state === "incorrect";

  return (
    <button
      type="button"
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={cn(answerVariants({ state }), className)}
      aria-pressed={state === "selected"}
    >
      {optionKey ? (
        <span className={keyBadgeVariants({ state })}>{optionKey}</span>
      ) : null}
      <span className="flex-1">{children}</span>
      {state === "correct" ? (
        <CheckCircle2
          className="size-[18px] shrink-0 text-success"
          aria-hidden
        />
      ) : null}
      {state === "incorrect" ? (
        <XCircle
          className="size-[18px] shrink-0 text-danger"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

export { AnswerChoiceButton, answerVariants };
