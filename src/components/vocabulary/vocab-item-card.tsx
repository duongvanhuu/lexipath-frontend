import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { VocabularyItem } from "./types";

/* -------------------------------------------------------------------------- */
/* Status badge variant map                                                    */
/* -------------------------------------------------------------------------- */

type StatusBadgeProps = {
  status: NonNullable<VocabularyItem["learningStatus"]>;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const labelMap: Record<NonNullable<VocabularyItem["learningStatus"]>, string> =
    {
      new: "Mới",
      learning: "Đang học",
      review: "Ôn tập",
      mastered: "Thành thạo",
    };

  const classMap: Record<
    NonNullable<VocabularyItem["learningStatus"]>,
    string
  > = {
    new: "bg-primary text-primary-foreground",
    learning: "bg-golden text-golden-foreground",
    review: "bg-warning text-warning-foreground",
    mastered: "bg-success text-success-foreground",
  };

  return (
    <Badge className={cn("rounded-pill", classMap[status])}>
      {labelMap[status]}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* VocabItemCard                                                               */
/* -------------------------------------------------------------------------- */

export type VocabItemCardProps = {
  item: VocabularyItem;
  onClick?: never;
  className?: string;
};

/**
 * VocabItemCard — server-renderable card for a single vocabulary word.
 * Wrapping in a `next/link` for navigation is the parent's responsibility
 * (onClick is intentionally excluded).
 */
function VocabItemCard({ item, className }: VocabItemCardProps) {
  const { word, partOfSpeech, phoneticText, meaning, learningStatus } = item;

  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="text-lg font-bold text-text-primary">{word}</span>
          {learningStatus ? (
            <StatusBadge status={learningStatus} />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {partOfSpeech ? (
            <Badge
              variant="secondary"
              className="rounded-pill bg-surface-muted text-text-secondary"
            >
              {partOfSpeech}
            </Badge>
          ) : null}
          {phoneticText ? (
            <span className="font-mono text-sm text-text-muted">
              /{phoneticText}/
            </span>
          ) : null}
        </div>
      </CardHeader>

      {meaning ? (
        <CardContent>
          <p className="text-sm text-text-secondary">{meaning}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export { VocabItemCard };
