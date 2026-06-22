import * as React from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type ExamQuestionPreviewCardProps = {
  /** Format label, e.g. "Trắc nghiệm · Part 5". */
  type?: string;
  question: string;
  options: string[];
  /** Index of the option the learner picked (for the demo). */
  selectedIndex?: number;
  /** Index of the correct option (renders a success state). */
  correctIndex?: number;
  className?: string;
};

/**
 * ExamQuestionPreviewCard — a static, non-interactive preview of an exam
 * question format (type, prompt, answer options). Use the real answer-choice
 * components for interactive exams.
 */
function ExamQuestionPreviewCard({
  type,
  question,
  options,
  selectedIndex,
  correctIndex,
  className,
}: ExamQuestionPreviewCardProps) {
  return (
    <Card className={cn("gap-4 p-5", className)}>
      {type ? (
        <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
          {type}
        </span>
      ) : null}
      <p className="text-base font-medium text-text-primary">{question}</p>

      <ul className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isCorrect = correctIndex != null && i === correctIndex;
          const isSelected = !isCorrect && i === selectedIndex;
          return (
            <li
              key={opt}
              className={cn(
                "flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-sm",
                isCorrect &&
                  "border-success bg-success-soft text-success-foreground",
                isSelected &&
                  "border-primary bg-primary-soft text-primary-soft-foreground",
                !isCorrect &&
                  !isSelected &&
                  "border-border bg-surface-muted text-text-secondary"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isCorrect || isSelected
                    ? "border-current"
                    : "border-border text-text-muted"
                )}
              >
                {isCorrect ? (
                  <Check className="size-3" aria-hidden />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-text-primary">{opt}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export { ExamQuestionPreviewCard };
