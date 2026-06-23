import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { CollectionListItem } from "@/features/collections/types/collection-list.types";

export type CollectionListCompactCardProps = {
  collection: CollectionListItem;
  className?: string;
};

function CollectionListCompactCard({
  collection,
  className,
}: CollectionListCompactCardProps) {
  const {
    glyph,
    glyphIsHan,
    title,
    level,
    access,
    progressPercent,
    totalWords,
    tags,
    status,
    href,
    nextLessonHref,
  } = collection;

  const isLearning = status === "learning";
  const pct = Math.min(100, Math.max(0, progressPercent));

  return (
    <Link
      href={href as Route}
      className={cn(
        "group flex flex-col gap-3 rounded-card border bg-card p-5 transition-[border-color,box-shadow] duration-150",
        "hover:border-primary/30 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isLearning && "border-l-[3px] border-l-primary",
        className
      )}
      aria-label={`${title}${isLearning ? " — Đang học" : " — Chưa bắt đầu"}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-secondary",
            glyphIsHan ? "text-base font-black" : "text-sm font-extrabold"
          )}
        >
          {glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            {isLearning && (
              <span className="inline-flex items-center rounded-pill bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-soft-foreground">
                Đang học
              </span>
            )}
            <span className="text-[11px] text-text-muted">{level}</span>
            {access === "free" && !isLearning && (
              <span className="inline-flex items-center rounded-pill bg-success-soft px-1.5 py-0.5 text-[10px] font-semibold text-success-foreground">
                Miễn phí
              </span>
            )}
          </div>
          <h3 className="truncate text-sm font-bold leading-snug text-text-primary">
            {title}
          </h3>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
          <BookOpen className="size-3" aria-hidden />
          {totalWords} từ
        </span>
        {isLearning && pct > 0 && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
            <TrendingUp className="size-3" aria-hidden />
            {pct}%
          </span>
        )}
      </div>

      {/* Progress bar (learning only) */}
      {isLearning && pct > 0 && (
        <div
          className="h-[4px] overflow-hidden rounded-pill bg-border"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tiến độ ${pct}%`}
        >
          <div
            className="h-full rounded-pill bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors",
            isLearning
              ? "text-primary group-hover:text-primary-hover"
              : "text-text-secondary group-hover:text-text-primary"
          )}
        >
          {isLearning ? (nextLessonHref ? "Tiếp tục" : "Tiếp tục") : "Bắt đầu"}
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export { CollectionListCompactCard };
