import * as React from "react";
import {
  AlertCircle,
  Calendar,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

import type { ReviewReason } from "../types";
import { REVIEW_REASON_LABELS } from "../constants/lexipath.constants";

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

const reviewReasonVariants = cva(
  "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      reason: {
        due: "bg-primary-soft text-primary-soft-foreground",
        overdue: "bg-danger-soft text-danger-foreground",
        weak: "bg-warning-soft text-warning-foreground",
        exam_miss: "bg-golden-soft text-golden-foreground",
      },
    },
    defaultVariants: {
      reason: "due",
    },
  }
);

/* -------------------------------------------------------------------------- */
/* Reason icon map                                                             */
/* -------------------------------------------------------------------------- */

const REASON_ICONS: Record<ReviewReason, React.ReactElement> = {
  due: <Calendar className="size-3 shrink-0" aria-hidden />,
  overdue: <AlertCircle className="size-3 shrink-0" aria-hidden />,
  weak: <TrendingDown className="size-3 shrink-0" aria-hidden />,
  exam_miss: <XCircle className="size-3 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* ReviewReasonChip                                                            */
/* -------------------------------------------------------------------------- */

export type ReviewReasonChipProps = {
  reason: ReviewReason;
  className?: string;
  children?: React.ReactNode;
};

/**
 * ReviewReasonChip — a coloured pill indicating why a word is in the review
 * queue (due / overdue / weak / exam miss).
 */
function ReviewReasonChip({ reason, className, children }: ReviewReasonChipProps) {
  return (
    <span className={cn(reviewReasonVariants({ reason }), className)}>
      {REASON_ICONS[reason]}
      {children ?? REVIEW_REASON_LABELS[reason]}
    </span>
  );
}

export { ReviewReasonChip, reviewReasonVariants };
