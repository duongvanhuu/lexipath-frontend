"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, FileText, Unlock } from "lucide-react";

import { EmptyState } from "@/components/shared/feedback/empty-state";
import { Button } from "@/components/ui/button";
import {
  ExamFilterChip,
  ExamTestCard,
} from "@/features/exam/components";
import {
  EXAM_PROGRAMS,
  EXAM_TESTS,
  EXAM_TYPE_META,
} from "@/features/exam";
import type { LearnerExamProgram } from "@/features/exam/types";

interface ExamProgramViewProps {
  program: LearnerExamProgram;
}

export function ExamProgramView({ program }: ExamProgramViewProps) {
  const [filterType, setFilterType] = React.useState("all");
  const [filterSkill, setFilterSkill] = React.useState("all");
  const [filterAccess, setFilterAccess] = React.useState("all");
  const [filterTag, setFilterTag] = React.useState("all");

  const progTests = EXAM_TESTS.filter((t) => t.programId === program.id);
  const allSkills = [...new Set(progTests.flatMap((t) => t.skills))];

  const filtered = progTests.filter((t) => {
    if (filterType !== "all" && t.typeId !== filterType) return false;
    if (filterAccess !== "all" && t.access !== filterAccess) return false;
    if (filterTag === "new" && !t.isNew) return false;
    if (filterTag === "featured" && !t.featured) return false;
    if (filterSkill !== "all" && !t.skills.includes(filterSkill)) return false;
    return true;
  });

  function clearFilters() {
    setFilterType("all");
    setFilterSkill("all");
    setFilterAccess("all");
    setFilterTag("all");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-text-muted"
      >
        <Link
          href="/exams"
          className="inline-flex items-center gap-1 font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Kho đề
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-semibold text-text-primary">{program.name}</span>
      </nav>

      {/* Hero — surface card + left accent rail, no gradient */}
      <div className="relative flex flex-wrap items-center gap-5 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card px-7 py-6 shadow-[var(--shadow-card)]">
        {/* Left accent */}
        <span
          className="absolute inset-y-0 left-0 w-1.5 rounded-l-[var(--radius-panel)]"
          style={{ backgroundColor: program.color }}
          aria-hidden
        />

        {/* Icon badge */}
        <span
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold"
          style={{ backgroundColor: program.colorSoft, color: program.color }}
          aria-hidden
        >
          {program.glyphBig}
        </span>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              {program.name}
            </h1>
            {program.featured && (
              <span className="inline-flex items-center rounded-full bg-warning-soft px-2.5 py-0.5 text-[10px] font-bold text-warning-foreground">
                ⭐ Nổi bật
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-secondary">
            {program.langFlag} {program.fullName}
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {[
              [program.testCount, "đề thi"],
              [program.freeCount, "miễn phí"],
              [program.skills.length, "kỹ năng"],
            ].map(([v, l]) => (
              <span key={String(l)} className="text-sm font-medium text-text-muted">
                <strong className="font-bold text-text-primary">{v}</strong> {l}
              </span>
            ))}
          </div>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-1.5">
          {program.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold"
              style={{
                backgroundColor: program.colorSoft,
                color: program.color,
                borderColor: `${program.color}33`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Bộ lọc đề thi"
      >
        {/* Type */}
        <ExamFilterChip
          label="Tất cả loại"
          active={filterType === "all"}
          onClick={() => setFilterType("all")}
        />
        {(Object.entries(EXAM_TYPE_META) as [string, (typeof EXAM_TYPE_META)[keyof typeof EXAM_TYPE_META]][]).map(
          ([id, meta]) => (
            <ExamFilterChip
              key={id}
              label={meta.label}
              active={filterType === id}
              onClick={() => setFilterType(id)}
            />
          )
        )}

        {allSkills.length > 1 && (
          <>
            <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
            <ExamFilterChip
              label="Tất cả kỹ năng"
              active={filterSkill === "all"}
              onClick={() => setFilterSkill("all")}
            />
            {allSkills.map((s) => (
              <ExamFilterChip
                key={s}
                label={s}
                active={filterSkill === s}
                onClick={() => setFilterSkill(s)}
              />
            ))}
          </>
        )}

        <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />

        <ExamFilterChip
          label="Miễn phí"
          active={filterAccess === "free"}
          onClick={() => setFilterAccess(filterAccess === "free" ? "all" : "free")}
        />
        <ExamFilterChip
          label="Pro"
          active={filterAccess === "pro"}
          onClick={() => setFilterAccess(filterAccess === "pro" ? "all" : "pro")}
        />
        <ExamFilterChip
          label="⭐ Nổi bật"
          active={filterTag === "featured"}
          onClick={() => setFilterTag(filterTag === "featured" ? "all" : "featured")}
        />
        <ExamFilterChip
          label="Mới"
          active={filterTag === "new"}
          onClick={() => setFilterTag(filterTag === "new" ? "all" : "new")}
        />
      </div>

      {/* Results count */}
      <p className="-mt-2 text-sm font-medium text-text-muted">
        <strong className="text-text-primary">{filtered.length}</strong> / {progTests.length} đề thi {program.name}
      </p>

      {/* Test grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="Không tìm thấy đề thi phù hợp"
          description="Thử thay đổi bộ lọc để xem thêm đề thi."
          action={{ label: "Xóa bộ lọc", onClick: clearFilters }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ExamTestCard
              key={t.id}
              test={t}
              program={program}
              typeMeta={EXAM_TYPE_META[t.typeId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
