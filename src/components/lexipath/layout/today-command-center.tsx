import * as React from "react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";

/* -------------------------------------------------------------------------- */
/* MetricTile — local sub-component                                           */
/* -------------------------------------------------------------------------- */

type MetricTileProps = {
  label: string;
  value: number;
  accent?: "default" | "primary" | "golden";
};

function MetricTile({ label, value, accent = "default" }: MetricTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border p-3 text-center",
        accent === "primary"
          ? "border-primary/30 bg-primary-soft"
          : accent === "golden"
            ? "border-golden/40 bg-golden-soft"
            : "border-border bg-card"
      )}
    >
      <span
        className={cn(
          "text-2xl font-bold",
          accent === "primary"
            ? "text-primary-soft-foreground"
            : accent === "golden"
              ? "text-golden-foreground"
              : "text-text-primary"
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "mt-0.5 text-xs",
          accent === "primary"
            ? "text-primary-soft-foreground/70"
            : accent === "golden"
              ? "text-golden-foreground/70"
              : "text-text-muted"
        )}
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TodayCommandCenter                                                          */
/* -------------------------------------------------------------------------- */

export type TodayCommandCenterProps = {
  reviewedCount: number;
  learnedCount: number;
  dueCount: number;
  goldenTimeActive?: boolean;
  nextHref?: string;
  nextLabel?: string;
  className?: string;
};

/**
 * TodayCommandCenter — today's session control panel. Shows 3 stat tiles
 * (reviewed, learned, due) and primary/golden CTAs. Server Component since
 * all actions are navigation-based Links.
 */
function TodayCommandCenter({
  reviewedCount,
  learnedCount,
  dueCount,
  goldenTimeActive,
  nextHref,
  nextLabel = "Tiếp tục học",
  className,
}: TodayCommandCenterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-card border border-border bg-card p-5",
        className
      )}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <MetricTile label="Đã ôn" value={reviewedCount} accent="primary" />
        <MetricTile label="Đã học" value={learnedCount} />
        <MetricTile
          label="Đến hạn"
          value={dueCount}
          accent="default"
        />
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-2">
        {nextHref ? (
          <Button
            asChild
            className={cn(buttonToneVariants({ tone: "nextStep" }), "flex-1")}
          >
            <Link href={nextHref as Route}>{nextLabel}</Link>
          </Button>
        ) : null}

        {goldenTimeActive ? (
          <Button
            asChild
            className={cn(buttonToneVariants({ tone: "golden" }), "flex-1")}
          >
            <Link href={"/golden-time" as Route}>Bắt đầu Golden Time</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { TodayCommandCenter };
