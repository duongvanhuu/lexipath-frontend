import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  Gift,
  Lock,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { statusBadgeVariants } from "@/lib/styles/variants";
import type { LessonDetail, LessonDetailStatus } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Status config                                                               */
/* -------------------------------------------------------------------------- */

type StatusConfig = {
  numberVariant: "completed" | "current" | "available" | "locked" | "due" | "weak";
  badge: { label: string; status: "success" | "golden" | "info" | "neutral" | "warning" };
  cta: { label: string; icon: React.ReactElement } | null;
  cardClass: string;
  dimmed: boolean;
  bottomBar: "locked" | "preview" | null;
};

const STATUS_CONFIG: Record<LessonDetailStatus, StatusConfig> = {
  completed: {
    numberVariant: "completed",
    badge: { label: "Hoàn thành", status: "success" },
    cta: { label: "Xem lại", icon: <Eye className="size-3.5" aria-hidden /> },
    cardClass: "border-border/60",
    dimmed: false,
    bottomBar: null,
  },
  current: {
    numberVariant: "current",
    badge: { label: "Đang học", status: "golden" },
    cta: { label: "Học tiếp", icon: <ArrowRight className="size-3.5" aria-hidden /> },
    cardClass: "border-primary/40 ring-1 ring-primary/20",
    dimmed: false,
    bottomBar: null,
  },
  preview: {
    numberVariant: "available",
    badge: { label: "Xem thử", status: "info" },
    cta: { label: "Xem thử", icon: <Play className="size-3.5" aria-hidden /> },
    cardClass: "border-border",
    dimmed: false,
    bottomBar: "preview",
  },
  available: {
    numberVariant: "available",
    badge: { label: "Sẵn sàng", status: "info" },
    cta: { label: "Bắt đầu", icon: <Play className="size-3.5" aria-hidden /> },
    cardClass: "border-border",
    dimmed: false,
    bottomBar: null,
  },
  locked: {
    numberVariant: "locked",
    badge: { label: "Khoá", status: "neutral" },
    cta: null,
    cardClass: "border-border opacity-60",
    dimmed: true,
    bottomBar: "locked",
  },
  due: {
    numberVariant: "due",
    badge: { label: "Cần ôn", status: "golden" },
    cta: { label: "Ôn tập", icon: <RotateCcw className="size-3.5" aria-hidden /> },
    cardClass: "border-golden/40",
    dimmed: false,
    bottomBar: null,
  },
  weak: {
    numberVariant: "weak",
    badge: { label: "Cần luyện", status: "warning" },
    cta: { label: "Luyện tập", icon: <Zap className="size-3.5" aria-hidden /> },
    cardClass: "border-warning/30",
    dimmed: false,
    bottomBar: null,
  },
};

/* -------------------------------------------------------------------------- */
/* Number circle variants                                                      */
/* -------------------------------------------------------------------------- */

const numberVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
  {
    variants: {
      variant: {
        completed: "bg-success-soft text-success-foreground",
        current: "bg-primary-soft text-primary",
        available: "bg-surface-muted text-text-secondary",
        locked: "bg-surface-muted text-text-muted",
        due: "bg-golden-soft text-golden-foreground",
        weak: "bg-warning-soft text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "available",
    },
  }
);

/* -------------------------------------------------------------------------- */
/* LessonRoadmapCard                                                           */
/* -------------------------------------------------------------------------- */

