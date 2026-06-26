"use client";

import * as React from "react";
import { Pencil, RotateCcw, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionPreview } from "./question-preview";
import type { Question } from "../types/question-bank.types";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ReviewQuestionDialogProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (question: Question) => void;
  onReturnDraft: (question: Question) => void;
  onApprove: (question: Question) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ReviewQuestionDialog({
  question,
  open,
  onOpenChange,
  onEdit,
  onReturnDraft,
  onApprove,
}: ReviewQuestionDialogProps) {
  if (question === null) return null;

  const titleText =
    question.stem.length > 60
      ? question.stem.slice(0, 60) + "…"
      : question.stem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{titleText || "Duyệt câu hỏi"}</DialogTitle>
          <DialogDescription className="sr-only">
            Xem xét và duyệt câu hỏi
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto py-1">
          <QuestionPreview question={question} showAnswer={true} />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onEdit(question);
              onOpenChange(false);
            }}
          >
            <Pencil className="mr-1.5 size-3.5" aria-hidden />
            Sửa
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onReturnDraft(question);
                onOpenChange(false);
              }}
            >
              <RotateCcw className="mr-1.5 size-3.5" aria-hidden />
              Trả lại nháp
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                onApprove(question);
                onOpenChange(false);
              }}
            >
              <CheckCircle className="mr-1.5 size-3.5" aria-hidden />
              Duyệt & xuất bản
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
