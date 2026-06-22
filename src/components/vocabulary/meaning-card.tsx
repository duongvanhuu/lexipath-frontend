import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* MeaningCard                                                                 */
/* -------------------------------------------------------------------------- */

export type MeaningCardProps = {
  definition: string;
  partOfSpeech?: string;
  className?: string;
};

/**
 * MeaningCard — simplified card for a single definition string.
 * Used in compact contexts where only the PoS + definition text is needed.
 */
function MeaningCard({ definition, partOfSpeech, className }: MeaningCardProps) {
  return (
    <Card size="sm" className={cn("gap-2", className)}>
      <CardContent className="flex flex-col gap-1.5">
        {partOfSpeech ? (
          <Badge
            variant="secondary"
            className="w-fit rounded-pill bg-surface-muted text-text-secondary"
          >
            {partOfSpeech}
          </Badge>
        ) : null}
        <p className="text-sm text-text-primary">{definition}</p>
      </CardContent>
    </Card>
  );
}

export { MeaningCard };
