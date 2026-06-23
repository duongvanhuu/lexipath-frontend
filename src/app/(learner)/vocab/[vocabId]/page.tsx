import type { Metadata } from "next";

import { getMockVocabDetail } from "@/features/vocabulary/vocab-detail.mock";
import { VocabDetailClient } from "./vocab-detail-client";

type Props = {
  params: Promise<{ vocabId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vocabId } = await params;
  const item = getMockVocabDetail(decodeURIComponent(vocabId));
  return {
    title: item ? `${item.word} — Chi tiết từ vựng` : "Chi tiết từ vựng",
  };
}

export default async function VocabDetailPage({ params }: Props) {
  const { vocabId } = await params;
  const item = getMockVocabDetail(decodeURIComponent(vocabId));

  if (!item) {
    return (
      <div className="mx-auto max-w-[860px] px-4 py-16 text-center">
        <p className="text-lg font-semibold text-text-primary">
          Không tìm thấy từ vựng
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Từ <strong>{decodeURIComponent(vocabId)}</strong> chưa có trong hệ thống.
        </p>
      </div>
    );
  }

  return <VocabDetailClient item={item} />;
}
