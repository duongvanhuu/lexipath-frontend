"use client";

import * as React from "react";
import {
  Crosshair,
  TextSearch,
  Layers,
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
  TieredResults,
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

export type DictionaryResultListProps = {
  results: DictionaryEntry[];
  tiers: TieredResults;
  groups: VocabGroup[];
  byGroup: Record<string, DictionaryEntry[]>;
  lang: DictLang;
  query: string;
  saved: Set<string>;
  onSelect: (entry: DictionaryEntry) => void;
  onSave: (entry: DictionaryEntry) => void;
};

function SectionHeader({
  icon: Icon,
  label,
  count,
  className,
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted",
        className
      )}
    >
      <Icon size={12} />
      {label}
      {count !== undefined && (
        <span className="font-medium">({count})</span>
      )}
    </div>
  );
}

function DictionaryResultList({
  results,
  tiers,
  groups,
  byGroup,
  query,
  saved,
  onSelect,
  onSave,
}: DictionaryResultListProps) {
  if (results.length === 0) return null;

  return (
    <div>
      {/* Result count + group summary chips */}
      <p className="mb-2 text-xs font-medium text-text-muted">
        {results.length} kết quả cho &ldquo;{query}&rdquo;
      </p>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {groups
          .filter((g) => (byGroup[g.id] ?? []).length > 0)
          .map((g) => {
            const Icon = GROUP_ICONS[g.icon] ?? BookText;
            return (
              <span
                key={g.id}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-text-secondary"
              >
                <Icon size={11} /> {g.label}{" "}
                <b className="text-text-primary">{byGroup[g.id]?.length ?? 0}</b>
              </span>
            );
          })}
      </div>

      {/* Exact matches */}
      {tiers.exact.length > 0 && (
        <>
          <SectionHeader
            icon={Crosshair}
            label="Kết quả khớp chính xác"
            count={tiers.exact.length}
          />
          <div className="flex flex-col gap-2 mb-1">
            {tiers.exact.map((e) => (
              <DictionaryResultCard
                key={e.id}
                entry={e}
                tier="exact"
                saved={saved.has(e.id)}
                onSelect={onSelect}
                onSave={onSave}
              />
            ))}
          </div>
        </>
      )}

      {/* Normalized matches */}
      {tiers.norm.length > 0 && (
        <>
          <SectionHeader
            icon={TextSearch}
            label="Kết quả gần đúng"
            count={tiers.norm.length}
          />
          <div className="flex flex-col gap-2 mb-1">
            {tiers.norm.map((e) => (
              <DictionaryResultCard
                key={e.id}
                entry={e}
                tier="norm"
                saved={saved.has(e.id)}
                onSelect={onSelect}
                onSave={onSave}
              />
            ))}
          </div>
        </>
      )}

      {/* Related — grouped by category */}
      {tiers.related.length > 0 && (
        <>
          <SectionHeader icon={Layers} label="Kết quả liên quan — theo nhóm" />
          {groups.map((g) => {
            const items = (byGroup[g.id] ?? []).filter(
              (e) =>
                !tiers.exact.includes(e) && !tiers.norm.includes(e)
            );
            if (!items.length) return null;
            const Icon = GROUP_ICONS[g.icon] ?? BookText;
            return (
              <React.Fragment key={g.id}>
                <SectionHeader
                  icon={Icon}
                  label={g.label}
                  count={items.length}
                  className="py-2 text-text-secondary"
                />
                <div className="flex flex-col gap-2 mb-1">
                  {items.map((e) => (
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
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
}

export { DictionaryResultList };
