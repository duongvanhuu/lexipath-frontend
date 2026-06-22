export type ExerciseAnswerState =
  | "idle"
  | "selected"
  | "correct"
  | "incorrect"
  | "partial"
  | "disabled";

export type ExerciseQuestionType =
  | "flashcard"
  | "choice"
  | "audio"
  | "fill_blank"
  | "spelling"
  | "collocation";

export type FeedbackState = "correct" | "incorrect" | "partial" | "hint";

export interface SessionProgress {
  currentIndex: number;
  totalCount: number;
  progressPercent: number;
}

export interface SessionSummary {
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  durationLabel?: string;
}
