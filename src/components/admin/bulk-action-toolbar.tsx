"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { AdminTableAction } from "./types";

export interface BulkActionToolbarProps {
  selectedCount: number;
  selectedIds: string[];
  actions: AdminTableAction[];
  onClearSelection: () => void;
  className?: string;
}

function mapVariant(
  variant: AdminTableAction["variant"],
): React.ComponentProps<typeof Button>["variant"] {
  if (variant === "danger") return "destructive";
  if (variant === "secondary") return "secondary";
  if (variant === "default") return "default";
  return "outline";
}

export function BulkActionToolbar({
  selectedCount,
  selectedIds,
  actions,
  onClearSelection,
  className,
}: BulkActionToolbarProps) {
  const visible = selectedCount > 0;

  return (
    <div
      aria-live="polite"
      className={cn(
        "transition-all duration-200",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden",
        className,
      )}
    >
      <div className="border rounded-lg bg-muted/80 px-3 py-2 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-foreground">
          {selectedCount} selected
        </span>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear selection"
          onClick={onClearSelection}
          className="h-7 w-7 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1 shrink-0" aria-hidden />

        {actions.map((action) => (
          <Button
            key={action.id}
            variant={mapVariant(action.variant)}
            size="sm"
            onClick={() => action.onClick(selectedIds)}
            className="h-7"
          >
            {action.icon && (
              <span className="mr-1.5 flex items-center">{action.icon}</span>
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
