import * as React from "react";
import type { Metadata } from "next";

import { PageJourneyHeader } from "@/components/lexipath";
import {
  LessonActionPanel,
  LessonDetailHero,
  LessonProgressSummary,
  SkillCoverageSection,
  VocabPreviewGrid,
} from "@/components/collections";
import {
  MOCK_COLLECTION_DETAIL,
  MOCK_LESSON_DETAIL_VIEW,
} from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Chi tiết bài học",
};

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

type Props = {
  params: Promise<{ collectionId: string; lessonId: string }>;
};

export default async function LessonDetailPage({ params }: Props) {
  const { collectionId } = await params;

  // TODO: Replace with real API call: fetchLessonDetail(collectionId, lessonId)
  const collection = MOCK_COLLECTION_DETAIL;
  const lesson = MOCK_LESSON_DETAIL_VIEW;

  const langLabel =
    collection.language === "ja"
      ? "🇯🇵 Tiếng Nhật"
      : collection.language === "zh"
        ? "🇨🇳 Tiếng Trung"
        : "🇬🇧 Tiếng Anh";

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + page title */}
      <PageJourneyHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: collection.title, href: `/collections/${collectionId}` },
          { label: lesson.title },
        ]}
        title={lesson.title}
        subtitle={`Bài ${lesson.sortOrder} · ${langLabel} · ${collection.level}`}
        badge={collection.level}
      />

      {/* Hero: status, meta, progress, CTA */}
      <LessonDetailHero lesson={lesson} />

      {/* Progress summary tiles */}
      <LessonProgressSummary lesson={lesson} />

      {/* Skill coverage lanes */}
      <SkillCoverageSection skillLanes={lesson.skillLanes} />

      {/* Learning action block */}
      <LessonActionPanel lesson={lesson} />

      {/* Vocab preview grid */}
      <VocabPreviewGrid items={lesson.vocabPreviewItems} />
    </div>
  );
}
