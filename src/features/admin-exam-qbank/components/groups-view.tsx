"use client";

import * as React from "react";
import { BookOpen, Headphones, FileQuestion, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { GroupEditorDialog } from "./group-editor-dialog";
import { QuestionStatusBadge } from "./atoms/question-status-badge";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QB_PROGRAMS } from "../mock/question-bank.mock";
import type { QuestionGroup, Question } from "../types/question-bank.types";

// ─── Constants ────────────────────────────────────────────────────────────────
const STIMULUS_ICON: Record<QuestionGroup["stimulusType"], React.ElementType> = {
  passage:    BookOpen,
  audio:      Headphones,
  standalone: FileQuestion,
};

const SKILL_LABEL: Record<QuestionGroup["skill"], string> = {
  listening: "Nghe",
  reading:   "Đọc",
  writing:   "Viết",
  speaking:  "Nói",
  grammar:   "Ngữ pháp",
  vocab:     "Từ vựng",
};

const PROG_MAP = Object.fromEntries(QB_PROGRAMS.map((p) => [p.id, p]));

// ─── Props ────────────────────────────────────────────────────────────────────
export interface GroupsViewProps {
  groups: QuestionGroup[];
  questions: Question[];
  onOpenQuestion: (question: Question) => void;
  onSaveGroup: (group: QuestionGroup) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function GroupsView({
  groups,
  questions,
  onOpenQuestion,
  onSaveGroup,
  className,
}: GroupsViewProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<QuestionGroup | null>(null);

  const qById = React.useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q])),
    [questions],
  );

  function openCreate() {
    setEditingGroup(null);
    setDialogOpen(true);
  }

  function openEdit(group: QuestionGroup) {
    setEditingGroup(group);
    setDialogOpen(true);
  }

  function handleSave(saved: QuestionGroup) {
    onSaveGroup(saved);
    setDialogOpen(false);
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Nhóm câu hỏi</h2>
            <span className="text-sm text-muted-foreground">{groups.length} nhóm</span>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 size-4" aria-hidden />
            Tạo nhóm
          </Button>
        </div>

        {/* Empty state */}
        {groups.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-16">
            <p className="text-sm text-muted-foreground">Chưa có nhóm câu hỏi.</p>
          </div>
        )}

        {/* Group cards grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {groups.map((group) => {
            const Icon = STIMULUS_ICON[group.stimulusType];
            const prog = PROG_MAP[group.programId];
            const resolvedQuestions = group.questionIds
              .map((id) => qById[id])
              .filter((q): q is Question => q !== undefined);

            return (
              <Card key={group.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="mt-0.5 shrink-0 rounded-lg bg-muted p-1.5">
                        <Icon className="size-4 text-muted-foreground" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                            {group.code}
                          </code>
                          <QuestionStatusBadge status={group.status} />
                        </div>
                        <CardTitle className="text-sm font-semibold leading-snug">
                          {group.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Sửa nhóm"
                      onClick={() => openEdit(group)}
                      className="shrink-0"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Program + skill meta */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {prog && (
                      <span className="font-medium">{prog.code}</span>
                    )}
                    <span>·</span>
                    <span>{SKILL_LABEL[group.skill]}</span>
                    <span>·</span>
                    <span>{resolvedQuestions.length} câu hỏi</span>
                  </div>

                  {/* Stimulus preview */}
                  {group.stimulus.trim().length > 0 && (
                    <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {group.stimulus}
                    </p>
                  )}

                  {/* Instructions preview */}
                  {group.instructions.trim().length > 0 && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      <span className="font-medium text-foreground">Hướng dẫn:</span>{" "}
                      {group.instructions}
                    </p>
                  )}

                  {/* Question chips */}
                  {group.questionIds.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Chưa có câu hỏi trong nhóm.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {group.questionIds.map((qId) => {
                        const q = qById[qId];
                        if (!q) return null;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => onOpenQuestion(q)}
                            className="inline-flex max-w-[200px] items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                          >
                            <QuestionTypeChip type={q.type} size="sm" />
                            <span className="truncate">{q.stem || "(trống)"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Group editor dialog */}
      <GroupEditorDialog
        group={editingGroup}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </>
  );
}
