"use client";

import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LessonReorderItem } from "./types";

export interface LessonItemReorderListProps {
  items: LessonReorderItem[];
  onReorder: (items: LessonReorderItem[]) => void;
  onRemove?: (id: string) => void;
}

export function LessonItemReorderList({
  items,
  onReorder,
  onRemove,
}: LessonItemReorderListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No items to reorder
      </p>
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...items];
    const tmp = next[index - 1] as LessonReorderItem;
    next[index - 1] = next[index] as LessonReorderItem;
    next[index] = tmp;
    onReorder(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = [...items];
    const tmp = next[index + 1] as LessonReorderItem;
    next[index + 1] = next[index] as LessonReorderItem;
    next[index] = tmp;
    onReorder(next);
  }

  return (
    <div className="space-y-1.5 w-full">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border bg-card",
            "hover:bg-muted/50 transition-colors",
          )}
        >
          {/* Drag handle */}
          <span className="cursor-grab text-muted-foreground shrink-0">
            <GripVertical className="size-4" aria-hidden="true" />
          </span>

          {/* Title */}
          <span className="flex-1 text-sm font-medium truncate">
            {item.title}
          </span>

          {/* Item count badge */}
          {item.itemCount !== undefined && (
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              {item.itemCount} items
            </Badge>
          )}

          {/* Move up */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => moveUp(index)}
            className="size-7 shrink-0"
          >
            <ArrowUp className="size-3.5" />
          </Button>

          {/* Move down */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Move down"
            disabled={index === items.length - 1}
            onClick={() => moveDown(index)}
            className="size-7 shrink-0"
          >
            <ArrowDown className="size-3.5" />
          </Button>

          {/* Remove */}
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove item"
              onClick={() => onRemove(item.id)}
              className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
