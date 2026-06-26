"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import type { ExamTest, TestSection, AccessRule, TestStructureMap, AccessRulesMap } from "../types/exam-builder.types";
import { DEFAULT_ACCESS_RULES } from "../mock/exam-builder.mock";
import { TestListView } from "./test-list-view";
import { TestBuilderShell } from "./test-builder-shell";
import { TestMetadataDialog } from "./test-metadata-dialog";

interface TestBuilderClientProps {
  initialTests: ExamTest[];
  initialStructures: TestStructureMap;
  initialAccessRules: AccessRulesMap;
}

export function TestBuilderClient({
  initialTests,
  initialStructures,
  initialAccessRules,
}: TestBuilderClientProps) {
  const [tests, setTests] = useState<ExamTest[]>(initialTests);
  const [structures, setStructures] = useState<TestStructureMap>(() =>
    JSON.parse(JSON.stringify(initialStructures)) as TestStructureMap,
  );
  const [accessRules, setAccessRules] = useState<AccessRulesMap>(() =>
    JSON.parse(JSON.stringify(initialAccessRules)) as AccessRulesMap,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metaOpen, setMetaOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const saveBuilder = (test: ExamTest, structure: TestSection[], rules: AccessRule[]) => {
    setTests((p) => p.map((t) => (t.id === test.id ? test : t)));
    setStructures((p) => ({ ...p, [test.id]: structure }));
    setAccessRules((p) => ({ ...p, [test.id]: rules }));
  };

  const createTest = (test: ExamTest) => {
    setTests((p) => [{ ...test, status: "draft" }, ...p]);
    setStructures((p) => ({ ...p, [test.id]: [] }));
    setAccessRules((p) => ({ ...p, [test.id]: DEFAULT_ACCESS_RULES(test.id) }));
    setEditingId(test.id);
  };

  if (editingId) {
    const test = tests.find((t) => t.id === editingId);
    if (!test) return null;
    return (
      <>
        <TestBuilderShell
          test={test}
          initialStructure={structures[editingId] ?? []}
          initialRules={accessRules[editingId] ?? []}
          onBack={() => setEditingId(null)}
          onSave={saveBuilder}
          onToast={showToast}
        />
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-20 right-6 z-50 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-text-primary shadow-lg border border-border"
          >
            {toast}
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Tạo đề thi</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            {tests.length} đề thi · tìm câu hỏi, dựng cấu trúc, kiểm tra & xuất bản
          </p>
        </div>
        <Button
          type="button"
          variant="default"
          className="gap-1.5"
          onClick={() => setMetaOpen(true)}
        >
          <Plus className="size-4" aria-hidden />
          Tạo đề thi
        </Button>
      </div>

      <TestListView
        tests={tests}
        structures={structures}
        onSelect={setEditingId}
      />

      <TestMetadataDialog
        open={metaOpen}
        initial={null}
        onClose={() => setMetaOpen(false)}
        onSave={createTest}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-text-primary shadow-lg border border-border"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
