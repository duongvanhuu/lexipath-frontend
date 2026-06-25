"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlueprintPart, MediaType } from "../types/blueprints.types";
import type { ExamTaskType } from "../types/blueprints.types";

interface PartEditorPanelProps {
  part: BlueprintPart;
  taskTypes: ExamTaskType[];
  onUpdate: (part: BlueprintPart) => void;
  onDelete: () => void;
}

export function PartEditorPanel({
  part,
  taskTypes,
  onUpdate,
  onDelete,
}: PartEditorPanelProps) {
  function upd<K extends keyof BlueprintPart>(k: K, v: BlueprintPart[K]) {
    onUpdate({ ...part, [k]: v });
  }

  return (
    <div className="rounded-b-xl border border-t-0 border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">
          Part / Task
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          aria-label="Xóa part"
          className="text-text-muted hover:bg-red-50 hover:text-red-600 h-7 w-7 p-0"
        >
          <Trash2 className="size-3.5" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`part-name-${part.id}`}>
            Tên part <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`part-name-${part.id}`}
            value={part.name}
            onChange={(e) => upd("name", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`part-qcount-${part.id}`}>Số câu hỏi</Label>
          <Input
            id={`part-qcount-${part.id}`}
            type="number"
            min={0}
            value={part.qCount || 0}
            onChange={(e) => upd("qCount", parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`part-tasktype-${part.id}`}>
            Dạng bài (task type) <span className="text-destructive">*</span>
          </Label>
          <Select
            value={part.taskType || ""}
            onValueChange={(v) => upd("taskType", v)}
          >
            <SelectTrigger
              id={`part-tasktype-${part.id}`}
              aria-label="Dạng bài"
              className={!part.taskType ? "border-destructive" : undefined}
            >
              <SelectValue placeholder="-- Chọn dạng bài --" />
            </SelectTrigger>
            <SelectContent>
              {taskTypes.map((t) => (
                <SelectItem key={t.id} value={t.code}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`part-media-${part.id}`}>Loại media</Label>
          <Select
            value={part.mediaType || "none"}
            onValueChange={(v) => upd("mediaType", v as MediaType)}
          >
            <SelectTrigger id={`part-media-${part.id}`} aria-label="Loại media">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không cần</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="passage">Đoạn văn</SelectItem>
              <SelectItem value="image">Hình ảnh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor={`part-desc-${part.id}`}>Mô tả</Label>
          <Input
            id={`part-desc-${part.id}`}
            value={part.desc || ""}
            onChange={(e) => upd("desc", e.target.value)}
            placeholder="Mô tả nội dung của part này"
          />
        </div>
      </div>
    </div>
  );
}
