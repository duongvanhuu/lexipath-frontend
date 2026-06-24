import * as React from "react";
import { Check, Info, BookOpen, Mic, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { QB_RUBRICS } from "../mock/question-bank.mock";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionDiffPill } from "./atoms/question-diff-pill";
import { QuestionGradeChip } from "./atoms/question-grade-chip";
import type { Question } from "../types/question-bank.types";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionPreviewProps {
  question: Question;
  showAnswer?: boolean;
  className?: string;
}

// ─── Fill stem parser ─────────────────────────────────────────────────────────
function FillStem({ stem }: { stem: string }) {
  const parts = stem.split(/(\{\{\d+\}\})/g);
  return (
    <p className="text-base font-semibold leading-relaxed text-foreground">
      {parts.map((part, i) => {
        if (/^\{\{\d+\}\}$/.test(part)) {
          const num = part.replace(/[{}]/g, "");
          return (
            <span
              key={i}
              className="mx-1 inline-block min-w-16 border-b-2 border-primary text-center text-xs font-bold text-primary"
            >
              {num}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function QuestionPreview({
  question,
  showAnswer = true,
  className,
}: QuestionPreviewProps) {
  const rubricName =
    QB_RUBRICS.find((r) => r.id === question.rubricId)?.name ??
    "Chưa chọn rubric";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 space-y-4",
        className,
      )}
    >
      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <QuestionTypeChip type={question.type} size="sm" />
        <QuestionDiffPill difficulty={question.difficulty} />
        <QuestionGradeChip type={question.type} rubricId={question.rubricId ?? null} />
        <span className="text-[11px] text-muted-foreground ml-auto">
          {question.points} điểm
        </span>
      </div>

      {/* ── Stem ───────────────────────────────────────────────────────── */}
      {question.type === "fill" ? (
        <FillStem stem={question.stem} />
      ) : (
        <p className="text-base font-semibold leading-relaxed text-foreground">
          {question.stem}
        </p>
      )}

      {/* ── MCQ ────────────────────────────────────────────────────────── */}
      {question.type === "mcq" && (
        <div className="space-y-2">
          {(question.choices ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có lựa chọn.</p>
          ) : (
            (question.choices ?? []).map((c) => {
              const isCorrect = showAnswer && c.correct;
              return (
                <div
                  key={c.key}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5",
                    isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-border bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "size-6 shrink-0 flex items-center justify-center rounded-full border-2 text-xs font-bold",
                      isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-muted-foreground/40 text-muted-foreground",
                    )}
                    aria-hidden={!isCorrect}
                  >
                    {isCorrect ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      c.key
                    )}
                  </span>
                  <span className="text-sm text-foreground">{c.text}</span>
                  {isCorrect && (
                    <span className="sr-only">Đáp án đúng</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Multi ──────────────────────────────────────────────────────── */}
      {question.type === "multi" && (
        <div className="space-y-2">
          {(question.choices ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có lựa chọn.</p>
          ) : (
            (question.choices ?? []).map((c) => {
              const isCorrect = showAnswer && c.correct;
              return (
                <div
                  key={c.key}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5",
                    isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-border bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "size-6 shrink-0 flex items-center justify-center rounded-md border-2 text-xs font-bold",
                      isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-muted-foreground/40 text-muted-foreground",
                    )}
                    aria-hidden={!isCorrect}
                  >
                    {isCorrect ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      c.key
                    )}
                  </span>
                  <span className="text-sm text-foreground">{c.text}</span>
                  {isCorrect && (
                    <span className="sr-only">Đáp án đúng</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Fill blanks answer key ──────────────────────────────────────── */}
      {question.type === "fill" && (
        <div className="space-y-1">
          {(question.blanks ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có chỗ trống.</p>
          ) : (
            (question.blanks ?? []).map((b) => (
              <div key={b.pos} className="text-sm text-muted-foreground">
                <span className="font-bold text-purple-600">{`{{${b.pos}}}`}</span>
                {" → "}
                <span className="text-foreground">
                  {(b.accepted ?? []).join(" / ")}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Matching ───────────────────────────────────────────────────── */}
      {question.type === "matching" && (
        <div className="space-y-2">
          {(question.pairs ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có cặp ghép.</p>
          ) : (
            (question.pairs ?? []).map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                  {p.left}
                </div>
                <span className="shrink-0 font-bold text-base text-pink-500">
                  →
                </span>
                <div className="flex-1 rounded-lg border border-pink-100 bg-pink-50 px-3 py-2 text-sm">
                  {p.right}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Ordering ───────────────────────────────────────────────────── */}
      {question.type === "ordering" && (
        <div className="space-y-2">
          {(question.orderItems ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có mục sắp xếp.
            </p>
          ) : (
            (question.orderItems ?? [])
              .slice()
              .sort((a, b) => a.correctPos - b.correctPos)
              .map((it, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                >
                  <span className="size-6 shrink-0 rounded-md bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{it.text}</span>
                </div>
              ))
          )}
        </div>
      )}

      {/* ── TFNG ───────────────────────────────────────────────────────── */}
      {question.type === "tfng" && (
        <div className="flex gap-2">
          {(
            [
              ["true", "True"],
              ["false", "False"],
              ["ng", "Not Given"],
            ] as const
          ).map(([value, label]) => {
            const isSelected = showAnswer && question.judgeAnswer === value;
            return (
              <div
                key={value}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 px-2 text-center text-sm font-bold",
                  isSelected
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {label}
                {isSelected && (
                  <Check className="size-3.5" aria-label="Đáp án đúng" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── YNNG ───────────────────────────────────────────────────────── */}
      {question.type === "ynng" && (
        <div className="flex gap-2">
          {(
            [
              ["yes", "Yes"],
              ["no", "No"],
              ["ng", "Not Given"],
            ] as const
          ).map(([value, label]) => {
            const isSelected = showAnswer && question.judgeAnswer === value;
            return (
              <div
                key={value}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 px-2 text-center text-sm font-bold",
                  isSelected
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {label}
                {isSelected && (
                  <Check className="size-3.5" aria-label="Đáp án đúng" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Short ──────────────────────────────────────────────────────── */}
      {question.type === "short" && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Đáp án chấp nhận
          </p>
          {(question.answerKeys ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có đáp án.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(question.answerKeys ?? []).map((a, i) => (
                <Badge key={i} variant="secondary">
                  {a.value}
                </Badge>
              ))}
            </div>
          )}
          {question.maxWords != null && (
            <p className="text-[11px] text-muted-foreground">
              Tối đa {question.maxWords} từ
            </p>
          )}
        </div>
      )}

      {/* ── Writing ────────────────────────────────────────────────────── */}
      {question.type === "writing" && (
        <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          <BookOpen className="size-4 shrink-0 mt-0.5" aria-hidden />
          <div className="space-y-1">
            <p className="font-semibold">
              Rubric: <span className="font-normal">{rubricName}</span>
            </p>
            {question.minWords != null && (
              <p>Tối thiểu {question.minWords} từ</p>
            )}
            {question.suggestedTime != null && (
              <p>Thời gian gợi ý: {question.suggestedTime} phút</p>
            )}
          </div>
        </div>
      )}

      {/* ── Speaking ───────────────────────────────────────────────────── */}
      {question.type === "speaking" && (
        <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          <Mic className="size-4 shrink-0 mt-0.5" aria-hidden />
          <div className="space-y-1">
            <p className="font-semibold">
              Rubric: <span className="font-normal">{rubricName}</span>
            </p>
            {question.suggestedTime != null && (
              <p>Thời gian nói: {question.suggestedTime} phút</p>
            )}
            {question.prepTime != null && (
              <p>Chuẩn bị: {question.prepTime} phút</p>
            )}
          </div>
        </div>
      )}

      {/* ── Explanation ────────────────────────────────────────────────── */}
      {question.explanation && (
        <div className="border-t border-dashed border-border pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
            <Lightbulb className="size-3" aria-hidden />
            Giải thích
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
