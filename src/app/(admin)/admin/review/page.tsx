import type { Metadata } from "next";

import { REVIEW_TASKS_MOCK } from "@/features/admin-review";
import { ReviewBoardClient } from "@/components/admin-review/review-board-client";

export const metadata: Metadata = { title: "Duyệt nội dung" };

export default function AdminReviewPage() {
  return <ReviewBoardClient initialTasks={REVIEW_TASKS_MOCK} />;
}
