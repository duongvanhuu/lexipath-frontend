import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MOCK_COLLECTION_LIST } from "@/features/collections/mock/collection-list.mock";
import {
  CollectionListView,
  CollectionListSkeleton,
} from "@/features/collections/components/collection-list-view";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description: "Khám phá và tiếp tục các bộ sưu tập từ vựng theo lộ trình của bạn.",
};

export default function CollectionsPage() {
  // Default to Japanese; in a real app this comes from user settings/session
  const data = MOCK_COLLECTION_LIST.ja;

  return (
    <Suspense fallback={<CollectionListSkeleton />}>
      <CollectionListView data={data} />
    </Suspense>
  );
}
