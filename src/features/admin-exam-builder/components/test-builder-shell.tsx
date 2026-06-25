"use client";

import { useState } from "react";
import { ArrowLeft, Settings2, AlertTriangle, CheckCircle, Rocket, Save, Archive } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { cn } from "@/lib/utils/cn";
import type { ExamTest, TestSection, AccessRule } from "../types/exam-builder.types";
import { validateTest } from "../utils/validate-test";
import { getProgramColor, getProgramCode } from "../mock/exam-builder.mock";
import { TestStructureEditor } from "./test-structure-editor";
import { AccessRulesEditor } from "./access-rules-editor";
import { ValidateTab } from "./validate-tab";
import { TestPreview } from "./test-preview";
import { TestMetadataDialog } from "./test-metadata-dialog";

interface TestBuilderShellProps {
  test: ExamTest;
  initialStructure: TestSection[];
  initialRules: AccessRule[];
  onBack: () => void;
  onSave: (test: ExamTest, structure: TestSection[], rules: AccessRule[]) => void;
  onToast?: (msg: string) => void;
}

export function TestBuilderShell({
  test: initialTest,
  initialStructure,
  initialRules,
  onBack,
  onSave,
  onToast,
}: TestBuilderShellProps) {
  const [test, setTest] = useState<ExamTest>(initialTest);
  const [structure, setStructure] = useState<TestSection[]>(initialStructure);
  const [rules, setRules] = useState<AccessRule[]>(initialRules);
  const [tab, setTab] = useState("structure");
  const [metaOpen, setMetaOpen] = useState(false);

  const errors = validateTest(test, structure);
  const blocking = errors.filter((e) => e.sev === "error");

  const persist = (patch: Partial<ExamTest>, s = structure, r = rules) => {
    const next = { ...test, ...patch };
    setTest(next);
    onSave(next, s, r);
  };

  const color = getProgramColor(test.programId);
  const code = getProgramCode(test.programId);
  const statusForBadge = (test.status === "archived" ? "archived" : test.status) as ContentStatus;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-1.5"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Danh sách đề
        </Button>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <code
            className="rounded px-1.5 py-0.5 text-[11px] font-bold"
            style={{ color, background: `${color}14` }}
          >
            {code}
          </code>
          <span className="text-lg font-bold tracking-tight text-text-primary">{test.name}</span>
          <ContentStatusBadge status={statusForBadge} />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMetaOpen(true)}
          className="gap-1.5"
        >
          <Settings2 className="size-3.5" aria-hidden />
          Thông tin
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5">
          <TabsTrigger value="structure">Cấu trúc</TabsTrigger>
          <TabsTrigger value="access">Quy tắc truy cập</TabsTrigger>
          <TabsTrigger value="validate">
            Kiểm tra{blocking.length > 0 ? ` · ${blocking.length}` : ""}
          </TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <TestStructureEditor
            structure={structure}
            onChange={(s) => { setStructure(s); onSave({ ...test, sectionCount: s.length }, s, rules); }}
            {...(onToast !== undefined ? { onToast } : {})}
          />
        </TabsContent>

        <TabsContent value="access">
          <AccessRulesEditor
            rules={rules}
            onChange={(r) => { setRules(r); onSave(test, structure, r); }}
          />
        </TabsContent>

        <TabsContent value="validate">
          <ValidateTab test={test} structure={structure} errors={errors} />
        </TabsContent>

        <TabsContent value="preview">
          <TestPreview test={test} structure={structure} />
        </TabsContent>
      </Tabs>

      {/* Sticky publish bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 border-t border-border bg-card px-8 py-3 shadow-[0_-2px_12px_rgba(16,24,40,0.06)] lg:left-60">
        <span className={cn(
          "flex items-center gap-1.5 text-sm font-semibold",
          blocking.length > 0 ? "text-warning-foreground" : "text-success-foreground",
        )}>
          {blocking.length > 0 ? (
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
          ) : (
            <CheckCircle className="size-4 shrink-0" aria-hidden />
          )}
          {blocking.length > 0
            ? `${blocking.length} lỗi cần sửa trước khi xuất bản`
            : "Đề thi hợp lệ"}
        </span>

        <div className="flex-1" />

        {test.status === "published" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { persist({ status: "archived" }); onToast?.("Đã lưu trữ đề thi"); }}
          >
            <Archive className="size-4" aria-hidden />
            Lưu trữ
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { persist({ status: "draft" }); onToast?.("Đã lưu nháp"); }}
          >
            <Save className="size-4" aria-hidden />
            Lưu nháp
          </Button>
        )}

        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={blocking.length > 0}
          className="gap-1.5"
          onClick={() => {
            persist({ status: "published" });
            onToast?.(test.status === "published" ? "Đã cập nhật đề thi" : "Đã xuất bản đề thi");
          }}
        >
          <Rocket className="size-4" aria-hidden />
          {test.status === "published" ? "Cập nhật" : "Xuất bản"}
        </Button>
      </div>

      <TestMetadataDialog
        open={metaOpen}
        initial={test}
        onClose={() => setMetaOpen(false)}
        onSave={(t) => { setTest(t); onSave(t, structure, rules); }}
      />
    </div>
  );
}
