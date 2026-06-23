import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type HomeCollectionData = {
  id: string;
  glyph: string;
  glyphBg: string;
  glyphColor: string;
  title: string;
  currentLesson: string;
  done: number;
  total: number;
  unit: string;
  nextLesson: string;
  collectionHref: string;
  mapHref: string;
};

export type HomeCollectionCardProps = {
  collection: HomeCollectionData;
  allHref?: string;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* HomeCollectionCard                                                          */
/* -------------------------------------------------------------------------- */

function HomeCollectionCard({
  collection,
  allHref = "/collections",
  className,
}: HomeCollectionCardProps) {
  const pct =
    collection.total > 0
      ? Math.round((collection.done / collection.total) * 100)
      : 0;

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">
          Bộ sưu tập đang học
        </span>
        <Link
          href={allHref as Route}
          className="text-[13px] font-semibold text-primary no-underline hover:opacity-80"
        >
          Tất cả
        </Link>
      </div>

      {/* Body grid: glyph | info | CTA */}
      <div className="grid items-center gap-4 [grid-template-columns:52px_1fr]  sm:[grid-template-columns:52px_1fr_auto]">
        {/* Glyph */}
        <div
          className={cn(
            "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[13px] text-2xl font-extrabold",
            collection.glyphBg,
            collection.glyphColor
          )}
          aria-hidden
        >
          {collection.glyph}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
            Đang học
          </p>
          <p className="truncate text-sm font-bold text-text-primary">
            {collection.title}
          </p>
          <p className="mb-2 text-xs text-text-secondary">
            {collection.currentLesson}
          </p>

          {/* Progress rail */}
          <div className="flex items-center gap-2">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Tiến độ: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-text-muted">
              {collection.done}/{collection.total} {collection.unit}
            </span>
          </div>

          {/* Next lesson */}
          <div className="mt-1.5 flex items-center gap-1 text-[11.5px] text-text-secondary">
            <ArrowRight className="size-3 shrink-0" aria-hidden />
            Tiếp: {collection.nextLesson}
          </div>
        </div>

        {/* Map CTA — desktop only */}
        <Link
          href={collection.mapHref as Route}
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5",
            "text-[13px] font-semibold text-text-primary no-underline",
            "transition-colors hover:bg-muted sm:flex"
          )}
        >
          <Map className="size-3.5" aria-hidden />
          Xem lộ trình
        </Link>
      </div>
    </div>
  );
}

export { HomeCollectionCard };
