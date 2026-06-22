import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { WordRelationGroup, WordRelation } from "./types";

const RELATION_META: Record<
  WordRelationGroup["type"],
  { label: string; colorClass: string; dotClass: string }
> = {
  synonym: {
    label: "Đồng nghĩa",
    colorClass: "text-skill-meaning",
    dotClass: "border-skill-meaning",
  },
  antonym: {
    label: "Trái nghĩa",
    colorClass: "text-skill-usage",
    dotClass: "border-skill-usage",
  },
  confusable: {
    label: "Dễ nhầm",
    colorClass: "text-danger-foreground",
    dotClass: "border-danger",
  },
  collocation: {
    label: "Kết hợp",
    colorClass: "text-skill-collocation",
    dotClass: "border-skill-collocation",
  },
  grammar: {
    label: "Ngữ pháp",
    colorClass: "text-skill-spelling",
    dotClass: "border-skill-spelling",
  },
};

export type WordRelationMapProps = {
  headword?: string;
  groups?: WordRelationGroup[];
  onWordClick?: (word: WordRelation) => void;
  className?: string;
};

function WordRelationMap({
  headword,
  groups = [],
  onWordClick,
  className,
}: WordRelationMapProps) {
  return (
    <div
      className={cn("rounded-card border border-border bg-card p-4", className)}
    >
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Từ liên quan
      </div>

      {headword ? (
        <div className="mb-1 inline-flex items-center gap-2 rounded-pill border border-primary/30 bg-primary/10 px-3.5 py-1.5">
          <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-sm font-semibold text-primary">{headword}</span>
        </div>
      ) : null}

      <div className="flex flex-col" role="list">
        {groups.map((group, gi) => {
          const meta = RELATION_META[group.type];
          const isLast = gi === groups.length - 1;

          return (
            <div key={group.id} className="flex gap-3" role="listitem">
              {/* Connector rail */}
              <div className="flex w-3 shrink-0 flex-col items-center pt-1.5">
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-full border-2 bg-card",
                    meta.dotClass
                  )}
                  aria-hidden
                />
                {!isLast ? (
                  <span
                    className="mt-0.5 w-0.5 flex-1 rounded-full bg-border"
                    aria-hidden
                  />
                ) : null}
              </div>

              {/* Group content */}
              <div
                className={cn("min-w-0 flex-1 pt-0.5", !isLast && "pb-4")}
              >
                <div
                  className={cn(
                    "mb-1.5 text-xs font-semibold",
                    meta.colorClass
                  )}
                  id={`relation-group-${group.id}`}
                >
                  {group.label || meta.label}
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  aria-labelledby={`relation-group-${group.id}`}
                >
                  {group.relations.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={
                        onWordClick ? () => onWordClick(rel) : undefined
                      }
                      disabled={!onWordClick}
                      aria-label={`${rel.word}${rel.reading ? ` (${rel.reading})` : ""}`}
                      className={cn(
                        "inline-flex items-baseline gap-1.5 rounded-pill border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-text-primary transition-colors",
                        onWordClick
                          ? "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          : "pointer-events-none"
                      )}
                    >
                      {rel.word}
                      {rel.reading ? (
                        <span className="text-xs text-text-muted">
                          {rel.reading}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { WordRelationMap };
