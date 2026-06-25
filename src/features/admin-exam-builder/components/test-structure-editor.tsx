"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { QuestionTypeChip } from "@/features/admin-exam-qbank/components/atoms/question-type-chip";
import { QB_QUESTIONS } from "@/features/admin-exam-qbank/mock/question-bank.mock";
import type { QuestionType } from "@/features/admin-exam-qbank/types/question-bank.types";
import type { TestSection } from "../types/exam-builder.types";
import { BUILDER_SKILLS, BUILDER_TASK_TYPES } from "../mock/exam-builder.mock";
import { ReorderButtons } from "./reorder-buttons";
import { AddQuestionsDialog } from "./add-questions-dialog";

interface TestStructureEditorProps {
  structure: TestSection[];
  onChange: (structure: TestSection[]) => void;
  onToast?: ((msg: string) => void) | undefined;
}

function qById(id: string) {
  return QB_QUESTIONS.find((q) => q.id === id);
}

function cloneStructure(s: TestSection[]): TestSection[] {
  return JSON.parse(JSON.stringify(s)) as TestSection[];
}

type AddTarget = { si: number; pi: number; skill: string } | null;

export function TestStructureEditor({ structure, onChange, onToast }: TestStructureEditorProps) {
  const [addTo, setAddTo] = useState<AddTarget>(null);

  const mut = (fn: (s: TestSection[]) => void) => {
    const next = cloneStructure(structure);
    fn(next);
    onChange(next);
  };

  const addSection = () =>
    mut((s) => s.push({ id: `ts-${Date.now()}`, order: s.length + 1, name: "Phần mới", skill: "reading", durationMin: 30, parts: [] }));

  const addPart = (si: number) =>
    mut((s) => {
      const sec = s[si];
      if (!sec) return;
      sec.parts.push({ id: `tp-${Date.now()}`, order: sec.parts.length + 1, name: "Part mới", taskType: "mcq", qCount: 0, questionIds: [] });
    });

  const moveSection = (si: number, d: number) =>
    mut((s) => {
      const j = si + d;
      if (j < 0 || j >= s.length) return;
      const a = s[si]; const b = s[j];
      if (!a || !b) return;
      s[si] = b; s[j] = a;
    });

  const movePart = (si: number, pi: number, d: number) =>
    mut((s) => {
      const arr = s[si]?.parts;
      if (!arr) return;
      const j = pi + d;
      if (j < 0 || j >= arr.length) return;
      const a = arr[pi]; const b = arr[j];
      if (!a || !b) return;
      arr[pi] = b; arr[j] = a;
    });

  const moveQ = (si: number, pi: number, qi: number, d: number) =>
    mut((s) => {
      const arr = s[si]?.parts[pi]?.questionIds;
      if (!arr) return;
      const j = qi + d;
      if (j < 0 || j >= arr.length) return;
      const a = arr[qi]; const b = arr[j];
      if (a === undefined || b === undefined) return;
      arr[qi] = b; arr[j] = a;
    });

  const delSection = (si: number) => mut((s) => s.splice(si, 1));
  const delPart = (si: number, pi: number) => mut((s) => { s[si]?.parts.splice(pi, 1); });
  const delQ = (si: number, pi: number, qi: number) => mut((s) => { s[si]?.parts[pi]?.questionIds.splice(qi, 1); });

  const setSec = (si: number, k: keyof TestSection, v: string | number) =>
    mut((s) => {
      const sec = s[si];
      if (!sec) return;
      (sec as unknown as Record<string, unknown>)[k] = v;
    });

  const setPart = (si: number, pi: number, k: string, v: string | number) =>
    mut((s) => {
      const part = s[si]?.parts[pi];
      if (!part) return;
      (part as unknown as Record<string, unknown>)[k] = v;
    });

  const allExistingIds = structure.flatMap((s) => s.parts.flatMap((p) => p.questionIds));

  return (
    <div>
      <div className="flex flex-col gap-4">
        {structure.map((sec, si) => {
          const secQ = sec.parts.reduce((a, p) => a + (p.questionIds?.length ?? 0), 0);
          return (
            <Card key={sec.id} className="overflow-hidden p-0">
              {/* Section header */}
              <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-surface-muted px-4 py-3">
                <ReorderButtons
                  onUp={() => moveSection(si, -1)}
                  onDown={() => moveSection(si, 1)}
                  disabledUp={si === 0}
                  disabledDown={si === structure.length - 1}
                />
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                  {si + 1}
                </span>
                <Input
                  className="h-8 max-w-64 font-semibold"
                  value={sec.name}
                  onChange={(e) => setSec(si, "name", e.target.value)}
                  aria-label={`Tên phần ${si + 1}`}
                />
                <select
                  className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring"
                  value={sec.skill}
                  onChange={(e) => setSec(si, "skill", e.target.value)}
                  aria-label="Kỹ năng"
                >
                  {BUILDER_SKILLS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    className="h-8 w-16 text-center"
                    value={sec.durationMin}
                    min={0}
                    onChange={(e) => setSec(si, "durationMin", Number(e.target.value))}
                    aria-label="Thời lượng (phút)"
                  />
                  <span className="text-xs text-text-muted">phút</span>
                </div>
                <div className="flex-1" />
                <Badge variant="secondary">{secQ} câu</Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-text-muted hover:text-danger"
                  onClick={() => delSection(si)}
                  aria-label={`Xóa phần ${sec.name}`}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </Button>
              </div>

              {/* Parts */}
              <div className="flex flex-col gap-3 p-4">
                {sec.parts.map((part, pi) => {
                  const qCount = part.questionIds.length;
                  const hasTarget = part.qCount > 0;
                  const countOk = !hasTarget || qCount === part.qCount;
                  return (
                    <div key={part.id} className="overflow-hidden rounded-xl border border-border">
                      {/* Part header */}
                      <div className={cn(
                        "flex flex-wrap items-center gap-2 px-3 py-2 bg-card",
                        qCount > 0 && "border-b border-border",
                      )}>
                        <ReorderButtons
                          onUp={() => movePart(si, pi, -1)}
                          onDown={() => movePart(si, pi, 1)}
                          disabledUp={pi === 0}
                          disabledDown={pi === sec.parts.length - 1}
                        />
                        <Input
                          className="h-7 max-w-48 font-semibold text-sm"
                          value={part.name}
                          onChange={(e) => setPart(si, pi, "name", e.target.value)}
                          aria-label={`Tên part ${pi + 1}`}
                        />
                        <select
                          className="rounded-md border border-border bg-surface-muted px-2 py-1 text-xs text-text-primary outline-none focus:ring-1 focus:ring-ring"
                          value={part.taskType}
                          onChange={(e) => setPart(si, pi, "taskType", e.target.value)}
                          aria-label="Dạng câu"
                        >
                          {BUILDER_TASK_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-text-muted">mục tiêu</span>
                          <Input
                            type="number"
                            className="h-7 w-14 text-center text-xs"
                            min={0}
                            value={part.qCount}
                            onChange={(e) => setPart(si, pi, "qCount", Number(e.target.value))}
                            aria-label="Số câu mục tiêu"
                          />
                        </div>
                        <div className="flex-1" />
                        <span className={cn(
                          "text-xs font-semibold",
                          countOk ? "text-success-foreground" : "text-warning-foreground",
                        )}>
                          {qCount}{hasTarget ? `/${part.qCount}` : ""} câu
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-text-muted hover:text-danger"
                          onClick={() => delPart(si, pi)}
                          aria-label={`Xóa part ${part.name}`}
                        >
                          <Trash2 className="size-3" aria-hidden />
                        </Button>
                      </div>

                      {/* Questions */}
                      {qCount > 0 && (
                        <div className="flex flex-col gap-1.5 bg-surface-muted px-3 py-2">
                          {part.questionIds.map((qid, qi) => {
                            const item = qById(qid);
                            return (
                              <div
                                key={qid}
                                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5"
                              >
                                <span className="w-5 shrink-0 text-center text-[11px] text-text-muted">{qi + 1}</span>
                                {item && <QuestionTypeChip type={item.type as QuestionType} size="sm" />}
                                <span className="flex-1 truncate text-xs text-text-secondary">
                                  {item?.stem ?? "(đã xóa)"}
                                </span>
                                <span className="shrink-0 text-[11px] text-text-muted">{item?.points ?? 0}đ</span>
                                <ReorderButtons
                                  onUp={() => moveQ(si, pi, qi, -1)}
                                  onDown={() => moveQ(si, pi, qi, 1)}
                                  disabledUp={qi === 0}
                                  disabledDown={qi === part.questionIds.length - 1}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-5 text-text-muted hover:text-danger"
                                  onClick={() => delQ(si, pi, qi)}
                                  aria-label={`Xóa câu hỏi ${qi + 1}`}
                                >
                                  <X className="size-3" aria-hidden />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add question button */}
                      <div className={cn("px-3 py-2", qCount > 0 ? "bg-surface-muted" : "bg-card")}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          onClick={() => setAddTo({ si, pi, skill: sec.skill })}
                        >
                          <Plus className="size-3.5" aria-hidden />
                          Thêm câu hỏi từ ngân hàng
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => addPart(si)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
                >
                  <Plus className="size-4" aria-hidden />
                  Thêm phần con (part)
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-3 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
      >
        <Plus className="size-4" aria-hidden />
        Thêm phần (section)
      </button>

      <AddQuestionsDialog
        open={!!addTo}
        onClose={() => setAddTo(null)}
        existingIds={allExistingIds}
        defaultSkill={addTo?.skill}
        onAdd={(ids) => {
          if (!addTo) return;
          const { si, pi } = addTo;
          mut((s) => { s[si]?.parts[pi]?.questionIds.push(...ids); });
          onToast?.(`Đã thêm ${ids.length} câu hỏi`);
        }}
      />
    </div>
  );
}
