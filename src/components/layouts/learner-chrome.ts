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
  streak?: number;
  xp?: number;
  notification?: NotificationSummary;
  languages?: LanguageOption[];
  activeLanguage?: string;
  onLanguageChange?: (code: string) => void;
};
