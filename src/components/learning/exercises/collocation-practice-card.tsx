import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type CollocationPracticeCardProps = {
  baseWord: string;
  prompt?: string;
  options: string[];
  selectedIndex?: number;
  correctIndex?: number;
  state?: "idle" | "answered";
  onSelect?: (index: number) => void;
  className?: string;
};

function CollocationPracticeCard({
  baseWord,
  prompt,
  options,
  selectedIndex,
  correctIndex,
  state = "idle",
  onSelect,
  className,
}: CollocationPracticeCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      {prompt ? (
        <p className="mb-2 text-sm text-text-secondary">{prompt}</p>
      ) : null}
      <div className="mb-5 text-2xl font-bold text-text-primary">
        ___ + {baseWord}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          const isCorrect = state === "answered" && i === correctIndex;
          const isWrong =
            state === "answered" && isSelected && i !== correctIndex;

          return (
            <button
              key={i}
              type="button"
              onClick={() => state === "idle" && onSelect?.(i)}
              disabled={state === "answered"}
              aria-pressed={isSelected}
              className={cn(
                "rounded-button border-[1.5px] px-[18px] py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
                isCorrect &&
                  "border-success bg-success-soft text-success-foreground",
                isWrong &&
                  "border-danger bg-danger-soft text-danger-foreground",
                isSelected &&
                  state === "idle" &&
                  "border-primary bg-primary/10 text-primary",
                !isSelected &&
                  !isCorrect &&
                  !isWrong &&
                  "border-border bg-card text-text-primary hover:border-border/80 hover:bg-muted/40"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { CollocationPracticeCard };
