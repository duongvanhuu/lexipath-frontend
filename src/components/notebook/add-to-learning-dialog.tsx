"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type AddToLearningDialogCollection = {
  id: string;
  name: string;
};

export type AddToLearningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: string;
  meaning?: string;
  collections: AddToLearningDialogCollection[];
  selectedCollectionId?: string;
  onSelectedCollectionChange: (id: string) => void;
  onConfirm: () => void;
};

function AddToLearningDialog({
  open,
  onOpenChange,
  word,
  meaning,
  collections,
  selectedCollectionId,
  onSelectedCollectionChange,
  onConfirm,
}: AddToLearningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm vào học</DialogTitle>
          {meaning ? (
            <DialogDescription>
              <strong>{word}</strong> — {meaning}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              Chọn bộ sưu tập để thêm từ {word} vào học
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-primary">
            Chọn bộ sưu tập:
          </p>
          <RadioGroup
            value={selectedCollectionId ?? null}
            onValueChange={onSelectedCollectionChange}
            className="gap-2"
          >
            {collections.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  selectedCollectionId === c.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={c.id} id={`col-${c.id}`} />
                <Label
                  htmlFor={`col-${c.id}`}
                  className="flex-1 cursor-pointer text-sm text-text-primary"
                >
                  {c.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <LexiButton variant="quiet" onClick={() => onOpenChange(false)}>
            Hủy
          </LexiButton>
          <LexiButton
            variant="primary"
            onClick={onConfirm}
            disabled={!selectedCollectionId}
          >
            Thêm
          </LexiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddToLearningDialog };
