"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Rubric, RubricCriterion } from "../types/scoring.types";
import { ScoringSectionLabel } from "./scoring-section-label";

interface RubricPreviewProps {
  rubric: Rubric;
  criteria: RubricCriterion[];
}

export function RubricPreview({ rubric, criteria }: RubricPreviewProps) {
  const [picks, setPicks] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(criteria.map((c) => [c.id, Number(c.levels[0]?.band) || 0])),
  );

  const avg =
    criteria.length
      ? criteria.reduce((sum, c) => sum + (picks[c.id] || 0), 0) / criteria.length
      : 0;

  const weighted = criteria.reduce(
    (sum, c) => sum + (picks[c.id] || 0) * (c.weight || 0) / 100,
    0,
  );

  return (
    <Card>
      <CardContent className="p-5">
        <ScoringSectionLabel
          right={
            <span className="text-xs text-text-muted">Chọn mức cho từng tiêu chí</span>
          }
        >
          Tính thử điểm rubric
        </ScoringSectionLabel>

        <div className="flex flex-col gap-3">
          {criteria.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3">
              <span className="w-44 text-sm font-semibold text-text-secondary">
                {c.name}{" "}
                <span className="font-normal text-text-muted">({c.weight}%)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {c.levels.map((lv, i) => {
                  const selected = (picks[c.id] || 0) === Number(lv.band);
                  return (
                    <button
                      key={i}
                      type="button"
                      title={lv.desc}
                      onClick={() =>
                        setPicks((p) => ({ ...p, [c.id]: Number(lv.band) }))
                      }
                      className={cn(
                        "min-w-[38px] px-2.5 py-1 rounded-lg border-[1.5px] text-sm font-bold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected
                          ? "border-violet-600 bg-violet-50 text-violet-700"
                          : "border-border bg-card text-text-secondary hover:bg-muted/50",
                      )}
                    >
                      {lv.band}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3.5">
          <div className="rounded-xl bg-violet-50 border border-violet-200 px-4 py-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1">
              Điểm trung bình
            </div>
            <div className="text-2xl font-extrabold text-violet-700">
              {avg.toFixed(1)}
              <span className="text-sm font-medium text-text-muted">
                {" "}/ {rubric.scaleMax}
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 border border-border px-4 py-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted mb-1">
              Điểm có trọng số
            </div>
            <div className="text-2xl font-extrabold text-text-primary">
              {weighted.toFixed(1)}
              <span className="text-sm font-medium text-text-muted">
                {" "}/ {rubric.scaleMax}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
