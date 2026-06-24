"use client";

import { useState } from "react";
import { Plus, CheckCircle, Clock, Database, FileEdit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layouts/page-header";
import { FilterToolbar } from "@/components/admin/filter-toolbar";
import { BulkActionToolbar } from "@/components/admin/bulk-action-toolbar";
import type {
  AdminFilterState,
  AdminFilterField,
  AdminTableAction,
} from "@/components/admin/types";
import { cn } from "@/lib/utils/cn";

import type {
  Question,
  QuestionType,
  QuestionGroup,
  QuestionTag,
  QuestionSource,
  QuestionBankMock,
} from "@/features/admin-exam-qbank/types/question-bank.types";
import { useQuestionBankFilters } from "@/features/admin-exam-qbank/hooks/use-question-bank-filters";
import type { QuestionBankFilterState } from "@/features/admin-exam-qbank/hooks/use-question-bank-filters";
import { blankQuestion } from "@/features/admin-exam-qbank/mock/blank-question";
import {
  QB_TYPE_REGISTRY,
  QB_SKILL_REGISTRY,
  QB_PROGRAMS,
} from "@/features/admin-exam-qbank/mock/question-bank.mock";

import { QuestionBankTable } from "./question-bank-table";
import { QuestionEditorPanel } from "./question-editor-panel";
import { GroupsView } from "./groups-view";
import { TagSourceManager } from "./tag-source-manager";
import { NewQuestionDialog } from "./new-question-dialog";
import { ReviewQuestionDialog } from "./review-question-dialog";

// ─── Filter fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: AdminFilterField[] = [
  {
    id: "search",
    type: "search",
    label: "Tìm kiếm",
    placeholder: "Tìm nội dung câu hỏi…",
  },
  {
    id: "type",
    type: "select",
    label: "Dạng câu",
    options: Object.values(QB_TYPE_REGISTRY).map((t) => ({
      value: t.id,
      label: t.name,
    })),
  },
  {
    id: "skill",
    type: "select",
    label: "Kỹ năng",
    options: QB_SKILL_REGISTRY.map((s) => ({ value: s.id, label: s.name })),
  },
  {
    id: "programId",
    type: "select",
    label: "Chương trình",
    options: QB_PROGRAMS.map((p) => ({ value: p.id, label: p.code })),
  },
  {
    id: "status",
    type: "select",
    label: "Trạng thái",
    options: [
      { value: "draft", label: "Nháp" },
      { value: "review", label: "Chờ duyệt" },
      { value: "published", label: "Đã xuất bản" },
    ],
  },
];

// ─── Stat tiles config ────────────────────────────────────────────────────────

const STAT_ICONS = {
  total: Database,
  published: CheckCircle,
  review: Clock,
  draft: FileEdit,
} as const;

