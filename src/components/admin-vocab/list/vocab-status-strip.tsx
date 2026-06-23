"use client";

import { cn } from "@/lib/utils/cn";
import type { VocabStripFilter } from "@/features/admin-vocab/types/vocab-item.types";

const STRIP_ITEMS: { value: VocabStripFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "ai_generated", label: "AI tạo" },
  { value: "in_review", label: "Đang duyệt" },
  { value: "reviewed", label: "Đã duyệt" },
  { value: "published", label: "Đã xuất bản" },
  { value: "rejected", label: "Từ chối" },
  { value: "archived", label: "Lưu trữ" },
];

const CHIP_ACTIVE_CLASS: Record<VocabStripFilter, string> = {
  all: "bg-foreground text-background",
  draft: "bg-muted-foreground text-background",
  ai_generated: "bg-violet-600 text-white",
  in_review: "bg-amber-500 text-white",
  reviewed: "bg-sky-600 text-white",
  published: "bg-primary text-primary-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  archived: "bg-muted text-muted-foreground border border-border",
};

export interface VocabStatusStripProps {
  value: VocabStripFilter;
  counts: Record<VocabStripFilter, number>;
  onChange: (value: VocabStripFilter) => void;
  className?: string;
}

export function VocabStatusStrip({
  value,
  counts,
  onChange,
  className,
}: VocabStatusStripProps) {
  const visible = STRIP_ITEMS.filter(
    (item) => item.value === "all" || (counts[item.value] ?? 0) > 0,
  );

  return (
    <div
      role="group"
      aria-label="Lọc theo trạng thái"
      className={cn("flex overflow-x-auto gap-2 pb-1", className)}
    >
      {visible.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? CHIP_ACTIVE_CLASS[item.value]
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {item.label}
            <span className="tabular-nums">{counts[item.value] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
