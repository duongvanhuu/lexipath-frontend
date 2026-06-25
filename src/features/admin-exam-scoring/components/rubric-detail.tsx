"use client";

import * as React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/shared";
import type { Rubric, RubricCriterion, ScoringProgram } from "../types/scoring.types";
import { ScoringStatusBadge } from "./scoring-status-badge";
import { RubricCriteriaEditor } from "./rubric-criteria-editor";
import { RubricPreview } from "./rubric-preview";

interface RubricDetailProps {
  rubric: Rubric;
  initialCriteria: RubricCriterion[];
  programs: ScoringProgram[];
  onBack: () => void;
}

export function RubricDetail({ rubric, initialCriteria, programs, onBack }: RubricDetailProps) {
  const [criteria, setCriteria] = React.useState(initialCriteria);
  const program = programs.find((p) => p.id === rubric.programId);

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-3.5" />
          Rubric
        </Button>
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          <span className="text-lg font-bold text-text-primary">{rubric.name}</span>
          <ScoringStatusBadge status={rubric.status} />
          {program && (
            <Badge variant="outline" className="text-[11px]" style={{ color: program.color }}>
              {program.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-[11px]">
            thang 0–{rubric.scaleMax}
          </Badge>
        </div>
        <Button onClick={() => toast.success("Đã lưu rubric ✓")} className="gap-1.5 shrink-0">
          <Check className="size-4" />
          Lưu rubric
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-wrap gap-5 items-start">
        <Card className="flex-1 min-w-0 basis-[380px]">
          <CardContent className="p-5">
            <RubricCriteriaEditor
              criteria={criteria}
              scaleMax={rubric.scaleMax}
              onChange={setCriteria}
            />
          </CardContent>
        </Card>
        <div className="flex-1 min-w-0 basis-[300px]">
          <RubricPreview key={rubric.id} rubric={rubric} criteria={criteria} />
        </div>
      </div>
    </div>
  );
}
