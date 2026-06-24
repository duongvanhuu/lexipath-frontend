"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { QB_TYPE_REGISTRY } from "../mock/question-bank.mock";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import type { QuestionType } from "../types/question-bank.types";

// ─── Constants ────────────────────────────────────────────────────────────────
const QB_TYPES_LIST = Object.values(QB_TYPE_REGISTRY);

// ─── Props ────────────────────────────────────────────────────────────────────
export interface NewQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateQuestion: (type: QuestionType) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function NewQuestionDialog({
  open,
  onOpenChange,
  onCreateQuestion,
}: NewQuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo câu hỏi mới</DialogTitle>
          <DialogDescription>
            Chọn dạng câu hỏi để mở trình soạn thảo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2.5 mt-2 sm:grid-cols-3">
          {QB_TYPES_LIST.map((info) => (
            <button
              key={info.id}
              type="button"
              onClick={() => {
                onCreateQuestion(info.id);
                onOpenChange(false);
              }}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 text-left",
                "transition-colors hover:bg-muted/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <span className="shrink-0 mt-0.5">
                <QuestionTypeChip type={info.id} size="sm" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {info.name}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                  {info.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
