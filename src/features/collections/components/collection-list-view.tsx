"use client";

import * as React from "react";
import { Layers, Search, Star, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { CollectionListHeroCard } from "@/components/collections/collection-list-hero-card";
import { CollectionListCompactCard } from "@/components/collections/collection-list-compact-card";
import { CollectionListProCard } from "@/components/collections/collection-list-pro-card";
import type { CollectionListItem, CollectionListPageData } from "../types/collection-list.types";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type StateFilter = "Tất cả" | "Đang học" | "Chưa bắt đầu" | "Hoàn thành";
type AccessFilter = "all" | "free" | "pro";

const STATE_TABS: StateFilter[] = [
  "Tất cả",
  "Đang học",
  "Chưa bắt đầu",
  "Hoàn thành",
];

/* -------------------------------------------------------------------------- */
/* Section divider                                                             */
/* -------------------------------------------------------------------------- */

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.07em] text-text-muted">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center"
      role="status"
    >
      <Layers className="size-7 text-border" aria-hidden />
      <p className="text-sm text-text-muted">Không tìm thấy bộ sưu tập nào</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collection list skeleton                                                    */
/* -------------------------------------------------------------------------- */

function CollectionListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Đang tải...">
      <div className="h-40 animate-pulse rounded-card bg-surface-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-card bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page stats bar                                                              */
/* -------------------------------------------------------------------------- */

function PageStats({ collections }: { collections: CollectionListItem[] }) {
  const total = collections.length;
  const learning = collections.filter((c) => c.status === "learning").length;
  const done = collections.filter((c) => c.status === "done").length;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
      <span>
        <strong className="text-text-primary">{total}</strong> bộ sưu tập
      </span>
      {learning > 0 && (
        <span>
          <strong className="text-primary">{learning}</strong> đang học
        </span>
      )}
      {done > 0 && (
        <span>
          <strong className="text-success-foreground">{done}</strong> hoàn thành
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CollectionListView                                                          */
/* -------------------------------------------------------------------------- */

export type CollectionListViewProps = {
  data: CollectionListPageData;
};

export function CollectionListView({ data }: CollectionListViewProps) {
  const { langLabel, langSubtitle, collections } = data;

  const [stateFilter, setStateFilter] = React.useState<StateFilter>("Tất cả");
  const [accessFilter, setAccessFilter] = React.useState<AccessFilter>("all");
  const [query, setQuery] = React.useState("");

  /* Filter logic */
  const filtered = React.useMemo(() => {
    return collections.filter((c) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const titleMatch = c.title.toLowerCase().includes(q);
        const levelMatch = c.level.toLowerCase().includes(q);
        const tagMatch = c.tags.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !levelMatch && !tagMatch) return false;
      }
      if (stateFilter === "Đang học" && c.status !== "learning") return false;
      if (stateFilter === "Chưa bắt đầu" && c.status !== "not-started") return false;
      if (stateFilter === "Hoàn thành" && c.status !== "done") return false;
      if (accessFilter === "free" && c.access !== "free") return false;
      if (accessFilter === "pro" && c.access !== "pro") return false;
      return true;
    });
  }, [collections, stateFilter, accessFilter, query]);

  /* Split into hero and compact */
  const learningColls = filtered.filter((c) => c.status === "learning");
  const nonLearning = filtered.filter((c) => c.status !== "learning");

  const showAllHero = stateFilter === "Đang học";
  const heroColls = showAllHero ? learningColls : learningColls.slice(0, 1);
  const compactColls = showAllHero
    ? []
    : [...learningColls.slice(1), ...nonLearning];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-primary">
          BỘ SƯU TẬP · {langLabel.toUpperCase()}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Bộ sưu tập của bạn
        </h1>
        <p className="text-sm text-text-secondary">{langSubtitle}</p>
        <PageStats collections={collections} />
      </div>

      {/* Search */}
      <div
        className={cn(
          "flex max-w-md items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-0 transition-[border-color,box-shadow] duration-150",
          "focus-within:border-primary focus-within:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h_/_0.12)]"
        )}
      >
        <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Tìm trong bộ sưu tập ${langLabel.toLowerCase()}…`}
          aria-label="Tìm kiếm bộ sưu tập"
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Xóa tìm kiếm"
            className="inline-flex items-center text-text-muted hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* State tabs */}
        <div
          className="flex overflow-hidden rounded-[10px] border border-border bg-card"
          role="tablist"
          aria-label="Lọc theo trạng thái học"
        >
          {STATE_TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={stateFilter === tab}
              onClick={() => setStateFilter(tab)}
              className={cn(
                "h-10 whitespace-nowrap px-4 text-[13px] font-medium transition-[background,color] duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
                i < STATE_TABS.length - 1 && "border-r border-border",
                stateFilter === tab
                  ? "bg-primary-soft font-bold text-primary-soft-foreground"
                  : "text-text-primary hover:bg-surface-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Access chips */}
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Lọc theo gói tài khoản"
        >
          {(
            [
              { value: "free" as const, label: "Miễn phí", icon: false },
              { value: "pro" as const, label: "Pro", icon: true },
            ] as const
          ).map(({ value, label, icon }) => (
            <button
              key={value}
              aria-pressed={accessFilter === value}
              onClick={() =>
                setAccessFilter(accessFilter === value ? "all" : value)
              }
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-pill border px-3.5 text-[13px] font-medium transition-all duration-130",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                accessFilter === value
                  ? "border-primary/40 bg-primary-soft font-bold text-primary-soft-foreground"
                  : "border-border bg-card text-text-primary hover:border-border hover:bg-surface-muted"
              )}
            >
              {icon && <Star className="size-3" aria-hidden />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Hero cards */}
          {heroColls.length > 0 && (
            <div className="flex flex-col gap-4">
              {showAllHero && <SectionDivider label="Đang học" />}
              {heroColls.map((c) => (
                <CollectionListHeroCard key={c.id} collection={c} />
              ))}
            </div>
          )}

          {/* Compact grid */}
          {compactColls.length > 0 && (
            <div className="flex flex-col gap-4">
              {heroColls.length > 0 && (
                <SectionDivider label="Khám phá thêm" />
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {compactColls.map((c) =>
                  c.access === "pro" && c.status === "not-started" ? (
                    <CollectionListProCard key={c.id} collection={c} />
                  ) : (
                    <CollectionListCompactCard key={c.id} collection={c} />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { CollectionListSkeleton };
