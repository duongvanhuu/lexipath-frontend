"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import type { QuestionBlank } from "../../types/question-bank.types";

export interface FillBlankEditorProps {
  stem: string;
  blanks: QuestionBlank[];
  onChange: (blanks: QuestionBlank[]) => void;
  className?: string;
}

/** Extract all {{n}} pos numbers from the stem in order of appearance. */
function detectBlankPositions(stem: string): number[] {
  const matches = stem.matchAll(/\{\{(\d+)\}\}/g);
  const seen = new Set<number>();
  const result: number[] = [];
  for (const m of matches) {
    const pos = Number(m[1]);
    if (!seen.has(pos)) {
      seen.add(pos);
      result.push(pos);
    }
  }
  return result;
}

export function FillBlankEditor({
  stem,
  blanks,
  onChange,
  className,
}: FillBlankEditorProps) {
  const detectedPositions = detectBlankPositions(stem);
  const hasSlots = detectedPositions.length > 0;

  /** Get the current blank for a given pos, or a default if not yet in blanks. */
  function getBlank(pos: number): QuestionBlank {
    return (
      blanks.find((b) => b.pos === pos) ?? {
        pos,
        accepted: [],
        caseSensitive: false,
      }
    );
  }

  /** Upsert a blank by pos and call onChange. */
  function updateBlank(pos: number, patch: Partial<Omit<QuestionBlank, "pos">>) {
    const existing = blanks.find((b) => b.pos === pos);
    if (existing) {
      onChange(
        blanks.map((b) => (b.pos === pos ? { ...b, ...patch } : b)),
      );
    } else {
      onChange([...blanks, { pos, accepted: [], caseSensitive: false, ...patch }]);
    }
  }

  function addAccepted(pos: number) {
    const blank = getBlank(pos);
    updateBlank(pos, { accepted: [...blank.accepted, ""] });
  }

  function setAccepted(pos: number, index: number, value: string) {
    const blank = getBlank(pos);
    const next = blank.accepted.map((a, i) => (i === index ? value : a));
    updateBlank(pos, { accepted: next });
  }

  function removeAccepted(pos: number, index: number) {
    const blank = getBlank(pos);
    updateBlank(pos, { accepted: blank.accepted.filter((_, i) => i !== index) });
  }

  function setCaseSensitive(pos: number, checked: boolean) {
    updateBlank(pos, { caseSensitive: checked });
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Helper text */}
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Dùng cú pháp{" "}
        <code className="rounded bg-muted px-1 py-0.5">{"{{1}}"}</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">{"{{2}}"}</code>
        {" "}trong đề bài để đánh dấu chỗ trống.
      </p>

      {/* Empty stem state */}
      {!hasSlots && (
        <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Đề bài chưa có chỗ trống. Dùng{" "}
          <code className="rounded bg-muted px-1 py-0.5">{"{{1}}"}</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">{"{{2}}"}</code>
          … trong đề bài để thêm chỗ trống.
        </p>
      )}

      {/* Blank slots */}
      {detectedPositions.map((pos) => {
        const blank = getBlank(pos);
        const checkboxId = `fill-case-${pos}`;

        return (
          <div
            key={pos}
            className="rounded-xl border border-border bg-muted/40 p-4 space-y-3"
          >
            {/* Section label + case-sensitive toggle */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">
                Chỗ trống{" "}
                <code className="rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-bold text-purple-700">
                  {`{{${pos}}}`}
                </code>
              </span>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={checkboxId}
                  checked={blank.caseSensitive}
                  onCheckedChange={(checked) =>
                    setCaseSensitive(pos, checked === true)
                  }
                />
                <Label
                  htmlFor={checkboxId}
                  className="cursor-pointer text-[11px] text-muted-foreground"
                >
                  Phân biệt hoa/thường
                </Label>
              </div>
            </div>

            {/* Accepted answers */}
            <div className="space-y-2">
              {blank.accepted.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={answer}
                    onChange={(e) => setAccepted(pos, idx, e.target.value)}
                    placeholder="Đáp án chấp nhận…"
                    aria-label={`Đáp án chấp nhận ${idx + 1} cho chỗ trống ${pos}`}
                    className="h-8 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Xóa đáp án"
                    onClick={() => removeAccepted(pos, idx)}
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              ))}

              {blank.accepted.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Chưa có đáp án chấp nhận.
                </p>
              )}
            </div>

            {/* Add accepted answer button */}
            <button
              type="button"
              onClick={() => addAccepted(pos)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" aria-hidden />
              Thêm đáp án chấp nhận
            </button>
          </div>
        );
      })}
    </div>
  );
}
