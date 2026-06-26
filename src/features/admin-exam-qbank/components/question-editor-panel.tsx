"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { Question, QuestionType } from "@/features/admin-exam-qbank/types/question-bank.types";
import {
  QB_TYPE_REGISTRY,
  QB_PROGRAMS,
  QB_TAGS,
  QB_SOURCES,
  QB_SKILL_REGISTRY,
} from "@/features/admin-exam-qbank/mock/question-bank.mock";
import { blankQuestion } from "@/features/admin-exam-qbank/mock/blank-question";
import { isAutoGraded } from "./atoms/question-atom-meta";

import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionGradeChip } from "./atoms/question-grade-chip";
import { QuestionStatusBadge } from "./atoms/question-status-badge";
import { ChoiceEditor } from "./answer-editors/choice-editor";
import { FillBlankEditor } from "./answer-editors/fill-blank-editor";
import { MatchingPairEditor } from "./answer-editors/matching-pair-editor";
import { OrderingEditor } from "./answer-editors/ordering-editor";
import { JudgeEditor } from "./answer-editors/judge-editor";
import { AnswerKeyEditor } from "./answer-editors/answer-key-editor";
import { OpenPromptEditor } from "./answer-editors/open-prompt-editor";
import { QuestionPreview } from "./question-preview";
import { LinkVocabDialog } from "./link-vocab-dialog";

// ─── Props ────────────────────────────────────────────────────────────────────

export type QuestionEditorPanelProps = {
  question: Question;
  mode?: "create" | "edit";
  onBack: () => void;
  onSave: (question: Question) => void;
  onPublish: (question: Question) => void;
  className?: string;
};

// ─── Type list (ordered) ──────────────────────────────────────────────────────

const QB_TYPES_LIST = Object.values(QB_TYPE_REGISTRY);

// ─── Validation ───────────────────────────────────────────────────────────────

function validateDraft(d: Question): string[] {
  const errors: string[] = [];
  if (!d.stem.trim()) errors.push("Thiếu đề bài");
  if (d.points <= 0) errors.push("Điểm phải lớn hơn 0");
  switch (d.type) {
    case "mcq":
    case "multi":
      if (!(d.choices ?? []).some((c) => c.correct))
        errors.push("Chưa chọn đáp án đúng");
      break;
    case "fill":
      if (!(d.blanks ?? []).length) errors.push("Chưa có chỗ trống");
      else if ((d.blanks ?? []).some((b) => !b.accepted.length))
        errors.push("Có chỗ trống chưa có đáp án");
      break;
    case "matching":
      if ((d.pairs ?? []).length < 2) errors.push("Cần ít nhất 2 cặp ghép");
      break;
    case "ordering":
      if ((d.orderItems ?? []).length < 2)
        errors.push("Cần ít nhất 2 mục sắp xếp");
      break;
    case "tfng":
    case "ynng":
      if (!d.judgeAnswer) errors.push("Chưa chọn đáp án");
      break;
    case "short":
      if (!(d.answerKeys ?? []).length) errors.push("Chưa có đáp án");
      break;
    case "writing":
    case "speaking":
      if (!d.rubricId) errors.push("Chưa chọn rubric chấm điểm");
      break;
  }
  return errors;
}

// ─── Skill label map ──────────────────────────────────────────────────────────

