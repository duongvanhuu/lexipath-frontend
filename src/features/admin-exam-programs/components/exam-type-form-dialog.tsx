"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ExamType, ExamTypeFormValues } from "../types/exam-programs.types";

const BLANK: ExamTypeFormValues = {
  code: "",
  name: "",
  icon: "file-text",
  color: "#2563EB",
  desc: "",
};

interface ExamTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ExamType | null;
  onSave: (values: ExamTypeFormValues) => void;
}

export function ExamTypeFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: ExamTypeFormDialogProps) {
  const [form, setForm] = React.useState<ExamTypeFormValues>(
    initial ? { ...initial } : { ...BLANK },
  );

  function upd<K extends keyof ExamTypeFormValues>(k: K, v: ExamTypeFormValues[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function handleSave() {
    onSave(form);
    onOpenChange(false);
  }

  const canSave = form.code.trim() !== "" && form.name.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Chỉnh sửa loại đề thi" : "Tạo loại đề thi mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="etf-code">
              Mã <span className="text-destructive">*</span>
            </Label>
            <Input
              id="etf-code"
              value={form.code}
              onChange={(e) => upd("code", e.target.value)}
              placeholder="full"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="etf-name">
              Tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="etf-name"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="Đề đầy đủ"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="etf-icon">Icon Lucide</Label>
            <Input
              id="etf-icon"
              value={form.icon}
              onChange={(e) => upd("icon", e.target.value)}
              placeholder="file-text"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="etf-color">Màu</Label>
            <Input
              id="etf-color"
              type="color"
              value={form.color}
              onChange={(e) => upd("color", e.target.value)}
              className="h-9 px-2 py-1 cursor-pointer"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="etf-desc">Mô tả</Label>
            <Textarea
              id="etf-desc"
              value={form.desc}
              onChange={(e) => upd("desc", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
