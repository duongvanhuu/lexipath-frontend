"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

export type SpellingInputCardProps = {
  prompt: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};

function SpellingInputCard({
  prompt,
  hint,
  value,
  onChange,
  onSubmit,
  state = "idle",
  correctAnswer,
  className,
}: SpellingInputCardProps) {
  const isLocked = state !== "idle" && state !== "selected";

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      <p className="mb-2 text-sm text-text-secondary">{prompt}</p>
      {hint ? (
        <p className="mb-4 text-xs text-text-muted">{hint}</p>
      ) : null}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        disabled={isLocked}
        aria-label="Nhập từ"
        className={cn(
          "mx-auto h-12 max-w-xs text-center text-xl font-semibold",
          {
            "border-success bg-success-soft": state === "correct",
            "border-danger bg-danger-soft": state === "incorrect",
          }
        )}
        autoFocus
      />
      {state === "incorrect" && correctAnswer ? (
        <p className="mt-3 text-sm text-danger-foreground">
          Đáp án đúng: <strong>{correctAnswer}</strong>
        </p>
      ) : null}
      {!isLocked && onSubmit ? (
        <LexiButton variant="primary" className="mt-4" onClick={onSubmit}>
          Kiểm tra
        </LexiButton>
      ) : null}
    </div>
  );
}

export { SpellingInputCard };
