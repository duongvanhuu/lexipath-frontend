import * as React from "react";
import { Zap, UserCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { QuestionType } from "../../types/question-bank.types";
import { isAutoGraded } from "./question-atom-meta";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionGradeChipProps {
  type: QuestionType;
  rubricId?: string | null;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionGradeChip({ type, rubricId, className }: QuestionGradeChipProps) {
  if (isAutoGraded(type)) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] font-semibold text-green-700",
          className,
        )}
      >
        <Zap className="size-3" aria-hidden />
        Tự chấm
      </span>
    );
  }

  // writing / speaking — rubric graded
  const hasRubric = rubricId != null && rubricId !== "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold",
        hasRubric
          ? "text-purple-700"
          : "text-amber-600",
        className,
      )}
    >
      <UserCheck className="size-3" aria-hidden />
      Rubric
    </span>
  );
}
