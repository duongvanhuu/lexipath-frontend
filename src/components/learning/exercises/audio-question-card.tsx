"use client";

import * as React from "react";
import { PauseCircle, PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type AudioQuestionCardProps = {
  prompt?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  className?: string;
  children?: React.ReactNode;
};

function AudioQuestionCard({
  prompt = "Nghe và chọn đáp án đúng",
  isPlaying: controlledPlaying,
  onPlay,
  className,
  children,
}: AudioQuestionCardProps) {
  const [internalPlaying, setInternalPlaying] = React.useState(false);
  const isPlaying =
    controlledPlaying !== undefined ? controlledPlaying : internalPlaying;

  function handlePlay() {
    if (onPlay) {
      onPlay();
    } else {
      setInternalPlaying((v) => !v);
    }
  }

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      <p className="mb-4 text-sm text-text-secondary">{prompt}</p>
      <button
        type="button"
        aria-label={isPlaying ? "Dừng audio" : "Phát audio"}
        aria-pressed={isPlaying}
        onClick={handlePlay}
        className={cn(
          "mb-5 inline-flex size-16 items-center justify-center rounded-full border-2 border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isPlaying
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        {isPlaying ? (
          <PauseCircle className="size-6" aria-hidden />
        ) : (
          <PlayCircle className="size-6" aria-hidden />
        )}
      </button>
      {children ? <div className="text-left">{children}</div> : null}
    </div>
  );
}

export { AudioQuestionCard };
