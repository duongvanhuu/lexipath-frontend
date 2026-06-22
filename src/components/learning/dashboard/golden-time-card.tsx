import * as React from "react";
import { Clock, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";

import type { GoldenTimeSummary } from "./types";

const REASON_LABELS: Record<
  NonNullable<GoldenTimeSummary["reasons"][number]>,
  string
> = {
  post_session: "Sau buổi học",
  forgetting_curve: "Đường cong quên",
  exam_wrong: "Sai trong bài thi",
};

export type GoldenTimeCardProps = {
  summary: GoldenTimeSummary;
  onStartHref?: string;
  className?: string;
};

function GoldenTimeCard({ summary, onStartHref, className }: GoldenTimeCardProps) {
  return (
    <div
      className={cn(
        "bg-golden-soft border border-golden/40 shadow-golden rounded-card p-5 flex flex-col gap-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-golden-strong text-white [&_svg]:size-5">
          <Clock aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-base font-bold text-golden-foreground">
            Golden Time
          </span>
          {summary.closeAt ? (
            <span className="text-xs text-text-muted">
              Đóng lúc {summary.closeAt}
            </span>
          ) : null}
        </div>
        <span className="ml-auto rounded-pill bg-golden-strong px-2.5 py-0.5 text-sm font-semibold text-white">
          {summary.queueCount} từ
        </span>
      </div>

      {/* Reason chips */}
      {summary.reasons.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {summary.reasons.map((reason) => (
            <span
              key={reason}
              className="rounded-pill bg-golden-strong/15 px-2 py-0.5 text-xs font-medium text-golden-foreground"
            >
              {REASON_LABELS[reason]}
            </span>
          ))}
        </div>
      ) : null}

      {/* CTA */}
      {summary.windowOpen ? (
        onStartHref ? (
          <Button
            asChild
            className={cn(buttonToneVariants({ tone: "golden" }), "w-full")}
          >
            <a href={onStartHref}>Bắt đầu Golden Time</a>
          </Button>
        ) : null
      ) : (
        <div className="flex items-center gap-2 rounded-md bg-golden-soft/50 px-3 py-2 text-sm text-text-muted">
          <Lock className="size-4 shrink-0" aria-hidden />
          Cửa sổ đã đóng
        </div>
      )}
    </div>
  );
}

export { GoldenTimeCard };
