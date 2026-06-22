import Link from "next/link";
import type { Route } from "next";
import type * as React from "react";

import type { NavItem } from "@/components/shared/navigation";
import { cn } from "@/lib/utils/cn";

import type { LearnerChrome } from "./learner-chrome";
import { AccountMenu } from "./learner-account-menu";
import { GoldenTimeChip, LearnerStatusCluster } from "./learner-status-cluster";
import { LearnerMobileNav } from "./learner-mobile-nav";

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
              <LearnerMobileNav
                navItems={navItems}
                homeHref={homeHref}
                {...(activeNavId !== undefined ? { activeNavId } : {})}
                {...(chrome.streak !== undefined ? { streak: chrome.streak } : {})}
                {...(chrome.xp !== undefined ? { xp: chrome.xp } : {})}
                {...(chrome.languages !== undefined ? { languages: chrome.languages } : {})}
                {...(chrome.activeLanguage !== undefined ? { activeLanguage: chrome.activeLanguage } : {})}
                {...(chrome.onLanguageChange !== undefined ? { onLanguageChange: chrome.onLanguageChange } : {})}
              />
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
