import * as React from "react";
import { ShieldOff } from "lucide-react";

import { ActionButton } from "@/components/shared/action-button";
import { cn } from "@/lib/utils/cn";

import type { EmptyStateAction } from "./types";

export type PermissionDeniedStateProps = {
  title?: string;
  description?: string;
  /** Optional action — e.g. "Liên hệ quản trị viên" or "Quay lại". */
  action?: EmptyStateAction;
  className?: string;
};

/**
 * PermissionDeniedState — shown when the user lacks access to a resource or
 * page. Neutral and non-alarming: a clear message with an optional next step.
 */
function PermissionDeniedState({
  title = "Không có quyền truy cập",
  description = "Bạn không có quyền xem nội dung này. Liên hệ quản trị viên để được cấp quyền.",
  action,
  className,
}: PermissionDeniedStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-panel bg-surface-muted text-text-muted [&_svg]:size-6">
        <ShieldOff aria-hidden />
      </span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {action ? (
        <div className="mt-5">
          <ActionButton action={{ variant: "outline", ...action }} />
        </div>
      ) : null}
    </div>
  );
}

export { PermissionDeniedState };
