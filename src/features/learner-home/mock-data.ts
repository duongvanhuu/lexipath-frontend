import type { NextBestStepCardProps } from "@/components/lexipath/cta/next-best-step-card";
import type { TodayCommandCenterProps } from "@/components/lexipath/layout/today-command-center";
import type { TodayPathProps } from "@/components/lexipath/path/today-path";
import type { GoldenTimeWindowProps } from "@/components/lexipath/golden-time/golden-time-window";
import type { LearningInsightCardProps } from "@/components/lexipath/insights/learning-insight-card";
import type { SkillLaneData } from "@/components/lexipath";
import type { LanguageCode } from "@/features/auth/types/auth.types";

/* -------------------------------------------------------------------------- */
/* User                                                                        */
/* -------------------------------------------------------------------------- */

export type HomeUserData = {
  name: string;
  activeLang: LanguageCode;
};

export const MOCK_HOME_USER: HomeUserData = {
  name: "An Nhiên",
  activeLang: "en",
};

/* -------------------------------------------------------------------------- */
/* Next best step                                                               */
/* -------------------------------------------------------------------------- */

export const MOCK_NEXT_BEST_STEP: NextBestStepCardProps = {
  badge: "Bước tiếp theo",
  title: "Ôn tập từ vựng Unit 4",
  description:
    "Bạn có 18 từ sắp vượt qua đường quên lãng. Ôn ngay để giữ vững tiến độ.",
  ctaLabel: "Bắt đầu ôn",
  href: "/learning/review",
  itemCount: 18,
  estimatedMinutes: 12,
  reason: "overdue",
};

/* -------------------------------------------------------------------------- */
/* Today session                                                                */
/* -------------------------------------------------------------------------- */

export const MOCK_TODAY_SESSION: TodayCommandCenterProps = {
  reviewedCount: 24,
  learnedCount: 8,
  dueCount: 18,
  goldenTimeActive: true,
  nextHref: "/learning/review",
  nextLabel: "Ôn tập ngay",
};

/* -------------------------------------------------------------------------- */
/* Today path                                                                   */
/* -------------------------------------------------------------------------- */

export const MOCK_TODAY_PATH: TodayPathProps = {
  title: "Lộ trình hôm nay",
  currentLabel: "Unit 4 — Từ vựng chủ đề Du lịch",
  currentState: "current",
  remainingCount: 3,
  href: "/learning",
};

/* -------------------------------------------------------------------------- */
/* Golden Time                                                                  */
/* -------------------------------------------------------------------------- */

export const MOCK_GOLDEN_TIME: GoldenTimeWindowProps = {
  windowOpen: true,
  closeAt: "22:00",
  queueCount: 12,
  reasons: ["post_session", "forgetting_curve"],
};

/* -------------------------------------------------------------------------- */
/* Skill lanes                                                                  */
/* -------------------------------------------------------------------------- */

export const MOCK_SKILL_LANES: SkillLaneData[] = [
  { skill: "meaning",     masteredCount: 58, totalCount: 80, accuracyPct: 87 },
  { skill: "listening",   masteredCount: 34, totalCount: 80, accuracyPct: 72 },
  { skill: "spelling",    masteredCount: 20, totalCount: 80, accuracyPct: 61 },
  { skill: "usage",       masteredCount: 45, totalCount: 80, accuracyPct: 78 },
  { skill: "collocation", masteredCount: 12, totalCount: 80, accuracyPct: 55 },
];

/* -------------------------------------------------------------------------- */
/* Insight metrics                                                              */
/* -------------------------------------------------------------------------- */

export const MOCK_INSIGHTS: LearningInsightCardProps[] = [
  {
    title: "Chuỗi học",
    value: 7,
    unit: "ngày",
    sublabel: "Liên tiếp không nghỉ",
    trend: "up",
  },
  {
    title: "Điểm XP",
    value: 1240,
    unit: "điểm",
    sublabel: "Tổng kinh nghiệm",
    trend: "up",
  },
  {
    title: "Từ đã thuộc",
    value: 342,
    unit: "từ",
    sublabel: "Trong kho từ vựng",
    trend: "up",
  },
  {
    title: "Cần ôn hôm nay",
    value: 18,
    unit: "từ",
    sublabel: "Sắp quá hạn SRS",
    trend: "flat",
  },
];
