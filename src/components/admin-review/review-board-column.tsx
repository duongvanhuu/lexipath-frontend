import type * as React from "react";
import {
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ReviewBoardTask, ReviewTaskStatus } from "@/features/admin-review";
import { ReviewTaskKanbanCard } from "./review-task-kanban-card";

const COLUMN_CONFIG: Record<
  ReviewTaskStatus,
  {
    label: string;
    icon: React.ReactNode;
    headerBg: string;
    headerText: string;
    bodyBg: string;
    countBg: string;
    accentColor: string;
  }
> = {
  pending: {
    label: "Chờ duyệt",
    icon: <Clock className="size-3.5" aria-hidden />,
    headerBg: "bg-warning-soft border-warning",
    headerText: "text-warning-foreground",
    bodyBg: "bg-surface-muted border-warning",
    countBg: "bg-warning text-white",
    accentColor: "var(--color-warning)",
  },
  changes_requested: {
    label: "Cần sửa",
    icon: <MessageSquare className="size-3.5" aria-hidden />,
    headerBg: "bg-primary-soft border-primary",
    headerText: "text-primary-soft-foreground",
    bodyBg: "bg-surface-muted border-primary",
    countBg: "bg-primary text-primary-foreground",
    accentColor: "var(--color-primary)",
  },
  approved: {
    label: "Đã duyệt",
    icon: <CheckCircle className="size-3.5" aria-hidden />,
    headerBg: "bg-success-soft border-success",
    headerText: "text-success-foreground",
    bodyBg: "bg-surface-muted border-success",
    countBg: "bg-success text-white",
    accentColor: "var(--color-success)",
  },
  rejected: {
    label: "Từ chối",
    icon: <XCircle className="size-3.5" aria-hidden />,
    headerBg: "bg-danger-soft border-danger",
    headerText: "text-danger-foreground",
    bodyBg: "bg-surface-muted border-danger",
    countBg: "bg-danger text-white",
    accentColor: "var(--color-danger)",
  },
  published: {
    label: "Đã xuất bản",
    icon: <Globe className="size-3.5" aria-hidden />,
    headerBg: "bg-primary-soft border-primary",
    headerText: "text-primary-soft-foreground",
    bodyBg: "bg-surface-muted border-primary",
    countBg: "bg-primary text-primary-foreground",
    accentColor: "var(--color-primary)",
  },
};

interface ReviewBoardColumnProps {
  status: ReviewTaskStatus;
  tasks: ReviewBoardTask[];
  onSelectTask: (task: ReviewBoardTask) => void;
}

export function ReviewBoardColumn({
  status,
  tasks,
  onSelectTask,
}: ReviewBoardColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="w-60 shrink-0">
      <div
        className={cn(
          "flex items-center gap-2 rounded-t-[10px] border px-3 py-2.5",
          config.headerBg,
          config.headerText,
        )}
      >
        {config.icon}
        <span className="flex-1 text-sm font-bold">{config.label}</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-extrabold",
            config.countBg,
          )}
        >
          {tasks.length}
        </span>
      </div>

      <div
        className={cn(
          "min-h-[120px] space-y-1.5 rounded-b-[10px] border border-t-0 p-2",
          config.bodyBg,
        )}
        role="list"
        aria-label={`Cột ${config.label}`}
      >
        {tasks.length === 0 && (
          <p className="py-6 text-center text-xs text-text-muted">
            Không có mục
          </p>
        )}
        {tasks.map((task) => (
          <div key={task.id} role="listitem">
            <ReviewTaskKanbanCard
              task={task}
              accentColor={config.accentColor}
              onClick={onSelectTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
