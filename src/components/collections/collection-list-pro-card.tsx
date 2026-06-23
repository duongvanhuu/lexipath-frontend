import * as React from "react";
import { BookOpen, Crown, Layers, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { CollectionListItem } from "@/features/collections/types/collection-list.types";

export type CollectionListProCardProps = {
  collection: CollectionListItem;
  onUnlock?: () => void;
  className?: string;
};

function CollectionListProCard({
  collection,
  onUnlock,
  className,
}: CollectionListProCardProps) {
  const { glyph, glyphIsHan, title, level, totalWords, tags, roadmap } =
    collection;

  const lessonCount = roadmap?.length ?? 0;
  const previewLessons = roadmap?.slice(0, 3) ?? [];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border border-border bg-card p-5 transition-[border-color] duration-150",
        "hover:border-[#7c3aed]/30",
        className
      )}
      role="group"
      aria-label={`${title} — Pro, bị khóa`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#7c3aed]",
            glyphIsHan ? "text-base font-black" : "text-sm font-extrabold"
          )}
        >
          {glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-pill bg-[#EDE9FE] px-1.5 py-0.5 text-[10px] font-bold text-[#7c3aed]">
              <Lock className="size-2.5" aria-hidden />
              Pro
            </span>
            <span className="text-[11px] text-text-muted">{level}</span>
          </div>
          <h3 className="truncate text-sm font-bold leading-snug text-text-primary">
            {title}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
          <BookOpen className="size-3" aria-hidden />
          {totalWords} từ
        </span>
        {lessonCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
            <Layers className="size-3" aria-hidden />
            {lessonCount} bài học
          </span>
        )}
      </div>

      {/* Lesson preview (blurred) */}
      {previewLessons.length > 0 && (
        <div className="flex flex-col gap-0">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-text-muted">
            Bài học
          </div>
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
            {previewLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex select-none items-center gap-2 px-3 py-2 opacity-60 blur-[1.5px]"
                aria-hidden
              >
                <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted">
                  <Lock className="size-2.5 text-text-muted" aria-hidden />
                </div>
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-text-secondary">
                  {lesson.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.filter((t) => t !== "Pro").length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags
            .filter((t) => t !== "Pro")
            .slice(0, 2)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary"
              >
                {tag}
              </span>
            ))}
        </div>
      )}

      {/* Unlock CTA */}
      <div className="mt-auto">
        <Button
          size="sm"
          className="w-full border border-[#7c3aed] bg-[#EDE9FE] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
          onClick={onUnlock}
          aria-label={`Mở khóa Pro để học ${title}`}
        >
          <Crown className="size-4" aria-hidden />
          Mở khóa Pro
        </Button>
      </div>
    </div>
  );
}

export { CollectionListProCard };
