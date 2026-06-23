import * as React from "react";
import type { Route } from "next";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  PageJourneyHeader,
  NextBestStepCard,
  GoldenTimeWindow,
} from "@/components/lexipath";
import {
  CollectionDetailHero,
  CollectionLessonRoadmap,
  CollectionProgressSummary,
  CollectionLearningPromise,
} from "@/components/collections";
import {
  MOCK_COLLECTION_DETAIL,
  MOCK_LESSONS,
} from "@/features/collections";
import type { CollectionDetail } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Chi tiết bộ sưu tập",
};

/* -------------------------------------------------------------------------- */
/* Static config                                                               */
/* -------------------------------------------------------------------------- */

const LANG_SUBTITLE: Record<CollectionDetail["language"], string> = {
  ja: "🇯🇵 Tiếng Nhật",
  zh: "🇨🇳 Tiếng Trung",
  en: "🇬🇧 Tiếng Anh",
};

const RELATED_COLLECTIONS = [
  {
    href: "/collections/ja-kanji-n5",
    glyph: "字",
    title: "Kanji N5 cơ bản",
    level: "Kanji · N5",
    totalItems: 103,
    itemLabel: "kanji",
  },
  {
    href: "/collections/ja-nguphap",
    glyph: "法",
    title: "Ngữ pháp N5 toàn tập",
    level: "N5 · Ngữ pháp",
    totalItems: 9,
    itemLabel: "bài",
  },
  {
    href: "/collections/ja-kana",
    glyph: "仮",
    title: "Hiragana & Katakana",
    level: "N5 · Kana",
    totalItems: 92,
    itemLabel: "ký tự",
  },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CollectionDetailPage() {
  const collection = MOCK_COLLECTION_DETAIL;
  const lessons = MOCK_LESSONS;
  const isStarted = collection.collectionStatus !== "not-started";

  const currentLesson = lessons.find((l) => l.status === "current");
  const nextLesson =
    currentLesson ??
    lessons.find((l) => l.status === "available" || l.status === "preview");

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
          { label: "Bộ sưu tập", href: "/collections" },
        ]}
        title={collection.title}
        badge={collection.level}
        subtitle={LANG_SUBTITLE[collection.language]}
      />

      {/* Hero: glyph, meta, progress ring, CTA */}
      <CollectionDetailHero
        collection={collection}
        {...(nextLesson?.href !== undefined
          ? { nextLessonHref: nextLesson.href }
          : {})}
      />

      {/* Next best step */}
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
          ctaLabel={nextLesson.status === "current" ? "Học tiếp" : "Bắt đầu"}
          {...(nextLesson.href !== undefined ? { href: nextLesson.href } : {})}
          itemCount={nextLesson.itemCount}
          estimatedMinutes={nextLesson.estimatedMinutes}
          badge={
            nextLesson.status === "current" ? "Bài đang học" : "Bài tiếp theo"
          }
        />
      ) : null}

      {/* Golden Time — review reminder when items are due */}
      {isStarted && collection.reviewDue > 0 ? (
        <GoldenTimeWindow
          windowOpen={true}
          closeAt="21:00"
          queueCount={collection.reviewDue}
          reasons={["forgetting_curve"]}
        />
      ) : null}

      {/* Progress summary tiles + mastery bar */}
      {isStarted ? (
        <CollectionProgressSummary
          collection={collection}
          lessonsDone={collection.lessonsCompleted}
        />
      ) : null}

      {/* Learning promise: for who / what to learn / what to achieve */}
      {collection.learningPromise ? (
        <CollectionLearningPromise promise={collection.learningPromise} />
      ) : null}

      {/* Skills chips */}
      {collection.skills && collection.skills.length > 0 ? (
        <section
          aria-labelledby="skills-heading"
          className="flex flex-col gap-4"
        >
          <h2
            id="skills-heading"
            className="text-lg font-semibold tracking-tight text-text-primary"
          >
            Kỹ năng trong bộ học
          </h2>
          <div className="flex flex-wrap gap-2">
            {collection.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Lesson roadmap */}
      <section
        aria-labelledby="roadmap-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="roadmap-heading"
            className="text-lg font-semibold tracking-tight text-text-primary"
          >
            Lộ trình bài học
          </h2>
          <span className="shrink-0 text-xs text-text-secondary">
            {lessons.length} bài · {collection.totalItems} {collection.itemLabel}
            {collection.lessonsCompleted > 0
              ? ` · ${collection.lessonsCompleted}/${lessons.length} hoàn thành`
              : ""}
          </span>
        </div>
        <CollectionLessonRoadmap lessons={lessons} />
      </section>

      {/* Related collections */}
      <section
        aria-labelledby="related-heading"
        className="flex flex-col gap-4"
      >
        <h2
          id="related-heading"
          className="text-lg font-semibold tracking-tight text-text-primary"
        >
          Bộ sưu tập liên quan
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RELATED_COLLECTIONS.map((rel) => (
            <Link
              key={rel.href}
              href={rel.href as Route}
              className="flex items-center gap-3 rounded-card border border-border bg-card p-3 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xl font-bold leading-none text-text-primary"
                aria-hidden
              >
                {rel.glyph}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {rel.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {rel.level} · {rel.totalItems} {rel.itemLabel}
                </p>
              </div>
              <ChevronRight
                className="size-4 shrink-0 text-text-muted"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
