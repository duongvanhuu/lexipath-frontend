import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { LexiCard } from "./lexi-card";
import { type LexiCardTone } from "./card-variants";

export type MetricTrend = {
  direction: "up" | "down" | "flat";
  /** Pre-formatted delta, e.g. "+12%", "−3 từ". */
  value: string;
};

export type MetricCardProps = {
  /** Metric name, e.g. "Từ đã thuộc tuần này". */
  label: string;
  /** The headline figure. */
  value: React.ReactNode;
  /** Leading accent icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  /** Optional trend pill. `up` is positive (success), `down` negative. */
  trend?: MetricTrend;
  /** Supporting caption under the value. */
  hint?: string;
  tone?: LexiCardTone;
  className?: string;
};

const TREND_META = {
  up: { Icon: TrendingUp, className: "text-success-foreground bg-success-soft" },
  down: { Icon: TrendingDown, className: "text-danger-foreground bg-danger-soft" },
  flat: { Icon: Minus, className: "text-text-secondary bg-surface-muted" },
} as const;

/**
 * MetricCard — a single learning metric (value + label + optional trend).
 * Built on `LexiCard`; presentational only (no data fetching).
 */
function MetricCard({
  label,
  value,
  icon,
  trend,
  hint,
  tone = "default",
  className,
}: MetricCardProps) {
  const trendMeta = trend ? TREND_META[trend.direction] : null;

  return (
    <LexiCard tone={tone} className={className}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {icon ? (
          <CardAction className="text-text-muted [&_svg]:size-4">
            {icon}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-heading text-2xl leading-none font-semibold text-text-primary">
          {value}
        </span>
        {trendMeta ? (
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium",
              trendMeta.className
            )}
          >
            <trendMeta.Icon className="size-3" aria-hidden />
            {trend!.value}
          </span>
        ) : null}
        {hint ? (
          <span className="text-xs text-text-muted">{hint}</span>
        ) : null}
      </CardContent>
    </LexiCard>
  );
}

export { MetricCard };
