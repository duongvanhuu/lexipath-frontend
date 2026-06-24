"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CollectionFormRow } from "./collection-form-row";
import { BULK_WORDS } from "@/features/admin-collections/mock/collections.mock";
import type { AdminLessonItem, AdminCollectionLang } from "@/features/admin-collections/types";
import { LEVEL_OPTS } from "@/features/admin-collections/types";

const BULK_TAGS = [
  "JLPT N5", "TOEIC", "Business", "Grammar", "Common",
  "Daily", "Academic", "JLPT N4", "HSK", "Idiom",
];

export interface LessonBulkAddDialogProps {
  open: boolean;
  langCode: AdminCollectionLang;
  existingCount: number;
  onClose: () => void;
  onAdd: (items: AdminLessonItem[]) => void;
}

export function LessonBulkAddDialog({
  open,
  langCode,
  existingCount,
  onClose,
  onAdd,
}: LessonBulkAddDialogProps) {
  const [mode, setMode] = React.useState<"tag" | "level">("tag");
  const [bulkVal, setBulkVal] = React.useState("");
  const [bulkCount, setBulkCount] = React.useState(10);

  const levelOpts = (LEVEL_OPTS[langCode] ?? LEVEL_OPTS["en"]) as string[];
  const wordPool = BULK_WORDS[langCode] ?? BULK_WORDS.en ?? [];
  const count = Math.min(bulkCount, wordPool.length);

  const handleAdd = () => {
    const start = existingCount + 1;
    const items: AdminLessonItem[] = wordPool.slice(0, count).map((w, i) => ({
      id: `li_${Date.now()}_${i}`,
      item_id: `v_${Date.now()}_${i}`,
      sense_id: `s_${Date.now()}_${i}`,
      sort_order: start + i,
      is_key_item: false,
      custom_example_id: null,
      word: w.w,
      reading: w.r,
      meaning: w.m,
    }));
    onAdd(items);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm từ hàng loạt</DialogTitle>
          <DialogDescription>Chọn nhóm từ để thêm vào bài học.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            {(["tag", "level"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  mode === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text-secondary hover:border-border/80"
                }`}
              >
                {m === "tag" ? "Theo tag" : "Theo cấp độ"}
              </button>
            ))}
          </div>

          <CollectionFormRow label={mode === "tag" ? "Chọn tag" : "Chọn cấp độ"}>
            <Select value={bulkVal} onValueChange={setBulkVal}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="— Chọn —" />
              </SelectTrigger>
              <SelectContent>
                {mode === "tag"
                  ? BULK_TAGS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))
                  : levelOpts.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </CollectionFormRow>

          <CollectionFormRow label="Số từ muốn thêm">
            <Input
              type="number"
              min={1}
              max={50}
              value={bulkCount}
              className="h-9"
              onChange={(e) => setBulkCount(parseInt(e.target.value) || 10)}
            />
          </CollectionFormRow>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleAdd}>
            Thêm {count} từ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
