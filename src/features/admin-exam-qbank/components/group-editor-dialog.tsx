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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QB_SKILL_REGISTRY, QB_PROGRAMS } from "../mock/question-bank.mock";
import type { QuestionGroup } from "../types/question-bank.types";

// ─── Form state ───────────────────────────────────────────────────────────────
interface GroupFormState {
  code: string;
  title: string;
  stimulusType: QuestionGroup["stimulusType"];
  skill: QuestionGroup["skill"];
  programId: string;
  mediaId: string;
  instructions: string;
  stimulus: string;
}

function makeBlankForm(): GroupFormState {
  return {
    code: "",
    title: "",
    stimulusType: "passage",
    skill: "reading",
    programId: QB_PROGRAMS[0]?.id ?? "p-ielts",
    mediaId: "",
    instructions: "",
    stimulus: "",
  };
}

function groupToForm(group: QuestionGroup): GroupFormState {
  return {
    code: group.code,
    title: group.title,
    stimulusType: group.stimulusType,
    skill: group.skill,
    programId: group.programId,
    mediaId: group.mediaId ?? "",
    instructions: group.instructions,
    stimulus: group.stimulus,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface GroupEditorDialogProps {
  group?: QuestionGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: QuestionGroup) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function GroupEditorDialog({
  group,
  open,
  onOpenChange,
  onSave,
}: GroupEditorDialogProps) {
  const [form, setForm] = React.useState<GroupFormState>(
    group != null ? groupToForm(group) : makeBlankForm(),
  );
  const [errors, setErrors] = React.useState<{ code?: string; title?: string }>(
    {},
  );

  // Re-initialize when dialog opens or group prop changes
  React.useEffect(() => {
    if (open) {
      setForm(group != null ? groupToForm(group) : makeBlankForm());
      setErrors({});
    }
  }, [open, group]);

  function upd(patch: Partial<GroupFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleSave() {
    const nextErrors: { code?: string; title?: string } = {};
    if (form.code.trim() === "") {
      nextErrors.code = "Mã nhóm không được để trống.";
    }
    if (form.title.trim() === "") {
      nextErrors.title = "Tiêu đề không được để trống.";
    }
    if (nextErrors.code !== undefined || nextErrors.title !== undefined) {
      setErrors(nextErrors);
      return;
    }

    const saved: QuestionGroup = {
      id: group != null ? group.id : `grp-${Date.now()}`,
      code: form.code.trim(),
      title: form.title.trim(),
      stimulusType: form.stimulusType,
      skill: form.skill,
      programId: form.programId,
      mediaId: form.mediaId.trim() !== "" ? form.mediaId.trim() : null,
      instructions: form.instructions,
      stimulus: form.stimulus,
      questionIds: group != null ? group.questionIds : [],
      status: group != null ? group.status : "draft",
      updatedAt: new Date().toLocaleDateString("vi-VN"),
    };

    onSave(saved);
    onOpenChange(false);
  }

  const isEditing = group != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa nhóm" : "Tạo nhóm mới"}
          </DialogTitle>
          <DialogDescription>
            Nhóm các câu hỏi chia sẻ chung ngữ liệu (đoạn văn / audio).
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* Code */}
          <div className="col-span-1">
            <Label
              htmlFor="grp-code"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Mã nhóm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grp-code"
              value={form.code}
              onChange={(e) => upd({ code: e.target.value })}
              placeholder="RD-RENEW-01"
              className="mt-1 h-9 text-sm"
              aria-describedby={errors.code !== undefined ? "grp-code-err" : undefined}
            />
            {errors.code !== undefined && (
              <p
                id="grp-code-err"
                className="mt-1 text-[11px] text-destructive"
              >
                {errors.code}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="col-span-1">
            <Label
              htmlFor="grp-title"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grp-title"
              value={form.title}
              onChange={(e) => upd({ title: e.target.value })}
              placeholder="Đọc hiểu — Renewable Energy"
              className="mt-1 h-9 text-sm"
              aria-describedby={errors.title !== undefined ? "grp-title-err" : undefined}
            />
            {errors.title !== undefined && (
              <p
                id="grp-title-err"
                className="mt-1 text-[11px] text-destructive"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Stimulus type */}
          <div className="col-span-1">
            <Label
              htmlFor="grp-stimulus-type"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Loại ngữ liệu
            </Label>
            <Select
              value={form.stimulusType}
              onValueChange={(v) =>
                upd({ stimulusType: v as QuestionGroup["stimulusType"] })
              }
            >
              <SelectTrigger
                id="grp-stimulus-type"
                className="mt-1 h-9 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passage">Đoạn văn</SelectItem>
                <SelectItem value="audio">Âm thanh</SelectItem>
                <SelectItem value="standalone">Độc lập</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skill */}
          <div className="col-span-1">
            <Label
              htmlFor="grp-skill"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Kỹ năng
            </Label>
            <Select
              value={form.skill}
              onValueChange={(v) =>
                upd({ skill: v as QuestionGroup["skill"] })
              }
            >
              <SelectTrigger id="grp-skill" className="mt-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QB_SKILL_REGISTRY.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Program */}
          <div className="col-span-2">
            <Label
              htmlFor="grp-program"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Chương trình
            </Label>
            <Select
              value={form.programId}
              onValueChange={(v) => upd({ programId: v })}
            >
              <SelectTrigger id="grp-program" className="mt-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QB_PROGRAMS.map((prog) => (
                  <SelectItem key={prog.id} value={prog.id}>
                    {prog.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media ID — conditional on audio */}
          {form.stimulusType === "audio" && (
            <div className="col-span-2">
              <Label
                htmlFor="grp-media-id"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Media ID
              </Label>
              <Input
                id="grp-media-id"
                value={form.mediaId}
                onChange={(e) => upd({ mediaId: e.target.value })}
                placeholder="m-ielts-l1"
                className="mt-1 h-9 text-sm"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-3">
          <Label
            htmlFor="grp-instructions"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Hướng dẫn
          </Label>
          <Textarea
            id="grp-instructions"
            value={form.instructions}
            onChange={(e) => upd({ instructions: e.target.value })}
            placeholder="Đọc đoạn văn và trả lời các câu hỏi…"
            className="mt-1 min-h-16 text-sm resize-none"
          />
        </div>

        {/* Stimulus — conditional on non-standalone */}
        {form.stimulusType !== "standalone" && (
          <div className="mt-3">
            <Label
              htmlFor="grp-stimulus"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Nội dung / mô tả
            </Label>
            <Textarea
              id="grp-stimulus"
              value={form.stimulus}
              onChange={(e) => upd({ stimulus: e.target.value })}
              placeholder={
                form.stimulusType === "audio"
                  ? "[Audio] mô tả nội dung đoạn nghe…"
                  : "Dán nội dung đoạn văn ngữ liệu…"
              }
              className="mt-1 min-h-24 text-sm resize-none"
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleSave}>
            Lưu nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
