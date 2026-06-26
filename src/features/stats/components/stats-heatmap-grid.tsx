import * as React from "react";

import { cn } from "@/lib/utils/cn";

const LEVEL_BG = [
  "bg-border",
  "bg-success-soft",
  "bg-green-300",
  "bg-green-400",
  "bg-primary",
] as const;

const LEVEL_LABEL = [
  "Không học",
  "1–5 từ",
  "6–15 từ",
  "16–30 từ",
  "30+ từ",
] as const;

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

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

      {/* Visual heatmap — decorative, hidden from screen readers */}
      <div className="overflow-x-auto pb-1" aria-hidden>
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
                    className={cn("aspect-square rounded-sm", LEVEL_BG[level])}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Screen-reader table — same data, accessible format */}
      <table className="sr-only" aria-label={`Biểu đồ hoạt động 18 tuần — ${langName}`}>
        <caption>Hoạt động học tập 18 tuần gần nhất — {langName}</caption>
        <thead>
          <tr>
            <th scope="col">Tuần</th>
            {DAY_LABELS.map((d) => (
              <th key={d} scope="col">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: WEEKS }, (_, w) => (
            <tr key={w}>
              <th scope="row">
                {w === WEEKS - 1 ? "Tuần này" : `${WEEKS - w} tuần trước`}
              </th>
              {Array.from({ length: 7 }, (_, d) => {
                const level = cells[w * 7 + d] ?? 0;
                return <td key={d}>{LEVEL_LABEL[level]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
        {LEVEL_BG.map((bg, l) => (
          <span key={l} className="flex items-center gap-1">
            <span aria-hidden className={cn("inline-block size-2.5 rounded-sm", bg)} />
            {LEVEL_LABEL[l]}
          </span>
        ))}
      </div>
    </div>
  );
}

export { StatsHeatmapGrid };
