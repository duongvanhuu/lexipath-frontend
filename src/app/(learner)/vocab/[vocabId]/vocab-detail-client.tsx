"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlarmClock,
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  BookmarkCheck,
  Bookmark,
  BookOpen,
  Brain,
  Clock,
  Ear,
  Equal,
  GitMerge,
  GraduationCap,
  Info,
  Lightbulb,
  Link2,
  Mic,
  Music,
  PenLine,
  PencilLine,
  Repeat2,
  SpellCheck,
  TrendingUp,
  Type,
  Volume1,
  Volume2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { LangModuleEn } from "@/components/vocabulary/lang-module-en";
import { LangModuleJa } from "@/components/vocabulary/lang-module-ja";
import { LangModuleZh } from "@/components/vocabulary/lang-module-zh";
import { ExampleSentenceCard } from "@/components/vocabulary/example-sentence-card";
import { cn } from "@/lib/utils/cn";
import type {
  VocabDetailItem,
  VocabDetailSense,
  VocabRelatedGroup,
  VocabSkillRow,
  VocabUsageNote,
} from "@/features/vocabulary/vocab-detail.types";

/* ── helpers ── */

const LANG_TTS: Record<string, string> = {
  ja: "ja-JP",
  en: "en-US",
  zh: "zh-CN",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  learning: "Đang học",
  review: "Ôn tập",
  mastered: "Thành thạo",
};

const STATUS_CLS: Record<string, string> = {
  new: "bg-surface-muted text-text-secondary",
  learning: "bg-golden-soft text-golden-foreground",
  review: "bg-warning-soft text-warning-foreground",
  mastered: "bg-success-soft text-success-foreground",
};

const NEXT_REVIEW_CLS: Record<string, string> = {
  danger: "bg-danger-soft text-danger-foreground",
  primary: "bg-primary-soft text-primary-soft-foreground",
  golden: "bg-golden-soft text-golden-foreground",
  neutral: "bg-surface-muted text-text-muted",
};

const SKILL_ICON_MAP: Record<string, React.ReactNode> = {
  meaning: <Brain className="size-3.5" aria-hidden />,
  listen: <Ear className="size-3.5" aria-hidden />,
  read: <BookOpen className="size-3.5" aria-hidden />,
  romaji: <Type className="size-3.5" aria-hidden />,
  spell: <SpellCheck className="size-3.5" aria-hidden />,
  pron: <Mic className="size-3.5" aria-hidden />,
  tone: <Music className="size-3.5" aria-hidden />,
  pinyin: <Type className="size-3.5" aria-hidden />,
  write: <PenLine className="size-3.5" aria-hidden />,
};

const RELATED_ICON_MAP: Record<string, React.ReactNode> = {
  Equal: <Equal className="size-3" aria-hidden />,
  ArrowLeftRight: <ArrowLeftRight className="size-3" aria-hidden />,
  AlertTriangle: <AlertTriangle className="size-3" aria-hidden />,
  GitMerge: <GitMerge className="size-3" aria-hidden />,
  Link2: <Link2 className="size-3" aria-hidden />,
};

function ttsSpeak(word: string, lang: string, rate: number) {
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang;
    u.rate = rate;
    synth.speak(u);
  } catch {
    /* ignore auto-play policy errors */
  }
}

/* ── Section card ── */

