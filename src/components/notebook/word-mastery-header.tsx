import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { NextReview } from "./types";

export type WordMasteryHeaderProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  nextReview?: NextReview;
  className?: string;
};

function WordMasteryHeader({
  headword,
  reading,
  partOfSpeech,
  script = "latin",
  reviewChip,
  nextReview,
  className,
}: WordMasteryHeaderProps) {
  const headwordClass = cn(
    "font-bold text-text-primary leading-tight",
    script === "latin" ? "text-5xl tracking-tight" : "text-5xl tracking-wide"
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="rounded-card border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {reading && script !== "latin" ? (
              <div className="mb-1 text-sm text-text-secondary">{reading}</div>
            ) : null}
            <h1 className={headwordClass}>{headword}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {reading && script === "latin" ? (
                <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-sm text-text-secondary">
                  {reading}
                </span>
              ) : null}
              {partOfSpeech ? (
                <span className="text-xs italic text-text-muted">
                  {partOfSpeech}
                </span>
              ) : null}
            </div>
          </div>
          {reviewChip ? (
            <div className="shrink-0">{reviewChip}</div>
          ) : null}
        </div>
      </div>

      {nextReview ? (
        <div className="flex items-center gap-3 rounded-card border border-golden/40 bg-golden-soft px-4 py-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-golden/20 text-golden-foreground">
            <Clock className="size-4" aria-hidden />
          </span>
          <div className="flex-1">
            <div className="text-xs text-golden-foreground">
              {nextReview.label ?? "Ôn tập tiếp theo"}
            </div>
            <div className="text-sm font-semibold text-golden-foreground">
              {nextReview.when}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { WordMasteryHeader };
