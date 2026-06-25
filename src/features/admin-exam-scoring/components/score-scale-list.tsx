"use client";

import * as React from "react";
import { Calculator, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/shared";
import type { ScoreScale, ScoringProgram } from "../types/scoring.types";
import { ScoringStatusBadge } from "./scoring-status-badge";

const SCALE_TYPE_LABELS: Record<string, string> = {
  band: "Band score",
  total: "Điểm tổng",
  rubric: "Rubric",
};

interface ScoreScaleListProps {
  scales: ScoreScale[];
  programs: ScoringProgram[];
  onOpen: (scale: ScoreScale) => void;
}

export function ScoreScaleList({ scales, programs, onOpen }: ScoreScaleListProps) {
  const getProgram = (id: string) => programs.find((p) => p.id === id);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => toast.info("Tạo thang điểm mới (chưa triển khai)")}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Tạo thang điểm
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {scales.map((scale) => {
          const program = getProgram(scale.programId);
          return (
            <button
              key={scale.id}
              type="button"
              onClick={() => onOpen(scale)}
              className="w-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="hover:ring-primary/30 hover:ring-2 transition-all cursor-pointer">
                <CardContent className="p-[18px] flex items-center gap-3.5">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${program?.color ?? "#64748B"}14`,
                      color: program?.color ?? "#64748B",
                    }}
                  >
                    <Calculator className="size-5" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-base font-bold text-text-primary">{scale.name}</span>
                      <ScoringStatusBadge status={scale.status} />
                    </div>
                    <p className="text-xs text-text-muted mb-2">{scale.desc}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                      <span>
                        <strong>{program?.name ?? scale.programId}</strong>
                        {" · "}
                        {SCALE_TYPE_LABELS[scale.type] ?? scale.type}
                      </span>
                      <span>
                        Thô {scale.minRaw}–{scale.maxRaw} → Thang {scale.minScaled}–{scale.maxScaled}
                      </span>
                      <span>· {scale.convCount} khoảng</span>
                      <span className="text-success-foreground font-semibold">
                        Đạt ≥ {scale.passMark}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-muted shrink-0" aria-hidden />
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
