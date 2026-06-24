"use client";

import * as React from "react";
import { Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { QB_VOCAB_ITEMS } from "../mock/question-bank.mock";
import type { QuestionVocabItem } from "../types/question-bank.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LANG_LABEL: Record<string, string> = {
  en: "EN",
  ja: "JA",
  zh: "ZH",
};

function getLangLabel(lang: string): string {
  const prefix = lang.split("-")[0] ?? lang;
  return LANG_LABEL[prefix] ?? prefix.toUpperCase();
}

// ─── Vocab row ────────────────────────────────────────────────────────────────
interface VocabRowProps {
  item: QuestionVocabItem;
  selected: boolean;
  onToggle: (id: string) => void;
}

function VocabRow({ item, selected, onToggle }: VocabRowProps) {
  return (
    <label
      htmlFor={`vocab-${item.id}`}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer",
        "transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:bg-muted/40",
      )}
    >
      {/* Styled checkbox visual */}
      <span
        className={cn(
          "size-5 shrink-0 flex items-center justify-center rounded-md border-2 transition-colors",
          selected
            ? "border-green-500 bg-green-500"
            : "border-muted-foreground/40 bg-background",
        )}
        aria-hidden
      >
        {selected && <Check className="size-3 text-white" aria-hidden />}
      </span>

      {/* Hidden real checkbox for accessibility */}
      <input
        id={`vocab-${item.id}`}
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(item.id)}
        className="sr-only"
        aria-label={`${item.word} — ${item.meaning}`}
      />

      <span
        className="min-w-20 font-bold text-base text-foreground"
        lang={item.lang}
      >
        {item.word}
      </span>

      <span className="min-w-24 text-xs text-muted-foreground truncate">
        {item.reading}
      </span>

      <span className="flex-1 text-sm text-muted-foreground truncate">
        {item.meaning}
      </span>

      <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
        {getLangLabel(item.lang)}
      </Badge>
    </label>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface LinkVocabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function LinkVocabDialog({
  open,
  onOpenChange,
  selectedIds,
  onChange,
}: LinkVocabDialogProps) {
  const [localIds, setLocalIds] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  // Copy selected IDs into local state when dialog opens.
  // Suppressed: state reset on controlled "open" flag is the standard dialog pattern.
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (open) {
      setLocalIds([...selectedIds]);
      setSearch("");
    }
    // intentional: only re-initialize when dialog opens, not on every selectedIds change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggle(id: string) {
    setLocalIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const filtered = QB_VOCAB_ITEMS.filter((v) => {
    if (search.trim() === "") return true;
    const s = search.toLowerCase();
    return (
      v.word.toLowerCase().includes(s) ||
      v.meaning.toLowerCase().includes(s) ||
      v.reading.toLowerCase().includes(s)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Liên kết từ vựng</DialogTitle>
          <DialogDescription>
            Gắn câu hỏi với mục từ vựng để theo dõi và gợi ý ôn tập.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm từ, phiên âm, nghĩa…"
            className="pl-8 h-9 text-sm"
            aria-label="Tìm kiếm từ vựng"
          />
        </div>

        {/* Vocab list */}
        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
          {filtered.length > 0 ? (
            filtered.map((v) => (
              <VocabRow
                key={v.id}
                item={v}
                selected={localIds.includes(v.id)}
                onToggle={toggle}
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy từ phù hợp.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => {
              onChange(localIds);
              onOpenChange(false);
            }}
          >
            Xong ({localIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
