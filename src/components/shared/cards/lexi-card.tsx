import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { cardToneVariants, type LexiCardTone } from "./card-variants";

export type LexiCardProps = React.ComponentProps<typeof Card> & {
  /** Identity surface tone — choose the semantically correct one. */
  tone?: LexiCardTone;
  /** Adds hover/focus elevation for non-clickable emphasis. */
  interactive?: boolean;
  /** Adds the brand glow ring to mark the current path step / focus. */
  current?: boolean;
};

/**
 * LexiCard — the shadcn `Card` surface with LexiPath identity tones. Use the
 * re-exported `CardHeader` / `CardContent` / `CardFooter` for internal layout.
 * For a clickable card use `InteractiveCard` instead (never a clickable div).
 */
function LexiCard({
  className,
  tone = "default",
  interactive = false,
  current = false,
  ...props
}: LexiCardProps) {
  return (
    <Card
      data-tone={tone}
      className={cn(
        cardToneVariants({ tone }),
        interactive &&
          "cursor-pointer transition-shadow hover:shadow-card focus-visible:shadow-card",
        current && "ring-2 ring-primary/40",
        className
      )}
      {...props}
    />
  );
}

export { LexiCard };
