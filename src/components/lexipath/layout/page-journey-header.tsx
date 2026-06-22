import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* PageJourneyHeader                                                           */
/* -------------------------------------------------------------------------- */

export type PageJourneyHeaderProps = {
  breadcrumbs: Array<{ label: string; href?: string }>;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
};

/**
 * PageJourneyHeader — breadcrumb + journey context header for learning pages.
 * Breadcrumb items with href are rendered as <Link>; the last item is always
 * plain text (current page context).
 */
function PageJourneyHeader({
  breadcrumbs,
  title,
  subtitle,
  badge,
  className,
}: PageJourneyHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-2", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 ? (
        <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-1">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${i}`}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href as Route}
                    className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-sm",
                      isLast ? "text-text-secondary" : "text-text-muted"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast ? (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-text-muted"
                    aria-hidden
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </nav>
      ) : null}

      {/* Title row */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {badge ? (
          <Badge className="rounded-pill bg-primary-soft text-primary-soft-foreground">
            {badge}
          </Badge>
        ) : null}
      </div>

      {/* Subtitle */}
      {subtitle ? (
        <p className="text-sm text-text-secondary">{subtitle}</p>
      ) : null}
    </header>
  );
}

export { PageJourneyHeader };
