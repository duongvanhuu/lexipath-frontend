import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { WordSense } from "./types";

export type WordSensesListProps = {
  senses: WordSense[];
  className?: string;
};

function WordSensesList({ senses, className }: WordSensesListProps) {
  if (senses.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2.5", className)} role="list">
      {senses.map((sense, i) => (
        <div
          key={i}
          className="rounded-card border border-border bg-card p-4"
          role="listitem"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary"
              aria-label={`Nghĩa ${i + 1}`}
            >
              {i + 1}
            </span>
            {sense.pos ? (
              <span className="text-xs italic text-text-muted">{sense.pos}</span>
            ) : null}
          </div>
          <p className="mt-2 text-base leading-normal text-text-primary">
            {sense.gloss}
          </p>
          {sense.example ? (
            <p className="mt-2 border-l-2 border-border pl-3 text-sm italic leading-relaxed text-text-secondary">
              {sense.example}
            </p>
          ) : null}
          {sense.exampleTranslation ? (
            <p className="mt-1 pl-3 text-xs text-text-muted">
              {sense.exampleTranslation}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export { WordSensesList };
