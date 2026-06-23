import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { CollectionListItem } from "@/features/collections/types/collection-list.types";

import { CollectionMiniRoadmap } from "./collection-mini-roadmap";

export type CollectionListHeroCardProps = {
  collection: CollectionListItem;
  className?: string;
};

function CollectionListHeroCard({
  collection,
  className,
}: CollectionListHeroCardProps) {
  const {
    glyph,
    glyphIsHan,
    title,
    level,
    access,
    progressPercent,
    masteredWords,
    totalWords,
    currentLessonTitle,
    roadmap,
    href,
    nextLessonHref,
  } = collection;

  const pct = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border-2 border-primary/30 bg-card",
        className
      )}
      role="article"
      aria-label={`Đang học: ${title}`}
    >
      {/* Accent bar */}
      <div className="h-[3px] w-full bg-primary" aria-hidden />

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Glyph */}
          <div
            aria-hidden
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary",
              glyphIsHan ? "text-xl font-black" : "text-lg font-extrabold"
            )}
          >
            {glyph}
          </div>

          {/* Title block */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-pill bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-soft-foreground">
                Đang học
              </span>
              <span className="text-[11px] font-medium text-text-muted">
                {level}
              </span>
              {access === "free" && (
                <span className="inline-flex items-center rounded-pill bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
                  Miễn phí
                </span>
              )}
            </div>
            <h2 className="text-base font-bold leading-snug tracking-tight text-text-primary sm:text-lg">
              {title}
            </h2>
            {currentLessonTitle && (
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-secondary">
                <PlayCircle className="size-3.5 shrink-0 text-primary" aria-hidden />
                <span>Bài hiện tại: {currentLessonTitle}</span>
              </div>
            )}
          </div>

          {/* Progress % */}
          <div className="shrink-0 text-right">
            <div className="text-2xl font-extrabold leading-none text-primary">
              {pct}%
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
              <BookOpen className="size-3" aria-hidden />
              <span>
                {masteredWords}/{totalWords} từ
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="h-[5px] overflow-hidden rounded-pill bg-border"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tiến độ ${pct}%`}
        >
          <div
            className="h-full rounded-pill bg-primary transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Mini roadmap */}
        {roadmap && roadmap.length > 0 && (
          <CollectionMiniRoadmap nodes={roadmap} maxVisible={5} />
        )}

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3">
          {nextLessonHref ? (
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Link href={nextLessonHref as Route}>
                <PlayCircle className="size-4" aria-hidden />
                Tiếp tục học
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <PlayCircle className="size-4" aria-hidden />
              Tiếp tục học
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <Link href={href as Route}>
              Xem chi tiết
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CollectionListHeroCard };
