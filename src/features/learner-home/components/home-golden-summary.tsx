import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  Headphones,
  Languages,
  Lightbulb,
  MessageCircle,
  Music,
  Type,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type GoldenSkillBreakdown = {
  label: string;
  count: number;
  icon: string;
};

export type HomeGoldenSummaryProps = {
  due: number;
  overdue: number;
  mins: number;
  skills: GoldenSkillBreakdown[];
  queueHref?: string;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* Icon map                                                                    */
/* -------------------------------------------------------------------------- */

const ICON_MAP: Record<string, React.ReactNode> = {
  lightbulb: <Lightbulb className="size-3.5 shrink-0" aria-hidden />,
  headphones: <Headphones className="size-3.5 shrink-0" aria-hidden />,
  type: <Type className="size-3.5 shrink-0" aria-hidden />,
  "message-circle": <MessageCircle className="size-3.5 shrink-0" aria-hidden />,
  music: <Music className="size-3.5 shrink-0" aria-hidden />,
  languages: <Languages className="size-3.5 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* HomeGoldenSummary                                                           */
/* -------------------------------------------------------------------------- */

function HomeGoldenSummary({
  due,
  overdue,
  mins,
  skills,
  queueHref = "/golden-time",
  className,
}: HomeGoldenSummaryProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-golden/40 bg-golden-soft p-5",
        className
      )}
    >
      {/* Decorative watermark */}
      <span
        className="pointer-events-none absolute -right-2 -top-2 select-none text-[88px] leading-none opacity-[0.06] grayscale"
        aria-hidden
      >
        ⏰
      </span>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-golden-foreground/70">
            Golden Time
          </span>
          <Link
            href={queueHref as Route}
            className="text-[13px] font-semibold text-golden-foreground no-underline hover:opacity-80"
          >
            Xem hàng chờ
          </Link>
        </div>

        {/* KV pills */}
        <div className="flex flex-wrap gap-2">
          <div className="flex min-w-[54px] flex-1 flex-col items-center rounded-lg border border-golden/30 bg-white/70 px-2.5 py-2">
            <span className="text-lg font-extrabold leading-none text-golden-foreground">
              {due}
            </span>
            <span className="mt-0.5 text-[10px] text-text-muted">Cần ôn</span>
          </div>

          {overdue > 0 ? (
            <div className="flex min-w-[54px] flex-1 flex-col items-center rounded-lg border border-danger/35 bg-white/70 px-2.5 py-2">
              <span className="text-lg font-extrabold leading-none text-danger">
                {overdue}
              </span>
              <span className="mt-0.5 text-[10px] text-text-muted">
                Quá hạn
              </span>
            </div>
          ) : null}

          <div className="flex min-w-[54px] flex-1 flex-col items-center rounded-lg border border-golden/30 bg-white/70 px-2.5 py-2">
            <span className="text-lg font-extrabold leading-none text-golden-foreground">
              ~{mins}&apos;
            </span>
            <span className="mt-0.5 text-[10px] text-text-muted">
              Ước tính
            </span>
          </div>
        </div>

        {/* Skill breakdown */}
        <div className="flex flex-col gap-1.5">
          {skills.slice(0, 4).map((sk, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[12px] text-golden-foreground/80"
            >
              {ICON_MAP[sk.icon] ?? null}
              <span className="flex-1">{sk.label}</span>
              <span className="font-bold text-golden-foreground">
                {sk.count} từ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { HomeGoldenSummary };
