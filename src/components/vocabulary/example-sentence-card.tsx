import * as React from "react";
import { Quote } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { VocabularyExample } from "./types";

/* -------------------------------------------------------------------------- */
/* ExampleSentenceCard                                                         */
/* -------------------------------------------------------------------------- */

export type ExampleSentenceCardProps = {
  example: VocabularyExample;
  className?: string;
};

/**
 * ExampleSentenceCard — compact row for a single usage example.
 * Shows source sentence and optional translation, with a decorative quote icon.
 */
function ExampleSentenceCard({ example, className }: ExampleSentenceCardProps) {
  const { sourceText, translatedText } = example;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md bg-surface-muted px-3 py-2",
        className
      )}
    >
      <Quote
        className="mt-0.5 size-3.5 shrink-0 text-text-muted"
        aria-hidden
      />

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-medium text-text-primary">{sourceText}</p>
        {translatedText ? (
          <p className="text-sm italic text-text-muted">{translatedText}</p>
        ) : null}
      </div>
    </div>
  );
}

export { ExampleSentenceCard };
