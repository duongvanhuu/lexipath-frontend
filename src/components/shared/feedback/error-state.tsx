import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

import { ActionButton } from "@/components/shared/action-button";
import { cn } from "@/lib/utils/cn";

export type ErrorStateProps = {
  /** Leading icon — defaults to an alert circle. */
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  /** Retry handler. When set, a retry button is shown. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/**
 * ErrorState — calm but clear failure message with an optional retry action.
 * Pairs naturally with a TanStack Query `error` branch.
 */
function ErrorState({
  icon,
  title = "Đã xảy ra lỗi",
  description,
  onRetry,
  retryLabel = "Thử lại",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-panel bg-danger-soft text-danger [&_svg]:size-6">
        {icon ?? <AlertCircle aria-hidden />}
      </span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      ) : null}
      {onRetry ? (
        <div className="mt-5">
          <ActionButton
            action={{
              label: retryLabel,
              onClick: onRetry,
              variant: "outline",
              icon: <RotateCcw aria-hidden />,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export { ErrorState };
