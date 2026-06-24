"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import type { AnswerKey } from "../../types/question-bank.types";

export interface AnswerKeyEditorProps {
  answerKeys: AnswerKey[];
  maxWords?: number;
  onChange: (answerKeys: AnswerKey[]) => void;
  onMaxWordsChange?: (maxWords: number | undefined) => void;
  className?: string;
}

export function AnswerKeyEditor({
  answerKeys,
  maxWords,
  onChange,
  onMaxWordsChange,
  className,
}: AnswerKeyEditorProps) {
  function set(index: number, value: string) {
    onChange(answerKeys.map((a, i) => (i === index ? { value } : a)));
  }

  function add() {
    onChange([...answerKeys, { value: "" }]);
  }

  function remove(index: number) {
    onChange(answerKeys.filter((_, i) => i !== index));
  }

  function handleMaxWordsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!onMaxWordsChange) return;
    const raw = e.target.value;
    if (raw === "") {
      onMaxWordsChange(undefined);
    } else {
      const num = Number(raw);
      onMaxWordsChange(isNaN(num) ? undefined : num);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Section label */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Đáp án chấp nhận
      </p>

      {/* Empty state */}
      {answerKeys.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Chưa có đáp án chấp nhận.
        </p>
      )}

      {/* Answer variants list */}
      {/* Note: using index as key is acceptable here because AnswerKey has no id field
          and this list is small (typically 1-5 entries). */}
      {answerKeys.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={a.value}
            onChange={(e) => set(i, e.target.value)}
            placeholder="Đáp án đúng…"
            className="h-8 text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Xóa đáp án"
            onClick={() => remove(i)}
            className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
        </div>
      ))}

      {/* Add answer button */}
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        Thêm đáp án
      </button>

      {/* Max words input — only rendered when onMaxWordsChange is provided */}
      {onMaxWordsChange !== undefined && (
        <div className="pt-1 max-w-[200px] space-y-1">
          <Label
            htmlFor="answer-key-max-words"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Số từ tối đa
          </Label>
          <Input
            id="answer-key-max-words"
            type="number"
            min={0}
            value={maxWords ?? ""}
            onChange={handleMaxWordsChange}
            className="h-8 text-sm"
          />
        </div>
      )}
    </div>
  );
}
