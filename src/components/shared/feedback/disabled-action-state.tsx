import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type DisabledActionHelp = {
  label?: string;
  href?: string;
  onClick?: () => void;
};

export type DisabledActionStateProps = {
  message?: string;
  /** Optional "learn more" affordance explaining the limitation. */
  help?: DisabledActionHelp;
  className?: string;
};

/**
 * DisabledActionState — inline, muted banner explaining why an action is
 * currently unavailable, with an optional help link.
 */
function DisabledActionState({
  message = "Hành động này hiện không khả dụng",
  help,
  className,
}: DisabledActionStateProps) {
  const helpLabel = help?.label ?? "Tìm hiểu thêm";

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2.5 rounded-md bg-surface-muted px-4 py-3 text-sm text-text-muted",
        className
      )}
    >
      <Info className="size-4 shrink-0" aria-hidden />
      <span className="flex-1">{message}</span>
      {help?.href ? (
        <a
          href={help.href}
          className="text-xs font-medium whitespace-nowrap text-primary hover:underline"
        >
          {helpLabel}
        </a>
      ) : help?.onClick ? (
        <button
          type="button"
          onClick={help.onClick}
          className="text-xs font-medium whitespace-nowrap text-primary hover:underline"
        >
          {helpLabel}
        </button>
      ) : null}
    </div>
  );
}

export { DisabledActionState };
