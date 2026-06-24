import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { LessonEditorClient } from "@/components/admin-collections/lesson-editor-client";
import {
  MOCK_COLLECTIONS,
  MOCK_LESSONS,
  MOCK_ITEMS,
} from "@/features/admin-collections/mock/collections.mock";

type Props = {
  params: Promise<{ collectionId: string; lessonId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const allLessons = Object.values(MOCK_LESSONS).flat();
  const lesson = allLessons.find((l) => l.id === lessonId);
  return { title: lesson ? `Sửa: ${lesson.title}` : "Bài học" };
}

export default async function LessonEditorPage({ params }: Props) {
  const { collectionId, lessonId } = await params;

  const collection = MOCK_COLLECTIONS.find((c) => c.id === collectionId);
  if (!collection) notFound();

  const collLessons = MOCK_LESSONS[collectionId] ?? [];
  const lesson = collLessons.find((l) => l.id === lessonId) ?? null;

  const lessonItems = lesson ? (MOCK_ITEMS[lesson.id] ?? []) : [];
  const collectionHref = `/admin/collections/${collectionId}` as Route;

  return (
    <LessonEditorClient
      collection={collection}
      initialLesson={lesson}
      initialItems={lessonItems}
      collectionHref={collectionHref}
    />
  );
}