function LessonRoadmapCard({ lesson }: { lesson: LessonDetail }) {
  const config = STATUS_CONFIG[lesson.status];
  const pct =
    lesson.itemCount > 0
      ? Math.round((lesson.completedCount / lesson.itemCount) * 100)
      : 0;

  const inner = (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-card border bg-card transition-shadow",
        config.cardClass
      )}
    >
      {/* Card body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {lesson.estimatedMinutes} phút
            </span>
            <span className="inline-flex items-center gap-1">
              {lesson.completedCount}/{lesson.itemCount} từ
            </span>
            {typeof lesson.accuracy === "number" ? (
              <span className="font-medium text-success-foreground">
                {lesson.accuracy}% chính xác
              </span>
            ) : null}
          </div>

          <span className={statusBadgeVariants({ status: config.badge.status })}>
            {config.badge.label}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-text-primary">{lesson.title}</p>

        {/* Description */}
        {lesson.description ? (
          <p className="text-xs leading-relaxed text-text-secondary">
            {lesson.description}
          </p>
        ) : null}

        {/* Topic chips */}
        {lesson.topics && lesson.topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {lesson.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-text-secondary"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}

        {/* Progress bar — current lesson only */}
        {lesson.status === "current" && lesson.completedCount > 0 ? (
          <div className="flex flex-col gap-1">
            <Progress
              value={pct}
              aria-label={`Bài học ${pct}% hoàn thành`}
              className="h-1.5"
            />
            <p className="text-xs text-text-secondary">
              {lesson.completedCount}/{lesson.itemCount} từ đã học trong bài
            </p>
          </div>
        ) : null}

        {/* Footer: hint + CTA */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-text-muted">
            {lesson.status === "locked"
              ? "Hoàn thành bài trước để mở khóa"
              : null}
          </span>

          {config.cta ? (
            <Button
              asChild={!!lesson.href && !config.dimmed}
              size="sm"
              variant="outline"
              className="ml-auto shrink-0 gap-1.5"
            >
              {lesson.href && !config.dimmed ? (
                <Link href={lesson.href as Route}>
                  {config.cta.icon}
                  {config.cta.label}
                </Link>
              ) : (
                <>
                  {config.cta.icon}
                  {config.cta.label}
                </>
              )}
            </Button>
          ) : (
            <Lock className="ml-auto size-4 shrink-0 text-text-muted" aria-hidden />
          )}
        </div>
      </div>

      {/* Bottom bar for locked / preview */}
      {config.bottomBar === "locked" ? (
        <div className="flex items-center gap-2 bg-[#EDE9FE] px-4 py-2">
          <Crown className="size-3.5 text-[#7c3aed]" aria-hidden />
          <span className="text-xs font-medium text-[#7c3aed]">
            Yêu cầu thành viên Pro để mở khóa
          </span>
        </div>
      ) : config.bottomBar === "preview" ? (
        <div className="flex items-center gap-2 bg-success-soft px-4 py-2">
          <Gift className="size-3.5 text-success-foreground" aria-hidden />
          <span className="text-xs font-medium text-success-foreground">
            Bài học miễn phí — không cần Pro
          </span>
        </div>
      ) : null}
    </div>
  );

  return inner;
}

/* -------------------------------------------------------------------------- */
/* CollectionLessonRoadmap                                                     */
/* -------------------------------------------------------------------------- */

export type CollectionLessonRoadmapProps = {
  lessons: LessonDetail[];
  className?: string;
};

function CollectionLessonRoadmap({
  lessons,
  className,
}: CollectionLessonRoadmapProps) {
  if (lessons.length === 0) {
    return (
      <p className="text-sm text-text-secondary">Chưa có bài học nào.</p>
    );
  }

  return (
    <ol className={cn("flex flex-col", className)}>
      {lessons.map((lesson, i) => {
        const config = STATUS_CONFIG[lesson.status];
        const isLast = i === lessons.length - 1;

        return (
          <li key={lesson.id} className="relative flex gap-4">
            {/* Spine column */}
            <div className="flex flex-col items-center">
              {/* Number circle */}
              <div className={numberVariants({ variant: config.numberVariant })}>
                {lesson.status === "completed" ? (
                  <CheckCircle2 className="size-4" aria-hidden />
                ) : lesson.status === "locked" ? (
                  <Lock className="size-3.5" aria-hidden />
                ) : (
                  lesson.sortOrder
                )}
              </div>

              {/* Connecting line */}
              {!isLast ? (
                <div className="my-1 w-px flex-1 bg-border" aria-hidden />
              ) : null}
            </div>

            {/* Card */}
            <div className={cn("min-w-0 flex-1", !isLast ? "pb-4" : "")}>
              <LessonRoadmapCard lesson={lesson} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { CollectionLessonRoadmap };
