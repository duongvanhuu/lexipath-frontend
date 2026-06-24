"use client";

import { GitCommitHorizontal, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { ReviewBoardTask, ReviewTaskPriority } from "@/features/admin-review";

const LANG_FLAG: Record<string, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

const PRIORITY_CLASS: Record<ReviewTaskPriority, string> = {
  high: "bg-danger-soft text-danger-foreground",
  medium: "bg-warning-soft text-warning-foreground",
  low: "bg-surface-muted text-text-secondary",
};

const PRIORITY_LABEL: Record<ReviewTaskPriority, string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface ReviewTaskKanbanCardProps {
  task: ReviewBoardTask;
  accentColor: string;
  onClick: (task: ReviewBoardTask) => void;
}

export function ReviewTaskKanbanCard({
  task,
  accentColor,
  onClick,
}: ReviewTaskKanbanCardProps) {
  const isCjk = task.lang !== "en";

  return (
    <button
      type="button"
      onClick={() => onClick(task)}
      className={cn(
        "block w-full rounded-lg border border-border bg-card p-3 text-left transition-colors",
        "shadow-sm hover:border-[--accent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      style={{ "--accent": accentColor } as React.CSSProperties}
      aria-label={`Xem chi tiết: ${task.itemTitle}`}
    >
      <div className="mb-1.5 flex items-start gap-1.5">
        <span
          className={cn(
            "flex-1 text-sm font-bold leading-snug",
            isCjk && "font-medium tracking-wide",
          )}
        >
          {task.itemTitle}
        </span>
        <span className="shrink-0 text-sm" aria-label={`Ngôn ngữ: ${task.lang}`}>
          {LANG_FLAG[task.lang]}
        </span>
        {task.priority === "high" && (
          <Badge className={cn("shrink-0 text-[10px]", PRIORITY_CLASS["high"])}>
            {PRIORITY_LABEL["high"]}
          </Badge>
        )}
      </div>

      <p className="mb-2 text-xs text-text-muted">
        {task.itemType} · cập nhật {task.updated}
      </p>

      <div className="flex items-center gap-1.5">
        <Avatar size="sm" className="size-5 shrink-0">
          <AvatarFallback className="text-[9px]">
            {getInitials(task.author)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1 truncate text-xs text-text-secondary">
          {task.author}
        </span>

        {task.commentCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-text-muted">
            <MessageSquare className="size-3" aria-hidden />
            {task.commentCount}
          </span>
        )}
        <span className="flex items-center gap-0.5 text-xs text-text-muted">
          <GitCommitHorizontal className="size-3" aria-hidden />
          {task.changeCount}
        </span>
      </div>
    </button>
  );
}
