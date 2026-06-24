import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionEditorClient } from "@/components/admin-collections/collection-editor-client";
import {
  MOCK_COLLECTIONS,
  MOCK_LESSONS,
  MOCK_ITEMS,
  MOCK_ACCESS_RULES,
  MOCK_VERSIONS,
} from "@/features/admin-collections/mock/collections.mock";

type Props = { params: Promise<{ collectionId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionId } = await params;
  const coll = MOCK_COLLECTIONS.find((c) => c.id === collectionId);
  return { title: coll ? `Sửa: ${coll.name}` : "Bộ sưu tập" };
}

export default async function CollectionEditorPage({ params }: Props) {
  const { collectionId } = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.id === collectionId);
  if (!collection) notFound();

  const lessons = MOCK_LESSONS[collectionId] ?? [];
  const allItems: Record<string, typeof MOCK_ITEMS[string]> = {};
  for (const lesson of lessons) {
    allItems[lesson.id] = MOCK_ITEMS[lesson.id] ?? [];
  }
  const accessRule = MOCK_ACCESS_RULES[collectionId] ?? null;
  const versions = MOCK_VERSIONS[collectionId] ?? [];

  return (
    <CollectionEditorClient
      initialCollection={collection}
      initialLessons={lessons}
      initialItems={allItems}
      initialAccessRule={accessRule}
      initialVersions={versions}
    />
  );
}
