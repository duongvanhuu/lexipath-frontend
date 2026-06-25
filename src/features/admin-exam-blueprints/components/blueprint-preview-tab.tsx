"use client";

import * as React from "react";
import { Clock, ListChecks, Layers, Target, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Blueprint, BlueprintSection, ExamTaskType } from "../types/blueprints.types";

interface BlueprintPreviewTabProps {
  blueprint: Blueprint;
  sections: BlueprintSection[];
  taskTypes: ExamTaskType[];
}

export function BlueprintPreviewTab({
  blueprint,
  sections,
  taskTypes,
}: BlueprintPreviewTabProps) {
  const [openSectionId, setOpenSectionId] = React.useState<string | null>(
    sections[0]?.id ?? null,
  );

  const taskTypeMap = Object.fromEntries(taskTypes.map((t) => [t.code, t]));

  const totalQ = sections.reduce(
    (a, s) => a + s.parts.reduce((b, p) => b + (p.qCount || 0), 0),
    0,
  );
  const totalT = sections.reduce((a, s) => a + (s.durationMin || 0), 0);

  const metrics = [
    { label: "Tổng thời gian", value: `${totalT} phút`, icon: Clock },
    { label: "Tổng câu hỏi", value: totalQ, icon: ListChecks },
    { label: "Số phần", value: sections.length, icon: Layers },
    { label: "Điểm đạt", value: blueprint.passMark || "—", icon: Target },
  ] as const;

  return (
    <div className="mt-1">
      <div className="grid grid-cols-4 gap-3 mb-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-surface-card p-4"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <m.icon className="size-3.5 text-text-muted" aria-hidden />
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                {m.label}
              </span>
            </div>
            <p className="text-xl font-bold text-text-primary">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {sections.map((sec) => {
          const isOpen = openSectionId === sec.id;
          const partQ = sec.parts.reduce((a, p) => a + (p.qCount || 0), 0);

          return (
            <div key={sec.id} className="rounded-xl border border-border bg-surface-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSectionId(isOpen ? null : sec.id)}
                className="w-full flex items-center gap-2.5 px-4 py-3.5 text-left hover:bg-surface-hover transition-colors"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-text-muted shrink-0" aria-hidden />
                ) : (
                  <ChevronRight className="size-4 text-text-muted shrink-0" aria-hidden />
                )}
                <span className="font-bold text-sm flex-1">{sec.name}</span>
                <span className="text-[11px] text-text-muted">{sec.durationMin} phút</span>
                <span className="text-[11px] text-text-muted ml-3">{partQ} câu</span>
                {sec.skill && (
                  <Badge variant="secondary" className="text-[10px] h-5 ml-1">
                    {sec.skill}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 ml-1",
                    sec.scoreType === "rubric" && "border-amber-200 text-amber-700 bg-amber-50",
                  )}
                >
                  {sec.scoreType}
                </Badge>
              </button>

              {isOpen && (
                <div className="border-t border-border px-4 pb-4">
                  {sec.parts.map((part, pi) => {
                    const tt = taskTypeMap[part.taskType];
                    return (
                      <div
                        key={part.id}
                        className={cn(
                          "flex items-center gap-2.5 py-2.5",
                          pi < sec.parts.length - 1 && "border-b border-border",
                        )}
                      >
                        <span className="inline-flex size-5 items-center justify-center rounded-md bg-surface-muted text-[10px] font-bold text-text-muted shrink-0">
                          {pi + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{part.name}</p>
                          {part.desc && (
                            <p className="text-[11px] text-text-secondary mt-0.5">{part.desc}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {tt ? (
                            <Badge variant="secondary" className="text-[10px] h-5">
                              {tt.name}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px] h-5">
                              —
                            </Badge>
                          )}
                          {part.mediaType && part.mediaType !== "none" && (
                            <Badge variant="outline" className="text-[10px] h-5">
                              {part.mediaType}
                            </Badge>
                          )}
                          <span className="text-[11px] font-bold text-text-primary min-w-[2rem] text-right">
                            {part.qCount}Q
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
