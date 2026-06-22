import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { GoldenTimeReason } from "../types";
import { GOLDEN_TIME_REASON_LABELS } from "../constants/lexipath.constants";

/* -------------------------------------------------------------------------- */
/* GoldenTimeReasonChip — inline sub-component                                */
/* -------------------------------------------------------------------------- */

function GoldenTimeReasonChip({ reason }: { reason: GoldenTimeReason }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-golden/20 px-2.5 py-1 text-xs font-medium text-golden-foreground">
      {GOLDEN_TIME_REASON_LABELS[reason]}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* GoldenTimeWindow                                                            */
/* -------------------------------------------------------------------------- */

export type GoldenTimeWindowProps = {
  windowOpen: boolean;
  closeAt?: string;
  queueCount?: number;
  reasons?: GoldenTimeReason[];
  className?: string;
};

/**
 * GoldenTimeWindow — the amber surface for an active (or inactive) Golden Time
 * review window in the learner app. Distinct from the marketing explainer
 * (GoldenTimeExplainer). Uses golden tokens exclusively — never warning tokens.
 */
function GoldenTimeWindow({
  windowOpen,
  closeAt,
  queueCount,
  reasons = [],
  className,
}: GoldenTimeWindowProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-golden/40 bg-golden-soft p-5 shadow-golden",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-golden-strong text-white">
          <Clock className="size-4" aria-hidden />
        </span>
        <span className="text-xs font-semibold tracking-wide text-golden-foreground uppercase">
          Golden Time
        </span>
        {windowOpen ? (
          <span className="ml-auto rounded-pill bg-golden-strong/20 px-2 py-0.5 text-xs font-medium text-golden-foreground">
            Đang mở
          </span>
        ) : (
          <span className="ml-auto rounded-pill bg-border px-2 py-0.5 text-xs font-medium text-text-muted">
            Đã đóng
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5">
        {typeof queueCount === "number" ? (
          <p className="text-sm text-golden-foreground">
            <span className="text-lg font-bold">{queueCount}</span>{" "}
            <span className="opacity-80">từ trong hàng ôn</span>
          </p>
        ) : null}

        {closeAt ? (
          <p className="text-xs text-golden-foreground/70">
            Đóng lúc: <span className="font-medium">{closeAt}</span>
          </p>
        ) : null}

        {reasons.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {reasons.map((reason) => (
              <GoldenTimeReasonChip key={reason} reason={reason} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { GoldenTimeWindow };
