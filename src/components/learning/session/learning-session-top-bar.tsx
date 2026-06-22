import * as React from "react";
import { X } from "lucide-react";

import { IconButton } from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

/**
 * Standalone session top bar for custom learning layouts.
 * Use FocusLearningShell for full-page learning sessions.
 */
export type LearningSessionTopBarProps = {
  current: number;
  total: number;
  title?: string;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};

function LearningSessionTopBar({
  current,
  total,
  title,
  onClose,
  closeLabel = "Thoát",
  className,
}: LearningSessionTopBarProps) {
  const pct =
    total > 0 ? Math.max(0, Math.min(100, Math.round((current / total) * 100))) : 0;

  return (
    <div className={cn("border-b border-border bg-card", className)}>
      <div className="flex h-14 items-center gap-3 px-4">
        {onClose ? (
          <IconButton variant="ghost" label={closeLabel} onClick={onClose}>
            <X />
          </IconButton>
        ) : null}
        <div className="flex-1">
          <Progress
            value={pct}
            aria-label={`Tiến độ: ${current}/${total}`}
            className="h-1.5"
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-text-muted">
          {current}/{total}
        </span>
        {title ? (
          <span className="hidden shrink-0 text-xs text-text-muted sm:inline">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { LearningSessionTopBar };
