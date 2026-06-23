import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  Lock,
  Play,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { statusBadgeVariants } from "@/lib/styles/variants";
import type {
  LessonDetailView,
  LessonDetailViewStatus,
} from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Status config                                                               */
/* -------------------------------------------------------------------------- */

type CtaVariant = "default" | "outline" | "premium";

type StatusConfig = {
  badge: {
    label: string;
    status: "success" | "golden" | "info" | "neutral" | "warning";
  };
  cta: { label: string; icon: React.ReactElement; variant: CtaVariant } | null;
  bottomBar: "locked" | "premium" | null;
};

const STATUS_CONFIG: Record<LessonDetailViewStatus, StatusConfig> = {
  not_started: {
    badge: { label: "Chưa học", status: "info" },
    cta: {
      label: "Bắt đầu học",
      icon: <Play className="size-4" aria-hidden />,
      variant: "default",
    },
    bottomBar: null,
  },
  in_progress: {
    badge: { label: "Đang học", status: "golden" },
    cta: {
      label: "Học tiếp",
      icon: <ArrowRight className="size-4" aria-hidden />,
      variant: "default",
    },
    bottomBar: null,
  },
  completed: {
    badge: { label: "Hoàn thành", status: "success" },
    cta: {
      label: "Xem lại",
      icon: <Eye className="size-4" aria-hidden />,
      variant: "outline",
    },
    bottomBar: null,
  },
  locked: {
    badge: { label: "Khoá", status: "neutral" },
    cta: null,
    bottomBar: "locked",
  },
  premium: {
    badge: { label: "Pro", status: "info" },
    cta: {
      label: "Mở khoá Pro",
      icon: <Crown className="size-4" aria-hidden />,
      variant: "premium",
    },
    bottomBar: "premium",
  },
};

const NUMBER_CIRCLE_CLASS: Record<LessonDetailViewStatus, string> = {
  not_started: "bg-surface-muted text-text-secondary",
  in_progress: "bg-primary-soft text-primary",
  completed: "bg-success-soft text-success-foreground",
  locked: "bg-surface-muted text-text-muted",
  premium: "bg-[#EDE9FE] text-[#7c3aed]",
};

/* -------------------------------------------------------------------------- */
/* LessonDetailHero                                                            */
/* -------------------------------------------------------------------------- */

export type LessonDetailHeroProps = {
  lesson: LessonDetailView;
  className?: string;
};

function LessonDetailHero({ lesson, className }: LessonDetailHeroProps) {
  const {
    sortOrder,
    description,
    status,
    itemCount,
    completedCount,
    estimatedMinutes,
    accuracy,
    topics,
    sessionHref,
  } = lesson;

  const config = STATUS_CONFIG[status];
  const pct =
    itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;
  const showProgress =
    (status === "in_progress" || status === "completed") && completedCount > 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-card",
        className
      )}
    >
      {/* Accent bar */}
      <div className="h-1 bg-primary" aria-hidden />

      {/* Body */}
      <div className="flex flex-col gap-5 p-5 sm:p-7">
        {/* Top row: lesson number + status badge */}
        <div className="flex items-center justify-between gap-3">
          <div
            aria-label={`Bài ${sortOrder}`}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              NUMBER_CIRCLE_CLASS[status]
            )}
          >
            {status === "completed" ? (
              <CheckCircle2 className="size-5" aria-hidden />
            ) : status === "locked" ? (
              <Lock className="size-4" aria-hidden />
            ) : (
              sortOrder
            )}
          </div>

          <span className={statusBadgeVariants({ status: config.badge.status })}>
            {config.badge.label}
          </span>
        </div>

        {/* Description */}
        {description ? (
          <p className="text-sm italic text-text-secondary">{description}</p>
        ) : null}

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-warning-foreground" aria-hidden />
            ~{estimatedMinutes} phút
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen
              className="size-3.5 text-success-foreground"
              aria-hidden
            />
            {itemCount} từ
          </span>
          {completedCount > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2
                className="size-3.5 text-success-foreground"
                aria-hidden
              />
              {completedCount}/{itemCount} đã học
            </span>
          ) : null}
          {typeof accuracy === "number" ? (
            <span className="inline-flex items-center gap-1.5">
              <Target className="size-3.5 text-primary" aria-hidden />
              <span className="font-medium text-primary">{accuracy}%</span>{" "}
              chính xác
            </span>
          ) : null}
        </div>

        {/* Topic chips */}
        {topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}

        {/* Progress bar */}
        {showProgress ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                {completedCount}/{itemCount} từ hoàn thành
              </span>
              <span className="font-semibold text-primary">{pct}%</span>
            </div>
            <Progress
              value={pct}
              aria-label={`Tiến độ bài học: ${pct}%`}
              className="h-2"
            />
          </div>
        ) : null}

        {/* CTA */}
        {config.cta ? (
          config.cta.variant === "premium" ? (
            <Button
              size="sm"
              className="w-fit bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
            >
              {config.cta.icon}
              {config.cta.label}
            </Button>
          ) : config.cta.variant === "outline" ? (
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={sessionHref as Route}>
                {config.cta.icon}
                {config.cta.label}
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="w-fit bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Link href={sessionHref as Route}>
                {config.cta.icon}
                {config.cta.label}
              </Link>
            </Button>
          )
        ) : null}
      </div>

      {/* Bottom bar */}
      {config.bottomBar === "locked" ? (
        <div className="flex items-center gap-2 bg-surface-muted px-5 py-2.5">
          <Lock className="size-3.5 shrink-0 text-text-muted" aria-hidden />
          <span className="text-xs text-text-muted">
            Hoàn thành bài trước để mở khóa bài này
          </span>
        </div>
      ) : config.bottomBar === "premium" ? (
        <div className="flex items-center gap-2 bg-[#EDE9FE] px-5 py-2.5">
          <Crown className="size-3.5 shrink-0 text-[#7c3aed]" aria-hidden />
          <span className="text-xs font-medium text-[#7c3aed]">
            Yêu cầu thành viên Pro để mở khóa nội dung này
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { LessonDetailHero };
