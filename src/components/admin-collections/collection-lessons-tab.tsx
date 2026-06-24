"use client";

import * as React from "react";
import { GripVertical, Pencil, Copy, Archive, Plus, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import type { AdminLesson, AdminLessonItem, AdminLessonStatus } from "@/features/admin-collections/types";
import { cn } from "@/lib/utils/cn";

function mapLessonStatus(s: AdminLessonStatus): ContentStatus {
  if (s === "review") return "in_review";
  if (s === "archived") return "archived";
  if (s === "published") return "published";
  return "draft";
}

export interface CollectionLessonsTabProps {
  collectionId: string;
  lessons: AdminLesson[];
  items: Record<string, AdminLessonItem[]>;
  onReorder: (lessons: AdminLesson[]) => void;
  onAddLesson: () => void;
  onEditLesson: (lessonId: string) => void;
  onDuplicateLesson: (lesson: AdminLesson) => void;
  onArchiveLesson: (lessonId: string, lessonTitle: string) => void;
}

export function CollectionLessonsTab({
  lessons,
  items,
  onReorder,
  onAddLesson,
  onEditLesson,
  onDuplicateLesson,
  onArchiveLesson,
}: CollectionLessonsTabProps) {
  const sorted = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
  const dragIdxRef = React.useRef<number | null>(null);
  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);

  const totalWords = sorted.reduce((sum, l) => sum + (items[l.id]?.length ?? 0), 0);
  const hasEmpty = sorted.some((l) => (items[l.id]?.length ?? 0) === 0);
  const hasFew = sorted.some((l) => {
    const n = items[l.id]?.length ?? 0;
    return n > 0 && n < 5;
  });

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragIdxRef.current = idx;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    const from = dragIdxRef.current;
    if (from === null || from === idx) {
      setDragOverIdx(null);
      return;
    }
    const next = [...sorted];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(idx, 0, moved);
    onReorder(next.map((l, i) => ({ ...l, sort_order: i + 1 })));
    dragIdxRef.current = null;
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    dragIdxRef.current = null;
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div>
      {hasEmpty && (
        <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-warning bg-warning-soft px-3.5 py-2.5 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden />
          Một số bài học chưa có từ vựng. Thêm từ trước khi xuất bản.
        </div>
      )}
      {hasFew && !hasEmpty && (
        <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3.5 py-2.5 text-sm">
          <Info className="size-4 shrink-0 text-text-secondary" aria-hidden />
          Khuyến nghị mỗi bài học ≥ 5 từ.
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {sorted.length} bài học · {totalWords} từ tổng
        </p>
        <Button type="button" size="sm" onClick={onAddLesson}>
          <Plus className="mr-1.5 size-4" />
          Thêm bài học
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-8" />}
          title="Chưa có bài học"
          description="Tạo bài học đầu tiên cho bộ sưu tập này."
          action={{ label: "Tạo bài học đầu tiên", onClick: onAddLesson }}
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((lesson, idx) => {
            const liCount = items[lesson.id]?.length ?? 0;
            const isEmpty = liCount === 0;
            const isFew = liCount > 0 && liCount < 5;
            const isDO = dragOverIdx === idx;

            return (
              <div
                key={lesson.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 transition-[border-color,transform]",
                  isDO
                    ? "border-primary -translate-y-0.5"
                    : "border-border",
                  dragIdx === idx && "opacity-50",
                )}
                style={{ cursor: "grab" }}
              >
                <GripVertical className="size-4 shrink-0 text-text-muted" aria-hidden />
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-[11px] font-bold text-text-muted">
                  {lesson.sort_order}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{lesson.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-secondary">
                    <span>{liCount} từ</span>
                    {lesson.estimated_minutes > 0 && (
                      <span>· {lesson.estimated_minutes} phút</span>
                    )}
                    {lesson.is_free && (
                      <span className="text-primary">· Miễn phí</span>
                    )}
                    {lesson.is_new && (
                      <Badge
                        className="h-4 px-1.5 text-[10px] bg-info-soft text-info-foreground"
                      >
                        Mới
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {isEmpty && (
                    <Badge className="bg-danger-soft text-danger-foreground text-xs">
                      Trống
                    </Badge>
                  )}
                  {isFew && (
                    <Badge className="bg-warning-soft text-warning-foreground text-xs">
                      Ít từ
                    </Badge>
                  )}
                  <ContentStatusBadge status={mapLessonStatus(lesson.status_code)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => onEditLesson(lesson.id)}
                  >
                    <Pencil className="size-3" />
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => onDuplicateLesson(lesson)}
                  >
                    <Copy className="size-3" />
                    Nhân bản
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => onArchiveLesson(lesson.id, lesson.title)}
                  >
                    <Archive className="size-3" />
                    Xóa
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
