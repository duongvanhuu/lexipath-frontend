"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Plus, CheckCircle, File, Clock, AlertCircle } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layouts/page-header";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { FilterToolbar } from "@/components/admin/filter-toolbar";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { AdminFilterState } from "@/components/admin/types";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import type { Blueprint, BlueprintStatus } from "../types/blueprints.types";
import type { ExamProgram, ExamType } from "@/features/admin-exam-programs/types/exam-programs.types";

function blueprintStatusToContent(s: BlueprintStatus): ContentStatus {
  if (s === "published") return "published";
  if (s === "review") return "in_review";
  return "draft";
}

interface QuickStat {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

interface BlueprintListClientProps {
  blueprints: Blueprint[];
  programs: ExamProgram[];
  examTypes: ExamType[];
}

export function BlueprintListClient({
  blueprints: initialBlueprints,
  programs,
  examTypes,
}: BlueprintListClientProps) {
  const router = useRouter();
  const [blueprints, setBlueprints] = React.useState<Blueprint[]>(initialBlueprints);
  const [filters, setFilters] = React.useState<AdminFilterState>({});

  const programMap = Object.fromEntries(programs.map((p) => [p.id, p]));
  const typeMap = Object.fromEntries(examTypes.map((t) => [t.id, t]));

  const stats: QuickStat[] = [
    { label: "Đã xuất bản", value: blueprints.filter((b) => b.status === "published").length, icon: CheckCircle, colorClass: "text-green-600", bgClass: "bg-green-50 border-green-100" },
    { label: "Bản nháp", value: blueprints.filter((b) => b.status === "draft").length, icon: File, colorClass: "text-text-muted", bgClass: "bg-surface-muted border-border" },
    { label: "Chờ duyệt", value: blueprints.filter((b) => b.status === "review").length, icon: Clock, colorClass: "text-amber-600", bgClass: "bg-amber-50 border-amber-100" },
    { label: "Có lỗi", value: blueprints.filter((b) => b.validationErrors.length > 0).length, icon: AlertCircle, colorClass: "text-destructive", bgClass: "bg-red-50 border-red-100" },
  ];

  const filtered = React.useMemo(() => {
    let result = blueprints;
    const { search, programId, typeId, status } = filters;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q),
      );
    }
    if (programId && programId !== "all") result = result.filter((b) => b.programId === programId);
    if (typeId && typeId !== "all") result = result.filter((b) => b.typeId === typeId);
    if (status && status !== "all") result = result.filter((b) => b.status === status);
    return result;
  }, [blueprints, filters]);

  const handleCreate = () => {
    const id = `bp-new-${Date.now()}`;
    const nb: Blueprint = {
      id,
      programId: "p-ielts",
      typeId: "t-full",
      code: "NEW-BP-01",
      name: "Blueprint mới",
      status: "draft",
      version: 1,
      durationTotal: 0,
      questionTotal: 0,
      sectionCount: 0,
      passMark: "",
      scoreType: "total",
      updatedAt: new Date().toLocaleDateString("vi-VN"),
      validationErrors: [],
    };
    setBlueprints((bs) => [nb, ...bs]);
    router.push(`/admin/exams/blueprints/${id}` as Route);
  };

  const columns: ColumnDef<Blueprint>[] = [
    {
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue }) => (
        <span className="font-mono text-[11px] font-semibold text-text-secondary">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên blueprint",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold">{row.original.name}</span>
          {row.original.validationErrors.length > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-destructive font-medium">
              <AlertCircle className="size-3" aria-hidden />
              {row.original.validationErrors.length} vấn đề
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "programId",
      header: "Chương trình",
      cell: ({ getValue }) => {
        const prog = programMap[getValue<string>()];
        return prog ? (
          <span className="font-semibold text-sm" style={{ color: prog.color }}>
            {prog.name}
          </span>
        ) : null;
      },
    },
    {
      accessorKey: "typeId",
      header: "Loại",
      cell: ({ getValue }) => (
        <span className="text-xs font-medium">{typeMap[getValue<string>()]?.name ?? getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => (
        <ContentStatusBadge status={blueprintStatusToContent(getValue<BlueprintStatus>())} />
      ),
    },
    {
      accessorKey: "version",
      header: "Phiên bản",
      cell: ({ getValue }) => (
        <Badge variant="secondary">v{getValue<number>()}</Badge>
      ),
    },
    {
      accessorKey: "sectionCount",
      header: "Phần",
      cell: ({ getValue }) => <span className="font-semibold">{getValue<number>()}</span>,
    },
    {
      accessorKey: "questionTotal",
      header: "Câu hỏi",
      cell: ({ getValue }) => <span className="font-semibold">{getValue<number>()}</span>,
    },
    {
      accessorKey: "durationTotal",
      header: "Thời gian",
      cell: ({ getValue }) => <span>{getValue<number>()} phút</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blueprints"
        description={`${blueprints.length} blueprint · cấu trúc đề thi (phần, part, dạng bài)`}
        actions={[
          {
            id: "create",
            label: "Tạo blueprint",
            variant: "primary",
            onClick: handleCreate,
          },
        ]}
      />

      {/* Quick stats */}
      <div className="flex flex-wrap gap-2.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${s.bgClass}`}
          >
            <s.icon className={`size-4 ${s.colorClass}`} aria-hidden />
            <strong className={`text-base ${s.colorClass}`}>{s.value}</strong>
            <span className="text-sm text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      <FilterToolbar
        filters={filters}
        fields={[
          { id: "search", label: "Tìm kiếm", type: "search", placeholder: "Tìm blueprint theo tên, mã…" },
          {
            id: "programId",
            label: "Chương trình",
            type: "select",
            options: programs.map((p) => ({ value: p.id, label: p.name })),
          },
          {
            id: "typeId",
            label: "Loại",
            type: "select",
            options: examTypes.map((t) => ({ value: t.id, label: t.name })),
          },
          {
            id: "status",
            label: "Trạng thái",
            type: "select",
            options: [
              { value: "published", label: "Đã xuất bản" },
              { value: "draft", label: "Bản nháp" },
              { value: "review", label: "Chờ duyệt" },
            ],
          },
        ]}
        onFilterChange={setFilters}
        onClear={() => setFilters({})}
        resultCount={filtered.length}
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        emptyTitle="Không tìm thấy blueprint"
        emptyDescription="Thử điều chỉnh bộ lọc hoặc tạo blueprint mới."
        onRowClick={(row) => router.push(`/admin/exams/blueprints/${row.id}` as Route)}
      />
    </div>
  );
}
