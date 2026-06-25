"use client";

import * as React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import type { RubricCriterion, CriterionLevel } from "../types/scoring.types";
import { ScoringSectionLabel } from "./scoring-section-label";

interface RubricCriteriaEditorProps {
  criteria: RubricCriterion[];
  scaleMax: number;
  onChange: (criteria: RubricCriterion[]) => void;
}

export function RubricCriteriaEditor({ criteria, scaleMax, onChange }: RubricCriteriaEditorProps) {
  const mutate = (fn: (draft: RubricCriterion[]) => void) => {
    const next = structuredClone(criteria);
    fn(next);
    onChange(next);
  };

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const weightOk = totalWeight === 100;

  const addCriterion = () =>
    mutate((d) =>
      d.push({
        id: `rc-${Date.now()}`,
        name: "Tiêu chí mới",
        weight: 0,
        levels: [{ band: String(scaleMax), desc: "" }],
      }),
    );

  const removeCriterion = (ci: number) => mutate((d) => d.splice(ci, 1));

  const updateCriterionName = (ci: number, name: string) =>
    mutate((d) => { const c = d[ci]; if (c) c.name = name; });

  const updateCriterionWeight = (ci: number, weight: number) =>
    mutate((d) => { const c = d[ci]; if (c) c.weight = weight; });

  const addLevel = (ci: number) =>
    mutate((d) => { d[ci]?.levels.push({ band: "", desc: "" }); });

  const removeLevel = (ci: number, li: number) =>
    mutate((d) => { d[ci]?.levels.splice(li, 1); });

  const updateLevel = (ci: number, li: number, field: keyof CriterionLevel, value: string) =>
    mutate((d) => {
      const lv = d[ci]?.levels[li];
      if (lv) (lv as unknown as Record<string, string>)[field] = value;
    });

  return (
    <div>
      <ScoringSectionLabel
        right={
          <span
            className={cn(
              "text-[11px] font-semibold",
              weightOk ? "text-success-foreground" : "text-warning-foreground",
            )}
          >
            Tổng trọng số: {totalWeight}%
          </span>
        }
      >
        Tiêu chí chấm
      </ScoringSectionLabel>

      <div className="flex flex-col gap-3.5">
        {criteria.map((criterion, ci) => (
          <div key={criterion.id} className="rounded-xl border border-border overflow-hidden">
            {/* Criterion header */}
            <div className="flex items-center gap-2.5 px-3.5 py-3 bg-muted/50 border-b border-border">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 text-xs font-bold">
                {ci + 1}
              </span>
              <Input
                className="h-8 max-w-xs font-semibold text-sm"
                value={criterion.name}
                onChange={(e) => updateCriterionName(ci, e.target.value)}
              />
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-text-muted">Trọng số</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-8 w-16 text-sm text-center"
                  value={criterion.weight}
                  onChange={(e) => updateCriterionWeight(ci, Number(e.target.value))}
                />
                <span className="text-xs text-text-muted">%</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-text-muted hover:text-destructive"
                aria-label={`Xóa tiêu chí ${criterion.name}`}
                onClick={() => removeCriterion(ci)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            {/* Levels */}
            <div className="px-3.5 py-3 flex flex-col gap-2">
              {criterion.levels.map((lv, li) => (
                <div key={li} className="flex items-start gap-2.5">
                  <Input
                    className="h-9 w-14 text-center text-sm font-bold text-violet-700 shrink-0"
                    value={lv.band}
                    onChange={(e) => updateLevel(ci, li, "band", e.target.value)}
                    aria-label="Mức band"
                  />
                  <Textarea
                    className="min-h-9 resize-none text-sm leading-snug"
                    value={lv.desc}
                    rows={2}
                    onChange={(e) => updateLevel(ci, li, "desc", e.target.value)}
                    placeholder="Mô tả mức điểm…"
                  />
                  {criterion.levels.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0 text-text-muted"
                      aria-label="Xóa mức"
                      onClick={() => removeLevel(ci, li)}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLevel(ci)}
                className="self-start inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity py-0.5"
              >
                <Plus className="size-3.5" />
                Thêm mức điểm
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCriterion}
        className="mt-3.5 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-xl bg-card text-text-secondary text-sm font-semibold cursor-pointer hover:bg-muted/40 transition-colors"
      >
        <Plus className="size-4" />
        Thêm tiêu chí
      </button>
    </div>
  );
}
