import * as React from "react";

/* -------------------------------------------------------------------------- */
/* Domain primitives                                                           */
/* -------------------------------------------------------------------------- */

export type CheckpointState =
  | "current"
  | "due"
  | "weak"
  | "premium"
  | "completed"
  | "locked"
  | "available";

export type SkillKey =
  | "meaning"
  | "listening"
  | "spelling"
  | "usage"
  | "collocation";

export type GoldenTimeReason =
  | "post_session"
  | "forgetting_curve"
  | "exam_wrong";

export type ReviewReason = "due" | "overdue" | "weak" | "exam_miss";

/* -------------------------------------------------------------------------- */
/* Prop interfaces shared across the identity layer                           */
/* -------------------------------------------------------------------------- */

export interface CheckpointNodeProps {
  state: CheckpointState;
  label: string;
  sublabel?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface GoldenQueueItem {
  id: string;
  word: string;
  reason: ReviewReason;
  skillKey: SkillKey;
  dueLabel?: string;
}

export interface JourneyCheckpoint {
  id: string;
  label: string;
  sublabel?: string;
  state: CheckpointState;
  href?: string;
}

export interface LearningRouteStep {
  id: string;
  label: string;
  type: "lesson" | "review" | "exam" | "golden";
  state: CheckpointState;
  estimatedMinutes?: number;
}

export interface SkillLaneData {
  skill: SkillKey;
  masteredCount: number;
  totalCount: number;
  accuracyPct?: number;
}

export interface SkillBranch {
  skill: SkillKey;
  items: Array<{ id: string; word: string; state: CheckpointState }>;
}

export interface ExamToSrsStep {
  label: string;
  sub: string;
  icon: React.ReactNode;
  tone: "primary" | "danger" | "golden" | "success";
}
