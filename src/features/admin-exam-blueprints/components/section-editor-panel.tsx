"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlueprintSection, ScoreType } from "../types/blueprints.types";

const SKILLS = [
  "listening",
  "reading",
  "writing",
  "speaking",
  "vocabulary",
  "grammar",
  "language",
] as const;

const SCORE_TYPES: { value: ScoreType; label: string }[] = [
  { value: "auto", label: "Chấm tự động" },
  { value: "rubric", label: "Rubric" },
  { value: "band", label: "Band score" },
  { value: "total", label: "Điểm tổng" },
];

interface SectionEditorPanelProps {
  section: BlueprintSection;
  onUpdate: (section: BlueprintSection) => void;
}

export function SectionEditorPanel({ section, onUpdate }: SectionEditorPanelProps) {
  function upd<K extends keyof BlueprintSection>(k: K, v: BlueprintSection[K]) {
    onUpdate({ ...section, [k]: v });
  }

  return (
    <div className="rounded-xl border border-border bg-surface-muted p-4 mb-4">
      <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-3">
        Chi tiết phần
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="sec-name">
            Tên phần <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sec-name"
            value={section.name}
            onChange={(e) => upd("name", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sec-skill">Kỹ năng</Label>
          <Select
            value={section.skill || ""}
            onValueChange={(v) => upd("skill", v)}
          >
            <SelectTrigger id="sec-skill" aria-label="Kỹ năng">
              <SelectValue placeholder="-- Chọn kỹ năng --" />
            </SelectTrigger>
            <SelectContent>
              {SKILLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sec-score">Phương pháp chấm</Label>
          <Select
            value={section.scoreType || "auto"}
            onValueChange={(v) => upd("scoreType", v as ScoreType)}
          >
            <SelectTrigger id="sec-score" aria-label="Phương pháp chấm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCORE_TYPES.map((st) => (
                <SelectItem key={st.value} value={st.value}>
                  {st.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sec-dur">Thời gian (phút)</Label>
          <Input
            id="sec-dur"
            type="number"
            min={0}
            value={section.durationMin || 0}
            onChange={(e) => upd("durationMin", parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sec-qtotal">Tổng câu hỏi</Label>
          <Input
            id="sec-qtotal"
            type="number"
            min={0}
            value={section.questionTotal || 0}
            onChange={(e) => upd("questionTotal", parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sec-maxscore">Điểm tối đa</Label>
          <Input
            id="sec-maxscore"
            type="number"
            min={0}
            value={section.maxScore || 0}
            onChange={(e) => upd("maxScore", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
}
