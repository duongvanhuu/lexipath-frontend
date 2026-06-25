"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Save, Send, Globe, Tag, Clock, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/shared/navigation/breadcrumb";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import { UnsavedChangesDialog } from "@/components/shared/feedback/unsaved-changes-dialog";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import type { Blueprint, BlueprintSection, BlueprintPart, BlueprintStatus, ExamTaskType } from "../types/blueprints.types";
import type { ExamProgram, ExamType } from "@/features/admin-exam-programs/types/exam-programs.types";
import { BlueprintStructureTab } from "./blueprint-structure-tab";
import { BlueprintValidationTab } from "./blueprint-validation-tab";
import { BlueprintPreviewTab } from "./blueprint-preview-tab";
import { runBlueprintValidation } from "../lib/blueprint-validation";

function blueprintStatusToContent(s: BlueprintStatus): ContentStatus {
  if (s === "published") return "published";
  if (s === "review") return "in_review";
  return "draft";
}

interface BlueprintEditorClientProps {
  blueprint: Blueprint;
  initialSections: BlueprintSection[];
  programs: ExamProgram[];
  examTypes: ExamType[];
  taskTypes: ExamTaskType[];
}

export function BlueprintEditorClient({
  blueprint: bpInit,
  initialSections,
  programs,
  examTypes,
  taskTypes,
}: BlueprintEditorClientProps) {
  const router = useRouter();

  const [bp, setBp] = React.useState<Blueprint>({ ...bpInit });
  const [sections, setSections] = React.useState<BlueprintSection[]>(
    JSON.parse(JSON.stringify(initialSections)),
  );
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(
    initialSections[0]?.id ?? null,
  );
  const [expandedPartId, setExpandedPartId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("structure");
  const [dirty, setDirty] = React.useState(false);
  const [exitDialogOpen, setExitDialogOpen] = React.useState(false);

  const programMap = Object.fromEntries(programs.map((p) => [p.id, p]));
  const typeMap = Object.fromEntries(examTypes.map((t) => [t.id, t]));

  const mark = () => setDirty(true);

  const valErrors = React.useMemo(() => runBlueprintValidation(bp, sections), [bp, sections]);
  const hasError = valErrors.some((e) => e.severity === "error");
  const errorCount = valErrors.filter((e) => e.severity === "error").length;

  const handleSave = () => {
    setDirty(false);
  };

  const handlePublish = () => {
    setBp((b) => ({ ...b, status: "published" as BlueprintStatus, version: b.version + 1 }));
    setDirty(false);
  };

  const handleUnpublish = () => {
    setBp((b) => ({ ...b, status: "draft" as BlueprintStatus }));
    mark();
  };

  const handleBack = () => {
    if (dirty) {
      setExitDialogOpen(true);
    } else {
      router.push("/admin/exams/blueprints" as Route);
    }
  };

  const addSection = () => {
    const s: BlueprintSection = {
      id: `s-${Date.now()}`,
      order: sections.length + 1,
      name: "Phần mới",
      skill: "",
      durationMin: 0,
      questionTotal: 0,
      scoreType: "auto",
      maxScore: 0,
      parts: [],
    };
    setSections((ss) => [...ss, s]);
    setSelectedSectionId(s.id);
    mark();
  };

  const deleteSection = (id: string) => {
    setSections((ss) => ss.filter((s) => s.id !== id));
    setSelectedSectionId(null);
    mark();
  };

  const updateSection = (section: BlueprintSection) => {
    setSections((ss) => ss.map((s) => (s.id === section.id ? section : s)));
    mark();
  };

  const addPart = (sectionId: string) => {
    const p: BlueprintPart = {
      id: `p-${Date.now()}`,
      order: 99,
      name: "Part mới",
      desc: "",
      taskType: "",
      qCount: 0,
      mediaType: "none",
      mediaRequired: false,
    };
    setSections((ss) =>
      ss.map((s) => (s.id === sectionId ? { ...s, parts: [...s.parts, p] } : s)),
    );
    setExpandedPartId(p.id);
    mark();
  };

  const updatePart = (sectionId: string, part: BlueprintPart) => {
    setSections((ss) =>
      ss.map((s) =>
        s.id === sectionId
          ? { ...s, parts: s.parts.map((p) => (p.id === part.id ? part : p)) }
          : s,
      ),
    );
    mark();
  };

  const deletePart = (sectionId: string, partId: string) => {
    setSections((ss) =>
      ss.map((s) =>
        s.id === sectionId
          ? { ...s, parts: s.parts.filter((p) => p.id !== partId) }
          : s,
      ),
    );
    setExpandedPartId(null);
    mark();
  };

  const togglePartExpand = (partId: string) => {
    setExpandedPartId((prev) => (prev === partId ? null : partId));
  };

  const goToSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveTab("structure");
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Blueprints", href: "/admin/exams/blueprints" as Route },
          { label: bp.code },
        ]}
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary leading-tight">
              {bp.name}
            </h1>
            <ContentStatusBadge status={blueprintStatusToContent(bp.status)} />
            <Badge variant="secondary">v{bp.version}</Badge>
            {hasError && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="size-3" aria-hidden />
                {errorCount} lỗi
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-3.5 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" aria-hidden />
              {programMap[bp.programId]?.name ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tag className="size-3.5" aria-hidden />
              {typeMap[bp.typeId]?.name ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              {bp.durationTotal} phút
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="size-3.5" aria-hidden />
              {bp.passMark || "chưa đặt"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {dirty && (
            <span className="text-xs text-text-muted italic">Chưa lưu</span>
          )}
          <Button variant="outline" onClick={handleSave} className="gap-1.5">
            <Save className="size-4" aria-hidden />
            Lưu
          </Button>
          {bp.status !== "published" && !hasError && (
            <Button onClick={handlePublish} className="gap-1.5">
              <Send className="size-4" aria-hidden />
              Xuất bản
            </Button>
          )}
          {bp.status === "published" && (
            <Button variant="outline" onClick={handleUnpublish}>
              Hủy xuất bản
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="structure">Cấu trúc</TabsTrigger>
          <TabsTrigger value="validation" className="gap-1.5">
            Kiểm tra
            {valErrors.length > 0 && (
              <Badge
                className={`text-[10px] h-4 min-w-[18px] px-1.5 ${
                  hasError ? "bg-destructive text-destructive-foreground" : "bg-amber-500 text-white"
                }`}
              >
                {valErrors.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="mt-4">
          <BlueprintStructureTab
            sections={sections}
            taskTypes={taskTypes}
            selectedSectionId={selectedSectionId}
            expandedPartId={expandedPartId}
            onSelectSection={setSelectedSectionId}
            onAddSection={addSection}
            onDeleteSection={deleteSection}
            onUpdateSection={updateSection}
            onAddPart={addPart}
            onUpdatePart={updatePart}
            onDeletePart={deletePart}
            onTogglePartExpand={togglePartExpand}
          />
        </TabsContent>

        <TabsContent value="validation" className="mt-4">
          <BlueprintValidationTab errors={valErrors} onGoToSection={goToSection} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <BlueprintPreviewTab blueprint={bp} sections={sections} taskTypes={taskTypes} />
        </TabsContent>
      </Tabs>

      <UnsavedChangesDialog
        open={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        onDiscard={() => {
          setExitDialogOpen(false);
          router.push("/admin/exams/blueprints" as Route);
        }}
        onSave={() => {
          handleSave();
          setExitDialogOpen(false);
          router.push("/admin/exams/blueprints" as Route);
        }}
        onCancel={() => setExitDialogOpen(false)}
      />
    </div>
  );
}
