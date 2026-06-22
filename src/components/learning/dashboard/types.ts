export interface ReviewQueueItem {
  id: string;
  word: string;
  dueLabel: string;
  reason: "due" | "overdue" | "weak" | "exam_miss";
  skillKey: "meaning" | "listening" | "spelling" | "usage" | "collocation";
}

export interface StreakData {
  currentDays: number;
  longestDays: number;
  /** 7 booleans, Mon–Sun */
  weekActive: boolean[];
}

export interface XpData {
  totalXp: number;
  todayXp: number;
  weekHistory: Array<{ day: string; xp: number }>;
}

export interface SkillSummary {
  key: "meaning" | "listening" | "spelling" | "usage" | "collocation";
  label: string;
  masteredCount: number;
  totalCount: number;
  accuracyPct: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
  earnedAt?: string;
  iconName?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  isCurrentUser?: boolean;
}

export interface GoldenTimeSummary {
  windowOpen: boolean;
  closeAt?: string;
  queueCount: number;
  reasons: Array<"post_session" | "forgetting_curve" | "exam_wrong">;
}

export interface ContinueLearningData {
  lessonTitle: string;
  collectionName: string;
  progressPercent: number;
  href: string;
}

export interface DailyStats {
  reviewedCount: number;
  learnedCount: number;
  accuracyPct: number;
}
