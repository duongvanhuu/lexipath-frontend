"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  CheckCircle,
  Clock,
  MessageSquare,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { ReviewBoardTask, ReviewTaskStatus } from "@/features/admin-review";
import { ReviewBoardColumn } from "./review-board-column";

const COLUMN_ORDER: ReviewTaskStatus[] = [
  "pending",
  "changes_requested",
  "approved",
  "rejected",
  "published",
];

const STAT_CONFIG: {
  status: ReviewTaskStatus;
  label: string;
  icon: React.ReactNode;
  bg: string;
  fg: string;
}[] = [
  {
    status: "pending",
    label: "Chờ duyệt",
    icon: <Clock className="size-5" aria-hidden />,
    bg: "bg-warning-soft",
    fg: "text-warning-foreground",
  },
  {
    status: "changes_requested",
    label: "Cần sửa",
    icon: <MessageSquare className="size-5" aria-hidden />,
    bg: "bg-primary-soft",
    fg: "text-primary-soft-foreground",
  },
  {
    status: "approved",
    label: "Đã duyệt",
    icon: <CheckCircle className="size-5" aria-hidden />,
    bg: "bg-success-soft",
    fg: "text-success-foreground",
  },
  {
    status: "rejected",
    label: "Từ chối",
    icon: <XCircle className="size-5" aria-hidden />,
    bg: "bg-danger-soft",
    fg: "text-danger-foreground",
  },
];

interface ReviewBoardClientProps {
  initialTasks: ReviewBoardTask[];
}

export function ReviewBoardClient({ initialTasks }: ReviewBoardClientProps) {
  const router = useRouter();
  const [tasks] = React.useState(initialTasks);

  const byStatus = (status: ReviewTaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Bảng duyệt nội dung
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {tasks.length} yêu cầu · content_review_tasks
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
          className="shrink-0"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          Tải lại
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CONFIG.map((s) => {
          const count = byStatus(s.status).length;
          return (
            <div
              key={s.status}
              className={cn(
                "flex items-center gap-3 rounded-card border border-border bg-card p-4",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-panel",
                  s.bg,
                  s.fg,
                )}
              >
                {s.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xl font-bold leading-none text-text-primary">
                  {count}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max items-start gap-3">
          {COLUMN_ORDER.map((status) => (
            <ReviewBoardColumn
              key={status}
              status={status}
              tasks={byStatus(status)}
              onSelectTask={(task) =>
                router.push(`/admin/review/${task.id}` as Route)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
