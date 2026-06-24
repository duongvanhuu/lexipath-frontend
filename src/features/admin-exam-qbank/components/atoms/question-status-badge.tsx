import * as React from "react";

import {
  ContentStatusBadge,
  type ContentStatus,
} from "@/components/shared/badges/content-status-badge";
import type { QuestionStatus } from "../../types/question-bank.types";

// ─── Status mapping ───────────────────────────────────────────────────────────
// QuestionStatus uses "review" (Chờ duyệt); ContentStatus uses "in_review" (Đang duyệt).
// Override the label via children for draft and review to match product copy.
const STATUS_MAP: Record<QuestionStatus, ContentStatus> = {
  draft:     "draft",
  review:    "in_review",
  published: "published",
};

const STATUS_LABEL_OVERRIDE: Partial<Record<QuestionStatus, string>> = {
  draft:  "Bản nháp",
  review: "Chờ duyệt",
  // "published" matches ContentStatusBadge's default label "Đã xuất bản" — no override needed
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionStatusBadgeProps {
  status: QuestionStatus;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionStatusBadge({ status, className }: QuestionStatusBadgeProps) {
  const contentStatus = STATUS_MAP[status];
  const labelOverride = STATUS_LABEL_OVERRIDE[status];

  return (
    <ContentStatusBadge status={contentStatus} className={className}>
      {labelOverride}
    </ContentStatusBadge>
  );
}
