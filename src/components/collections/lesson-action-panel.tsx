import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { Play, RotateCcw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LessonDetailView } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* LessonActionPanel                                                           */
/* -------------------------------------------------------------------------- */

export type LessonActionPanelProps = {
  lesson: LessonDetailView;
  className?: string;
};

function LessonActionPanel({ lesson, className }: LessonActionPanelProps) {
  const {
    sortOrder,
    title,
    status,
    itemCount,
    completedCount,
    estimatedMinutes,
    sessionHref,
  } = lesson;

  if (status === "locked" || status === "premium") return null;

  const isDone = status === "completed";
  const isNew = completedCount === 0;

  const stateLabel = isDone
    ? "Bài học đã hoàn thành"
    : isNew
      ? "Sẵn sàng bắt đầu"
      : "Đang học";

  const stateSub = isDone
    ? "Ôn lại để củng cố — kiến thức bền hơn mỗi lần"
    : isNew
      ? `${itemCount} từ · khoảng ${estimatedMinutes} phút`
      : `${completedCount}/${itemCount} từ đã học — tiếp tục để hoàn thành`;

  const ctaLabel = isDone ? "Ôn lại bài" : isNew ? "Bắt đầu học" : "Học tiếp";
  const CtaIcon = isDone ? RotateCcw : Play;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-card border border-primary bg-primary/[0.04] p-4 sm:p-5",
        className
      )}
    >
      {/* Context info */}
      <div className="min-w-[180px] flex-1">
        <p className="mb-0.5 text-[10.5px] font-bold uppercase tracking-wide text-primary">
          {stateLabel}
        </p>
        <p className="text-sm font-semibold text-text-primary">
          Bài {sortOrder}: {title}
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">{stateSub}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          asChild
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Link href={sessionHref as Route}>
            <CtaIcon className="size-3.5" aria-hidden />
            {ctaLabel}
          </Link>
        </Button>

        {!isDone && (
          <Button asChild size="sm" variant="outline">
            <Link href={sessionHref as Route}>
              <RotateCcw className="size-3.5" aria-hidden />
              Ôn bài
            </Link>
          </Button>
        )}

        <Button asChild size="sm" variant="outline">
          <Link href={sessionHref as Route}>
            <Zap className="size-3.5" aria-hidden />
            Luyện nhanh
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { LessonActionPanel };
