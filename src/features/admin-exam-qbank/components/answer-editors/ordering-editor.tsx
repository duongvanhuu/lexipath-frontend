"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { OrderItem } from "../../types/question-bank.types";

export interface OrderingEditorProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  className?: string;
}

export function OrderingEditor({
  items,
  onChange,
  className,
}: OrderingEditorProps) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next.map((it, idx) => ({ ...it, correctPos: idx + 1 })));
  }

  function setText(i: number, text: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, text } : it)));
  }

  function add() {
    onChange([...items, { text: "", correctPos: items.length + 1 }]);
  }

  function remove(i: number) {
    onChange(
      items
        .filter((_, idx) => idx !== i)
        .map((it, idx) => ({ ...it, correctPos: idx + 1 })),
    );
  }

  const canDelete = items.length > 2;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Thứ tự đúng
        </p>
        <span className="text-[11px] text-muted-foreground">
          Thứ tự hiển thị = thứ tự đúng
        </span>
      </div>

      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-xl border border-border bg-card p-2"
        >
          {/* Position badge */}
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-100 text-[12px] font-bold text-amber-700">
            {i + 1}
          </span>

          <Input
            value={it.text}
            onChange={(e) => setText(i, e.target.value)}
            placeholder={`Mục thứ ${i + 1}`}
            className="h-8 text-sm"
          />

          {/* Move up / down */}
          <div className="flex shrink-0 flex-col gap-0.5">
            <button
              type="button"
              aria-label="Di chuyển lên"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="flex size-4 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
            >
              <ChevronUp className="size-3" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Di chuyển xuống"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="flex size-4 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
            >
              <ChevronDown className="size-3" aria-hidden />
            </button>
          </div>

          {/* Delete */}
          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Xóa mục"
              onClick={() => remove(i)}
              className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          ) : (
            <span className="size-8 shrink-0" aria-hidden />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        Thêm mục
      </button>
    </div>
  );
}
