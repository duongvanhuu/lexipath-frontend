import * as React from "react";

import { cn } from "@/lib/utils/cn";

const LEVEL_BG = [
  "bg-border",
  "bg-success-soft",
  "bg-green-300",
  "bg-green-400",
  "bg-primary",
] as const;

export type StatsHeatmapGridProps = {
  cells: number[];
  langName: string;
  className?: string;
};

function StatsHeatmapGrid({ cells, langName, className }: StatsHeatmapGridProps) {
  const WEEKS = 18;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm font-semibold">
        18 tuần gần nhất
        <span className="ml-1.5 font-normal text-text-muted">· {langName}</span>
      </p>

      <div
        className="overflow-x-auto pb-1"
        role="img"
        aria-label={`Biểu đồ hoạt động 18 tuần — ${langName}`}
      >
        <div
          className="grid min-w-72 gap-1"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}
        >
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, d) => {
                const level = cells[w * 7 + d] ?? 0;
                return (
                  <div
                    key={d}
                    title={`Tuần ${WEEKS - w}, ngày ${d + 1}`}
                    className={cn("aspect-square rounded-sm", LEVEL_BG[level])}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
        <span>Ít</span>
        {LEVEL_BG.map((bg, l) => (
          <span
            key={l}
            aria-hidden
            className={cn("inline-block size-2.5 rounded-sm", bg)}
          />
        ))}
        <span>Nhiều</span>
      </div>
    </div>
  );
}

export { StatsHeatmapGrid };
