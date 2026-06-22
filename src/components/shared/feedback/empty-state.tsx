import * as React from "react";

import { ActionButton } from "@/components/shared/action-button";
import { cn } from "@/lib/utils/cn";

import type { EmptyStateAction } from "./types";

export type EmptyStateProps = {
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary action (e.g. "Tạo mới", "Bắt đầu học"). */
  action?: EmptyStateAction;
  /**
   * Optional helper panel rendered beside the message — a calmer alternative
   * to pure blankness (next step, tip, mini queue). Forces left alignment.
   */
  companion?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
};

/**
 * EmptyState — warm, calm placeholder for empty views (not error-like). When a
 * `companion` is provided it fills the space with a helpful panel instead of a
 * blank screen.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  companion,
  align = "center",
  className,
}: EmptyStateProps) {
  const centered = align === "center" && !companion;

  return (
    <div
      role="status"
      className={cn(
        "flex min-h-60 flex-col justify-center gap-5 px-6 py-10",
        centered ? "items-center text-center" : "items-stretch text-left",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          centered ? "items-center" : "items-start"
        )}
      >
        {icon ? (
          <span className="mb-4 inline-flex size-14 items-center justify-center rounded-panel bg-surface-muted text-text-muted [&_svg]:size-6">
            {icon}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description ? (
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-5">
            <ActionButton action={{ variant: "primary", ...action }} />
          </div>
        ) : null}
      </div>
      {companion ? (
        <div className="rounded-card border border-border bg-surface-muted p-4">
          {companion}
        </div>
      ) : null}
    </div>
  );
}

export { EmptyState };
