import * as React from "react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";

import type { CheckpointState } from "../types";
import { checkpointVariants } from "./checkpoint-node";

/* -------------------------------------------------------------------------- */
/* TodayPath                                                                   */
/* -------------------------------------------------------------------------- */

export type TodayPathProps = {
  title: string;
  currentLabel: string;
  currentState?: CheckpointState;
  remainingCount?: number;
  href?: string;
  className?: string;
};

/**
 * TodayPath — a compact strip highlighting today's active learning path.
 * Uses emerald/primary tones to surface urgency without alarm.
 */
function TodayPath({
  title,
  currentLabel,
  currentState = "current",
  remainingCount,
  href,
  className,
}: TodayPathProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border border-primary/30 bg-primary-soft p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Left: title + current checkpoint */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-primary-soft-foreground/70 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-pill px-2.5 py-0.5 text-sm font-medium",
              checkpointVariants({ state: currentState })
            )}
          >
            {currentLabel}
          </span>
          {typeof remainingCount === "number" && remainingCount > 0 ? (
            <span className="rounded-pill bg-primary-soft-foreground/10 px-2 py-0.5 text-xs font-medium text-primary-soft-foreground">
              +{remainingCount} bài còn lại
            </span>
          ) : null}
        </div>
      </div>

      {/* Right: CTA */}
      {href ? (
        <Button
          asChild
          size="sm"
          className={cn(
            buttonToneVariants({ tone: "nextStep" }),
            "shrink-0 self-start sm:self-center"
          )}
        >
          <Link href={href as Route}>Tiếp tục</Link>
        </Button>
      ) : null}
    </div>
  );
}

export { TodayPath };
