export type LessonDetailStatus =
  | "completed"
  | "current"
  | "preview"
  | "available"
  | "locked"
  | "due"
  | "weak";

export interface CollectionDetail {
  id: string;
  title: string;
  description: string;
  glyph: string;
  language: "en" | "ja" | "zh";
  level: string;
  itemLabel: string;
  totalItems: number;
  lessonCount: number;
  estimatedMinutes: number;
  access: "free" | "pro";
  collectionStatus: "not-started" | "learning" | "completed";
  progressPercent: number;
  lessonsCompleted: number;
  itemsLearned: number;
  itemsMastered: number;
  reviewDue: number;
  averageAccuracy: number;
  lastStudiedAt?: string;
}

export interface LessonDetail {
  id: string;
  sortOrder: number;
  title: string;
  description?: string;
  itemCount: number;
  completedCount: number;
  estimatedMinutes: number;
  status: LessonDetailStatus;
  href?: string;
  topics?: string[];
  accuracy?: number;
}
