import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Crown,
  Layers,
  Play,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils/cn";
import { statusBadgeVariants } from "@/lib/styles/variants";
import type { CollectionDetail } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

const LANG_LABELS: Record<CollectionDetail["language"], string> = {
  en: "🇬🇧 Tiếng Anh",
  ja: "🇯🇵 Tiếng Nhật",
  zh: "🇨🇳 Tiếng Trung",
};

const STATUS_CTA: Record<
  CollectionDetail["collectionStatus"],
  { label: string; icon: React.ReactElement }
> = {
  "not-started": {
    label: "Bắt đầu học",
    icon: <Play className="size-4" aria-hidden />,
  },
  learning: {
    label: "Học tiếp",
    icon: <ArrowRight className="size-4" aria-hidden />,
  },
  completed: {
    label: "Ôn lại từ yếu",
    icon: <RotateCcw className="size-4" aria-hidden />,
  },
};

/* -------------------------------------------------------------------------- */
/* CollectionDetailHero                                                        */
/* -------------------------------------------------------------------------- */

export type CollectionDetailHeroProps = {
  collection: CollectionDetail;
  nextLessonHref?: string;
  className?: string;
};

function CollectionDetailHero({
  collection,
  nextLessonHref,
  className,
}: CollectionDetailHeroProps) {
  const {
    title,
    description,
    glyph,
    language,
    level,
    itemLabel,
    totalItems,
    lessonCount,
    estimatedMinutes,
    access,
    collectionStatus,
    progressPercent,
    lessonsCompleted,
    itemsMastered,
  } = collection;

  const pct = Math.min(100, Math.max(0, progressPercent));
  const cta = STATUS_CTA[collectionStatus];
  const isProLocked = access === "pro" && collectionStatus === "not-started";
  const showProgress = !isProLocked && collectionStatus !== "not-started";

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
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
        {/* Left: glyph + content */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Glyph + title row */}
          <div className="flex items-start gap-4">
            <div
              aria-hidden
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-3xl leading-none"
            >
              {glyph}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold leading-snug text-text-primary sm:text-2xl">
                {title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className={statusBadgeVariants({ status: "info" })}
                >
                  {LANG_LABELS[language]}
                </span>
                <span
                  className={statusBadgeVariants({ status: "neutral" })}
                >
                  {level}
                </span>
                {isProLocked ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-pill bg-[#EDE9FE] px-2 py-0.5 text-xs font-medium text-[#7c3aed]"
                  >
                    <Crown className="size-3" aria-hidden />
                    Pro
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Description */}
          {description ? (
            <p className="text-sm italic text-text-secondary">{description}</p>
          ) : null}

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" aria-hidden />
              {lessonCount} bài học
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-success-foreground" aria-hidden />
              {totalItems} {itemLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-warning-foreground" aria-hidden />
              ~{estimatedMinutes} phút
            </span>
            {showProgress ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="font-medium text-primary">{pct}%</span>
                hoàn thành ·{" "}
                <span className="font-medium text-text-primary">{lessonsCompleted}</span>/
                {lessonCount} bài xong
              </span>
            ) : null}
          </div>

          {/* CTA */}
          {isProLocked ? (
            <Button
              size="sm"
              className="w-fit bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
            >
              <Crown className="size-4" aria-hidden />
              Mở khóa Pro ngay
            </Button>
          ) : nextLessonHref ? (
            <Button asChild size="sm" className="w-fit bg-primary text-primary-foreground hover:bg-primary-hover">
              <Link href={nextLessonHref as Route}>
                {cta.icon}
                {cta.label}
              </Link>
            </Button>
          ) : (
            <Button size="sm" className="w-fit bg-primary text-primary-foreground hover:bg-primary-hover">
              {cta.icon}
              {cta.label}
            </Button>
          )}
        </div>

        {/* Right: progress ring or pro lock */}
        {showProgress ? (
          <div className="flex shrink-0 flex-col items-center gap-2 self-center sm:self-start">
            <ProgressRing
              value={pct}
              max={100}
              size={96}
              strokeWidth={7}
              tone="primary"
              aria-label={`Tiến độ ${pct}%`}
              label={
                <span className="absolute flex flex-col items-center leading-tight">
                  <span className="text-2xl font-bold text-text-primary">{pct}%</span>
                </span>
              }
            />
            <p className="text-center text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">{itemsMastered}</span>/
              {totalItems} thành thạo
            </p>
          </div>
        ) : isProLocked ? (
          <div className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-[#EDE9FE] px-5 py-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#7c3aed]">
              <Crown className="size-6 text-white" aria-hidden />
            </div>
            <p className="text-center text-xs font-medium text-[#7c3aed]">
              Nội dung Pro
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { CollectionDetailHero };
