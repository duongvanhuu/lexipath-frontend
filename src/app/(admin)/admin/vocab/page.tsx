import type { Metadata } from "next";
import { VOCAB_ITEMS_MOCK } from "@/features/admin-vocab/mock/vocab-items.mock";
import { VocabListClient } from "@/components/admin-vocab/list/vocab-list-client";

export const metadata: Metadata = { title: "Từ vựng" };

export default function AdminVocabPage() {
  return <VocabListClient initialItems={VOCAB_ITEMS_MOCK} />;
}
