import Link from "next/link";
import type { Route } from "next";
import type * as React from "react";

import type { NavItem } from "@/components/shared/navigation";
import { cn } from "@/lib/utils/cn";

import type { LearnerChrome } from "./learner-chrome";
import { LearnerUserMenu } from "./learner-account-menu";
import { LearnerMoreMenu } from "./learner-more-menu";
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

const NAV_PRIMARY_COUNT = 4;

/**
 * LearnerAppShell — sticky top header (no sidebar) over a centered content column.
 *
 * Breakpoints (v22):
 *  ≥1280px (xl)  — full 7-item nav visible
 *  1024–1279px   — compact: first 4 items + "Thêm" dropdown
 *  768–1023px    — burger sheet + page title; language selector hidden
 *  <768px        — compact header; bottom nav handled by mobile nav
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
  const primaryNav = navItems.slice(0, NAV_PRIMARY_COUNT);
  const overflowNav = navItems.slice(NAV_PRIMARY_COUNT);

  return (
    <div className={cn("min-h-svh bg-background", className)}>
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:px-7">

          {/* Logo */}
          <Link href={homeHref} className="flex shrink-0 items-center">
            {logo}
          </Link>

          {/* Full nav — ≥1280px */}
          {navItems.length > 0 && (
            <nav className="hidden min-w-0 items-center gap-0.5 xl:flex" aria-label="Điều hướng chính">
              {navItems.map((item) => {
                const active = item.id === activeNavId;
                return (
                  <Link
                    key={item.id}
                    href={item.href ?? homeHref}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center gap-1.5 rounded-pill px-3 text-sm whitespace-nowrap transition-colors [&_svg]:size-4",
                      active
                        ? "bg-primary-soft font-semibold text-primary-soft-foreground after:absolute after:bottom-[-17px] after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-primary [&_svg]:text-primary"
                        : "font-medium text-text-secondary hover:bg-surface-muted hover:text-foreground [&_svg]:text-text-muted"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Compact nav — 1024–1279px */}
          {navItems.length > 0 && (
            <nav className="hidden min-w-0 items-center gap-0.5 lg:flex xl:hidden" aria-label="Điều hướng chính">
              {primaryNav.map((item) => {
                const active = item.id === activeNavId;
                return (
                  <Link
                    key={item.id}
                    href={item.href ?? homeHref}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center gap-1.5 rounded-pill px-3 text-sm whitespace-nowrap transition-colors [&_svg]:size-4",
                      active
                        ? "bg-primary-soft font-semibold text-primary-soft-foreground after:absolute after:bottom-[-17px] after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-primary [&_svg]:text-primary"
                        : "font-medium text-text-secondary hover:bg-surface-muted hover:text-foreground [&_svg]:text-text-muted"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
              {overflowNav.length > 0 && (
                <LearnerMoreMenu
                  items={overflowNav}
                  homeHref={homeHref}
                  {...(activeNavId !== undefined ? { activeNavId } : {})}
                />
              )}
            </nav>
          )}

          {/* Right cluster */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Language switcher — hidden on mobile (<md), compact on tablet */}
            <div className="hidden md:flex">
              <LearnerStatusCluster {...chrome} />
            </div>

            {/* Golden Time chip */}
            {chrome.goldenTime ? (
              <GoldenTimeChip goldenTime={chrome.goldenTime} />
            ) : null}

            {/* User menu with notification panel */}
            <LearnerUserMenu
              user={chrome.user}
              {...(chrome.userStats !== undefined ? { userStats: chrome.userStats } : {})}
              {...(chrome.notifications !== undefined ? { notifications: chrome.notifications } : {})}
              {...(chrome.accountActions !== undefined ? { accountActions: chrome.accountActions } : {})}
              {...(chrome.onSignOut !== undefined ? { onSignOut: chrome.onSignOut } : {})}
              {...(chrome.signOutLabel !== undefined ? { signOutLabel: chrome.signOutLabel } : {})}
            />

            {/* Mobile/tablet burger */}
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
