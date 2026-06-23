"use client";

import * as React from "react";
import {
  Clock,
  Flame,
  LayoutGrid,
  BookText,
  SquarePen,
  GitMerge,
  Quote,
  Combine,
  Sparkles,
  Link,
  ListTree,
  Shapes,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { DictionaryResultCard } from "./dictionary-result-card";
import type {
  DictionaryEntry,
  DictLang,
  VocabGroup,
} from "@/features/dictionary";

const GROUP_ICONS: Record<string, React.ElementType> = {
  BookText,
  SquarePen,
  GitMerge,
  Quote,
  Combine,
  Sparkles,
  Link,
  ListTree,
  Shapes,
};

export type DictionaryBeforeSearchProps = {
  lang: DictLang;
  recentSearches: string[];
  onClearRecent: () => void;
  onRecentClick: (q: string) => void;
  groups: VocabGroup[];
  entriesByGroup: Record<string, DictionaryEntry[]>;
  popularEntries: DictionaryEntry[];
  saved: Set<string>;
  onSelect: (entry: DictionaryEntry) => void;
  onSave: (entry: DictionaryEntry) => void;
  onCategoryClick: (groupId: string) => void;
};

function BlockLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
      <Icon size={13} />
      {children}
    </div>
  );
}

function DictionaryBeforeSearch({
  recentSearches,
  onClearRecent,
  onRecentClick,
  groups,
  entriesByGroup,
  popularEntries,
  saved,
  onSelect,
  onSave,
  onCategoryClick,
}: DictionaryBeforeSearchProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <section>
          <BlockLabel icon={Clock}>Tìm kiếm gần đây</BlockLabel>
          <div className="flex flex-wrap items-center gap-2">
            {recentSearches.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onRecentClick(r)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-text-secondary transition-all",
                  "hover:border-primary hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Clock size={12} />
                {r}
              </button>
            ))}
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs text-text-muted underline hover:text-text-secondary"
            >
              Xóa
            </button>
          </div>
        </section>
      )}

      {/* Suggested categories */}
      <section>
        <BlockLabel icon={LayoutGrid}>Danh mục gợi ý</BlockLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {groups.map((g) => {
            const count = (entriesByGroup[g.id] ?? []).length;
            const Icon = GROUP_ICONS[g.icon] ?? BookText;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onCategoryClick(g.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[13px] border border-border bg-card p-3 text-left transition-all",
                  "hover:border-primary hover:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h/0.08)]"
                )}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-primary">
                    {g.label}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {count} mục
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular words */}
      {popularEntries.length > 0 && (
        <section>
          <BlockLabel icon={Flame}>Từ phổ biến</BlockLabel>
          <div className="flex flex-col gap-2">
            {popularEntries.map((e) => (
              <DictionaryResultCard
                key={e.id}
                entry={e}
                tier="related"
                saved={saved.has(e.id)}
                onSelect={onSelect}
                onSave={onSave}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export { DictionaryBeforeSearch };
