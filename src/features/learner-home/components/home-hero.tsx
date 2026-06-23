import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { MapPin, Flame, CheckCircle2, Clock, ArrowRight, Info } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type HomeHeroCta = {
  isGolden: boolean;
  goldenDue: number;
  goldenOverdue: number;
  goldenMins: number;
  lessonDone: number;
  lessonTotal: number;
  lessonUnit: string;
  lessonTitle: string;
  lessonMins: number;
  learnHref: string;
  reviewHref: string;
};

export type HomeHeroProps = {
  name: string;
  langLabel: string;
  greeting: string;
  streak: number;
  xpToday: number;
  dailyDone: number;
  dailyTarget: number;
  dailyUnit: string;
  cta: HomeHeroCta;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* HomeHero                                                                    */
/* -------------------------------------------------------------------------- */

function HomeHero({
  name,
  langLabel,
  greeting,
  streak,
  xpToday,
  dailyDone,
  dailyTarget,
  dailyUnit,
  cta,
  className,
}: HomeHeroProps) {
  const firstName = name.trim().split(/\s+/).at(-1) ?? name;
  const {
    isGolden,
    goldenDue,
    goldenOverdue,
    goldenMins,
    lessonDone,
    lessonTotal,
    lessonUnit,
    lessonTitle,
    lessonMins,
    learnHref,
    reviewHref,
  } = cta;
  const ctaHref = isGolden ? reviewHref : learnHref;
  const ctaMins = isGolden ? goldenMins : lessonMins;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]",
        className
      )}
    >
      {/* ── Greeting card ── */}
      <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-text-muted">
          <MapPin className="size-3 shrink-0" aria-hidden />
          {langLabel} · Hành trình học
        </div>

        <h1 className="text-xl font-bold leading-snug tracking-tight text-text-primary">
          Chào {firstName} 👋 {greeting}
        </h1>

        <p className="text-sm text-text-secondary">
          Streak đang chạy — đừng để chuỗi bị gián đoạn!
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1 text-[12.5px] text-text-secondary">
            🔥 <strong className="text-text-primary">{streak}</strong> ngày streak
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1 text-[12.5px] text-text-secondary">
            ⭐ <strong className="text-text-primary">{xpToday}</strong> XP hôm nay
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1 text-[12.5px] text-text-secondary">
            <CheckCircle2 className="size-3 text-primary" aria-hidden />
            <strong className="text-text-primary">
              {dailyDone}/{dailyTarget}
            </strong>{" "}
            {dailyUnit}
          </span>
        </div>
      </div>

      {/* ── Primary CTA card ── */}
      <Link
        href={ctaHref as Route}
        className={cn(
          "flex flex-col gap-3 rounded-card border p-5 no-underline",
          "transition-all hover:-translate-y-0.5",
          isGolden
            ? "border-golden/40 bg-golden-soft hover:shadow-golden"
            : "border-primary/30 bg-primary-soft hover:shadow-sm"
        )}
      >
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            isGolden ? "text-golden-foreground" : "text-primary"
          )}
        >
          {isGolden ? "Golden Time · Ưu tiên hôm nay" : "Bước tiếp theo"}
        </span>

        <p className="text-base font-bold leading-snug text-text-primary">
          {isGolden ? `Ôn ${goldenDue} từ Golden Time` : "Tiếp tục bài học"}
        </p>

        <p className="text-sm text-text-secondary">
          {isGolden
            ? `${goldenOverdue > 0 ? `${goldenOverdue} từ quá hạn · ` : ""}~${goldenMins} phút`
            : `${lessonDone}/${lessonTotal} ${lessonUnit} · ${lessonTitle}`}
        </p>

        {isGolden && goldenOverdue > 0 ? (
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Info className="size-3 shrink-0" aria-hidden />
            {goldenOverdue} từ đang quá hạn — nên ôn trước
          </div>
        ) : !isGolden ? (
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Flame className="size-3 shrink-0" aria-hidden />
            Giữ streak {streak} ngày
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white",
              isGolden ? "bg-golden" : "bg-primary"
            )}
          >
            {isGolden ? "Ôn ngay" : "Tiếp tục"}
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <Clock className="size-3" aria-hidden />
            ~{ctaMins} phút
          </span>
        </div>
      </Link>
    </div>
  );
}

export { HomeHero };
