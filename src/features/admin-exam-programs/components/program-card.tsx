"use client";

import * as React from "react";
import { Layers, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ExamProgram } from "../types/exam-programs.types";
import { ProgramStatusDot } from "./program-status-dot";

const LANG_LABELS: Record<string, string> = {
  en: "Tiếng Anh",
  ja: "Tiếng Nhật",
  zh: "Tiếng Trung",
};

interface ProgramCardProps {
  program: ExamProgram;
  onClick?: (program: ExamProgram) => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(program)}
      className={cn(
        "group w-full rounded-2xl border border-border bg-surface-card text-left",
        "overflow-hidden shadow-sm transition-all duration-150",
        "hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {/* Color band header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ backgroundColor: program.color }}
      >
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/20 shrink-0">
          <span
            className="font-bold text-base text-white leading-none"
            aria-hidden
          >
            {program.code.slice(0, 2)}
          </span>
        </span>
        <div>
          <div className="text-lg font-extrabold text-white leading-tight tracking-tight">
            {program.name}
          </div>
          <div className="text-[10px] text-white/70 font-medium">
            {LANG_LABELS[program.lang] ?? program.lang}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-xs text-text-secondary leading-relaxed mb-2.5 min-h-[2.5rem] line-clamp-2">
          {program.desc}
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
            <Layers className="size-3" aria-hidden />
            <strong className="text-text-primary">{program.blueprintCount}</strong>
            {" "}BP
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
            <FileText className="size-3" aria-hidden />
            <strong className="text-text-primary">{program.testCount}</strong>
            {" "}đề
          </span>
          <ProgramStatusDot status={program.status} />
        </div>
      </div>
    </button>
  );
}
