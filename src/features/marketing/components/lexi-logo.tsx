import { Route } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type LexiLogoProps = {
  /** Hide the wordmark, showing only the path glyph. */
  iconOnly?: boolean;
  className?: string;
};

/**
 * LexiLogo — the LexiPath brand mark: a path glyph in a brand-emerald tile next
 * to the wordmark. The "path" icon reinforces the learning-path identity.
 */
function LexiLogo({ iconOnly = false, className }: LexiLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Route className="size-4" aria-hidden />
      </span>
      {!iconOnly ? (
        <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
          LexiPath
        </span>
      ) : null}
    </span>
  );
}

export { LexiLogo };
