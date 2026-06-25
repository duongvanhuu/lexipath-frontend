"use client";

import * as React from "react";
import { Plus, Pencil } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layouts/page-header";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { FilterToolbar } from "@/components/admin/filter-toolbar";
import type { AdminFilterState } from "@/components/admin/types";
import type { ExamProgram, ExamType, ProgramFormValues, ExamTypeFormValues } from "../types/exam-programs.types";
import { ProgramCard } from "./program-card";
import { ProgramStatusDot } from "./program-status-dot";
import { ProgramFormDialog } from "./program-form-dialog";
import { ExamTypeFormDialog } from "./exam-type-form-dialog";

const LANG_LABELS: Record<string, string> = {
  en: "Tiếng Anh",
  ja: "Tiếng Nhật",
  zh: "Tiếng Trung",
};

interface ProgramsClientProps {
  initialPrograms: ExamProgram[];
  initialTypes: ExamType[];
}

export function ProgramsClient({ initialPrograms, initialTypes }: ProgramsClientProps) {
  const [programs, setPrograms] = React.useState<ExamProgram[]>(initialPrograms);
  const [types, setTypes] = React.useState<ExamType[]>(initialTypes);

  const [programFilters, setProgramFilters] = React.useState<AdminFilterState>({});
  const [programFormOpen, setProgramFormOpen] = React.useState(false);
  const [editingProgram, setEditingProgram] = React.useState<ExamProgram | null>(null);

  const [typeFormOpen, setTypeFormOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<ExamType | null>(null);

  const openProgramForm = (program: ExamProgram | null = null) => {
    setEditingProgram(program);
    setProgramFormOpen(true);
  };

  const handleSaveProgram = (values: ProgramFormValues) => {
    if (editingProgram) {
      setPrograms((ps) => ps.map((p) => (p.id === editingProgram.id ? { ...p, ...values } : p)));
    } else {
      setPrograms((ps) => [
        ...ps,
        {
          ...values,
          id: `p-${Date.now()}`,
          blueprintCount: 0,
          testCount: 0,
          updatedAt: new Date().toLocaleDateString("vi-VN"),
        },
      ]);
    }
  };

  const handleSaveType = (values: ExamTypeFormValues) => {
    if (editingType) {
      setTypes((ts) => ts.map((t) => (t.id === editingType.id ? { ...t, ...values } : t)));
    } else {
      setTypes((ts) => [...ts, { ...values, id: `t-${Date.now()}`, usageCount: 0 }]);
    }
  };

  const filteredPrograms = React.useMemo(() => {
    let result = programs;
    const { search, lang, status } = programFilters;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
      );
    }
    if (lang && lang !== "all") {
      result = result.filter((p) => p.lang === lang);
    }
    if (status && status !== "all") {
      result = result.filter((p) => p.status === status);
    }
    return result;
  }, [programs, programFilters]);

  const programColumns: ColumnDef<ExamProgram>[] = [
    {
      accessorKey: "code",
      header: "Mã",
      cell: ({ row }) => (
        <span className="font-mono text-[11px] font-semibold" style={{ color: row.original.color }}>
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Chương trình",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-[11px] text-text-muted">{row.original.fullName}</p>
        </div>
      ),
    },
    {
      accessorKey: "lang",
      header: "Ngôn ngữ",
      cell: ({ getValue }) => LANG_LABELS[getValue<string>()] ?? getValue<string>(),
    },
    {
      accessorKey: "blueprintCount",
      header: "Blueprints",
      cell: ({ getValue }) => (
        <Badge variant="secondary">{getValue<number>()}</Badge>
      ),
    },
    {
      accessorKey: "testCount",
      header: "Đề thi",
      cell: ({ getValue }) => (
        <Badge variant="outline">{getValue<number>()}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => (
        <ProgramStatusDot status={getValue<ExamProgram["status"]>()} />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Sửa ${row.original.name}`}
          onClick={(e) => {
            e.stopPropagation();
            openProgramForm(row.original);
          }}
          className="h-7 w-7 p-0"
        >
          <Pencil className="size-3.5" aria-hidden />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="programs">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Chương trình thi
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {programs.length} chương trình
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="programs">Chương trình</TabsTrigger>
            <TabsTrigger value="types">Loại đề thi</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Programs tab ── */}
        <TabsContent value="programs" className="space-y-6 mt-0">
          <div className="flex justify-end">
            <Button onClick={() => openProgramForm()} className="gap-1.5">
              <Plus className="size-4" aria-hidden />
              Thêm chương trình
            </Button>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} onClick={openProgramForm} />
            ))}
          </div>

          {/* Table section */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">
                Tất cả chương trình
              </span>
              <div className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <FilterToolbar
              filters={programFilters}
              fields={[
                {
                  id: "search",
                  label: "Tìm kiếm",
                  type: "search",
                  placeholder: "Tìm theo tên, mã…",
                },
                {
                  id: "lang",
                  label: "Ngôn ngữ",
                  type: "select",
                  options: [
                    { value: "en", label: "Tiếng Anh" },
                    { value: "ja", label: "Tiếng Nhật" },
                    { value: "zh", label: "Tiếng Trung" },
                  ],
                },
                {
                  id: "status",
                  label: "Trạng thái",
                  type: "select",
                  options: [
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Tạm dừng" },
                  ],
                },
              ]}
              onFilterChange={setProgramFilters}
              onClear={() => setProgramFilters({})}
              resultCount={filteredPrograms.length}
              className="mb-4"
            />

            <AdminDataTable
              data={filteredPrograms}
              columns={programColumns}
              emptyTitle="Không tìm thấy chương trình"
              emptyDescription="Thử điều chỉnh bộ lọc hoặc thêm chương trình mới."
              onRowClick={openProgramForm}
            />
          </div>
        </TabsContent>

        {/* ── Exam types tab ── */}
        <TabsContent value="types" className="space-y-4 mt-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {types.length} loại · dùng để phân loại blueprint và đề thi
            </p>
            <Button
              onClick={() => {
                setEditingType(null);
                setTypeFormOpen(true);
              }}
              className="gap-1.5"
            >
              <Plus className="size-4" aria-hidden />
              Thêm loại
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {types.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-4 rounded-xl border border-border bg-surface-card p-5"
              >
                <span
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${t.color}18` }}
                  aria-hidden
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: t.color }}
                  >
                    {t.code.slice(0, 1).toUpperCase()}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className="font-bold text-base">{t.name}</span>
                    <code className="rounded px-1.5 py-0.5 text-[10px] border border-border bg-surface-muted text-text-secondary font-semibold">
                      {t.code}
                    </code>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-2">
                    {t.desc}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Dùng trong{" "}
                    <strong className="text-text-primary">{t.usageCount}</strong>{" "}
                    blueprint
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Sửa loại ${t.name}`}
                  onClick={() => {
                    setEditingType(t);
                    setTypeFormOpen(true);
                  }}
                  className="gap-1 shrink-0"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Sửa
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ProgramFormDialog
        key={`prog-${editingProgram?.id ?? "new"}`}
        open={programFormOpen}
        onOpenChange={setProgramFormOpen}
        initial={editingProgram}
        onSave={handleSaveProgram}
      />

      <ExamTypeFormDialog
        key={`type-${editingType?.id ?? "new"}`}
        open={typeFormOpen}
        onOpenChange={setTypeFormOpen}
        initial={editingType}
        onSave={handleSaveType}
      />
    </div>
  );
}
