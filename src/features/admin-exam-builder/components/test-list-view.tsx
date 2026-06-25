"use client";

import { Clock, List, Layers, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { cn } from "@/lib/utils/cn";
import type { ExamTest, TestSection, TestStatus } from "../types/exam-builder.types";
import { getProgramColor, getProgramCode } from "../mock/exam-builder.mock";

interface TestListViewProps {
  tests: ExamTest[];
  structures: Record<string, TestSection[]>;
  onSelect: (id: string) => void;
}

const STATUS_GROUPS: { key: TestStatus; label: string }[] = [
  { key: "published", label: "Đã xuất bản" },
  { key: "draft",     label: "Bản nháp" },
  { key: "archived",  label: "Đã lưu trữ" },
];

export function TestListView({ tests, structures, onSelect }: TestListViewProps) {
  const grouped = {
    published: tests.filter((t) => t.status === "published"),
    draft:     tests.filter((t) => t.status === "draft"),
    archived:  tests.filter((t) => t.status === "archived"),
  };

  return (
    <div className="flex flex-col gap-7">
      {STATUS_GROUPS.map(({ key, label }) => {
        const group = grouped[key];
        if (group.length === 0) return null;
        return (
          <div key={key}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary whitespace-nowrap">
                {label} · {group.length}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-3">
              {group.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  structure={structures[test.id] ?? []}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        );
      })}

      {tests.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface-muted py-16 text-center">
          <Layers className="size-10 text-text-muted" aria-hidden />
          <p className="text-sm font-medium text-text-secondary">Chưa có đề thi nào.</p>
          <p className="text-xs text-text-muted">Bấm &ldquo;Tạo đề thi&rdquo; để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}

function TestCard({
  test,
  structure,
  onSelect,
}: {
  test: ExamTest;
  structure: TestSection[];
  onSelect: (id: string) => void;
}) {
  const color = getProgramColor(test.programId);
  const code = getProgramCode(test.programId);
  const totalQ = structure.reduce((a, s) => a + s.parts.reduce((b, p) => b + p.questionIds.length, 0), 0);
  const statusForBadge = (test.status === "archived" ? "archived" : test.status) as ContentStatus;

  return (
    <Card
      className={cn(
        "cursor-pointer p-4 transition-shadow hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-ring",
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3.5 text-left"
        onClick={() => onSelect(test.id)}
      >
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold"
          style={{ color, background: `${color}14` }}
          aria-hidden
        >
          {code}
        </span>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <code className="rounded bg-surface-muted px-1.5 py-0.5 text-[11px] font-bold text-text-muted">
              {test.code}
            </code>
            <ContentStatusBadge status={statusForBadge} />
            <span className="text-[11px] text-text-muted">v{test.version}</span>
          </div>
          <p className="mb-1 font-bold text-text-primary">{test.name}</p>
          {test.desc && (
            <p className="mb-2.5 text-xs leading-relaxed text-text-muted line-clamp-2">{test.desc}</p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {test.durationMin} phút
            </span>
            <span className="flex items-center gap-1">
              <List className="size-3" aria-hidden />
              {totalQ || test.questionTotal} câu
            </span>
            <span className="flex items-center gap-1">
              <Layers className="size-3" aria-hidden />
              {structure.length || test.sectionCount} phần
            </span>
            <span className="ml-auto text-text-muted">{test.updatedAt}</span>
          </div>
        </div>

        <ChevronRight className="mt-1 size-4 shrink-0 text-text-muted" aria-hidden />
      </button>
    </Card>
  );
}
