"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { QuestionAnswerKey, AnswerOption } from "./types";

export interface AnswerKeyEditorProps {
  value: QuestionAnswerKey;
  onChange: (key: QuestionAnswerKey) => void;
  maxOptions?: number;
  className?: string;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

function MultipleChoiceEditor({
  value,
  onChange,
  maxOptions,
  isMulti,
}: {
  value: QuestionAnswerKey;
  onChange: (key: QuestionAnswerKey) => void;
  maxOptions: number;
  isMulti: boolean;
}) {
  const options = value.options ?? [];

  function updateOption(id: string, patch: Partial<AnswerOption>) {
    onChange({
      ...value,
      options: options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  }

  function removeOption(id: string) {
    onChange({ ...value, options: options.filter((o) => o.id !== id) });
  }

  function addOption() {
    if (options.length >= maxOptions) return;
    const label = OPTION_LABELS[options.length] ?? String(options.length + 1);
    const newOption: AnswerOption = {
      id: crypto.randomUUID(),
      label,
      text: "",
      isCorrect: false,
    };
    onChange({ ...value, options: [...options, newOption] });
  }

  function handleCorrectToggle(id: string, checked: boolean) {
    if (isMulti) {
      updateOption(id, { isCorrect: checked });
    } else {
      onChange({
        ...value,
        options: options.map((o) => ({ ...o, isCorrect: o.id === id })),
      });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">
        {isMulti ? "Chọn các đáp án đúng" : "Chọn đáp án đúng"}
      </p>
      {isMulti ? (
        options.map((option) => (
          <div
            key={option.id}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2"
          >
            <span className="flex size-6 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
              {option.label}
            </span>
            <Input
              value={option.text}
              onChange={(e) => updateOption(option.id, { text: e.target.value })}
              placeholder={`Đáp án ${option.label}...`}
              className="h-8 text-sm"
              aria-label={`Nội dung đáp án ${option.label}`}
            />
            <Checkbox
              checked={option.isCorrect}
              onCheckedChange={(v) => handleCorrectToggle(option.id, !!v)}
              aria-label={`Đáp án ${option.label} là đúng`}
            />
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeOption(option.id)}
              aria-label={`Xóa đáp án ${option.label}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))
      ) : (
        <RadioGroup
          value={options.find((o) => o.isCorrect)?.id ?? ""}
          onValueChange={(v) => handleCorrectToggle(v, true)}
        >
          {options.map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2"
            >
              <span className="flex size-6 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
                {option.label}
              </span>
              <Input
                value={option.text}
                onChange={(e) =>
                  updateOption(option.id, { text: e.target.value })
                }
                placeholder={`Đáp án ${option.label}...`}
                className="h-8 text-sm"
                aria-label={`Nội dung đáp án ${option.label}`}
              />
              <RadioGroupItem
                value={option.id}
                aria-label={`Đáp án ${option.label} là đúng`}
              />
              <Button
                variant="ghost"
                size="sm"
                className="size-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeOption(option.id)}
                aria-label={`Xóa đáp án ${option.label}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      )}
      {options.length < maxOptions ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-1 w-full"
          onClick={addOption}
        >
          <Plus className="size-3.5" />
          Thêm đáp án
        </Button>
      ) : null}
    </div>
  );
}

function TextAnswerEditor({
  value,
  onChange,
}: {
  value: QuestionAnswerKey;
  onChange: (key: QuestionAnswerKey) => void;
}) {
  const accepted = value.acceptedAnswers ?? [];

  function updateAccepted(idx: number, text: string) {
    const next = [...accepted];
    next[idx] = text;
    onChange({ ...value, acceptedAnswers: next });
  }

  function addAccepted() {
    onChange({ ...value, acceptedAnswers: [...accepted, ""] });
  }

  function removeAccepted(idx: number) {
    onChange({
      ...value,
      acceptedAnswers: accepted.filter((_, i) => i !== idx),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="correct-answer">Đáp án chính</Label>
        <Textarea
          id="correct-answer"
          value={value.correctAnswer ?? ""}
          onChange={(e) =>
            onChange({ ...value, correctAnswer: e.target.value })
          }
          placeholder="Nhập đáp án chính xác..."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          Đáp án chấp nhận thêm
        </p>
        {accepted.map((ans, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_auto] items-center gap-2"
          >
            <Input
              value={ans}
              onChange={(e) => updateAccepted(idx, e.target.value)}
              placeholder={`Đáp án thay thế ${idx + 1}...`}
              className="h-8 text-sm"
              aria-label={`Đáp án thay thế ${idx + 1}`}
            />
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeAccepted(idx)}
              aria-label={`Xóa đáp án thay thế ${idx + 1}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1 w-full"
          onClick={addAccepted}
        >
          <Plus className="size-3.5" />
          Thêm đáp án thay thế
        </Button>
      </div>
    </div>
  );
}

function AnswerKeyEditor({
  value,
  onChange,
  maxOptions = 6,
  className,
}: AnswerKeyEditorProps) {
  const isChoice =
    value.type === "single_choice" || value.type === "multiple_choice";
  const isMulti = value.type === "multiple_choice";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm font-medium">Đáp án</p>
      <Separator />
      {isChoice ? (
        <MultipleChoiceEditor
          value={value}
          onChange={onChange}
          maxOptions={maxOptions}
          isMulti={isMulti}
        />
      ) : (
        <TextAnswerEditor value={value} onChange={onChange} />
      )}
    </div>
  );
}

export { AnswerKeyEditor };
