"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { TranscriptSegment } from "./types";

export interface TranscriptEditorPanelProps {
  segments: TranscriptSegment[];
  onChange: (segments: TranscriptSegment[]) => void;
  onAddSegment: () => void;
  onRemoveSegment: (id: string) => void;
  className?: string;
}

function SegmentRow({
  segment,
  index,
  onUpdate,
  onRemove,
}: {
  segment: TranscriptSegment;
  index: number;
  onUpdate: (updated: TranscriptSegment) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {index + 1}
      </span>
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={`seg-speaker-${segment.id}`}
              className="text-xs"
            >
              Người nói
            </Label>
            <Input
              id={`seg-speaker-${segment.id}`}
              value={segment.speakerLabel ?? ""}
              onChange={(e) => {
                const speakerLabel = e.target.value;
                if (speakerLabel) {
                  onUpdate({ ...segment, speakerLabel });
                } else {
                  const { speakerLabel: _removed, ...rest } = segment;
                  onUpdate(rest);
                }
              }}
              placeholder="Speaker A / Narrator..."
              className="h-7 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={`seg-time-${segment.id}`}
              className="text-xs"
            >
              Thời điểm
            </Label>
            <Input
              id={`seg-time-${segment.id}`}
              value={segment.timeLabel ?? ""}
              onChange={(e) => {
                const timeLabel = e.target.value;
                if (timeLabel) {
                  onUpdate({ ...segment, timeLabel });
                } else {
                  const { timeLabel: _removed, ...rest } = segment;
                  onUpdate(rest);
                }
              }}
              placeholder="00:00 – 00:15"
              className="h-7 text-xs"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`seg-text-${segment.id}`}
            className="text-xs"
          >
            Nội dung
          </Label>
          <Textarea
            id={`seg-text-${segment.id}`}
            value={segment.text}
            onChange={(e) =>
              onUpdate({ ...segment, text: e.target.value })
            }
            placeholder="Nội dung đoạn hội thoại..."
            rows={2}
            className="text-sm"
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-6 size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(segment.id)}
        aria-label={`Xóa đoạn ${index + 1}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function TranscriptEditorPanel({
  segments,
  onChange,
  onAddSegment,
  onRemoveSegment,
  className,
}: TranscriptEditorPanelProps) {
  function handleUpdate(updated: TranscriptSegment) {
    onChange(segments.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {segments.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Chưa có đoạn thoại nào. Nhấn thêm để bắt đầu nhập transcript.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {segments.map((seg, idx) => (
            <React.Fragment key={seg.id}>
              {idx > 0 ? <Separator /> : null}
              <SegmentRow
                segment={seg}
                index={idx}
                onUpdate={handleUpdate}
                onRemove={onRemoveSegment}
              />
            </React.Fragment>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        onClick={onAddSegment}
        className="w-full"
      >
        <Plus className="size-4" />
        Thêm đoạn thoại
      </Button>
    </div>
  );
}

export { TranscriptEditorPanel };