const STAT_CONFIG = [
  { key: "total" as const, label: "Tổng câu hỏi", colorClass: "text-indigo-500 bg-indigo-500/10" },
  { key: "published" as const, label: "Đã xuất bản", colorClass: "text-green-600 bg-green-600/10" },
  { key: "review" as const, label: "Chờ duyệt", colorClass: "text-amber-600 bg-amber-600/10" },
  { key: "draft" as const, label: "Bản nháp", colorClass: "text-slate-500 bg-slate-500/10" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface QuestionBankClientProps {
  mock: QuestionBankMock;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function QuestionBankClient({ mock, className }: QuestionBankClientProps) {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>(mock.questions);
  const [groups, setGroups] = useState<QuestionGroup[]>(mock.groups);
  const [tags, setTags] = useState<QuestionTag[]>(mock.tags);
  const [sources, setSources] = useState<QuestionSource[]>(mock.sources);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("questions");
  const [editorQuestion, setEditorQuestion] = useState<Question | null>(null);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("edit");
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [reviewQuestion, setReviewQuestion] = useState<Question | null>(null);

  // ── Filter hook ─────────────────────────────────────────────────────────────
  const {
    filters,
    setFilters,
    clearFilters,
    selectedIds,
    setSelectedIds,
    clearSelection,
    filteredQuestions,
    stats,
  } = useQuestionBankFilters(questions);

  // ── Filter bridge: QuestionBankFilterState → AdminFilterState ───────────────
  const adminFilters: AdminFilterState = {
    ...(filters.search !== "" ? { search: filters.search } : {}),
    ...(filters.type !== "all" ? { type: filters.type } : {}),
    ...(filters.skill !== "all" ? { skill: filters.skill } : {}),
    ...(filters.programId !== "all" ? { programId: filters.programId } : {}),
    ...(filters.status !== "all" ? { status: filters.status } : {}),
  };

  function handleFilterChange(af: AdminFilterState): void {
    setFilters({
      search: af.search ?? "",
      type: (af.type as QuestionBankFilterState["type"]) ?? "all",
      skill: (af.skill as QuestionBankFilterState["skill"]) ?? "all",
      programId: af.programId ?? "all",
      status: (af.status as QuestionBankFilterState["status"]) ?? "all",
    });
  }

  // ── Bulk actions ────────────────────────────────────────────────────────────
  const bulkActions: AdminTableAction[] = [
    {
      id: "publish",
      label: "Xuất bản",
      variant: "default",
      icon: <CheckCircle className="size-3.5" aria-hidden />,
      onClick: (ids) => {
        setQuestions((qs) =>
          qs.map((q) =>
            ids.includes(q.id) ? { ...q, status: "published" as const } : q,
          ),
        );
        clearSelection();
      },
    },
    {
      id: "assign-tag",
      label: "Gán tag",
      variant: "secondary",
      onClick: (_ids) => {
        // mock no-op
      },
    },
  ];

  // ── Editor actions ──────────────────────────────────────────────────────────
  function openEditor(question: Question, mode: "create" | "edit"): void {
    setEditorQuestion(question);
    setEditorMode(mode);
  }

  function closeEditor(): void {
    setEditorQuestion(null);
  }

  function handleSave(updated: Question): void {
    setQuestions((qs) => {
      const idx = qs.findIndex((q) => q.id === updated.id);
      if (idx === -1) return [...qs, updated];
      return qs.map((q) => (q.id === updated.id ? updated : q));
    });
    // Keep editor open after save
  }

  function handlePublish(updated: Question): void {
    setQuestions((qs) => {
      const idx = qs.findIndex((q) => q.id === updated.id);
      if (idx === -1) return [...qs, updated];
      return qs.map((q) => (q.id === updated.id ? updated : q));
    });
    closeEditor();
  }

  function handleCreateQuestion(type: QuestionType): void {
    const newQ: Question = { ...blankQuestion(type), id: `q-new-${Date.now()}` };
    setNewQuestionDialogOpen(false);
    openEditor(newQ, "create");
  }

  // ── Review actions ──────────────────────────────────────────────────────────
  function handleReturnDraft(question: Question): void {
    const updated: Question = { ...question, status: "draft" };
    setQuestions((qs) => qs.map((q) => (q.id === updated.id ? updated : q)));
    setReviewQuestion(null);
  }

  function handleApprove(question: Question): void {
    const updated: Question = { ...question, status: "published" };
    setQuestions((qs) => qs.map((q) => (q.id === updated.id ? updated : q)));
    setReviewQuestion(null);
  }

  // ── Full-page editor takeover ───────────────────────────────────────────────
  if (editorQuestion !== null) {
    return (
      <QuestionEditorPanel
        question={editorQuestion}
        mode={editorMode}
        onBack={closeEditor}
        onSave={handleSave}
        onPublish={handlePublish}
      />
    );
  }

  // ── Bank screen ─────────────────────────────────────────────────────────────
  return (
    <div className={cn("space-y-5", className)}>
      {/* Page header */}
      <PageHeader
        title="Ngân hàng câu hỏi"
        description={`${questions.length} câu hỏi · ${groups.length} nhóm · 10 dạng câu hỏi`}
        actions={[
          {
            id: "create",
            label: "Tạo câu hỏi",
            icon: <Plus className="size-4" aria-hidden />,
            onClick: () => setNewQuestionDialogOpen(true),
          },
        ]}
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CONFIG.map((cfg) => {
          const Icon = STAT_ICONS[cfg.key];
          return (
            <Card key={cfg.key}>
              <CardContent className="flex items-center gap-3 p-4">
                <span
                  className={cn(
                    "size-9 shrink-0 rounded-xl flex items-center justify-center",
                    cfg.colorClass,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xl font-extrabold tracking-tight leading-none">
                    {stats[cfg.key]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cfg.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
          <TabsTrigger value="groups">Nhóm câu hỏi</TabsTrigger>
          <TabsTrigger value="tags">Tags &amp; Nguồn</TabsTrigger>
        </TabsList>

        {/* Questions tab */}
        <TabsContent value="questions" className="mt-4">
          <div className="flex flex-col gap-3">
            <FilterToolbar
              filters={adminFilters}
              fields={FILTER_FIELDS}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              resultCount={filteredQuestions.length}
            />
            <BulkActionToolbar
              selectedCount={selectedIds.length}
              selectedIds={selectedIds}
              actions={bulkActions}
              onClearSelection={clearSelection}
            />
            <QuestionBankTable
              questions={filteredQuestions}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onOpenEditor={(q) => openEditor(q, "edit")}
              onReview={(q) => setReviewQuestion(q)}
            />
          </div>
        </TabsContent>

        {/* Groups tab */}
        <TabsContent value="groups" className="mt-4">
          <GroupsView
            groups={groups}
            questions={questions}
            onOpenQuestion={(q) => openEditor(q, "edit")}
            onSaveGroup={(g) => {
              setGroups((gs) => {
                const idx = gs.findIndex((x) => x.id === g.id);
                if (idx === -1) return [...gs, g];
                return gs.map((x) => (x.id === g.id ? g : x));
              });
            }}
          />
        </TabsContent>

        {/* Tags & sources tab */}
        <TabsContent value="tags" className="mt-4">
          <TagSourceManager
            tags={tags}
            sources={sources}
            onTagsChange={setTags}
            onSourcesChange={setSources}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewQuestionDialog
        open={newQuestionDialogOpen}
        onOpenChange={setNewQuestionDialogOpen}
        onCreateQuestion={handleCreateQuestion}
      />
      <ReviewQuestionDialog
        question={reviewQuestion}
        open={reviewQuestion !== null}
        onOpenChange={(open) => {
          if (!open) setReviewQuestion(null);
        }}
        onEdit={(q) => {
          setReviewQuestion(null);
          openEditor(q, "edit");
        }}
        onReturnDraft={handleReturnDraft}
        onApprove={handleApprove}
      />
    </div>
  );
}
