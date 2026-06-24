"use client";

import * as React from "react";
import { GripVertical, Trash2, Plus, Layers, AlertCircle, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { LessonBulkAddDialog } from "./lesson-bulk-add-dialog";
import type { AdminLessonItem, AdminCollectionLang } from "@/features/admin-collections/types";
import { cn } from "@/lib/utils/cn";

const MIN_ITEMS = 5;

export interface LessonItemsTabProps {
  lessonId: string;
  langCode: AdminCollectionLang;
  items: AdminLessonItem[];
  onChange: (items: AdminLessonItem[]) => void;
}

export function LessonItemsTab({
  lessonId,
  langCode,
  items,
  onChange,
}: LessonItemsTabProps) {
  const [showBulk, setShowBulk] = React.useState(false);
  const dragRef = React.useRef<number | null>(null);
  const [dragOver, setDragOver] = React.useState<number | null>(null);

  const onDragStart = (e: React.DragEvent, i: number) => {
    dragRef.current = i;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOver(i);
  };
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const from = dragRef.current;
    if (from === null || from === i) { setDragOver(null); return; }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(i, 0, moved);
    onChange(next.map((it, si) => ({ ...it, sort_order: si + 1 })));
    dragRef.current = null;
    setDragOver(null);
  };
  const onDragEnd = () => { dragRef.current = null; setDragOver(null); };

  const removeItem = (id: string) =>
    onChange(items.filter((it) => it.id !== id).map((it, si) => ({ ...it, sort_order: si + 1 })));

  const toggleKey = (id: string) =>
    onChange(items.map((it) => it.id === id ? { ...it, is_key_item: !it.is_key_item } : it));

  const updateField = (id: string, k: keyof AdminLessonItem, v: string) =>
    onChange(items.map((it) => it.id === id ? { ...it, [k]: v } : it));

  const addSingle = () => {
    const newItem: AdminLessonItem = {
      id: `li_${Date.now()}`,
      item_id: `v_${Date.now()}`,
      sense_id: `s_${Date.now()}`,
      sort_order: items.length + 1,
      is_key_item: false,
      custom_example_id: null,
      word: "",
      reading: "",
      meaning: "",
    };
    onChange([...items, newItem]);
  };

  const keyCount = items.filter((it) => it.is_key_item).length;

  return (
    <div>
      {items.length === 0 && (
        <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-destructive bg-danger-soft px-3.5 py-2.5 text-sm">
          <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden />
          Cần ít nhất {MIN_ITEMS} từ trước khi xuất bản.
        </div>
      )}
      {items.length > 0 && items.length < MIN_ITEMS && (
        <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-warning bg-warning-soft px-3.5 py-2.5 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden />
          Chỉ {items.length} từ — khuyến nghị ≥ {MIN_ITEMS}.
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {items.length} từ · {keyCount} trọng tâm
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowBulk(true)}
          >
            <Layers className="mr-1.5 size-4" />
            Thêm hàng loạt
          </Button>
          <Button type="button" size="sm" onClick={addSingle}>
            <Plus className="mr-1.5 size-4" />
            Thêm từ
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Chưa có từ"
          description="Thêm từ vựng vào bài học."
          action={{ label: "Thêm hàng loạt", onClick: () => setShowBulk(true) }}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          {/* Header */}
          <div className="grid grid-cols-[28px_28px_1.2fr_1fr_1.5fr_60px_36px] gap-2 border-b border-border bg-surface-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            <span />
            <span>#</span>
            <span>Từ</span>
            <span>Phiên âm</span>
            <span>Nghĩa</span>
            <span className="text-center">Key</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={(e) => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              className={cn(
                "grid grid-cols-[28px_28px_1.2fr_1fr_1.5fr_60px_36px] gap-2 items-center px-3 py-1.5 transition-colors",
                idx < items.length - 1 && "border-b border-border",
                dragOver === idx ? "bg-success-soft" : "bg-card",
              )}
              style={{ cursor: "grab" }}
            >
              <GripVertical className="size-3.5 text-text-muted" aria-hidden />
              <span className="text-[11px] font-bold text-text-muted">{idx + 1}</span>

              <Input
                value={item.word}
                placeholder="Từ…"
                className="h-7 px-2 text-sm font-semibold"
                aria-label={`Từ ${idx + 1}`}
                onChange={(e) => updateField(item.id, "word", e.target.value)}
              />
              <Input
                value={item.reading}
                placeholder="Phiên âm…"
                className="h-7 px-2 text-xs"
                aria-label={`Phiên âm ${idx + 1}`}
                onChange={(e) => updateField(item.id, "reading", e.target.value)}
              />
              <Input
                value={item.meaning}
                placeholder="Nghĩa…"
                className="h-7 px-2 text-sm"
                aria-label={`Nghĩa ${idx + 1}`}
                onChange={(e) => updateField(item.id, "meaning", e.target.value)}
              />

              <div className="flex justify-center">
                <Switch
                  checked={item.is_key_item}
                  onCheckedChange={() => toggleKey(item.id)}
                  aria-label={`Đánh dấu từ trọng tâm ${idx + 1}`}
                />
              </div>

              <button
                type="button"
                aria-label={`Xóa từ ${idx + 1}`}
                onClick={() => removeItem(item.id)}
                className="flex size-6 items-center justify-center rounded text-text-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <LessonBulkAddDialog
        open={showBulk}
        langCode={langCode}
        existingCount={items.length}
        onClose={() => setShowBulk(false)}
        onAdd={(newItems) => {
          onChange([...items, ...newItems]);
          setShowBulk(false);
        }}
      />
    </div>
  );
}
