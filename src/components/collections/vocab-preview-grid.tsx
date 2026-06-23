import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { LessonVocabPreviewItem } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Status dot config                                                           */
/* -------------------------------------------------------------------------- */

const STATUS_DOT: Record<
  NonNullable<LessonVocabPreviewItem["status"]>,
  { className: string; label: string }
> = {
  new: { className: "bg-surface-muted ring-1 ring-border", label: "Mới" },
  learning: { className: "bg-primary", label: "Đang học" },
  reviewing: { className: "bg-golden-strong", label: "Ôn tập" },
  weak: { className: "bg-danger", label: "Cần luyện" },
  mastered: { className: "bg-success", label: "Thành thạo" },
};

/* -------------------------------------------------------------------------- */
/* VocabPreviewCard                                                            */
/* -------------------------------------------------------------------------- */

function VocabPreviewCard({ item }: { item: LessonVocabPreviewItem }) {
  const displayText = item.script?.primary ?? item.primaryText;
  const phonetic = item.script?.phonetic;
  const dotConfig = item.status ? STATUS_DOT[item.status] : null;

  return (
    <Link
      href={item.href as Route}
      className="group flex flex-col gap-1 rounded-card border border-border bg-card p-3 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      aria-label={`${displayText}${phonetic ? ` (${phonetic})` : ""} — ${item.meaning}`}
    >
      {/* Word + status dot */}
      <div className="flex items-start justify-between gap-1">
        <span className="text-xl font-bold leading-tight text-text-primary group-hover:text-primary">
          {displayText}
        </span>
        {dotConfig ? (
          <span
            className={cn("mt-1 size-2 shrink-0 rounded-full", dotConfig.className)}
            title={dotConfig.label}
            aria-label={dotConfig.label}
          />
        ) : null}
      </div>

      {/* Phonetic / reading */}
      {phonetic ? (
        <span className="text-xs text-text-muted">{phonetic}</span>
      ) : null}

      {/* Meaning */}
      <span className="text-xs italic text-text-secondary">{item.meaning}</span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* VocabPreviewGrid                                                            */
/* -------------------------------------------------------------------------- */

export type VocabPreviewGridProps = {
  items: LessonVocabPreviewItem[];
  className?: string;
};

function VocabPreviewGrid({ items, className }: VocabPreviewGridProps) {
  return (
    <section
      aria-labelledby="vocab-preview-heading"
      className={cn("flex flex-col gap-3", className)}
    >
      <h2
        id="vocab-preview-heading"
        className="text-base font-semibold text-text-primary"
      >
        Từ vựng trong bài
      </h2>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 rounded-card border border-border bg-card p-4 text-sm text-text-secondary">
          <BookOpen className="size-4 shrink-0" aria-hidden />
          Chưa có từ vựng trong bài học này.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => (
            <VocabPreviewCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export { VocabPreviewGrid };
