"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Clock, List, Trophy, Unlock, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { LearnerExamTest, LearnerExamProgram, ExamTypeInfo } from "@/features/exam/types";

export interface ExamTestCardProps {
  test: LearnerExamTest;
  program: LearnerExamProgram | undefined;
  typeMeta: ExamTypeInfo | undefined;
  className?: string;
}

function ExamTestCard({ test, program, typeMeta, className }: ExamTestCardProps) {
  const progColor = program?.color ?? "var(--color-primary)";

  return (
    <Link
      href={`/exams/${test.programId}/${test.id}` as Route}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card px-5 pt-4 pb-4 shadow-[var(--shadow-card)] transition-all duration-150 hover:-translate-y-px hover:shadow-[var(--shadow-pop)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Left accent rail */}
      <span
        className="absolute inset-y-0 left-0 w-1 rounded-l-[var(--radius-card)]"
        style={{ backgroundColor: progColor }}
        aria-hidden
      />

      {/* Badge row */}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5 pl-1">
        {program && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: program.colorSoft, color: program.colorSoftFg }}
          >
            {program.langFlag} {program.name}
          </span>
        )}
        {typeMeta && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: typeMeta.soft, color: typeMeta.softFg }}
          >
            {typeMeta.label}
          </span>
        )}
        {test.isNew && (
          <span className="inline-flex items-center rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success-foreground">
            Mới
          </span>
        )}
        {test.featured && (
          <span className="inline-flex items-center rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
            ⭐ Nổi bật
          </span>
        )}
      </div>

      {/* Title */}
      <p className="mb-1.5 pl-1 text-sm font-semibold leading-snug text-text-primary">
        {test.title}
      </p>

      {/* Description */}
      <p className="mb-3 flex-1 pl-1 text-xs leading-relaxed text-text-secondary">
        {test.desc}
      </p>

      {/* Meta */}
      <div className="mb-3 flex flex-wrap items-center gap-3 pl-1">
        <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
          <Clock className="size-3.5" aria-hidden />
          {test.durationMin} phút
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
          <List className="size-3.5" aria-hidden />
          {test.questions} câu
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
          <Trophy className="size-3.5" aria-hidden />
          {test.maxScore}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pl-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
            {test.level}
          </span>
          {test.access === "free" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success-foreground">
              <Unlock className="size-2.5" aria-hidden />
              Miễn phí
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
              <Star className="size-2.5" aria-hidden />
              Pro
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
        >
          Xem chi tiết
        </Button>
      </div>
    </Link>
  );
}

export { ExamTestCard };
