import * as React from "react";
import type { Metadata } from "next";

import {
  PageJourneyHeader,
  NextBestStepCard,
  GoldenTimeWindow,
} from "@/components/lexipath";
import {
  CollectionDetailHero,
  CollectionLessonRoadmap,
  CollectionProgressCard,
  CollectionStatsCard,
  CollectionProgressStory,
} from "@/components/collections";
import {
  MOCK_COLLECTION_DETAIL,
  MOCK_LESSONS,
} from "@/features/collections";
import type { CollectionStats, CollectionProgressEntry, CollectionSummary } from "@/components/collections";

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Chi tiết bộ sưu tập",
};

/* -------------------------------------------------------------------------- */
/* Mock adapters (to feed existing typed components)                           */
/* -------------------------------------------------------------------------- */

function toCollectionSummary(
  detail: typeof MOCK_COLLECTION_DETAIL
): CollectionSummary {
  return {
    id: detail.id,
    title: detail.title,
    description: detail.description,
    progressPercent: detail.progressPercent,
    totalItems: detail.totalItems,
    masteredItems: detail.itemsMastered,
    lessonCount: detail.lessonCount,
  };
}

const MOCK_STATS: CollectionStats = {
  totalWords: MOCK_COLLECTION_DETAIL.totalItems,
  masteredWords: MOCK_COLLECTION_DETAIL.itemsMastered,
  reviewDue: MOCK_COLLECTION_DETAIL.reviewDue,
  averageAccuracy: MOCK_COLLECTION_DETAIL.averageAccuracy,
};

const MOCK_PROGRESS_HISTORY: CollectionProgressEntry[] = [
  { date: "23/06/2026", learnedCount: 8, masteredCount: 5 },
  { date: "22/06/2026", learnedCount: 12, masteredCount: 8 },
  { date: "21/06/2026", learnedCount: 6, masteredCount: 4 },
  { date: "19/06/2026", learnedCount: 10, masteredCount: 3 },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CollectionDetailPage() {
  const collection = MOCK_COLLECTION_DETAIL;
  const lessons = MOCK_LESSONS;
  const isStarted = collection.collectionStatus !== "not-started";

  // Current lesson for next-step CTA
  const currentLesson = lessons.find((l) => l.status === "current");
  const nextLesson =
    currentLesson ??
    lessons.find((l) => l.status === "available" || l.status === "preview");

  const collectionSummary = toCollectionSummary(collection);

  const nextStepDescription =
    collection.collectionStatus === "completed"
      ? `${collection.reviewDue} từ cần ôn lại để giữ trình độ.`
      : nextLesson?.description;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + page title */}
      <PageJourneyHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Bộ sưu tập" },
        ]}
        title={collection.title}
        badge={collection.level}
        subtitle={`${collection.language === "ja" ? "🇯🇵 Tiếng Nhật" : collection.language === "zh" ? "🇨🇳 Tiếng Trung" : "🇬🇧 Tiếng Anh"}`}
      />

      {/* Hero: glyph, meta, progress ring, CTA */}
      <CollectionDetailHero
        collection={collection}
        {...(nextLesson?.href !== undefined
          ? { nextLessonHref: nextLesson.href }
          : {})}
      />

      {/* 2-column body */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ── Main column ── */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          {/* Next lesson action card (when started) */}
          {isStarted && nextLesson ? (
            <NextBestStepCard
              title={
                collection.collectionStatus === "completed"
                  ? "Ôn lại từ yếu"
                  : `Bài tiếp theo: ${nextLesson.title}`
              }
              {...(nextStepDescription !== undefined
                ? { description: nextStepDescription }
                : {})}
              ctaLabel={
                nextLesson.status === "current" ? "Học tiếp" : "Bắt đầu"
              }
              {...(nextLesson.href !== undefined ? { href: nextLesson.href } : {})}
              itemCount={nextLesson.itemCount}
              estimatedMinutes={nextLesson.estimatedMinutes}
              badge={
                nextLesson.status === "current" ? "Bài đang học" : "Bài tiếp theo"
              }
            />
          ) : null}

          {/* GoldenTime — mobile only (duplicate hidden on desktop) */}
          <div className="lg:hidden">
            <GoldenTimeWindow
              windowOpen={true}
              closeAt="21:00"
              queueCount={collection.reviewDue}
              reasons={["forgetting_curve"]}
            />
          </div>

          {/* Lesson roadmap */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">
              Lộ trình bài học
            </h2>
            <CollectionLessonRoadmap lessons={lessons} />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          {/* Progress ring (desktop) */}
          {isStarted ? (
            <CollectionProgressCard collection={collectionSummary} />
          ) : null}

          {/* GoldenTime — desktop only */}
          <div className="hidden lg:block">
            <GoldenTimeWindow
              windowOpen={true}
              closeAt="21:00"
              queueCount={collection.reviewDue}
              reasons={["forgetting_curve"]}
            />
          </div>

          {/* Stats */}
          <CollectionStatsCard stats={MOCK_STATS} />

          {/* Progress story / history */}
          {isStarted ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-text-primary">
                Lịch sử học
              </h2>
              <CollectionProgressStory entries={MOCK_PROGRESS_HISTORY} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
