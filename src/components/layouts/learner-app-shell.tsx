"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Flame, Menu, Star } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";
import type { NavItem } from "@/components/shared/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

import type { LearnerChrome } from "./learner-chrome";
import { AccountMenu, LanguageMenu } from "./learner-account-menu";
import {
  GoldenTimeChip,
  LearnerStatusCluster,
  StatPill,
} from "./learner-status-cluster";

export type LearnerAppShellProps = LearnerChrome & {
  logo?: React.ReactNode;
  homeHref?: Route;
  navItems?: NavItem[];
  activeNavId?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * LearnerAppShell — the default signed-in learner layout: a sticky top header
 * (no sidebar) over a centered, max-1180px content column. Use for the
 * dashboard, vocabulary, Golden Time hub, notebook, dictionary, exam library
 * and learner settings. For focus sessions use `FocusLearningShell`; for admin
 * use `AdminShell`.
 */
function LearnerAppShell({
  logo,
  homeHref = "/",
  navItems = [],
  activeNavId,
  children,
  className,
  ...chrome
}: LearnerAppShellProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("min-h-svh bg-background", className)}>
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex h-15 max-w-[1180px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-7">
            <Link href={homeHref} className="flex shrink-0 items-center">
              {logo}
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = item.id === activeNavId;
                return (
                  <Link
                    key={item.id}
                    href={item.href ?? homeHref}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-button px-3 text-sm whitespace-nowrap transition-colors [&_svg]:size-4",
                      active
                        ? "bg-primary-soft font-semibold text-primary-soft-foreground [&_svg]:text-primary"
                        : "font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary [&_svg]:text-text-muted"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LearnerStatusCluster {...chrome} />
            {chrome.goldenTime ? (
              <GoldenTimeChip goldenTime={chrome.goldenTime} />
            ) : null}
            <AccountMenu
              user={chrome.user}
              accountActions={chrome.accountActions}
              onSignOut={chrome.onSignOut}
              signOutLabel={chrome.signOutLabel}
            />

            {navItems.length > 0 ? (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <IconButton variant="outline" label="Mở menu">
                    <Menu />
                  </IconButton>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 gap-0 p-0">
                  <SheetHeader>
                    <SheetTitle>Điều hướng</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 px-2">
                    {navItems.map((item) => {
                      const active = item.id === activeNavId;
                      return (
                        <Link
                          key={item.id}
                          href={item.href ?? homeHref}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "inline-flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors [&_svg]:size-4",
                            active
                              ? "bg-primary-soft text-primary-soft-foreground [&_svg]:text-primary"
                              : "text-text-secondary hover:bg-surface-muted hover:text-text-primary [&_svg]:text-text-muted"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border p-4">
                    {typeof chrome.streak === "number" ? (
                      <StatPill
                        icon={<Flame aria-hidden />}
                        className="bg-golden-soft text-golden-foreground"
                      >
                        {chrome.streak}
                      </StatPill>
                    ) : null}
                    {typeof chrome.xp === "number" ? (
                      <StatPill
                        icon={<Star aria-hidden />}
                        className="bg-success-soft text-success-foreground"
                      >
                        {chrome.xp}
                      </StatPill>
                    ) : null}
                    <LanguageMenu
                      languages={chrome.languages}
                      activeLanguage={chrome.activeLanguage}
                      onLanguageChange={chrome.onLanguageChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export { LearnerAppShell };
