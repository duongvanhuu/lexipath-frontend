import * as React from "react";
import { Star, CheckCircle2, Target } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { StatTile } from "./stat-tile";

export type GoldenTimeSummaryCardProps = {
  reviewedCount: number;
  accuracy: number;
  xpEarned: number;
  className?: string;
};

function GoldenTimeSummaryCard({
  reviewedCount,
  accuracy,
  xpEarned,
  className,
}: GoldenTimeSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-golden/40 bg-golden-soft p-5 shadow-golden flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-golden-strong text-white [&_svg]:size-4">
          <Star aria-hidden />
        </span>
        <span className="text-base font-bold text-golden-foreground">
          Kết quả Golden Time
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatTile
          label="Đã ôn"
          value={reviewedCount}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatTile
          label="Độ chính xác"
          value={`${accuracy}%`}
          icon={<Target />}
          tone="default"
        />
        <StatTile
          label="XP nhận được"
          value={`+${xpEarned}`}
          icon={<Star />}
          tone="golden"
        />
      </div>
    </div>
  );
}

export { GoldenTimeSummaryCard };
