import * as React from "react";
import { Award, BookOpen, Calendar, Layers, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { CollectionDetail } from "@/features/collections";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type CollectionProgressSummaryProps = {
  collection: CollectionDetail;
  lessonsDone: number;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* CollectionProgressSummary                                                   */
/* -------------------------------------------------------------------------- */

function CollectionProgressSummary({
  collection,
  lessonsDone,
  className,
}: CollectionProgressSummaryProps) {
  const pct = Math.min(100, Math.max(0, collection.progressPercent));
  const mastered = collection.itemsMastered;
  const learning = Math.max(0, collection.itemsLearned - mastered);
  const reviewing = collection.reviewDue;
  const total = collection.totalItems;
  const remaining = Math.max(0, total - mastered - learning - reviewing);

  const tiles = [
    {
      icon: <TrendingUp className="size-3.5" aria-hidden />,
      bgClass: "bg-success-soft",
      fgClass: "text-success-foreground",
      value: `${pct}%`,
      label: "Hoàn thành",
    },
    {
      icon: <BookOpen className="size-3.5" aria-hidden />,
      bgClass: "bg-primary-soft",
      fgClass: "text-primary",
      value: `${lessonsDone}/${collection.lessonCount}`,
      label: "Bài đã xong",
    },
    {
      icon: <Layers className="size-3.5" aria-hidden />,
      bgClass: "bg-warning-soft",
      fgClass: "text-warning-foreground",
      value: String(collection.itemsLearned),
      label: "Từ đã học",
    },
    {
      icon: <Award className="size-3.5" aria-hidden />,
      bgClass: "bg-success-soft",
      fgClass: "text-success-foreground",
      value: String(mastered),
      label: "Thành thạo",
    },
    {
      icon: <Calendar className="size-3.5" aria-hidden />,
      bgClass: "bg-surface-muted",
      fgClass: "text-text-secondary",
      value: collection.lastStudiedAt ?? "—",
      label: "Học lần cuối",
    },
  ] as const;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Tile strip */}
      <div className="flex flex-wrap overflow-hidden rounded-card border border-border bg-card">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="flex min-w-[120px] flex-1 items-center gap-2.5 border-b border-r border-border p-3.5 last-of-type:border-r-0 sm:border-b-0"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg",
                tile.bgClass,
                tile.fgClass
              )}
            >
              {tile.icon}
            </span>
            <div>
              <div className="text-sm font-bold leading-tight text-text-primary">
                {tile.value}
              </div>
              <div className="text-xs text-text-secondary">{tile.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mastery bar */}
      {total > 0 && (mastered > 0 || learning > 0 || reviewing > 0) ? (
        <div className="flex flex-col gap-1.5">
          <div
            className="flex h-1.5 overflow-hidden rounded-full bg-surface-muted"
            role="img"
            aria-label={`Tiến độ: ${mastered} thành thạo, ${learning} đang học, ${reviewing} cần ôn, ${remaining} chưa học`}
          >
            {mastered > 0 ? (
              <span
                className="bg-success transition-[width] duration-500"
                style={{ width: `${(mastered / total) * 100}%` }}
              />
            ) : null}
            {learning > 0 ? (
              <span
                className="bg-primary transition-[width] duration-500"
                style={{ width: `${(learning / total) * 100}%` }}
              />
            ) : null}
            {reviewing > 0 ? (
              <span
                className="bg-golden-strong transition-[width] duration-500"
                style={{ width: `${(reviewing / total) * 100}%` }}
              />
            ) : null}
            {remaining > 0 ? (
              <span
                className="bg-border transition-[width] duration-500"
                style={{ width: `${(remaining / total) * 100}%` }}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
            {mastered > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-success" aria-hidden />
                {mastered} thành thạo
              </span>
            ) : null}
            {learning > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {learning} đang học
              </span>
            ) : null}
            {reviewing > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-golden-strong" aria-hidden />
                {reviewing} cần ôn
              </span>
            ) : null}
            {remaining > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-border" aria-hidden />
                {remaining} chưa học
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { CollectionProgressSummary };
