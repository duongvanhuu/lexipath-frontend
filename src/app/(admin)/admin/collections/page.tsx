import type { Metadata } from "next";
import { CollectionListClient } from "@/components/admin-collections/collection-list-client";
import { MOCK_COLLECTIONS } from "@/features/admin-collections/mock/collections.mock";

export const metadata: Metadata = { title: "Bộ sưu tập" };

export default function AdminCollectionsPage() {
  return <CollectionListClient initialCollections={MOCK_COLLECTIONS} />;
}
