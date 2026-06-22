"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Pencil, Trash2, HelpCircle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { cn } from "@/lib/utils/cn";

import type { ExamQuestion, QuestionType, QuestionStatus } from "./types";

export interface QuestionBankTableProps {
  questions: ExamQuestion[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (questions: ExamQuestion[]) => void;
  emptyTitle?: string;
  className?: string;
}

const TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: "1 đáp án",
  multiple_choice: "Nhiều đáp án",
  fill_blank: "Điền vào",
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
};

const STATUS_LABELS: Record<QuestionStatus, string> = {
  draft: "Nháp",
  review: "Chờ duyệt",
  approved: "Đã duyệt",
  archived: "Lưu trữ",
};

const STATUS_CLASSES: Record<QuestionStatus, string> = {
  draft: "bg-surface-muted text-text-secondary",
  review: "bg-warning-soft text-warning-foreground",
  approved: "bg-success-soft text-success-foreground",
  archived: "bg-surface-muted text-text-muted",
};

function TableSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 py-2"
      role="status"
      aria-busy
      aria-label="Đang tải câu hỏi"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}

function QuestionBankTable({
  questions,
  isLoading,
  onEdit,
  onDelete,
  onSelect,
  emptyTitle = "Chưa có câu hỏi nào",
  className,
}: QuestionBankTableProps) {
  const columns = React.useMemo<ColumnDef<ExamQuestion>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Chọn tất cả"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label={`Chọn câu hỏi ${row.original.id}`}
          />
        ),
        size: 40,
      },
      {
        accessorKey: "prompt",
        header: "Câu hỏi",
        cell: ({ getValue }) => (
          <span className="line-clamp-2 max-w-xs text-sm">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại",
        cell: ({ getValue }) => (
          <Badge variant="outline" className="text-xs">
            {TYPE_LABELS[getValue<QuestionType>()]}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ getValue }) => {
          const status = getValue<QuestionStatus | undefined>();
          if (!status) return null;
          return (
            <Badge className={cn("text-xs", STATUS_CLASSES[status])}>
              {STATUS_LABELS[status]}
            </Badge>
          );
        },
      },
      {
        accessorKey: "points",
        header: "Điểm",
        cell: ({ getValue }) => {
          const pts = getValue<number | undefined>();
          return pts !== undefined ? (
            <span className="text-sm">{pts}</span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {onEdit ? (
              <Button
                variant="ghost"
                size="sm"
                className="size-7 p-0"
                onClick={() => onEdit(row.original.id)}
                aria-label={`Chỉnh sửa câu hỏi`}
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                className="size-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(row.original.id)}
                aria-label={`Xóa câu hỏi`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        onSelect?.(questions.filter((q) => next[q.id]));
        return next;
      });
    },
    state: { rowSelection },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<HelpCircle />}
        title={emptyTitle}
        description="Thêm câu hỏi mới vào ngân hàng đề để bắt đầu."
        {...(className ? { className } : {})}
      />
    );
  }

  return (
    <div className={cn("rounded-lg border border-border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { QuestionBankTable };
