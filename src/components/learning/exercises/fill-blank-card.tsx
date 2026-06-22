"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

export type FillBlankCardProps = {
  sentenceBefore: string;
  sentenceAfter: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};

function FillBlankCard({
  sentenceBefore,
  sentenceAfter,
  value,
  onChange,
  onSubmit,
  state = "idle",
  correctAnswer,
  className,
}: FillBlankCardProps) {
  const blankClass = cn(
    "mx-1 inline-block min-w-[80px] border-b-2 px-3 py-0.5 text-center font-semibold",
    state === "correct" && "border-success text-success-foreground",
    state === "incorrect" && "border-danger text-danger-foreground",
    (state === "idle" || state === "selected") &&
      "border-primary text-text-primary"
  );

  const isLocked = state !== "idle" && state !== "selected";

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7",
        className
      )}
    >
      <div className="mb-4 text-center text-lg leading-loose text-text-primary">
        {sentenceBefore}
        <span className={blankClass}>{value || "   "}</span>
        {sentenceAfter}
      </div>
      <div className="flex flex-col items-center gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) onSubmit();
          }}
          disabled={isLocked}
          aria-label="Điền vào chỗ trống"
          className={cn("max-w-xs text-center text-lg font-semibold", {
            "border-success bg-success-soft": state === "correct",
            "border-danger bg-danger-soft": state === "incorrect",
          })}
          autoFocus
        />
        {!isLocked && onSubmit ? (
          <LexiButton variant="primary" onClick={onSubmit}>
            Kiểm tra
          </LexiButton>
        ) : null}
        {state === "incorrect" && correctAnswer ? (
          <p className="text-sm text-danger-foreground">
            Đáp án đúng: <strong>{correctAnswer}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { FillBlankCard };
