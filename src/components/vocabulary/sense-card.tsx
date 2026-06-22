import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { ExampleSentenceCard } from "./example-sentence-card";
import type { VocabularySense } from "./types";

/* -------------------------------------------------------------------------- */
/* SenseCard                                                                   */
/* -------------------------------------------------------------------------- */

export type SenseCardProps = {
  sense: VocabularySense;
  index?: number;
  className?: string;
};

/**
 * SenseCard — displays one meaning/sense of a vocabulary item including
 * part of speech, definition, collocations, and usage examples.
 */
function SenseCard({ sense, index, className }: SenseCardProps) {
  const { definition, partOfSpeech, examples, collocations } = sense;

  return (
    <Card size="sm" className={cn("gap-3", className)}>
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-center gap-2">
          {index !== undefined ? (
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-label={`Nghĩa thứ ${index + 1}`}
            >
              {index + 1}
            </span>
          ) : null}

          {partOfSpeech ? (
            <Badge
              variant="secondary"
              className="rounded-pill bg-surface-muted text-text-secondary"
            >
              {partOfSpeech}
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-text-primary">{definition}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {collocations && collocations.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Cụm từ
            </span>
            <div className="flex flex-wrap gap-1.5">
              {collocations.map((col) => (
                <span
                  key={col}
                  className="rounded-pill bg-surface-muted px-2.5 py-0.5 text-xs text-text-secondary"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {examples && examples.length > 0 ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Ví dụ
            </span>
            <div className="flex flex-col gap-2">
              {examples.map((ex) => (
                <ExampleSentenceCard key={ex.id} example={ex} />
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { SenseCard };
