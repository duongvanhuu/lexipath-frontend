import type { SessionExercise, SessionMeta } from "@/features/learning/types/session.types";
import type { ReviewReason, SkillKey } from "@/components/lexipath/types";

export type GoldenTimeExercise = SessionExercise & {
  reason: ReviewReason;
  skillKey: SkillKey;
  dueLabel?: string;
};

export type GoldenTimeSessionMeta = SessionMeta & {
  queueCount: number;
  windowMessage?: string;
};
