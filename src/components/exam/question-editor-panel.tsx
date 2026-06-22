"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { ExamQuestion, QuestionType, QuestionStatus } from "./types";

export interface QuestionEditorPanelProps {
  question: Partial<ExamQuestion>;
  onChange: (q: Partial<ExamQuestion>) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "single_choice", label: "Trắc nghiệm 1 đáp án" },
  { value: "multiple_choice", label: "Trắc nghiệm nhiều đáp án" },
  { value: "fill_blank", label: "Điền vào chỗ trống" },
  { value: "listening", label: "Nghe hiểu" },
  { value: "reading", label: "Đọc hiểu" },
  { value: "writing", label: "Viết" },
  { value: "speaking", label: "Nói" },
];

const QUESTION_STATUS_OPTIONS: { value: QuestionStatus; label: string }[] = [
  { value: "draft", label: "Bản nháp" },
  { value: "review", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "archived", label: "Lưu trữ" },
];

function QuestionEditorPanel({
  question,
  onChange,
  onSave,
  onCancel,
  isSubmitting,
  className,
}: QuestionEditorPanelProps) {
  const tagsValue = question.tags?.join(", ") ?? "";

  function handleTagsChange(raw: string) {
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onChange({ ...question, tags });
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-type">Loại câu hỏi</Label>
          <Select
            value={question.type ?? ""}
            onValueChange={(v) =>
              onChange({ ...question, type: v as QuestionType })
            }
          >
            <SelectTrigger id="q-type" aria-label="Loại câu hỏi">
              <SelectValue placeholder="Chọn loại..." />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-status">Trạng thái</Label>
          <Select
            value={question.status ?? ""}
            onValueChange={(v) =>
              onChange({ ...question, status: v as QuestionStatus })
            }
          >
            <SelectTrigger id="q-status" aria-label="Trạng thái">
              <SelectValue placeholder="Chọn trạng thái..." />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="q-prompt">Nội dung câu hỏi</Label>
        <Textarea
          id="q-prompt"
          value={question.prompt ?? ""}
          onChange={(e) => onChange({ ...question, prompt: e.target.value })}
          placeholder="Nhập nội dung câu hỏi..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-points">Điểm</Label>
          <Input
            id="q-points"
            type="number"
            min={0}
            step={0.5}
            value={question.points ?? ""}
            onChange={(e) => {
              if (e.target.value) {
                onChange({ ...question, points: parseFloat(e.target.value) });
              } else {
                const { points: _removed, ...rest } = question;
                onChange(rest);
              }
            }}
            placeholder="1"
            className="w-24"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-tags">Tags (phân cách bằng dấu phẩy)</Label>
          <Input
            id="q-tags"
            value={tagsValue}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="grammar, vocabulary, toeic..."
          />
        </div>
      </div>

      {onSave || onCancel ? (
        <>
          <Separator />
          <div className="flex items-center justify-end gap-2">
            {onCancel ? (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            ) : null}
            {onSave ? (
              <Button onClick={onSave} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

export { QuestionEditorPanel };
