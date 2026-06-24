"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { QB_RUBRICS } from "../../mock/question-bank.mock";

export interface OpenPromptEditorProps {
  type: "writing" | "speaking";
  rubricId?: string | null;
  minWords?: number;
  suggestedTime?: number;
  prepTime?: number;
  onChange: (patch: {
    rubricId?: string | null;
    minWords?: number;
    suggestedTime?: number;
    prepTime?: number;
  }) => void;
  className?: string;
}

const INFO_TEXT: Record<"writing" | "speaking", string> = {
  writing:
    "Câu hỏi Writing được chấm bằng rubric. Hãy chọn thang điểm và thời gian gợi ý.",
  speaking:
    "Câu hỏi Speaking cần thời gian chuẩn bị và rubric chấm nói.",
};

export function OpenPromptEditor({
  type,
  rubricId,
  minWords,
  suggestedTime,
  prepTime,
  onChange,
  className,
}: OpenPromptEditorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Cấu hình chấm
      </p>

      {/* Info callout */}
      <div className="flex items-start gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3">
        <Info
          className="mt-0.5 size-4 shrink-0 text-purple-600"
          aria-hidden
        />
        <span className="text-xs leading-relaxed text-purple-700">
          {INFO_TEXT[type]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Rubric select — full width */}
        <div className="col-span-2 space-y-1">
          <Label
            htmlFor="open-prompt-rubric"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Rubric chấm điểm
          </Label>
          <Select
            value={rubricId ?? ""}
            onValueChange={(value) => onChange({ rubricId: value })}
          >
            <SelectTrigger id="open-prompt-rubric" className="h-9 text-sm">
              <SelectValue placeholder="— Chọn rubric —" />
            </SelectTrigger>
            <SelectContent>
              {QB_RUBRICS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!rubricId && (
            <p className="text-[11px] text-amber-600">Chưa chọn rubric.</p>
          )}
        </div>

        {/* suggestedTime — both types */}
        <div className="space-y-1">
          <Label
            htmlFor="open-prompt-suggested-time"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Thời gian gợi ý (phút)
          </Label>
          <Input
            id="open-prompt-suggested-time"
            type="number"
            min={0}
            value={suggestedTime ?? 0}
            onChange={(e) => onChange({ suggestedTime: Number(e.target.value) })}
            className="h-9 text-sm"
          />
        </div>

        {/* writing: minWords | speaking: prepTime */}
        {type === "writing" ? (
          <div className="space-y-1">
            <Label
              htmlFor="open-prompt-min-words"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Số từ tối thiểu
            </Label>
            <Input
              id="open-prompt-min-words"
              type="number"
              min={0}
              value={minWords ?? 0}
              onChange={(e) => onChange({ minWords: Number(e.target.value) })}
              className="h-9 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Label
              htmlFor="open-prompt-prep-time"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Thời gian chuẩn bị (phút)
            </Label>
            <Input
              id="open-prompt-prep-time"
              type="number"
              min={0}
              value={prepTime ?? 0}
              onChange={(e) => onChange({ prepTime: Number(e.target.value) })}
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
