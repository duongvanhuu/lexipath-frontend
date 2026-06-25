"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ScoreScale, ScoreConversion, RoundingRule } from "../types/scoring.types";
import { applyRounding } from "../mock/scoring.mock";
import { ScoringSectionLabel } from "./scoring-section-label";

function ScoreRing({ pct, pass }: { pct: number; pass: boolean }) {
  const size = 120;
  const strokeWidth = 8;
  const r = (size - strokeWidth) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const safePct = Math.max(0, Math.min(100, pct));
  const offset = circ * (1 - safePct / 100);
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={c} cy={c} r={r}
        fill="none" strokeWidth={strokeWidth}
        style={{ stroke: "var(--color-border)" }}
      />
      <circle
        cx={c} cy={c} r={r}
        fill="none" strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          stroke: pass ? "var(--color-success)" : "var(--color-warning)",
          transition: "stroke-dashoffset 0.3s ease",
        }}
      />
    </svg>
  );
}

interface ScorePreviewProps {
  scale: ScoreScale;
  conversions: ScoreConversion[];
  roundingRules: RoundingRule[];
}

export function ScorePreview({ scale, conversions, roundingRules }: ScorePreviewProps) {
  const midRaw = Math.round((scale.minRaw + scale.maxRaw) / 2);
  const [raw, setRaw] = React.useState(midRaw);

  const matchingRow = conversions.find((c) => raw >= c.rawMin && raw <= c.rawMax);
  const rounded = matchingRow
    ? applyRounding(matchingRow.scaled, scale.roundingRuleId, roundingRules)
    : null;
  const pass = rounded !== null && rounded >= scale.passMark;
  const pct =
    scale.maxRaw === scale.minRaw
      ? 0
      : Math.round(((raw - scale.minRaw) / (scale.maxRaw - scale.minRaw)) * 100);

  return (
    <Card>
      <CardContent className="p-5">
        <ScoringSectionLabel>Tính thử điểm</ScoringSectionLabel>
        <div className="flex flex-wrap items-start gap-5 md:flex-nowrap">
          {/* Slider column */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-text-secondary">Điểm thô</span>
              <span className="text-sm font-bold text-text-primary">
                {raw} / {scale.maxRaw}
              </span>
            </div>
            <input
              type="range"
              min={scale.minRaw}
              max={scale.maxRaw}
              value={raw}
              onChange={(e) => setRaw(Number(e.target.value))}
              className="w-full accent-primary"
              aria-label="Điểm thô"
            />
            <div className="flex justify-between mt-1.5 text-[11px] text-text-muted">
              <span>{scale.minRaw}</span>
              <span>{scale.maxRaw}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/40 px-3.5 py-3">
                <div className="text-[11px] text-text-muted mb-1">Khoảng quy đổi</div>
                <div className="text-sm font-semibold text-text-primary">
                  {matchingRow ? `${matchingRow.rawMin}–${matchingRow.rawMax}` : "—"}
                </div>
              </div>
              <div className="rounded-xl border bg-muted/40 px-3.5 py-3">
                <div className="text-[11px] text-text-muted mb-1">Sau làm tròn</div>
                <div className="text-sm font-semibold text-text-primary">
                  {rounded !== null ? rounded : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-border" />

          {/* Ring column */}
          <div className="w-full md:w-48 flex flex-col items-center">
            <ScoreRing pct={pct} pass={pass} />
            <div className="mt-2 text-center">
              <div
                className={cn(
                  "text-3xl font-extrabold tracking-tight",
                  rounded === null
                    ? "text-text-muted"
                    : pass
                      ? "text-success-foreground"
                      : "text-warning-foreground",
                )}
              >
                {rounded !== null ? rounded : "—"}
              </div>
              <div className="text-xs text-text-muted">điểm thang</div>
              {rounded !== null && (
                <Badge
                  className={cn(
                    "mt-2 text-[11px]",
                    pass
                      ? "bg-success-soft text-success-foreground"
                      : "bg-warning-soft text-warning-foreground",
                  )}
                >
                  {pass ? "Đạt" : "Chưa đạt"} (ngưỡng {scale.passMark})
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
