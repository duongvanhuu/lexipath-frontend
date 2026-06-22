import * as React from "react";

import { ActionButton } from "@/components/shared/action-button";
import type { ShellAction } from "@/components/shared/navigation";
import { cn } from "@/lib/utils/cn";

export type PageHeaderProps = {
  title: string;
  description?: string;
  /** Right-aligned actions (e.g. "Tạo mới"). The first is the primary CTA. */
  actions?: ShellAction[];
  /** Breadcrumb slot rendered above the title. */
  breadcrumb?: React.ReactNode;
  className?: string;
};

/**
 * PageHeader — the title block at the top of a learner or admin page: optional
 * breadcrumb, an `h1`, a supporting description, and right-aligned actions.
 */
function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {breadcrumb ? <div className="mb-1">{breadcrumb}</div> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {actions && actions.length > 0 ? (
          <div className="flex shrink-0 items-center gap-2">
            {actions.map((action, index) => (
              <ActionButton
                key={action.id ?? action.label}
                action={{
                  ...action,
                  variant: action.variant ?? (index === 0 ? "primary" : "outline"),
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { PageHeader };
