"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ScoreConversion, ScoreScale } from "../types/scoring.types";
import { ScoringSectionLabel } from "./scoring-section-label";

interface ConversionEditorProps {
  scale: ScoreScale;
  conversions: ScoreConversion[];
  onChange: (conversions: ScoreConversion[]) => void;
}

export function ConversionEditor({ scale, conversions, onChange }: ConversionEditorProps) {
  const update = (
    index: number,
    field: keyof Omit<ScoreConversion, "id">,
    value: number,
  ) => {
    onChange(conversions.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const add = () =>
    onChange([
      { id: `cv-${Date.now()}`, rawMin: 0, rawMax: 0, scaled: 0 },
      ...conversions,
    ]);

  const remove = (index: number) =>
    onChange(conversions.filter((_, i) => i !== index));

  return (
    <div>
      <ScoringSectionLabel
        right={
          <Button variant="ghost" size="sm" onClick={add} className="h-7 gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Thêm khoảng
          </Button>
        }
      >
        Bảng quy đổi điểm thô → điểm thang
      </ScoringSectionLabel>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-3 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wide">
                Điểm thô từ
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wide">
                Đến
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wide">
                Điểm thang
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {conversions.map((conv, i) => (
              <tr key={conv.id} className="border-t border-border">
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    className="h-8 w-24 text-sm"
                    value={conv.rawMin}
                    onChange={(e) => update(i, "rawMin", Number(e.target.value))}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    className="h-8 w-24 text-sm"
                    value={conv.rawMax}
                    onChange={(e) => update(i, "rawMax", Number(e.target.value))}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    step={scale.step}
                    className="h-8 w-24 text-sm font-bold text-primary"
                    value={conv.scaled}
                    onChange={(e) => update(i, "scaled", Number(e.target.value))}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-text-muted hover:text-destructive"
                    aria-label="Xóa khoảng"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] text-text-muted">
        Phạm vi điểm thô: {scale.minRaw}–{scale.maxRaw} · điểm thang: {scale.minScaled}–
        {scale.maxScaled} (bước {scale.step})
      </p>
    </div>
  );
}
