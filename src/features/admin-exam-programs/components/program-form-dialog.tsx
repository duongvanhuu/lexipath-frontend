"use client";

import * as React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ExamProgram,
  ProgramFormValues,
  ExamLanguage,
  ExamProgramStatus,
} from "../types/exam-programs.types";

const BLANK: ProgramFormValues = {
  code: "",
  name: "",
  fullName: "",
  lang: "en",
  color: "#2563EB",
  icon: "globe",
  desc: "",
  status: "active",
};

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ExamProgram | null;
  onSave: (values: ProgramFormValues) => void;
}

export function ProgramFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: ProgramFormDialogProps) {
  const [form, setForm] = React.useState<ProgramFormValues>(
    initial ? { ...initial } : { ...BLANK },
  );

  function upd<K extends keyof ProgramFormValues>(k: K, v: ProgramFormValues[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function handleSave() {
    onSave(form);
    onOpenChange(false);
  }

  const canSave = form.code.trim() !== "" && form.name.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Chỉnh sửa chương trình thi" : "Tạo chương trình thi mới"}
          </DialogTitle>
          <DialogDescription>Thông tin cơ bản về chương trình kỳ thi.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pf-code">
              Mã chương trình <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pf-code"
              value={form.code}
              onChange={(e) => upd("code", e.target.value)}
              placeholder="IELTS"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">
              Tên viết tắt <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pf-name"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="IELTS"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="pf-fullname">Tên đầy đủ</Label>
            <Input
              id="pf-fullname"
              value={form.fullName}
              onChange={(e) => upd("fullName", e.target.value)}
              placeholder="International English Language Testing System"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="pf-desc">Mô tả</Label>
            <Textarea
              id="pf-desc"
              value={form.desc}
              onChange={(e) => upd("desc", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-lang">Ngôn ngữ</Label>
            <Select
              value={form.lang}
              onValueChange={(v) => upd("lang", v as ExamLanguage)}
            >
              <SelectTrigger id="pf-lang" aria-label="Ngôn ngữ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">Tiếng Anh</SelectItem>
                <SelectItem value="ja">Tiếng Nhật</SelectItem>
                <SelectItem value="zh">Tiếng Trung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-icon">Icon Lucide</Label>
            <Input
              id="pf-icon"
              value={form.icon}
              onChange={(e) => upd("icon", e.target.value)}
              placeholder="globe"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-color">Màu thương hiệu</Label>
            <Input
              id="pf-color"
              type="color"
              value={form.color}
              onChange={(e) => upd("color", e.target.value)}
              className="h-9 px-2 py-1 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-status">Trạng thái</Label>
            <Select
              value={form.status}
              onValueChange={(v) => upd("status", v as ExamProgramStatus)}
            >
              <SelectTrigger id="pf-status" aria-label="Trạng thái">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
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
