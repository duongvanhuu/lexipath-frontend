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
  ReviewReasonLegend,
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
    estimatedMinutes,
    weakSkillLabel,
    goalDone,
    goalTotal,
  } = MOCK_GOLDEN_TIME_DASHBOARD;

  const isEmpty = queueCount === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Golden top accent — visual cue that this page is distinct */}
      <div
        className="h-0.5 w-full rounded-full bg-gradient-to-r from-transparent via-golden to-transparent"
        aria-hidden
      />

      {/* Journey header — golden identity */}
      <PageJourneyHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Golden Time" },
        ]}
        title="Golden Time"
        subtitle={
          windowOpen
            ? "Cửa sổ ôn tập đang mở — đây là thời điểm trí nhớ ghi nhớ bền nhất."
            : "Ôn đúng cửa sổ thời gian — trí nhớ ghi nhớ bền hơn 3–4 lần."
        }
        badge={windowOpen ? "Đang mở" : "SRS"}
        {...(windowOpen
          ? { badgeClassName: "bg-golden-soft text-golden-foreground border border-golden/30" }
          : {})}
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
        {...(estimatedMinutes !== undefined ? { estimatedMinutes } : {})}
        {...(weakSkillLabel !== undefined ? { weakSkillLabel } : {})}
        {...(goalDone !== undefined ? { goalDone } : {})}
        {...(goalTotal !== undefined ? { goalTotal } : {})}
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

          {/* Right column — status + skills + reasons + insights */}
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

            <ReviewReasonLegend />

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
