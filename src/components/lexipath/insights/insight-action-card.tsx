import * as React from "react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { LearningInsightCardProps } from "./learning-insight-card";
import { LearningInsightCard } from "./learning-insight-card";

/* -------------------------------------------------------------------------- */
/* InsightActionCard                                                           */
/* -------------------------------------------------------------------------- */

export type InsightActionCardProps = LearningInsightCardProps & {
  actionLabel: string;
  href?: string;
};

/**
 * InsightActionCard — extends LearningInsightCard with a small action button
 * at the bottom. If href is provided the button wraps in a Link.
 */
function InsightActionCard({
  actionLabel,
  href,
  className,
  ...insightProps
}: InsightActionCardProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <LearningInsightCard
        {...insightProps}
        className="rounded-b-none border-b-0"
      />
      <div className="rounded-b-card border border-t-0 border-border bg-card px-4 py-3">
        {href ? (
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
            <Link href={href as Route}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export { InsightActionCard };
