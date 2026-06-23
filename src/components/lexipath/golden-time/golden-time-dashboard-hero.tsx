import * as React from "react";
import { Clock, Flame, Lock } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { buttonToneVariants } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

import type { GoldenTimeReason } from "../types";
import { GOLDEN_TIME_REASON_LABELS } from "../constants/lexipath.constants";

/* -------------------------------------------------------------------------- */
/* GoldenTimeDashboardHero                                                     */
/* -------------------------------------------------------------------------- */

export type GoldenTimeDashboardHeroProps = {
  queueCount: number;
  overdueCount?: number;
  timeWindowMessage: string;
  reasons?: GoldenTimeReason[];
  windowOpen: boolean;
  closeAt?: string;
  startHref: string;
  className?: string;
};

/**
 * GoldenTimeDashboardHero — full-width hero panel for the /golden-time page.
 * Shows queue count, overdue alert, time window tagline, reason chips, and the
 * primary golden CTA. Uses only golden design tokens — never warning tokens.
 */
function GoldenTimeDashboardHero({
  queueCount,
  overdueCount,
  timeWindowMessage,
  reasons = [],
  windowOpen,
  closeAt,
  startHref,
  className,
}: GoldenTimeDashboardHeroProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-golden/40 bg-golden-soft p-6 shadow-golden",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-golden-strong text-white [&_svg]:size-5">
          <Clock aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-golden-foreground/70">
            Golden Time · Ôn tập
          </span>
          <span className="text-lg font-bold text-golden-foreground">
            Thời điểm ôn tập của bạn
          </span>
        </div>
        {windowOpen ? (
          <span className="ml-auto rounded-pill bg-golden-strong/20 px-2.5 py-1 text-xs font-semibold text-golden-foreground">
            Đang mở
          </span>
        ) : (
          <span className="ml-auto rounded-pill bg-border px-2.5 py-1 text-xs font-medium text-text-muted">
            Đã đóng
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-4xl font-extrabold tabular-nums text-golden-foreground">
            {queueCount}
          </span>
          <span className="text-sm text-golden-foreground/70">từ trong hàng ôn</span>
        </div>

        {overdueCount && overdueCount > 0 ? (
          <div className="flex items-center gap-1.5 rounded-md bg-danger-soft px-2.5 py-1.5">
            <Flame className="size-3.5 text-danger-foreground" aria-hidden />
            <span className="text-xs font-semibold text-danger-foreground">
              {overdueCount} từ quá hạn
            </span>
          </div>
        ) : null}
      </div>

      {/* Time window tagline */}
      <p className="mt-2 text-sm text-golden-foreground/80">{timeWindowMessage}</p>

      {/* Reason chips */}
      {reasons.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {reasons.map((reason) => (
            <span
              key={reason}
              className="rounded-pill bg-golden-strong/15 px-2.5 py-0.5 text-xs font-medium text-golden-foreground"
            >
              {GOLDEN_TIME_REASON_LABELS[reason]}
            </span>
          ))}
        </div>
      ) : null}

      {/* CTA */}
      <div className="mt-5">
        {windowOpen ? (
          <Button
            asChild
            className={cn(buttonToneVariants({ tone: "golden" }), "w-full sm:w-auto px-8")}
          >
            <Link href={startHref as Route}>Bắt đầu ôn ngay</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-golden-soft/50 px-3 py-2.5 text-sm text-text-muted">
            <Lock className="size-4 shrink-0" aria-hidden />
            Cửa sổ Golden Time đã đóng{closeAt ? ` lúc ${closeAt}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export { GoldenTimeDashboardHero };
