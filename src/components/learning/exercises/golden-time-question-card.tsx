import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type GoldenTimeQuestionCardProps = {
  word: string;
  /** IPA transcription or CJK reading/phonetic displayed below the word. */
  reading?: string;
  /** Short instruction shown above the word (e.g. "Chọn nghĩa đúng của từ:"). */
  prompt?: string;
  questionType?: string;
  reviewChip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

function GoldenTimeQuestionCard({
  word,
  reading,
  prompt,
  questionType,
  reviewChip,
  className,
  children,
}: GoldenTimeQuestionCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-card",
        className
      )}
    >
      {/* Context strip */}
      <div className="flex items-center justify-between gap-3 border-b border-golden/20 bg-golden-soft px-5 py-2.5">
        <span className="text-xs font-semibold text-golden-foreground">
          Golden Time
        </span>
        <div className="flex items-center gap-2">
          {questionType ? (
            <span className="rounded-pill bg-white/60 px-2 py-0.5 text-[10px] text-text-muted">
              {questionType}
            </span>
          ) : null}
          {reviewChip}
        </div>
      </div>

      {/* Word display — prominent, centred */}
      <div className="px-6 pb-4 pt-6 text-center">
        {prompt ? (
          <p className="mb-4 text-sm text-text-secondary">{prompt}</p>
        ) : null}
        <div className="text-4xl font-bold tracking-tight text-text-primary">
          {word}
        </div>
        {reading ? (
          <div className="mt-2 text-sm text-text-secondary">{reading}</div>
        ) : null}
      </div>

      {/* Body — choices or other content */}
      {children ? <div className="px-5 pb-5">{children}</div> : null}
    </div>
  );
}

export { GoldenTimeQuestionCard };
