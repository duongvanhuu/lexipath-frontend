"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { PassageParagraph } from "./types";

export interface PassageParagraphEditorProps {
  paragraphs: PassageParagraph[];
  onChange: (paragraphs: PassageParagraph[]) => void;
  onAddParagraph: () => void;
  onRemoveParagraph: (id: string) => void;
  className?: string;
}

function ParagraphRow({
  paragraph,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  paragraph: PassageParagraph;
  index: number;
  total: number;
  onChange: (updated: PassageParagraph) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-1 pt-1">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0 text-muted-foreground"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          aria-label="Di chuyển lên"
        >
          <ArrowUp className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0 text-muted-foreground"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          aria-label="Di chuyển xuống"
        >
          <ArrowDown className="size-3" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`para-text-${paragraph.id}`}
            className="text-xs"
          >
            Nội dung đoạn văn
          </Label>
          <Textarea
            id={`para-text-${paragraph.id}`}
            value={paragraph.text}
            onChange={(e) =>
              onChange({ ...paragraph, text: e.target.value })
            }
            placeholder="Nhập nội dung đoạn văn..."
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`para-notes-${paragraph.id}`}
            className="text-xs"
          >
            Ghi chú (tùy chọn)
          </Label>
          <Input
            id={`para-notes-${paragraph.id}`}
            value={paragraph.notes ?? ""}
            onChange={(e) => {
              const notes = e.target.value;
              if (notes) {
                onChange({ ...paragraph, notes });
              } else {
                const { notes: _removed, ...rest } = paragraph;
                onChange(rest);
              }
            }}
            placeholder="Chú thích, từ vựng khó..."
            className="h-8 text-sm"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-7 size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(paragraph.id)}
        aria-label={`Xóa đoạn văn ${index + 1}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function PassageParagraphEditor({
  paragraphs,
  onChange,
  onAddParagraph,
  onRemoveParagraph,
  className,
}: PassageParagraphEditorProps) {
  function handleUpdate(updated: PassageParagraph) {
    onChange(paragraphs.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...paragraphs];
    const a = next[index - 1];
    const b = next[index];
    if (!a || !b) return;
    next[index - 1] = b;
    next[index] = a;
    onChange(next.map((p, i) => ({ ...p, order: i + 1 })));
  }

  function handleMoveDown(index: number) {
    if (index === paragraphs.length - 1) return;
    const next = [...paragraphs];
    const a = next[index];
    const b = next[index + 1];
    if (!a || !b) return;
    next[index] = b;
    next[index + 1] = a;
    onChange(next.map((p, i) => ({ ...p, order: i + 1 })));
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {paragraphs.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Chưa có đoạn văn nào. Nhấn thêm để bắt đầu nhập bài đọc.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {paragraphs.map((para, idx) => (
            <React.Fragment key={para.id}>
              {idx > 0 ? <Separator /> : null}
              <ParagraphRow
                paragraph={para}
                index={idx}
                total={paragraphs.length}
                onChange={handleUpdate}
                onRemove={onRemoveParagraph}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            </React.Fragment>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        onClick={onAddParagraph}
        className="w-full"
      >
        <Plus className="size-4" />
        Thêm đoạn văn
      </Button>
    </div>
  );
}

export { PassageParagraphEditor };
