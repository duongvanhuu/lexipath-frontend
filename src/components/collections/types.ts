export interface CollectionSummary {
  id: string;
  title: string;
  description?: string;
  progressPercent: number;
  totalItems: number;
  masteredItems: number;
  coverImageUrl?: string;
  lessonCount?: number;
  category?: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  itemCount: number;
  completedCount: number;
  status: "locked" | "available" | "current" | "completed";
  href?: string;
}

export interface CollectionStats {
  totalWords: number;
  masteredWords: number;
  reviewDue: number;
  averageAccuracy: number;
}

export interface CollectionProgressEntry {
  date: string;
  learnedCount: number;
  masteredCount: number;
}
