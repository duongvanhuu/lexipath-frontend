"use client";

import * as React from "react";
import { X } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

export type FocusLearningShellProps = {
  /** Exit handler. When set, a close button is shown on the left. */
  onClose?: () => void;
  /** Accessible label + tooltip for the close button. */
  closeLabel?: string;
  /** Centre context label (e.g. the lesson / session name). */
  title?: string;
  /** Path / step indicator slot rendered before the title. */
  pathIndicator?: React.ReactNode;
  /** 0–100 session progress. Renders a slim bar beneath the bar. */
  progress?: number;
  /** Right-aligned meta slot (timer, question count, …). */
  meta?: React.ReactNode;
  /** Narrow content column width. Defaults to a focused reading measure. */
  contentClassName?: string;
  children: React.ReactNode;
};

/**
 * FocusLearningShell — distraction-free layout for active learning (lesson
 * player, flashcards, exercise / review modes). Minimal top bar (exit · context
 * · meta) with a progress bar beneath; no app nav, no sidebar. Content is
 * centered in a narrow column.
 */
function FocusLearningShell({
  onClose,
  closeLabel = "Thoát",
  title,
  pathIndicator,
  progress,
  meta,
  contentClassName,
  children,
}: FocusLearningShellProps) {
  const hasProgress = typeof progress === "number";
  const pct = hasProgress ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex-none border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {onClose ? (
              <IconButton variant="quiet" label={closeLabel} onClick={onClose}>
                <X />
              </IconButton>
            ) : null}
            {pathIndicator}
            {title ? (
              <span className="truncate text-sm font-semibold text-text-primary">
                {title}
              </span>
            ) : null}
          </div>
          {meta ? (
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-text-secondary">
              {meta}
            </div>
          ) : null}
        </div>
        {hasProgress ? (
          <Progress
            value={pct}
            aria-label="Tiến độ phiên học"
            className="h-1 rounded-none"
          />
        ) : null}
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6">
        <div className={cn("w-full max-w-xl", contentClassName)}>{children}</div>
      </main>
    </div>
  );
}

export { FocusLearningShell };
