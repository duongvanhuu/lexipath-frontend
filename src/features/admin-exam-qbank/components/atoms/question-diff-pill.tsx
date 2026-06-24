import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { Difficulty } from "../../types/question-bank.types";
import { DIFFICULTY_LABEL } from "./question-atom-meta";

// ─── Variants ─────────────────────────────────────────────────────────────────
const diffPillVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
  {
    variants: {
      difficulty: {
        easy:   "bg-green-100 text-green-700",
        medium: "bg-amber-100 text-amber-700",
        hard:   "bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      difficulty: "medium",
    },
  },
);

type DifficultyVariant = NonNullable<
  VariantProps<typeof diffPillVariants>["difficulty"]
>;

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionDiffPillProps {
  difficulty: Difficulty;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionDiffPill({ difficulty, className }: QuestionDiffPillProps) {
  const label = DIFFICULTY_LABEL[difficulty];

  return (
    <span
      className={cn(
        diffPillVariants({ difficulty: difficulty as DifficultyVariant }),
        className,
      )}
    >
      {label}
    </span>
  );
}
