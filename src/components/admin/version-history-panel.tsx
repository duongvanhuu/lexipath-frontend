import { Clock, User, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

import type { VersionHistoryItem } from "./types";

export interface VersionHistoryPanelProps {
  items: VersionHistoryItem[];
  onRestore?: (id: string) => void;
  className?: string;
}

export function VersionHistoryPanel({
  items,
  onRestore,
  className,
}: VersionHistoryPanelProps) {
  if (items.length === 0) {
    return (
      <div className={cn("relative", className)}>
        <p className="py-6 text-center text-sm text-muted-foreground">
          No version history available.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <ul className="relative space-y-0">
        {items.map((item, i) => (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line: show for all but last */}
            {i < items.length - 1 && (
              <div
                className="absolute bottom-0 left-[9px] top-5 w-px bg-border"
                aria-hidden
              />
            )}

            {/* Dot */}
            <div
              className={cn(
                "relative z-10 mt-1 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2",
                item.isCurrent
                  ? "border-primary bg-primary"
                  : "border-border bg-background",
              )}
            >
              {item.isCurrent && (
                <span className="size-1.5 rounded-full bg-primary-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                {item.isCurrent && (
                  <Badge className="bg-primary/10 text-primary">Current</Badge>
                )}
              </div>

              {item.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3 shrink-0" aria-hidden />
                  {item.createdAtLabel}
                </span>
                {item.actorName && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="size-3 shrink-0" aria-hidden />
                    {item.actorName}
                  </span>
                )}
              </div>

              {onRestore && !item.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1.5 h-7 gap-1.5 px-2 text-xs"
                  onClick={() => onRestore(item.id)}
                >
                  <RotateCcw className="size-3" aria-hidden />
                  Restore
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
