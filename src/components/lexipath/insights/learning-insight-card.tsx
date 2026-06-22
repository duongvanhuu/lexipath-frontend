import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* LearningInsightCard                                                         */
/* -------------------------------------------------------------------------- */

export type LearningInsightCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  trend?: "up" | "down" | "flat";
  className?: string;
};

const TREND_ICON: Record<
  NonNullable<LearningInsightCardProps["trend"]>,
  React.ReactElement
> = {
  up: (
    <TrendingUp
      className="size-4 text-success-foreground"
      aria-label="Tăng"
    />
  ),
  down: (
    <TrendingDown
      className="size-4 text-danger-foreground"
      aria-label="Giảm"
    />
  ),
  flat: (
    <Minus className="size-4 text-text-muted" aria-label="Không đổi" />
  ),
};

/**
 * LearningInsightCard — a metric/insight card using shadcn Card.
 * Shows a title, large value, optional unit, sublabel, and trend indicator.
 */
function LearningInsightCard({
  title,
  value,
  unit,
  sublabel,
  trend,
  className,
}: LearningInsightCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-text-muted">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-bold text-text-primary">{value}</span>
          {unit ? (
            <span className="mb-0.5 text-sm text-text-secondary">{unit}</span>
          ) : null}
          {trend ? (
            <span className="mb-0.5 ml-auto">{TREND_ICON[trend]}</span>
          ) : null}
        </div>
        {sublabel ? (
          <p className="mt-1 text-xs text-text-muted">{sublabel}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { LearningInsightCard };