function SectionCard({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-border bg-card p-5", className)}>
      <div className="mb-3.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

/* ── Sense list ── */

function SenseBlock({ sense, index }: { sense: VocabDetailSense; index: number }) {
  const statusCls = STATUS_CLS[sense.status] ?? STATUS_CLS.new;
  const statusLabel = STATUS_LABEL[sense.status] ?? "Mới";

  return (
    <div className="rounded-xl bg-surface-muted p-4">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
        Nghĩa {index + 1}
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-pill border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-text-muted">
          {sense.pos}
        </span>
        <Badge className={cn("rounded-pill text-[10px]", statusCls)}>
          {statusLabel}
        </Badge>
      </div>
      <p className="text-[18px] font-bold leading-snug text-text-primary">
        {sense.meaning}
      </p>
      {sense.meaningVi ? (
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          {sense.meaningVi}
        </p>
      ) : null}
      {sense.examples && sense.examples.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          {sense.examples.map((ex) => (
            <ExampleSentenceCard
              key={ex.id}
              example={{
                id: ex.id,
                sourceText: ex.source,
                ...(ex.translation !== undefined
                  ? { translatedText: ex.translation }
                  : {}),
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Usage notes ── */

function UsageNotes({ notes }: { notes: VocabUsageNote[] }) {
  return (
    <SectionCard icon={<Info className="size-3.5" />} title="Cách dùng">
      <div className="divide-y divide-border">
        {notes.map((note) => (
          <div key={note.label} className="flex items-start gap-3 py-2.5">
            <span className="min-w-[108px] shrink-0 pt-px text-xs font-medium text-text-muted">
              {note.label}
            </span>
            <span className="text-sm leading-relaxed text-text-primary">
              {note.value}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ── Related groups ── */

function RelatedGroups({ groups }: { groups: VocabRelatedGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <SectionCard icon={<Link2 className="size-3.5" />} title="Từ liên quan">
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-text-secondary">
              {RELATED_ICON_MAP[group.icon] ?? null}
              {group.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Link
                  key={item.word}
                  href={`/vocab/${encodeURIComponent(item.word)}`}
                  className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface-muted px-3.5 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary-soft-foreground"
                >
                  {item.word}
                  {item.reading ? (
                    <span className="text-xs text-text-muted">({item.reading})</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ── Skill sidebar ── */

function SkillBar({ row }: { row: VocabSkillRow }) {
  const fillCls =
    row.pct >= 80
      ? "bg-primary"
      : row.pct >= 60
        ? "bg-skill-listening"
        : "bg-warning";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
        {SKILL_ICON_MAP[row.key] ?? <Brain className="size-3.5" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between">
          <span className="text-xs text-text-secondary">{row.label}</span>
          <span className="text-xs font-bold text-text-primary">{row.pct}%</span>
        </div>
        <div
          className="mt-1 h-1 w-full overflow-hidden rounded-pill bg-border"
          role="progressbar"
          aria-valuenow={row.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${row.label}: ${row.pct}%`}
        >
          <div
            className={cn("h-full rounded-pill transition-all duration-500", fillCls)}
            style={{ width: `${row.pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── VocabDetailClient ── */

export type VocabDetailClientProps = {
  item: VocabDetailItem;
};

export function VocabDetailClient({ item }: VocabDetailClientProps) {
  const [saved, setSaved] = React.useState(item.saved);
  const [note, setNote] = React.useState("");

  const ttsLang = LANG_TTS[item.langCode] ?? "ja-JP";

  const handlePlayTTS = React.useCallback(
    (rate: number) => ttsSpeak(item.word, ttsLang, rate),
    [item.word, ttsLang]
  );

  const handlePlayDialect = React.useCallback(
    (word: string, lang: string) => ttsSpeak(word, lang, 0.85),
    []
  );

  const mastPct =
    item.overallProgress.total > 0
      ? Math.round(
          (item.overallProgress.mastered / item.overallProgress.total) * 100
        )
      : 0;

  const isEnWord = item.langCode === "en";

  return (
    <div className="mx-auto max-w-[860px] px-4 pb-16 pt-6">
      {/* ── Back nav ── */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/notebook"
          className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Sổ tay
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Chi tiết từ vựng</h1>
      </div>

      {/* ── Hero header card ── */}
      <div className="mb-4 rounded-card border border-border bg-card p-7 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-5">
          <div className="min-w-0">
            {/* Word */}
            <p
              className={cn(
                "font-bold leading-none tracking-tight text-text-primary",
                isEnWord ? "text-[44px]" : "text-[56px]"
              )}
            >
              {item.word}
            </p>

            {/* Phonetic row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Normal speed */}
              <div className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => handlePlayTTS(0.85)}
                  aria-label="Nghe tốc độ thường"
                >
                  <Volume2 className="size-4" aria-hidden />
                </Button>
                <span className="text-[10px] text-text-muted">Thường</span>
              </div>

              {/* Slow speed */}
              <div className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => handlePlayTTS(0.5)}
                  aria-label="Nghe tốc độ chậm"
                >
                  <Volume1 className="size-4" aria-hidden />
                </Button>
                <span className="text-[10px] text-text-muted">Chậm</span>
              </div>

              {item.reading ? (
                <span className="text-xl font-medium text-primary">
                  {item.reading}
                </span>
              ) : null}
              {item.ipa ? (
                <span className="text-sm italic text-text-muted">{item.ipa}</span>
              ) : null}
            </div>
          </div>

          {/* Right meta */}
          <div className="flex shrink-0 flex-col items-end gap-2.5 pt-1">
            <Badge
              className={cn(
                "rounded-pill",
                STATUS_CLS[item.learningStatus] ?? STATUS_CLS.new
              )}
            >
              {STATUS_LABEL[item.learningStatus] ?? "Mới"}
            </Badge>
            {saved ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                <BookmarkCheck className="size-3" aria-hidden />
                Đã lưu
              </span>
            ) : null}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm">
            <Repeat2 className="size-4" aria-hidden />
            Ôn từ này
          </Button>
          <Button type="button" variant="outline" size="sm">
            <GraduationCap className="size-4" aria-hidden />
            Học lại
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSaved((p) => !p)}
            className={cn(saved && "border-primary/40 text-primary")}
            aria-pressed={saved}
          >
            {saved ? (
              <BookmarkCheck className="size-4" aria-hidden />
            ) : (
              <Bookmark className="size-4" aria-hidden />
            )}
            {saved ? "Bỏ lưu" : "Lưu từ"}
          </Button>
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Main column */}
        <div className="flex flex-col gap-4">
          {/* Senses */}
          <SectionCard
            icon={<Lightbulb className="size-3.5" />}
            title="Nghĩa"
          >
            <div className="flex flex-col gap-3">
              {item.senses.map((sense, i) => (
                <SenseBlock key={sense.id} sense={sense} index={i} />
              ))}
            </div>
          </SectionCard>

          {/* Usage notes */}
          <UsageNotes notes={item.usageNotes} />

          {/* Language module */}
          {item.langModule.type === "ja" ? (
            <LangModuleJa module={item.langModule} />
          ) : null}
          {item.langModule.type === "en" ? (
            <LangModuleEn
              module={item.langModule}
              onPlayDialect={handlePlayDialect}
            />
          ) : null}
          {item.langModule.type === "zh" ? (
            <LangModuleZh module={item.langModule} />
          ) : null}

          {/* Related groups */}
          <RelatedGroups groups={item.relatedGroups} />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Skills */}
          <div className="rounded-card border border-border bg-card p-5">
            <div className="mb-3.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted">
              <TrendingUp className="size-3.5" aria-hidden />
              Kỹ năng
            </div>
            <div className="flex flex-col gap-3">
              {item.skillRows.map((row) => (
                <SkillBar key={row.key} row={row} />
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-xs text-text-muted">Tổng tiến độ bộ từ</p>
              <Progress value={mastPct} className="h-1.5" />
              <p className="mt-1.5 text-[11px] text-text-muted">
                {item.overallProgress.mastered}/{item.overallProgress.total} từ
                thành thạo
              </p>
            </div>
          </div>

          {/* Next review */}
          <div className="rounded-card border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted">
              <Clock className="size-3.5" aria-hidden />
              Ôn tiếp theo
            </div>
            <p className="text-[15px] font-bold text-text-primary">
              {item.nextReview.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              {item.nextReview.sublabel}
            </p>
            <span
              className={cn(
                "mt-2.5 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold",
                NEXT_REVIEW_CLS[item.nextReview.tone] ?? NEXT_REVIEW_CLS.neutral
              )}
            >
              <AlarmClock className="size-3" aria-hidden />
              {item.nextReview.label}
            </span>
          </div>

          {/* Personal note */}
          <div className="rounded-card border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted">
              <PencilLine className="size-3.5" aria-hidden />
              Ghi chú cá nhân
            </div>
            <Textarea
              placeholder="Mẹo nhớ, liên tưởng, câu ví dụ của riêng bạn…"
              className="min-h-[80px] resize-none text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Ghi chú cá nhân"
            />
            {note ? (
              <div className="mt-2 flex justify-end">
                <Button type="button" variant="ghost" size="sm">
                  Lưu ghi chú
                </Button>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
