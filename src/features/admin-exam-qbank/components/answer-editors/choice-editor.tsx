"use client";

import * as React from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { QuestionChoice } from "../../types/question-bank.types";

const CHOICE_KEYS = ["A", "B", "C", "D", "E", "F"] as const;

export interface ChoiceEditorProps {
  choices: QuestionChoice[];
  multi?: boolean;
  onChange: (choices: QuestionChoice[]) => void;
  className?: string;
}

export function ChoiceEditor({
  choices,
  multi = false,
  onChange,
  className,
}: ChoiceEditorProps) {
  function set(i: number, patch: Partial<QuestionChoice>) {
    onChange(choices.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function setCorrect(i: number) {
    if (multi) {
      set(i, { correct: !choices[i]!.correct });
    } else {
      onChange(choices.map((c, idx) => ({ ...c, correct: idx === i })));
    }
  }

  function addChoice() {
    if (choices.length >= 6) return;
    const nextKey = CHOICE_KEYS[choices.length];
    if (!nextKey) return;
    onChange([...choices, { key: nextKey, text: "", correct: false }]);
  }

  function deleteChoice(i: number) {
    if (choices.length <= 2) return;
    onChange(
      choices
        .filter((_, idx) => idx !== i)
        .map((c, idx) => {
          const newKey = CHOICE_KEYS[idx];
          return { ...c, key: newKey ?? c.key };
        }),
    );
  }

  const canDelete = choices.length > 2;
  const canAdd = choices.length < 6;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Lựa chọn
        </p>
        <span className="text-[11px] text-muted-foreground">
          {multi ? "Tích các đáp án đúng" : "Chọn 1 đáp án đúng"}
        </span>
      </div>

      {choices.map((c, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 rounded-xl border p-2.5 transition-colors",
            c.correct ? "border-primary bg-primary/5" : "border-border bg-card",
          )}
        >
          {/* Correct toggle — radio semantics for mcq, checkbox semantics for multi */}
          <button
            type="button"
            aria-label={multi ? "Chọn đáp án đúng" : "Đáp án đúng"}
            aria-pressed={c.correct}
            onClick={() => setCorrect(i)}
            className={cn(
              "flex size-6 shrink-0 items-center justify-center border-2 transition-colors",
              multi ? "rounded-md" : "rounded-full",
              c.correct
                ? "border-green-500 bg-green-500"
                : "border-muted-foreground/40 bg-transparent hover:border-muted-foreground",
            )}
          >
            {c.correct && <Check className="size-3.5 text-white" aria-hidden />}
          </button>

          {/* Key label */}
          <span className="w-5 shrink-0 text-sm font-bold text-muted-foreground">
            {c.key}
          </span>

          {/* Choice text */}
          <Input
            value={c.text}
            onChange={(e) => set(i, { text: e.target.value })}
            placeholder={`Nội dung lựa chọn ${c.key}`}
            className="h-8 text-sm"
          />

          {/* Delete button — hidden when only 2 choices remain */}
          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Xóa lựa chọn"
              onClick={() => deleteChoice(i)}
              className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          ) : (
            /* Spacer so row widths stay consistent */
            <span className="size-8 shrink-0" aria-hidden />
          )}
        </div>
      ))}

      {/* Add choice button — hidden at max 6 */}
      {canAdd && (
        <button
          type="button"
          onClick={addChoice}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-3.5" aria-hidden />
          Thêm lựa chọn
        </button>
      )}
    </div>
  );
}
