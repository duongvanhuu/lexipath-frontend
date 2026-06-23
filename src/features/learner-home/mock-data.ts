import type { NextBestStepCardProps } from "@/components/lexipath/cta/next-best-step-card";
import type { TodayCommandCenterProps } from "@/components/lexipath/layout/today-command-center";
import type { TodayPathProps } from "@/components/lexipath/path/today-path";
import type { GoldenTimeWindowProps } from "@/components/lexipath/golden-time/golden-time-window";
import type { LearningInsightCardProps } from "@/components/lexipath/insights/learning-insight-card";
import type { SkillLaneData } from "@/components/lexipath";
import type { LanguageCode } from "@/features/auth/types/auth.types";

import type { HomeHeroProps } from "./components/home-hero";
import type { HomeJourneyRailProps } from "./components/home-journey-rail";
import type { HomeGoldenSummaryProps } from "./components/home-golden-summary";
import type { HomeSkillStat } from "./components/home-skill-lanes";
import type { HomeCollectionData } from "./components/home-collection-card";
import type { HomeWeeklyActivityProps } from "./components/home-weekly-activity";

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
/* Legacy mocks (kept for backward-compat with other pages)                   */
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

export const MOCK_TODAY_SESSION: TodayCommandCenterProps = {
  reviewedCount: 24,
  learnedCount: 8,
  dueCount: 18,
  goldenTimeActive: true,
  nextHref: "/learning/review",
  nextLabel: "Ôn tập ngay",
};

export const MOCK_TODAY_PATH: TodayPathProps = {
  title: "Lộ trình hôm nay",
  currentLabel: "Unit 4 — Từ vựng chủ đề Du lịch",
  currentState: "current",
  remainingCount: 3,
  href: "/learning",
};

export const MOCK_GOLDEN_TIME: GoldenTimeWindowProps = {
  windowOpen: true,
  closeAt: "22:00",
  queueCount: 12,
  reasons: ["post_session", "forgetting_curve"],
};

export const MOCK_SKILL_LANES: SkillLaneData[] = [
  { skill: "meaning",     masteredCount: 58, totalCount: 80, accuracyPct: 87 },
  { skill: "listening",   masteredCount: 34, totalCount: 80, accuracyPct: 72 },
  { skill: "spelling",    masteredCount: 20, totalCount: 80, accuracyPct: 61 },
  { skill: "usage",       masteredCount: 45, totalCount: 80, accuracyPct: 78 },
  { skill: "collocation", masteredCount: 12, totalCount: 80, accuracyPct: 55 },
];

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

/* -------------------------------------------------------------------------- */
/* v22 Home: Hero                                                              */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_HERO: HomeHeroProps = {
  name: "An Nhiên",
  langLabel: "Tiếng Anh",
  greeting: "Hôm nay luyện tiếng Anh 10 phút nhé?",
  streak: 8,
  xpToday: 90,
  dailyDone: 6,
  dailyTarget: 15,
  dailyUnit: "từ",
  cta: {
    isGolden: true,
    goldenDue: 10,
    goldenOverdue: 2,
    goldenMins: 5,
    lessonDone: 5,
    lessonTotal: 12,
    lessonUnit: "từ",
    lessonTitle: "Bài 5 — Business & Office Vocabulary",
    lessonMins: 6,
    learnHref: "/learning",
    reviewHref: "/golden-time",
  },
};

/* -------------------------------------------------------------------------- */
/* v22 Home: Journey rail                                                      */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_JOURNEY: HomeJourneyRailProps = {
  lessonTitle: "Bài 5 — Business & Office",
  steps: [
    {
      id: "learn",
      label: "Học từ mới",
      sub: "5/12 từ",
      state: "current",
      ctaLabel: "Tiếp tục",
      ctaHref: "/learning",
      isGolden: false,
    },
    {
      id: "practice",
      label: "Luyện tập",
      sub: "Bài tập kỹ năng",
      state: "available",
    },
    {
      id: "golden",
      label: "Ôn Golden Time",
      sub: "10 từ · ~5'",
      state: "due",
      ctaLabel: "Ôn ngay",
      ctaHref: "/golden-time",
      isGolden: true,
    },
    {
      id: "done",
      label: "Đích hôm nay",
      sub: "Mục tiêu 15 từ",
      state: "locked",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* v22 Home: Golden summary                                                    */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_GOLDEN: HomeGoldenSummaryProps = {
  due: 10,
  overdue: 2,
  mins: 5,
  skills: [
    { label: "Nhớ nghĩa",  count: 4, icon: "lightbulb"      },
    { label: "Nghe hiểu",  count: 3, icon: "headphones"     },
    { label: "Chính tả",   count: 2, icon: "type"           },
    { label: "Cách dùng",  count: 1, icon: "message-circle" },
  ],
  queueHref: "/golden-time",
};

/* -------------------------------------------------------------------------- */
/* v22 Home: Skill stats                                                       */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_SKILLS: HomeSkillStat[] = [
  { skill: "meaning",     pct: 75 },
  { skill: "listening",   pct: 52 },
  { skill: "spelling",    pct: 68 },
  { skill: "usage",       pct: 82 },
  { skill: "collocation", pct: 60 },
];

/* -------------------------------------------------------------------------- */
/* v22 Home: Current collection                                                */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_COLLECTION: HomeCollectionData = {
  id: "toeic",
  glyph: "T",
  glyphBg: "bg-info-soft",
  glyphColor: "text-blue-600",
  title: "1000 từ TOEIC",
  currentLesson: "Bài 5 — Business & Office Vocabulary",
  done: 5,
  total: 12,
  unit: "từ",
  nextLesson: "Bài 6 — Finance & Banking",
  collectionHref: "/collections/toeic",
  mapHref: "/collections/toeic/map",
};

/* -------------------------------------------------------------------------- */
/* v22 Home: Weekly activity                                                   */
/* -------------------------------------------------------------------------- */

export const MOCK_HOME_WEEK: HomeWeeklyActivityProps = {
  days: [
    { label: "T2", xp: 90,  active: true  },
    { label: "T3", xp: 75,  active: true  },
    { label: "T4", xp: 110, active: true  },
    { label: "T5", xp: 0,   active: false },
    { label: "T6", xp: 95,  active: true  },
    { label: "T7", xp: 80,  active: true  },
    { label: "CN", xp: 90,  active: true, isToday: true },
  ],
  xpTotal: 540,
};
