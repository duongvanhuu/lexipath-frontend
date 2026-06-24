import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { REVIEW_TASKS_MOCK, REVIEW_TASK_DETAILS_MOCK } from "@/features/admin-review";
import { ReviewDetailClient } from "@/components/admin-review/review-detail-client";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ReviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = REVIEW_TASKS_MOCK.find((t) => t.id === id);
  return {
    title: task ? `Duyệt: ${task.itemTitle}` : "Chi tiết duyệt",
  };
}

export default async function AdminReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { id } = await params;

  const detail =
    REVIEW_TASK_DETAILS_MOCK[id] ??
    (() => {
      const task = REVIEW_TASKS_MOCK.find((t) => t.id === id);
      if (!task) return null;
      return {
        taskId: task.id,
        item: {
          title: task.itemTitle,
          lang: task.lang,
          type: task.itemType,
          contentStatus: "draft",
        },
        authorName: task.author,
        assigneeName: task.assignee,
        priority: task.priority,
        status: task.status,
        created: task.created,
        updated: task.updated,
        changeCount: task.changeCount,
        comments: [],
        diff: [],
      };
    })();

  if (!detail) notFound();

  return <ReviewDetailClient detail={detail} />;
}
