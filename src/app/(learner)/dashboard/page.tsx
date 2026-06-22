// src/app/(learner)/dashboard/page.tsx
import * as React from "react";

import {
  NextBestStepCard,
  TodayCommandCenter,
  TodayPath,
  GoldenTimeWindow,
  SkillLaneGroup,
  LearningInsightCard,
} from "@/components/lexipath";

import {
  MOCK_HOME_USER,
  MOCK_NEXT_BEST_STEP,
  MOCK_TODAY_SESSION,
  MOCK_TODAY_PATH,
  MOCK_GOLDEN_TIME,
  MOCK_SKILL_LANES,
  MOCK_INSIGHTS,
} from "@/features/learner-home";

/* -------------------------------------------------------------------------- */
/* Active language labels                                                      */
/* -------------------------------------------------------------------------- */

const ACTIVE_LANG_LABELS: Record<"en" | "ja" | "zh", string> = {
  en: "🇬🇧 Tiếng Anh",
  ja: "🇯🇵 Tiếng Nhật",
  zh: "🇨🇳 Tiếng Trung",
};

/* -------------------------------------------------------------------------- */
/* HomeGreeting                                                                */
/* -------------------------------------------------------------------------- */

function HomeGreeting({
  name,
  activeLang,
}: {
  name: string;
  activeLang: "en" | "ja" | "zh";
}) {
  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-text-primary">
          Xin chào, {name}!
        </h1>
        <span className="rounded-pill bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary-soft-foreground">
          {ACTIVE_LANG_LABELS[activeLang]}
        </span>
      </div>
      <p className="text-sm text-text-secondary">
        Hôm nay là ngày học tốt. Tiếp tục hành trình của bạn nhé.
      </p>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const { name, activeLang } = MOCK_HOME_USER;

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <HomeGreeting name={name} activeLang={activeLang} />

      {/* 2-column cockpit grid */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Left column — learning action lane */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          <NextBestStepCard {...MOCK_NEXT_BEST_STEP} />

          {/* Duplicated only to preserve responsive reading order; keep pure display. */}
          <div className="lg:hidden">
            <GoldenTimeWindow {...MOCK_GOLDEN_TIME} />
          </div>

          <TodayCommandCenter {...MOCK_TODAY_SESSION} />
          <TodayPath {...MOCK_TODAY_PATH} />
        </div>

        {/* Right column — context lane */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          {/* Desktop-only: see mobile duplicate in left column above */}
          <div className="hidden lg:block">
            <GoldenTimeWindow {...MOCK_GOLDEN_TIME} />
          </div>

          <SkillLaneGroup title="Kỹ năng" lanes={MOCK_SKILL_LANES} />

          {/* Insight metrics — 2×2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {MOCK_INSIGHTS.map((insight) => (
              <LearningInsightCard key={insight.title} {...insight} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
