import type { Route } from "next";

import type { ShellAction, UserSummary } from "@/components/shared/navigation";

export type LanguageOption = { code: string; label: string };

export type GoldenTimeSummary = {
  count: number;
  href?: Route;
  onClick?: () => void;
};

export type NotificationSummary = {
  count?: number;
  href?: Route;
  onClick?: () => void;
};

/** Streak + XP shown inside the user menu dropdown. */
export type UserStats = {
  streak: number;
  xp: number;
};

/** Rich learning profile per language for the header language switcher. */
export type LearningProfile = {
  code: string;
  flag: string;
  name: string;
  level: string;
  goal: string;
  dailyDone: number;
  dailyTarget: number;
  streak: number;
  xp: number;
  goldenDue: number;
  lastStudied: string;
  isActive: boolean;
};

export type NotificationItemType =
  | "golden_time"
  | "streak"
  | "daily_goal"
  | "new_content"
  | "payment"
  | "security"
  | "exam";

/** A single notification for the header notification panel. */
export type NotificationItem = {
  id: string;
  type: NotificationItemType;
  title: string;
  body: string;
  sentAt: Date;
  readAt: Date | null;
  lang?: "ja" | "en" | "zh";
  dest?: string;
};

/**
 * The learner header "chrome" — everything in the top bar besides logo + nav.
 * Pages pass this down; shells never fetch it.
 */
export type LearnerChrome = {
  user: UserSummary;
  /** Account dropdown entries (profile, settings, …). */
  accountActions?: ShellAction[];
  onSignOut?: () => void;
  signOutLabel?: string;
  goldenTime?: GoldenTimeSummary;
  /** Streak + XP shown inside the user menu dropdown. */
  userStats?: UserStats;
  /** Rich notification items for the header notification panel. */
  notifications?: NotificationItem[];
  /** Rich learning profiles for the language switcher. */
  learningProfiles?: LearningProfile[];
  activeLanguage?: string;
  onLanguageChange?: (code: string) => void;
  /** Legacy: simple language options. Used as fallback when learningProfiles is absent. */
  languages?: LanguageOption[];
  /** Legacy: simple notification dot/count. */
  notification?: NotificationSummary;
  /** Legacy streak pill — now displayed inside the user menu. */
  streak?: number;
  /** Legacy XP pill — now displayed inside the user menu. */
  xp?: number;
};
