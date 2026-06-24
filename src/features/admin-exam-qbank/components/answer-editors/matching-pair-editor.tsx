"use client";

import * as React from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { MatchingPair } from "../../types/question-bank.types";

export interface MatchingPairEditorProps {
  pairs: MatchingPair[];
  onChange: (pairs: MatchingPair[]) => void;
  className?: string;
}

export function MatchingPairEditor({
  pairs,
  onChange,
  className,
}: MatchingPairEditorProps) {
  function set(i: number, patch: Partial<MatchingPair>) {
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function add() {
    onChange([...pairs, { left: "", right: "" }]);
  }

  function remove(i: number) {
    onChange(pairs.filter((_, idx) => idx !== i));
  }

  const canDelete = pairs.length > 2;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Cặp ghép đôi
        </p>
        <span className="text-[11px] text-muted-foreground">
          Cặp đúng — sẽ xáo trộn cho học viên
        </span>
      </div>

      {/* Column header */}
      <div className="flex items-center gap-2 px-0.5">
        <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Cột trái
        </span>
        <span className="w-7 shrink-0" aria-hidden />
        <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Cột phải
        </span>
        <span className="size-8 shrink-0" aria-hidden />
      </div>

      {pairs.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={p.left}
            onChange={(e) => set(i, { left: e.target.value })}
            placeholder={`Mục ${i + 1}`}
            className="h-8 text-sm"
          />
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={p.right}
            onChange={(e) => set(i, { right: e.target.value })}
            placeholder="Ghép với…"
            className="h-8 text-sm"
          />
          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Xóa cặp ghép"
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
        Thêm cặp ghép
      </button>
    </div>
  );
}
