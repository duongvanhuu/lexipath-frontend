"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Clock, List } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import type { ExamBlueprintSection } from "@/features/exam/types";

export interface ExamSectionAccordionProps {
  section: ExamBlueprintSection;
  defaultOpen?: boolean;
  className?: string;
}

function ExamSectionAccordion({
  section,
  defaultOpen = true,
  className,
}: ExamSectionAccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const headerId = React.useId();
  const bodyId = React.useId();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-border",
        className
      )}
    >
      <button
        type="button"
        id={headerId}
        aria-controls={bodyId}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {open ? (
            <ChevronDown className="size-3.5" aria-hidden />
          ) : (
            <ChevronRight className="size-3.5" aria-hidden />
          )}
        </span>
        <span className="flex-1 text-sm font-bold text-text-primary">{section.name}</span>
        <span className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {section.durationMin} phút
          </span>
          <span className="flex items-center gap-1">
            <List className="size-3" aria-hidden />
            {section.totalQ} câu
          </span>
        </span>
      </button>

      {open && (
        <div
          id={bodyId}
          role="region"
          aria-labelledby={headerId}
          className="divide-y divide-border border-t border-border bg-surface-muted"
        >
          {section.parts.map((part, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto] items-start gap-3 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">{part.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{part.desc}</p>
                <p className="mt-0.5 text-[11px] italic text-text-muted">{part.type}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-text-secondary">{part.q}</span>
                <span className="ml-0.5 text-[10px] font-medium text-text-muted"> câu</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ExamSectionAccordion };
