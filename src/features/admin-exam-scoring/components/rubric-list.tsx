"use client";

import * as React from "react";
import { ListChecks, Layers, Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/shared";
import type { Rubric, ScoringProgram } from "../types/scoring.types";
import { ScoringStatusBadge } from "./scoring-status-badge";

interface RubricListProps {
  rubrics: Rubric[];
  programs: ScoringProgram[];
  onOpen: (rubric: Rubric) => void;
}

export function RubricList({ rubrics, programs, onOpen }: RubricListProps) {
  const getProgram = (id: string) => programs.find((p) => p.id === id);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => toast.info("Tạo rubric mới (chưa triển khai)")}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Tạo rubric
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {rubrics.map((rubric) => {
          const program = getProgram(rubric.programId);
          return (
            <button
              key={rubric.id}
              type="button"
              onClick={() => onOpen(rubric)}
              className="w-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full hover:ring-primary/30 hover:ring-2 transition-all cursor-pointer">
                <CardContent className="p-[18px]">
                  <div className="flex items-start gap-3 mb-2.5">
                    <span className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 mt-0.5">
                      <ListChecks className="size-[18px]" aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className="text-base font-bold text-text-primary">{rubric.name}</span>
                        <ScoringStatusBadge status={rubric.status} />
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {program?.name ?? rubric.programId} · thang 0–{rubric.scaleMax}
                      </div>
                    </div>
                  </div>
                  <p className="text-[12.5px] text-text-secondary leading-snug mb-3">{rubric.desc}</p>
                  <div className="flex gap-3.5 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Layers className="size-3.5" aria-hidden />
                      {rubric.criteriaCount} tiêu chí
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Link2 className="size-3.5" aria-hidden />
                      {rubric.usedBy} câu dùng
                    </span>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
