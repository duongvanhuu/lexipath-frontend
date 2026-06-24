"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { cn } from "@/lib/utils/cn";
import type { Question } from "@/features/admin-exam-qbank/types/question-bank.types";
import { QB_TAGS, QB_PROGRAMS } from "@/features/admin-exam-qbank/mock/question-bank.mock";
import { QuestionTypeChip } from "@/features/admin-exam-qbank/components/atoms/question-type-chip";
import { QuestionDiffPill } from "@/features/admin-exam-qbank/components/atoms/question-diff-pill";
import { QuestionStatusBadge } from "@/features/admin-exam-qbank/components/atoms/question-status-badge";

// ─── Skill label map ──────────────────────────────────────────────────────────
const SKILL_LABEL: Record<string, string> = {
  listening: "Nghe",
  reading:   "Đọc",
  writing:   "Viết",
  speaking:  "Nói",
  grammar:   "Ngữ pháp",
  vocab:     "Từ vựng",
};

// ─── Tag lookup map ───────────────────────────────────────────────────────────
const TAG_MAP: Record<string, string> = Object.fromEntries(
  QB_TAGS.map((t) => [t.id, t.label]),
);

// ─── Program lookup map ───────────────────────────────────────────────────────
const PROGRAM_MAP: Record<string, { code: string; name: string; color: string }> =
  Object.fromEntries(QB_PROGRAMS.map((p) => [p.id, p]));

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionBankTableProps {
  questions: Question[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpenEditor: (question: Question) => void;
  onReview: (question: Question) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionBankTable({
  questions,
  onSelectionChange,
  onOpenEditor,
  onReview,
  className,
}: QuestionBankTableProps) {
  // Adapt AdminDataTable's onSelectionChange(TData[]) → onSelectionChange(ids: string[])
  const handleSelectionChange = React.useCallback(
    (rows: Question[]) => {
      onSelectionChange(rows.map((r) => r.id));
    },
    [onSelectionChange],
  );

  const columns: ColumnDef<Question>[] = React.useMemo(
    () => [
      // ── Stem ──────────────────────────────────────────────────────────────
      {
        id: "stem",
        header: "Câu hỏi",
        cell: ({ row }) => {
          const q = row.original;
          const tagLabels = q.tagIds
            .slice(0, 3)
            .map((tid) => TAG_MAP[tid] ?? tid);

          return (
            <div className="min-w-0 max-w-[320px]">
              <p className="line-clamp-2 text-sm font-medium text-foreground">
                {q.stem || "(chưa có nội dung)"}
              </p>
              {(tagLabels.length > 0 || q.vocabIds.length > 0) && (
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {tagLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))}
                  {q.vocabIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="h-4 rounded px-1.5 py-0 text-[10px] font-normal"
                    >
                      Vocab ×{q.vocabIds.length}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        },
      },

      // ── Type ──────────────────────────────────────────────────────────────
      {
        id: "type",
        header: "Dạng",
        size: 90,
        cell: ({ row }) => (
          <QuestionTypeChip type={row.original.type} size="sm" />
        ),
      },

      // ── Skill ─────────────────────────────────────────────────────────────
      {
        id: "skill",
        header: "Kỹ năng",
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {SKILL_LABEL[row.original.skill] ?? row.original.skill}
          </span>
        ),
      },

      // ── Difficulty ────────────────────────────────────────────────────────
      {
        id: "difficulty",
        header: "Độ khó",
        size: 80,
        cell: ({ row }) => (
          <QuestionDiffPill difficulty={row.original.difficulty} />
        ),
      },

      // ── Program ───────────────────────────────────────────────────────────
      {
        id: "program",
        header: "Chương trình",
        size: 100,
        cell: ({ row }) => {
          const prog = PROGRAM_MAP[row.original.programId];
          return prog ? (
            <span
              className="text-xs font-semibold"
              style={{ color: prog.color }}
            >
              {prog.code}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {row.original.programId}
            </span>
          );
        },
      },

      // ── Points ────────────────────────────────────────────────────────────
      {
        id: "points",
        header: () => (
          <span className="block text-right">Điểm</span>
        ),
        size: 60,
        cell: ({ row }) => (
          <span className="block text-right text-sm text-muted-foreground">
            {row.original.points} đ
          </span>
        ),
      },

      // ── Status ────────────────────────────────────────────────────────────
      {
        id: "status",
        header: "Trạng thái",
        size: 110,
        cell: ({ row }) => (
          <QuestionStatusBadge status={row.original.status} />
        ),
      },

      // ── Action ────────────────────────────────────────────────────────────
      {
        id: "actions",
        header: "",
        size: 80,
        cell: ({ row }) => {
          const q = row.original;
          if (q.status === "review") {
            return (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onReview(q);
                }}
              >
                Duyệt
              </Button>
            );
          }
          return (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Chỉnh sửa"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditor(q);
              }}
            >
              <Pencil className="size-3.5" />
            </Button>
          );
        },
      },
    ],
    [onOpenEditor, onReview],
  );

  return (
    <div className={cn(className)}>
      <AdminDataTable
        data={questions}
        columns={columns}
        emptyTitle="Không tìm thấy câu hỏi"
        emptyDescription="Thử đổi bộ lọc hoặc tạo câu hỏi mới."
        onRowClick={onOpenEditor}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
