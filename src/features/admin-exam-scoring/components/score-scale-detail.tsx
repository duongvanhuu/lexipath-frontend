"use client";

import * as React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/shared";
import type { ScoreScale, ScoreConversion, RoundingRule, ScoringProgram } from "../types/scoring.types";
import { ScoringStatusBadge } from "./scoring-status-badge";
import { ConversionEditor } from "./conversion-editor";
import { RoundingRuleEditor } from "./rounding-rule-editor";
import { ScorePreview } from "./score-preview";

const SCALE_TYPE_LABELS: Record<string, string> = {
  band: "Band score",
  total: "Điểm tổng",
  rubric: "Rubric",
};

interface ScoreScaleDetailProps {
  scale: ScoreScale;
  initialConversions: ScoreConversion[];
  roundingRules: RoundingRule[];
  programs: ScoringProgram[];
  onBack: () => void;
}

export function ScoreScaleDetail({
  scale: initialScale,
  initialConversions,
  roundingRules,
  programs,
  onBack,
}: ScoreScaleDetailProps) {
  const [scale, setScale] = React.useState(initialScale);
  const [conversions, setConversions] = React.useState(initialConversions);

  const program = programs.find((p) => p.id === scale.programId);

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-3.5" />
          Thang điểm
        </Button>
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          <span className="text-lg font-bold text-text-primary">{scale.name}</span>
          <ScoringStatusBadge status={scale.status} />
          {program && (
            <Badge variant="outline" className="text-[11px]" style={{ color: program.color }}>
              {program.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-[11px]">
            {SCALE_TYPE_LABELS[scale.type] ?? scale.type}
          </Badge>
        </div>
        <Button onClick={() => toast.success("Đã lưu thang điểm ✓")} className="gap-1.5 shrink-0">
          <Check className="size-4" />
          Lưu thang điểm
        </Button>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-5">
        <Card>
          <CardContent className="p-5">
            <ConversionEditor scale={scale} conversions={conversions} onChange={setConversions} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <RoundingRuleEditor
              rules={roundingRules}
              activeId={scale.roundingRuleId}
              onPick={(id) => setScale((s) => ({ ...s, roundingRuleId: id }))}
            />
          </CardContent>
        </Card>
        <ScorePreview scale={scale} conversions={conversions} roundingRules={roundingRules} />
      </div>
    </div>
  );
}
