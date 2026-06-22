"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Clock, Flame, Star } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type {
  GoldenTimeSummary,
  LearnerChrome,
  NotificationSummary,
} from "./learner-chrome";
import { LanguageMenu } from "./learner-account-menu";

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

export function GoldenTimeChip({ goldenTime }: { goldenTime: GoldenTimeSummary }) {
  const className =
    "inline-flex h-8 items-center gap-1.5 rounded-pill border border-golden/40 bg-golden-soft px-3 text-sm font-semibold text-golden-foreground transition-colors hover:bg-golden-soft/70 [&_svg]:size-4";
  const content = (
    <>
      <Clock aria-hidden />
      {goldenTime.count}
    </>
  );
  if (goldenTime.href) {
    return (
      <Link href={goldenTime.href} aria-label="Golden Time" className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={goldenTime.onClick}
      aria-label="Golden Time"
      className={className}
    >
      {content}
    </button>
  );
}

function NotificationButton({ notification }: { notification: NotificationSummary }) {
  const count = notification.count ?? 0;
  return (
    <span className="relative inline-flex">
      {notification.href ? (
        <Link
          href={notification.href}
          aria-label="Thông báo"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <Bell />
        </Link>
      ) : (
        <IconButton
          variant="outline"
          label="Thông báo"
          onClick={notification.onClick}
        >
          <Bell />
        </IconButton>
      )}
      {count > 0 ? (
        <span
          className="absolute top-1 right-1 size-2 rounded-full bg-danger ring-2 ring-card"
          aria-hidden
        />
      ) : null}
      {count > 0 ? <span className="sr-only">{count} thông báo mới</span> : null}
    </span>
  );
}

/** Desktop-only status extras (language · streak · XP · notifications). */
export function LearnerStatusCluster({
  languages,
  activeLanguage,
  onLanguageChange,
  streak,
  xp,
  notification,
}: LearnerChrome) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <LanguageMenu
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={onLanguageChange}
      />
      {typeof streak === "number" ? (
        <StatPill
          icon={<Flame aria-hidden />}
          className="bg-golden-soft text-golden-foreground"
        >
          {streak}
        </StatPill>
      ) : null}
      {typeof xp === "number" ? (
        <StatPill
          icon={<Star aria-hidden />}
          className="bg-success-soft text-success-foreground"
        >
          {xp}
        </StatPill>
      ) : null}
      {notification ? <NotificationButton notification={notification} /> : null}
    </div>
  );
}
