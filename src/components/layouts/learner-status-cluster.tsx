"use client";

import * as React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { GoldenTimeSummary, LearnerChrome } from "./learner-chrome";
import { LearnerLanguageSwitcher } from "./learner-language-switcher";

/* ── Golden Time chip ── */

export function GoldenTimeChip({
  goldenTime,
  compact,
}: {
  goldenTime: GoldenTimeSummary;
  compact?: boolean;
}) {
  const className =
    "inline-flex h-[34px] items-center gap-1.5 rounded-pill border border-golden/40 bg-golden-soft px-3 text-sm font-semibold text-golden-foreground transition-colors hover:bg-golden-soft/70 [&_svg]:size-4";
  const content = (
    <>
      <Clock aria-hidden />
      {!compact && <span className="hidden xl:inline">Golden Time</span>}
      <span
        className="inline-flex min-w-[18px] items-center justify-center rounded-pill bg-golden px-1 py-px text-[11px] font-bold text-white"
        aria-hidden
      >
        {goldenTime.count}
      </span>
    </>
  );

  if (goldenTime.href) {
    return (
      <Link
        href={goldenTime.href}
        aria-label={`Golden Time — ${goldenTime.count} từ cần ôn`}
        className={className}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={goldenTime.onClick}
      aria-label={`Golden Time — ${goldenTime.count} từ cần ôn`}
      className={className}
    >
      {content}
    </button>
  );
}

/** Desktop status cluster: language switcher only.
 *  Per v22 design, streak/XP and notification bell are consolidated into the user menu dropdown.
 *  Hidden below md; at md+ only the language switcher shows.
 *  At tablet (<lg) the language switcher is hidden via lph22-lang-hide pattern; we mirror this
 *  by hiding at <md. */
export function LearnerStatusCluster({
  learningProfiles,
  activeLanguage,
  onLanguageChange,
}: LearnerChrome) {
  return (
    <div className="hidden items-center md:flex">
      <LearnerLanguageSwitcher
        {...(learningProfiles !== undefined ? { learningProfiles } : {})}
        {...(activeLanguage !== undefined ? { activeLanguage } : {})}
        {...(onLanguageChange !== undefined ? { onLanguageChange } : {})}
      />
    </div>
  );
}

/** A compact (flag-only) language switcher for the tablet range (md–lg). */
export function CompactLanguageSwitcher({
  learningProfiles,
  activeLanguage,
  onLanguageChange,
}: LearnerChrome) {
  return (
    <div className="hidden items-center md:flex lg:hidden">
      <LearnerLanguageSwitcher
        {...(learningProfiles !== undefined ? { learningProfiles } : {})}
        {...(activeLanguage !== undefined ? { activeLanguage } : {})}
        {...(onLanguageChange !== undefined ? { onLanguageChange } : {})}
        compact
      />
    </div>
  );
}

/* ── StatPill kept as a utility for mobile nav and other uses ── */

export function StatPill({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-pill px-3 text-sm font-semibold [&_svg]:size-4",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
