"use client";

import * as React from "react";
import {
  AlertCircle,
  BarChart2,
  BookOpen,
  CheckCircle,
  Clock,
  Headphones,
  Play,
  Plus,
  PlusCircle,
  Volume2,
} from "lucide-react";

import { LexiButton } from "@/components/shared";
import { SkillWeaknessPanel } from "@/components/notebook";
import { WordRelationMap } from "@/components/notebook";
import { cn } from "@/lib/utils/cn";
import type { NotebookWord, ReviewUrgency, VocabLang } from "../types";
import type { WordRelationGroup } from "@/components/notebook";

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  mastered:   { label: "Thành thạo", textClass: "text-success-foreground",   bgClass: "bg-success-soft"   },
  learning:   { label: "Đang học",   textClass: "text-primary-foreground",   bgClass: "bg-primary-soft"   },
  review:     { label: "Cần ôn",     textClass: "text-warning-foreground",   bgClass: "bg-warning-soft"   },
  new:        { label: "Mới",        textClass: "text-text-muted",           bgClass: "bg-muted"          },
  forgetting: { label: "Sắp quên",   textClass: "text-danger-foreground",    bgClass: "bg-danger-soft"    },
} as const;

/* ── Urgency config ─────────────────────────────────────────── */
const URGENCY_CONFIG: Record<ReviewUrgency, {
  containerClass: string;
  iconClass: string;
  labelClass: string;
  icon: React.ElementType;
  heading: (nextReview?: string) => string;
  sub: string;
  showCta: boolean;
}> = {
  overdue: {
    containerClass: "bg-danger-soft border-danger/30",
    iconClass: "text-danger-foreground",
    labelClass: "text-danger-foreground",
    icon: AlertCircle,
    heading: () => "Quá hạn — nên ôn ngay",
    sub: "Từ này đã qua thời điểm ôn tốt nhất — ôn ngay để giữ nhịp nhớ.",
    showCta: true,
  },
  due: {
    containerClass: "bg-golden-soft border-golden/30",
    iconClass: "text-golden-foreground",
    labelClass: "text-golden-foreground",
    icon: Clock,
    heading: (r) => `Ôn lại: ${r ?? "Sắp tới"}`,
    sub: "LexiPath đã xếp Golden Time phù hợp với nhịp nhớ của bạn.",
    showCta: true,
  },
  ok: {
    containerClass: "bg-success-soft border-success/30",
    iconClass: "text-success-foreground",
    labelClass: "text-success-foreground",
    icon: CheckCircle,
    heading: (r) => `Ôn lại: ${r ?? "Sắp tới"}`,
    sub: "Nhớ tốt — LexiPath duy trì ôn nhẹ để từ không bị quên.",
    showCta: false,
  },
  none: {
    containerClass: "bg-muted border-border",
    iconClass: "text-text-secondary",
    labelClass: "text-text-secondary",
    icon: PlusCircle,
    heading: () => "Chưa học lần nào",
    sub: "Bắt đầu học từ này để LexiPath tính toán lịch ôn.",
    showCta: false,
  },
};

/* ── Review reason icon map ─────────────────────────────────── */
function ReasonIcon({ urgency, weakSkill }: { urgency?: ReviewUrgency; weakSkill?: boolean }) {
  if (weakSkill) return <BarChart2 className="size-4" aria-hidden />;
  if (urgency === "overdue") return <AlertCircle className="size-4" aria-hidden />;
  if (urgency === "due") return <Clock className="size-4" aria-hidden />;
  return <PlusCircle className="size-4" aria-hidden />;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function isCjk(lang: VocabLang) {
  return lang === "ja" || lang === "zh";
}

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyDetailState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 py-12 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-[14px] bg-muted text-text-muted">
        <BookOpen className="size-6" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-text-secondary">Chọn một từ để xem chi tiết</p>
      <p className="text-xs text-text-muted leading-relaxed">
        Nhấn vào từ bên trái để xem nghĩa, ví dụ và lịch ôn tập.
      </p>
    </div>
  );
}

/* ── Props ───────────────────────────────────────────────────── */
export type NotebookDetailPanelProps = {
  word: NotebookWord | null;
  onReview?: (word: NotebookWord) => void;
  onLearn?: (word: NotebookWord) => void;
  onAddToCollection?: (word: NotebookWord) => void;
  className?: string;
};

