import * as React from "react";
import {
  ContentStatusBadge,
  type ContentStatus,
} from "@/components/shared/badges/content-status-badge";
import type { ScoreStatus } from "../types/scoring.types";

const STATUS_MAP: Record<ScoreStatus, ContentStatus> = {
  draft: "draft",
  review: "in_review",
  published: "published",
};

const LABEL_OVERRIDE: Partial<Record<ScoreStatus, string>> = {
  review: "Chờ duyệt",
};

export interface ScoringStatusBadgeProps {
  status: ScoreStatus;
  className?: string;
}

export function ScoringStatusBadge({ status, className }: ScoringStatusBadgeProps) {
  return (
    <ContentStatusBadge status={STATUS_MAP[status]} className={className}>
      {LABEL_OVERRIDE[status]}
    </ContentStatusBadge>
  );
}
