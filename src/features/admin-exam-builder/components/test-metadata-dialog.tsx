"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExamTest } from "../types/exam-builder.types";
import {
  BUILDER_PROGRAMS,
  BUILDER_EXAM_TYPES,
  BUILDER_BLUEPRINTS,
} from "../mock/exam-builder.mock";

interface TestMetadataDialogProps {
  open: boolean;
  initial: ExamTest | null;
  onClose: () => void;
  onSave: (test: ExamTest) => void;
}

function blankTest(): ExamTest {
  return {
    id: `tst-${Date.now()}`,
    code: "", name: "", desc: "",
    programId: "p-ielts", typeId: "t-full", blueprintId: "",
    durationMin: 60, questionTotal: 0, sectionCount: 0,
    status: "draft", version: 1,
    updatedAt: new Date().toLocaleDateString("vi-VN"),
  };
}

// Form is extracted into its own component and remounted via key so state resets
// cleanly each time the dialog opens, without needing useEffect for state reset.
function TestMetadataForm({
  initial,
  onClose,
  onSave,
}: { initial: ExamTest | null; onClose: () => void; onSave: (t: ExamTest) => void }) {
  const [form, setForm] = useState<ExamTest>(() => initial ?? blankTest());
  const upd = <K extends keyof ExamTest>(key: K, value: ExamTest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const blueprints = BUILDER_BLUEPRINTS.filter((b) => b.programId === form.programId);
  const isNew = !initial;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isNew ? "Tạo đề thi mới" : "Chỉnh sửa thông tin đề thi"}</DialogTitle>
        <DialogDescription>
          Thông tin cơ bản — cấu trúc và câu hỏi được dựng ở bước sau.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-code" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Mã đề <span className="text-danger">*</span>
          </Label>
          <Input
            id="tb-code"
            value={form.code}
            onChange={(e) => upd("code", e.target.value)}
            placeholder="IELTS-AC-T01"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-name" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Tên đề <span className="text-danger">*</span>
          </Label>
          <Input
            id="tb-name"
            value={form.name}
            onChange={(e) => upd("name", e.target.value)}
            placeholder="IELTS Academic — Đề thực hành 1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-program" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Chương trình
          </Label>
          <select
            id="tb-program"
            className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
            value={form.programId}
            onChange={(e) => { upd("programId", e.target.value); upd("blueprintId", ""); }}
          >
            {BUILDER_PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-type" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Loại đề
          </Label>
          <select
            id="tb-type"
            className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
            value={form.typeId}
            onChange={(e) => upd("typeId", e.target.value)}
          >
            {BUILDER_EXAM_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-blueprint" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Dựa trên Blueprint
          </Label>
          <select
            id="tb-blueprint"
            className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
            value={form.blueprintId}
            onChange={(e) => upd("blueprintId", e.target.value)}
          >
            <option value="">— Không dùng blueprint —</option>
            {blueprints.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-duration" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Thời lượng (phút)
          </Label>
          <Input
            id="tb-duration"
            type="number"
            min={1}
            value={form.durationMin}
            onChange={(e) => upd("durationMin", Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tb-total" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Tổng số câu (mục tiêu)
          </Label>
          <Input
            id="tb-total"
            type="number"
            min={0}
            value={form.questionTotal}
            onChange={(e) => upd("questionTotal", Number(e.target.value))}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="tb-desc" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Mô tả
          </Label>
          <Textarea
            id="tb-desc"
            value={form.desc}
            onChange={(e) => upd("desc", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Hủy</Button>
        <Button
          variant="default"
          disabled={!form.code || !form.name}
          onClick={() => { onSave(form); onClose(); }}
        >
          {isNew ? "Tạo đề" : "Lưu"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function TestMetadataDialog({ open, initial, onClose, onSave }: TestMetadataDialogProps) {
  const formKey = open ? (initial?.id ?? "new") : "closed";
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <TestMetadataForm key={formKey} initial={initial} onClose={onClose} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}