/* ── Main ────────────────────────────────────────────────────── */
function NotebookDetailPanel({
  word,
  onReview,
  onLearn,
  onAddToCollection,
  className,
}: NotebookDetailPanelProps) {
  if (!word) return <EmptyDetailState />;

  const cjk = isCjk(word.lang);
  const statusCfg = STATUS_CONFIG[word.status];
  const urgency = word.urgency ?? "none";
  const urgencyCfg = URGENCY_CONFIG[urgency];
  const UrgencyIcon = urgencyCfg.icon;
  const isNew = word.status === "new";
  const needsAction = urgency === "due" || urgency === "overdue";

  /* Related words → WordRelationMap groups */
  const relatedGroups: WordRelationGroup[] = word.relatedWords?.length
    ? [
        {
          id: "related",
          label: "Từ liên quan & dễ nhầm",
          type: "confusable" as const,
          relations: word.relatedWords.map((r) => ({
            id: r.id,
            word: r.word,
            ...(r.reading !== undefined ? { reading: r.reading } : {}),
          })),
        },
      ]
    : [];

  return (
    <div className={cn("flex flex-col gap-3 p-4", className)}>

      {/* ── Block 1: Hero header ─────────────────────────────── */}
      <div className="rounded-[14px] border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {/* Reading above word for CJK */}
            {cjk && word.reading ? (
              <p className="mb-1 text-sm text-text-secondary">{word.reading}</p>
            ) : null}
            {/* Headword */}
            <h2
              className={cn(
                "font-bold text-text-primary leading-tight",
                cjk ? "text-5xl tracking-wide" : "text-4xl tracking-tight"
              )}
            >
              {word.word}
            </h2>
            {/* Latin reading (IPA) or POS row */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {!cjk && word.reading ? (
                <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-sm text-text-secondary">
                  {word.reading}
                </span>
              ) : null}
              {word.pos ? (
                <span className="text-xs italic text-text-muted">{word.pos}</span>
              ) : null}
            </div>
          </div>
          {/* Audio button */}
          <button
            type="button"
            aria-label="Nghe phát âm"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-colors hover:border-primary hover:text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Volume2 className="size-3.5" aria-hidden />
          </button>
        </div>

        {/* Status chips row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              statusCfg.bgClass,
              statusCfg.textClass
            )}
          >
            {statusCfg.label}
          </span>
          {word.weakSkill ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger-foreground">
              <AlertCircle className="size-3 shrink-0" aria-hidden />
              {word.weakSkill.label} yếu
            </span>
          ) : null}
          {word.nextReview ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                urgency === "overdue"
                  ? "bg-danger-soft text-danger-foreground"
                  : "bg-golden-soft text-golden-foreground"
              )}
            >
              <Clock className="size-3 shrink-0" aria-hidden />
              {urgency === "overdue" ? "Quá hạn — ôn ngay" : `Ôn lại: ${word.nextReview}`}
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Block 2: Meaning ─────────────────────────────────── */}
      <div className="rounded-card border border-border bg-card px-4 py-3.5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Nghĩa</p>
        <div className="flex items-center gap-2 flex-wrap">
          {word.pos ? (
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-text-muted">
              {word.pos}
            </span>
          ) : null}
          <span className="text-base font-semibold text-text-primary leading-snug">
            {word.meaning}
          </span>
        </div>
      </div>

      {/* ── Block 3: Example ─────────────────────────────────── */}
      {word.example ? (
        <div className="rounded-card border border-border bg-card px-4 py-3.5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Ví dụ</p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-medium text-primary-foreground">
                {word.lang === "en" ? "Đọc hiểu" : word.lang === "zh" ? "Nghe thanh điệu" : "Luyện đọc"}
              </span>
              <button
                type="button"
                aria-label="Nghe câu ví dụ"
                className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-colors hover:border-primary hover:text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Headphones className="size-3" aria-hidden />
              </button>
            </div>
          </div>
          <p
            className={cn(
              "text-sm font-medium text-text-primary leading-relaxed",
              cjk && "text-base"
            )}
          >
            {word.example}
          </p>
          {word.exampleVi ? (
            <p className="mt-1.5 text-xs italic text-text-secondary leading-relaxed">
              {word.exampleVi}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ── Block 4: Review card ─────────────────────────────── */}
      <div
        className={cn(
          "rounded-card border px-4 py-3.5",
          urgencyCfg.containerClass
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-white/50",
              urgencyCfg.iconClass
            )}
          >
            <UrgencyIcon className="size-4" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-bold", urgencyCfg.labelClass)}>
              {urgencyCfg.heading(word.nextReview)}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
              {urgencyCfg.sub}
            </p>
          </div>
          {needsAction ? (
            <button
              type="button"
              onClick={() => word.status === "new" ? onLearn?.(word) : onReview?.(word)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 self-start rounded-[9px] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                urgency === "overdue" ? "bg-danger" : "bg-golden"
              )}
            >
              <Play className="size-3" aria-hidden />
              Ôn ngay
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Block 5: Reason block ────────────────────────────── */}
      {word.reviewReason ? (
        <div className="rounded-card border border-border bg-card px-4 py-3.5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
              <ReasonIcon urgency={urgency} weakSkill={Boolean(word.weakSkill)} />
            </span>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Vì sao cần ôn
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                {word.reviewReason}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Block 6: Common phrases ──────────────────────────── */}
      {word.phrases?.length ? (
        <div className="rounded-card border border-border bg-card px-4 py-3.5">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Cụm từ thường gặp
          </p>
          <div className="flex flex-wrap gap-1.5">
            {word.phrases.map((p) => (
              <span
                key={p}
                className={cn(
                  "inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-[12.5px] text-text-secondary transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary",
                  cjk && "text-sm"
                )}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Related words ────────────────────────────────────── */}
      {relatedGroups.length > 0 ? (
        <WordRelationMap
          headword={word.word}
          groups={relatedGroups}
        />
      ) : null}

      {/* ── Skill progress ───────────────────────────────────── */}
      {word.skills?.length ? (
        <SkillWeaknessPanel
          title="Tiến độ kỹ năng"
          skills={word.skills.map((s) => ({
            skill: s.skill,
            label: s.label,
            accuracy: s.accuracy,
          }))}
        />
      ) : null}

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="flex gap-2.5 flex-wrap pt-1">
        {isNew ? (
          <LexiButton
            variant="primary"
            onClick={() => onLearn?.(word)}
          >
            <Play className="size-3.5 mr-1.5" aria-hidden />
            Bắt đầu học
          </LexiButton>
        ) : (
          <LexiButton
            variant="primary"
            onClick={() => onReview?.(word)}
          >
            <Play className="size-3.5 mr-1.5" aria-hidden />
            {urgency === "overdue" || urgency === "due" ? "Ôn ngay" : "Ôn từ này"}
          </LexiButton>
        )}
        <LexiButton
          variant="outline"
          onClick={() => onAddToCollection?.(word)}
        >
          <Plus className="size-3.5 mr-1.5" aria-hidden />
          Thêm vào bộ sưu tập
        </LexiButton>
      </div>
    </div>
  );
}

export { NotebookDetailPanel };
