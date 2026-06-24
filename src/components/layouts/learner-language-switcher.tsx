"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Check, ChevronDown, Plus, Settings2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

import type { LearningProfile } from "./learner-chrome";

export const MOCK_LEARNING_PROFILES: LearningProfile[] = [
  {
    code: "ja",
    flag: "🇯🇵",
    name: "Tiếng Nhật",
    level: "Sơ cấp (N5)",
    goal: "JLPT N5",
    dailyDone: 8,
    dailyTarget: 10,
    streak: 12,
    xp: 1240,
    goldenDue: 5,
    lastStudied: "Hôm nay",
    isActive: true,
  },
  {
    code: "en",
    flag: "🇬🇧",
    name: "Tiếng Anh",
    level: "Giao tiếp cơ bản (B1)",
    goal: "TOEIC",
    dailyDone: 6,
    dailyTarget: 15,
    streak: 8,
    xp: 890,
    goldenDue: 3,
    lastStudied: "2 ngày trước",
    isActive: false,
  },
  {
    code: "zh",
    flag: "🇨🇳",
    name: "Tiếng Trung",
    level: "Mới bắt đầu",
    goal: "HSK 1",
    dailyDone: 4,
    dailyTarget: 10,
    streak: 0,
    xp: 0,
    goldenDue: 0,
    lastStudied: "Hôm nay",
    isActive: false,
  },
];

function LangProfileRow({
  profile,
  onSelect,
}: {
  profile: LearningProfile;
  onSelect: (code: string) => void;
}) {
  const progressPct = Math.min(
    100,
    Math.round((profile.dailyDone / profile.dailyTarget) * 100)
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(profile.code)}
      className={cn(
        "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors",
        "border-t border-border/50 first:border-t-0",
        profile.isActive
          ? "bg-success-soft hover:bg-success-soft/80"
          : "hover:bg-surface-muted"
      )}
    >
      {/* Flag */}
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-xl",
          profile.isActive
            ? "border-primary/20 bg-white/70"
            : "bg-surface-muted"
        )}
        aria-hidden
      >
        {profile.flag}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[13.5px] font-semibold text-foreground">
            {profile.name}
          </span>
          {profile.isActive && (
            <span className="rounded-pill border border-primary/30 bg-white px-1.5 py-px text-[10px] font-bold text-primary">
              Đang học
            </span>
          )}
        </div>
        <div className="mb-1.5 text-[11.5px] text-text-secondary">
          {profile.level} · {profile.goal}
        </div>

        {/* Progress bar */}
        <Progress
          value={progressPct}
          className={cn("h-1", !profile.isActive && "[&>div]:bg-muted-foreground/40")}
        />

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-[10.5px] text-text-muted">
            {profile.dailyDone}/{profile.dailyTarget} từ hôm nay
          </span>
          <span className="shrink-0 text-[10.5px] text-text-muted">
            🔥 {profile.streak} · ⭐ {profile.xp}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] text-text-muted">{profile.lastStudied}</span>
          {profile.goldenDue > 0 && (
            <span className="text-[11px] text-golden-foreground">
              {profile.goldenDue} cần ôn
            </span>
          )}
        </div>
      </div>

      {/* Active check */}
      {profile.isActive && (
        <span
          aria-hidden
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary"
        >
          <Check className="size-3 text-white" />
        </span>
      )}
    </button>
  );
}

export function LearnerLanguageSwitcher({
  learningProfiles,
  activeLanguage,
  onLanguageChange,
  compact = false,
}: {
  learningProfiles?: LearningProfile[];
  activeLanguage?: string;
  onLanguageChange?: (code: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const profiles = learningProfiles ?? MOCK_LEARNING_PROFILES;
  const active = profiles.find((p) => p.code === activeLanguage) ?? profiles.find((p) => p.isActive) ?? profiles[0];

  React.useEffect(() => {
    if (!open) return;
    const onOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onOut);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOut);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleSelect = (code: string) => {
    onLanguageChange?.(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Ngôn ngữ đang học: ${active?.name ?? "Chọn ngôn ngữ"}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-[34px] items-center gap-1.5 rounded-pill border border-border bg-card px-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {active && (
          <span aria-hidden className="text-base leading-none">
            {active.flag}
          </span>
        )}
        {!compact && active && (
          <span className="lph-lang-label">{active.name}</span>
        )}
        <ChevronDown
          aria-hidden
          className="size-3.5 text-text-muted"
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-card border border-border bg-card shadow-lg"
          role="dialog"
          aria-label="Lộ trình đang học"
        >
          <div className="border-b border-border px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-widest text-text-muted">
            Lộ trình đang học
          </div>

          <div>
            {profiles.map((profile) => (
              <LangProfileRow
                key={profile.code}
                profile={profile}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="border-t border-border">
            <Link
              href={"/onboarding/language" as Route}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-surface-muted">
                <Plus className="size-3.5" aria-hidden />
              </span>
              Thêm ngôn ngữ học
            </Link>
            <Link
              href={"/settings/language" as Route}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-surface-muted">
                <Settings2 className="size-3.5" aria-hidden />
              </span>
              Quản lý hồ sơ ngôn ngữ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
