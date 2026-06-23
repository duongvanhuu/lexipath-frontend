import * as React from "react";
import type { Metadata } from "next";

import {
  GoldenTimeDashboardHero,
  GoldenTimeWindow,
  GoldenQueuePreview,
  TodaySchedulePanel,
  SkillLaneGroup,
  PageJourneyHeader,
  LearningInsightCard,
} from "@/components/lexipath";

import {
  MOCK_GOLDEN_TIME_DASHBOARD,
  MOCK_GOLDEN_TIME_INSIGHTS,
} from "@/features/golden-time";

export const metadata: Metadata = {
  title: "Golden Time",
};

export default function GoldenTimePage() {
  const {
    queueCount,
    overdueCount,
    windowOpen,
    closeAt,
    timeWindowMessage,
    reasons,
    queue,
    schedule,
    skillLanes,
  } = MOCK_GOLDEN_TIME_DASHBOARD;

  const isEmpty = queueCount === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Journey header */}
      <PageJourneyHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Golden Time" },
        ]}
        title="Thời điểm ôn tập"
        subtitle="Ôn đúng lúc giúp ghi nhớ bền hơn 3–4 lần so với học lại từ đầu."
        badge="SRS"
      />

      {/* Hero */}
      <GoldenTimeDashboardHero
        queueCount={queueCount}
        overdueCount={overdueCount}
        timeWindowMessage={timeWindowMessage}
        reasons={reasons}
        windowOpen={windowOpen}
        {...(closeAt !== undefined ? { closeAt } : {})}
        startHref="/golden-time/session"
      />

      {/* Empty state — no words due */}
      {isEmpty ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-card py-12 text-center">
          <span className="text-3xl" aria-hidden>✅</span>
          <p className="text-base font-semibold text-text-primary">
            Bạn đã ôn xong tất cả!
          </p>
          <p className="max-w-xs text-sm text-text-muted">
            Không còn từ nào cần ôn lúc này. Hãy quay lại vào lịch ôn tiếp theo.
          </p>
        </div>
      ) : (
        /* 2-column cockpit */
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Left column — queue + schedule */}
          <div className="flex flex-col gap-5 lg:col-span-7">

            {/* GoldenTimeWindow: mobile only (desktop version is in right col) */}
            <div className="lg:hidden">
              <GoldenTimeWindow
                windowOpen={windowOpen}
                {...(closeAt !== undefined ? { closeAt } : {})}
                queueCount={queueCount}
                reasons={reasons}
              />
            </div>

            <GoldenQueuePreview items={queue} maxVisible={8} />
            <TodaySchedulePanel items={schedule} />
          </div>

          {/* Right column — status + skills + insights */}
          <div className="flex flex-col gap-5 lg:col-span-5">

            {/* GoldenTimeWindow: desktop only */}
            <div className="hidden lg:block">
              <GoldenTimeWindow
                windowOpen={windowOpen}
                {...(closeAt !== undefined ? { closeAt } : {})}
                queueCount={queueCount}
                reasons={reasons}
              />
            </div>

            <SkillLaneGroup title="Kỹ năng trong hàng chờ" lanes={skillLanes} />

            <div className="grid grid-cols-2 gap-3">
              {MOCK_GOLDEN_TIME_INSIGHTS.map((insight) => (
                <LearningInsightCard key={insight.title} {...insight} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
