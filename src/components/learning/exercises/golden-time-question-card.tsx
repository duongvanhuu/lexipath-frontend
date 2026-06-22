import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type GoldenTimeQuestionCardProps = {
  word: string;
  reading?: string;
  questionType?: string;
  reviewChip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

function GoldenTimeQuestionCard({
  word,
  reading,
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
      <div className="flex items-center justify-between gap-3 border-b border-golden/20 bg-golden-soft px-5 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-text-primary">{word}</span>
          {reading ? (
            <span className="text-xs text-text-muted">{reading}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {questionType ? (
            <span className="rounded-pill bg-white/60 px-2 py-0.5 text-[10px] text-text-muted">
              {questionType}
            </span>
          ) : null}
          {reviewChip}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export { GoldenTimeQuestionCard };
