import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleDot,
  CheckSquare,
  PencilLine,
  Shuffle,
  Scale,
  CheckCheck,
  ListOrdered,
  Type,
  FileText,
  Mic,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { QuestionType } from "../../types/question-bank.types";
import {
  QUESTION_TYPE_LABEL,
  QUESTION_TYPE_CLASSES,
} from "./question-atom-meta";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const TYPE_ICON: Record<QuestionType, React.ElementType> = {
  mcq:      CircleDot,
  multi:    CheckSquare,
  fill:     PencilLine,
  matching: Shuffle,
  tfng:     Scale,
  ynng:     CheckCheck,
  ordering: ListOrdered,
  short:    Type,
  writing:  FileText,
  speaking: Mic,
};

// ─── Size variants ────────────────────────────────────────────────────────────
const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type ChipSize = NonNullable<VariantProps<typeof chipVariants>["size"]>;

// ─── Icon size classes ────────────────────────────────────────────────────────
const ICON_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: "size-[11px]",
  md: "size-3",
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionTypeChipProps {
  type: QuestionType;
  size?: ChipSize;
  showIcon?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionTypeChip({
  type,
  size = "md",
  showIcon = true,
  className,
}: QuestionTypeChipProps) {
  const Icon = TYPE_ICON[type];
  const label = QUESTION_TYPE_LABEL[type];
  const colorClasses = QUESTION_TYPE_CLASSES[type];

  return (
    <span
      className={cn(chipVariants({ size }), colorClasses, className)}
    >
      {showIcon && (
        <Icon
          className={ICON_SIZE_CLASSES[size]}
          aria-hidden
        />
      )}
      {label}
    </span>
  );
}
