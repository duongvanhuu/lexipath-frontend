"use client";

import * as React from "react";
import { Plus, X, ChevronDown, ChevronRight, AlertCircle, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { BlueprintSection, BlueprintPart, ExamTaskType } from "../types/blueprints.types";
import { SectionEditorPanel } from "./section-editor-panel";
import { PartEditorPanel } from "./part-editor-panel";

interface BlueprintStructureTabProps {
  sections: BlueprintSection[];
  taskTypes: ExamTaskType[];
  selectedSectionId: string | null;
  expandedPartId: string | null;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  onDeleteSection: (id: string) => void;
  onUpdateSection: (section: BlueprintSection) => void;
  onAddPart: (sectionId: string) => void;
  onUpdatePart: (sectionId: string, part: BlueprintPart) => void;
  onDeletePart: (sectionId: string, partId: string) => void;
  onTogglePartExpand: (partId: string) => void;
}

export function BlueprintStructureTab({
  sections,
  taskTypes,
  selectedSectionId,
  expandedPartId,
  onSelectSection,
  onAddSection,
  onDeleteSection,
  onUpdateSection,
  onAddPart,
  onUpdatePart,
  onDeletePart,
  onTogglePartExpand,
}: BlueprintStructureTabProps) {
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="grid grid-cols-[260px_1fr] gap-4 min-h-[480px] mt-1">
      {/* Sections sidebar */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Phần ({sections.length})
          </span>
          <Button variant="ghost" size="sm" onClick={onAddSection} className="h-7 gap-1 text-xs">
            <Plus className="size-3.5" aria-hidden />
            Thêm
          </Button>
        </div>

        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted p-6 text-center">
            <p className="text-xs text-text-muted">Chưa có phần nào</p>
          </div>
        )}

        {sections.map((sec) => {
          const isActive = sec.id === selectedSectionId;
          const partSum = sec.parts.reduce((a, p) => a + (p.qCount || 0), 0);
          const hasMismatch = sec.questionTotal > 0 && partSum !== sec.questionTotal;

          return (
            <div key={sec.id} className="mb-2">
              <button
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-3 text-left transition-all duration-100",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-card hover:bg-surface-hover",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-semibold text-sm truncate",
                      isActive ? "text-primary" : "text-text-primary",
                    )}
                  >
                    {sec.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(sec.id);
                    }}
                    aria-label={`Xóa phần ${sec.name}`}
                    className="ml-1 rounded p-0.5 text-transparent transition-all hover:bg-red-50 hover:text-red-600 focus-visible:text-red-600 focus-visible:outline-none"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {sec.skill && (
                    <span className="rounded px-1.5 py-0.5 text-[10px] text-text-muted bg-surface-muted border border-border">
                      {sec.skill}
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted">
                    {sec.durationMin}p · {sec.questionTotal}Q
                  </span>
                  {hasMismatch && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
                      <AlertCircle className="size-2.5" aria-hidden />
                      mismatch
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  {sec.parts.length} parts
                </p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Section detail + parts */}
      <div>
        {!selectedSection ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted py-16 text-center">
            <MousePointerClick className="size-7 text-text-muted mb-3" aria-hidden />
            <p className="text-sm text-text-muted">Chọn một phần bên trái để chỉnh sửa</p>
          </div>
        ) : (
          <div>
            <SectionEditorPanel
              section={selectedSection}
              onUpdate={onUpdateSection}
            />

            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Parts ({selectedSection.parts.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddPart(selectedSection.id)}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="size-3.5" aria-hidden />
                Thêm part
              </Button>
            </div>

            {selectedSection.parts.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-surface-muted p-4 text-center mb-2">
                <p className="text-xs text-text-muted">
                  Chưa có part nào — nhấn &ldquo;Thêm part&rdquo; để bắt đầu
                </p>
              </div>
            )}

            {selectedSection.parts.map((part) => {
              const isExpanded = expandedPartId === part.id;
              const noType = !part.taskType;

              return (
                <div key={part.id} className="mb-1.5">
                  <button
                    type="button"
                    onClick={() => onTogglePartExpand(part.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors",
                      isExpanded
                        ? "rounded-t-xl border border-b-0 border-blue-200 bg-surface-card"
                        : "rounded-xl border bg-surface-card hover:bg-surface-hover",
                      noType ? "border-red-200" : "border-border",
                    )}
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-3.5 text-text-muted shrink-0" aria-hidden />
                    ) : (
                      <ChevronRight className="size-3.5 text-text-muted shrink-0" aria-hidden />
                    )}
                    <span className="font-semibold text-sm flex-1">{part.name}</span>
                    <span className="text-[11px] text-text-muted">{part.qCount}Q</span>
                    {part.taskType ? (
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {part.taskType}
                      </Badge>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-destructive">
                        <AlertCircle className="size-3" aria-hidden />
                        chưa chọn
                      </span>
                    )}
                  </button>

                  {isExpanded && (
                    <PartEditorPanel
                      part={part}
                      taskTypes={taskTypes}
                      onUpdate={(updated) => onUpdatePart(selectedSection.id, updated)}
                      onDelete={() => onDeletePart(selectedSection.id, part.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