const SKILL_LABEL: Record<string, string> = Object.fromEntries(
  QB_SKILL_REGISTRY.map((s) => [s.id, s.name]),
);

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestionEditorPanel({
  question,
  mode = "edit",
  onBack,
  onSave,
  onPublish,
  className,
}: QuestionEditorPanelProps) {
  const [draft, setDraft] = useState<Question>(question);
  const [vocabDialogOpen, setVocabDialogOpen] = useState(false);

  // Reset draft when question.id changes.
  // Initializing state from a prop when a key identifier changes is an
  // intentional controlled-reset pattern; the set-state-in-effect warning
  // is suppressed here because this is not a cascading-render risk.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDraft(question);
  }, [question.id]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const validationErrors = useMemo(() => validateDraft(draft), [draft]);

  // ── Type switch ────────────────────────────────────────────────────────────

  function switchType(newType: QuestionType) {
    const base = blankQuestion(newType);
    setDraft((prev) => ({
      ...base,
      id: prev.id,
      stem: prev.stem,
      explanation: prev.explanation,
      programId: prev.programId,
      skill: prev.skill,
      difficulty: prev.difficulty,
      points: prev.points,
      status: prev.status,
      groupId: prev.groupId,
      tagIds: prev.tagIds,
      sourceId: prev.sourceId,
      vocabIds: prev.vocabIds,
    }));
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={cn("space-y-4", className)}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label="Quay lại ngân hàng"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Quay lại
        </button>

        <QuestionTypeChip type={draft.type} />

        <span className="text-lg font-bold tracking-tight">
          {mode === "create" ? "Câu hỏi mới" : "Chỉnh sửa câu hỏi"}
        </span>

        <QuestionStatusBadge status={draft.status} />

        <QuestionGradeChip type={draft.type} rubricId={draft.rubricId ?? null} />

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSave({ ...draft, status: "draft" })}
          >
            Lưu nháp
          </Button>
          <Button
            type="button"
            disabled={validationErrors.length > 0}
            onClick={() => onPublish({ ...draft, status: "published" })}
          >
            Xuất bản
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Left: tabs */}
        <div className="min-w-0 flex-1">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Nội dung & đáp án</TabsTrigger>
              <TabsTrigger value="meta">Phân loại & nguồn</TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>

            {/* ── Tab: content ───────────────────────────────────────────── */}
            <TabsContent value="content">
              <Card>
                <CardContent className="space-y-5 p-5">
                  {/* Type picker */}
                  <div>
                    <Label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Dạng câu hỏi
                    </Label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {QB_TYPES_LIST.map((t) => {
                        const isActive = draft.type === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            title={t.desc}
                            onClick={() => switchType(t.id)}
                            className={cn(
                              "flex flex-col items-center gap-1 rounded-lg border-[1.5px] px-2 py-2 text-[10px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
                            )}
                          >
                            <QuestionTypeChip
                              type={t.id}
                              size="sm"
                              showIcon
                              className="pointer-events-none"
                            />
                            <span>{t.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stem */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-stem"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Đề bài
                    </Label>
                    <Textarea
                      id="qep-stem"
                      value={draft.stem}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, stem: e.target.value }))
                      }
                      placeholder="Nhập nội dung câu hỏi…"
                      className="min-h-20 text-sm"
                    />
                  </div>

                  {/* Answer editor — switch by type */}
                  {draft.type === "mcq" && (
                    <ChoiceEditor
                      choices={draft.choices ?? []}
                      multi={false}
                      onChange={(choices) =>
                        setDraft((d) => ({ ...d, choices }))
                      }
                    />
                  )}

                  {draft.type === "multi" && (
                    <ChoiceEditor
                      choices={draft.choices ?? []}
                      multi={true}
                      onChange={(choices) =>
                        setDraft((d) => ({ ...d, choices }))
                      }
                    />
                  )}

                  {draft.type === "fill" && (
                    <FillBlankEditor
                      stem={draft.stem}
                      blanks={draft.blanks ?? []}
                      onChange={(blanks) =>
                        setDraft((d) => ({ ...d, blanks }))
                      }
                    />
                  )}

                  {draft.type === "matching" && (
                    <MatchingPairEditor
                      pairs={draft.pairs ?? []}
                      onChange={(pairs) =>
                        setDraft((d) => ({ ...d, pairs }))
                      }
                    />
                  )}

                  {draft.type === "ordering" && (
                    <OrderingEditor
                      items={draft.orderItems ?? []}
                      onChange={(orderItems) =>
                        setDraft((d) => ({ ...d, orderItems }))
                      }
                    />
                  )}

                  {draft.type === "tfng" && (
                    <JudgeEditor
                      type="tfng"
                      value={draft.judgeAnswer ?? ""}
                      onChange={(judgeAnswer) =>
                        setDraft((d) => ({ ...d, judgeAnswer }))
                      }
                    />
                  )}

                  {draft.type === "ynng" && (
                    <JudgeEditor
                      type="ynng"
                      value={draft.judgeAnswer ?? ""}
                      onChange={(judgeAnswer) =>
                        setDraft((d) => ({ ...d, judgeAnswer }))
                      }
                    />
                  )}

                  {draft.type === "short" && (
                    <AnswerKeyEditor
                      answerKeys={draft.answerKeys ?? []}
                      {...(draft.maxWords !== undefined
                        ? { maxWords: draft.maxWords }
                        : {})}
                      onChange={(answerKeys) =>
                        setDraft((d) => ({ ...d, answerKeys }))
                      }
                      onMaxWordsChange={(maxWords) =>
                        setDraft((d) => {
                          if (maxWords === undefined) {
                            const { maxWords: _omit, ...rest } = d;
                            return rest as Question;
                          }
                          return { ...d, maxWords };
                        })
                      }
                    />
                  )}

                  {draft.type === "writing" && (
                    <OpenPromptEditor
                      type="writing"
                      {...(draft.rubricId !== undefined
                        ? { rubricId: draft.rubricId }
                        : {})}
                      {...(draft.minWords !== undefined
                        ? { minWords: draft.minWords }
                        : {})}
                      {...(draft.suggestedTime !== undefined
                        ? { suggestedTime: draft.suggestedTime }
                        : {})}
                      onChange={(patch) =>
                        setDraft((d) => {
                          const next = { ...d };
                          if (patch.rubricId !== undefined) {
                            // null means "clear rubric" — store empty string
                            next.rubricId = patch.rubricId ?? "";
                          }
                          if (patch.minWords !== undefined) {
                            next.minWords = patch.minWords;
                          }
                          if (patch.suggestedTime !== undefined) {
                            next.suggestedTime = patch.suggestedTime;
                          }
                          return next;
                        })
                      }
                    />
                  )}

                  {draft.type === "speaking" && (
                    <OpenPromptEditor
                      type="speaking"
                      {...(draft.rubricId !== undefined
                        ? { rubricId: draft.rubricId }
                        : {})}
                      {...(draft.suggestedTime !== undefined
                        ? { suggestedTime: draft.suggestedTime }
                        : {})}
                      {...(draft.prepTime !== undefined
                        ? { prepTime: draft.prepTime }
                        : {})}
                      onChange={(patch) =>
                        setDraft((d) => {
                          const next = { ...d };
                          if (patch.rubricId !== undefined) {
                            // null means "clear rubric" — store empty string
                            next.rubricId = patch.rubricId ?? "";
                          }
                          if (patch.suggestedTime !== undefined) {
                            next.suggestedTime = patch.suggestedTime;
                          }
                          if (patch.prepTime !== undefined) {
                            next.prepTime = patch.prepTime;
                          }
                          return next;
                        })
                      }
                    />
                  )}

                  {/* Explanation */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-explanation"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Giải thích (tùy chọn)
                    </Label>
                    <Textarea
                      id="qep-explanation"
                      value={draft.explanation}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, explanation: e.target.value }))
                      }
                      placeholder="Giải thích đáp án đúng…"
                      className="min-h-16 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab: meta ──────────────────────────────────────────────── */}
            <TabsContent value="meta">
              <Card>
                <CardContent className="space-y-5 p-5">
                  {/* Program */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-program"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Chương trình
                    </Label>
                    <Select
                      value={draft.programId}
                      onValueChange={(v) =>
                        setDraft((d) => ({ ...d, programId: v }))
                      }
                    >
                      <SelectTrigger id="qep-program" className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QB_PROGRAMS.map((prog) => (
                          <SelectItem key={prog.id} value={prog.id}>
                            {prog.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skill */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-skill"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Kỹ năng
                    </Label>
                    <Select
                      value={draft.skill}
                      onValueChange={(v) =>
                        setDraft((d) => ({
                          ...d,
                          skill: v as Question["skill"],
                        }))
                      }
                    >
                      <SelectTrigger id="qep-skill" className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QB_SKILL_REGISTRY.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-difficulty"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Độ khó
                    </Label>
                    <Select
                      value={draft.difficulty}
                      onValueChange={(v) =>
                        setDraft((d) => ({
                          ...d,
                          difficulty: v as Question["difficulty"],
                        }))
                      }
                    >
                      <SelectTrigger id="qep-difficulty" className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Vừa</SelectItem>
                        <SelectItem value="hard">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Points */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-points"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Điểm
                    </Label>
                    <Input
                      id="qep-points"
                      type="number"
                      min={1}
                      value={draft.points}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          points: Number(e.target.value),
                        }))
                      }
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Source */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="qep-source"
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Nguồn
                    </Label>
                    <Select
                      value={draft.sourceId}
                      onValueChange={(v) =>
                        setDraft((d) => ({ ...d, sourceId: v }))
                      }
                    >
                      <SelectTrigger id="qep-source" className="h-9 text-sm">
                        <SelectValue placeholder="— Chọn nguồn —" />
                      </SelectTrigger>
                      <SelectContent>
                        {QB_SOURCES.map((src) => (
                          <SelectItem key={src.id} value={src.id}>
                            {src.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QB_TAGS.map((tag) => {
                        const active = draft.tagIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() =>
                              setDraft((d) => ({
                                ...d,
                                tagIds: active
                                  ? d.tagIds.filter((x) => x !== tag.id)
                                  : [...d.tagIds, tag.id],
                              }))
                            }
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
                            )}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vocab */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Từ vựng liên kết
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {draft.vocabIds.length} từ đã liên kết
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setVocabDialogOpen(true)}
                      >
                        Liên kết từ vựng
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab: preview ───────────────────────────────────────────── */}
            <TabsContent value="preview">
              <QuestionPreview question={draft} showAnswer={true} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right rail */}
        <div className="lg:w-[280px] lg:shrink-0">
          <div className="space-y-4 lg:sticky lg:top-4">
            {/* Validation card */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Kiểm tra
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {validationErrors.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                    Sẵn sàng xuất bản
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {validationErrors.map((err, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs leading-snug text-destructive"
                      >
                        <AlertCircle
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden
                        />
                        {err}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Summary card */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Tóm tắt
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <dl className="space-y-1.5">
                  {(
                    [
                      [
                        "Chương trình",
                        QB_PROGRAMS.find((p) => p.id === draft.programId)
                          ?.code ?? "—",
                      ],
                      [
                        "Kỹ năng",
                        SKILL_LABEL[draft.skill] ?? draft.skill,
                      ],
                      [
                        "Chấm điểm",
                        isAutoGraded(draft.type) ? "Tự động" : "Rubric",
                      ],
                      ["Điểm", String(draft.points)],
                      ["Tags", String(draft.tagIds.length)],
                      ["Từ vựng", String(draft.vocabIds.length)],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-border py-1 text-sm last:border-0"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vocab dialog */}
      <LinkVocabDialog
        open={vocabDialogOpen}
        onOpenChange={setVocabDialogOpen}
        selectedIds={draft.vocabIds}
        onChange={(ids) => setDraft((d) => ({ ...d, vocabIds: ids }))}
      />
    </div>
  );
}
