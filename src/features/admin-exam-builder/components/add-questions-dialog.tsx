"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  QB_QUESTIONS,
  QB_SKILL_REGISTRY,
  QB_TYPE_REGISTRY,
} from "@/features/admin-exam-qbank/mock/question-bank.mock";
import { QuestionTypeChip } from "@/features/admin-exam-qbank/components/atoms/question-type-chip";
import { QuestionDiffPill } from "@/features/admin-exam-qbank/components/atoms/question-diff-pill";
import type { QuestionType } from "@/features/admin-exam-qbank/types/question-bank.types";

interface AddQuestionsDialogProps {
  open: boolean;
  onClose: () => void;
  existingIds: string[];
  defaultSkill?: string | undefined;
  onAdd: (ids: string[]) => void;
}

// Extracted so it remounts when the dialog opens, giving clean state each time.
function AddQuestionsForm({
  existingIds,
  defaultSkill,
  onClose,
  onAdd,
}: { existingIds: string[]; defaultSkill: string | undefined; onClose: () => void; onAdd: (ids: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState(defaultSkill ?? "all");
  const [picked, setPicked] = useState<string[]>([]);

  const rows = QB_QUESTIONS.filter((item) => {
    if (existingIds.includes(item.id)) return false;
    if (query && !item.stem.toLowerCase().includes(query.toLowerCase())) return false;
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (skillFilter !== "all" && item.skill !== skillFilter) return false;
    return true;
  });

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const typeOptions = Object.values(QB_TYPE_REGISTRY);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Thêm câu hỏi từ ngân hàng</DialogTitle>
        <DialogDescription>
          Tìm và chọn câu hỏi có sẵn để thêm vào phần này.
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" aria-hidden />
          <Input
            className="pl-8"
            placeholder="Tìm nội dung câu hỏi…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Lọc theo dạng câu"
        >
          <option value="all">Mọi dạng</option>
          {typeOptions.map((t) => (
            <option key={t.id} value={t.id}>{t.short}</option>
          ))}
        </select>
        <select
          className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          aria-label="Lọc theo kỹ năng"
        >
          <option value="all">Mọi kỹ năng</option>
          {QB_SKILL_REGISTRY.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
        {rows.map((item) => {
          const isOn = picked.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                isOn
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:bg-surface-muted",
              )}
            >
              <span
                className={cn(
                  "size-5 shrink-0 rounded flex items-center justify-center border-2 transition-colors",
                  isOn ? "border-success bg-success" : "border-border bg-transparent",
                )}
                aria-hidden
              >
                {isOn && (
                  <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <QuestionTypeChip type={item.type as QuestionType} size="sm" />
              <span className="flex-1 truncate text-sm text-text-primary">{item.stem}</span>
              <QuestionDiffPill difficulty={item.difficulty} />
              <span className="w-8 shrink-0 text-right text-xs text-text-muted">{item.points}đ</span>
            </button>
          );
        })}

        {rows.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted py-8 text-center">
            <Search className="size-6 text-text-muted" aria-hidden />
            <p className="text-sm text-text-secondary">Không còn câu hỏi phù hợp.</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Hủy</Button>
        <Button
          variant="default"
          disabled={picked.length === 0}
          onClick={() => { onAdd(picked); onClose(); }}
        >
          Thêm {picked.length > 0 ? `${picked.length} câu` : "câu hỏi"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function AddQuestionsDialog({
  open,
  onClose,
  existingIds,
  defaultSkill,
  onAdd,
}: AddQuestionsDialogProps) {
  const formKey = open ? `open-${defaultSkill ?? "all"}` : "closed";
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <AddQuestionsForm
          key={formKey}
          existingIds={existingIds}
          defaultSkill={defaultSkill}
          onClose={onClose}
          onAdd={onAdd}
        />
      </DialogContent>
    </Dialog>
  );
}
