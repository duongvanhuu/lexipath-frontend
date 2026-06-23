"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { FileText, Unlock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { LearnerExamProgram } from "@/features/exam/types";

export interface ExamProgramCardProps {
  program: LearnerExamProgram;
  className?: string;
}

function ExamProgramCard({ program, className }: ExamProgramCardProps) {
  return (
    <Link
      href={`/exams/${program.id}` as Route}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label={`${program.name} — ${program.lang === 'en' ? 'Tiếng Anh' : program.lang === 'zh' ? 'Tiếng Trung' : 'Tiếng Nhật'}`}
    >
      {/* Card head — surface-muted + left accent */}
      <div className="relative flex items-center gap-3 border-b border-border bg-surface-muted px-5 py-4">
        {/* Left accent rail */}
        <span
          className="absolute inset-y-0 left-0 w-1 rounded-tl-[var(--radius-panel)]"
          style={{ backgroundColor: program.color }}
          aria-hidden
        />
        {/* Icon badge */}
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold tracking-tighter"
          style={{ backgroundColor: program.colorSoft, color: program.color }}
          aria-hidden
        >
          {program.glyphBig}
        </span>
        {/* Name + lang */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-lg font-extrabold leading-tight tracking-tight text-text-primary">
              {program.name}
            </span>
            {program.featured && (
              <span className="inline-flex items-center rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
                ⭐ Nổi bật
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-text-muted">
            {program.langFlag}{" "}
            {program.lang === "en"
              ? "Tiếng Anh"
              : program.lang === "zh"
              ? "Tiếng Trung"
              : "Tiếng Nhật"}
          </p>
        </div>
        {/* Accent dot */}
        <span
          className="size-2.5 shrink-0 rounded-full opacity-60"
          style={{ backgroundColor: program.color }}
          aria-hidden
        />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="text-sm leading-relaxed text-text-secondary">
          {program.desc}
        </p>

        {/* Stats */}
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <FileText className="size-3.5" aria-hidden />
            <strong className="text-text-primary">{program.testCount}</strong> đề thi
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <Unlock className="size-3.5" aria-hidden />
            <strong className="text-text-primary">{program.freeCount}</strong> miễn phí
          </span>
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

        {/* CTA — Phase 1: view tests only */}
        <div className="mt-auto pt-1">
          <Button variant="outline" size="sm" className="w-full" tabIndex={-1}>
            Xem đề thi
            <ArrowRight className="size-3.5" aria-hidden />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export { ExamProgramCard };
