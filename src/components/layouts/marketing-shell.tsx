import Link from "next/link";
import type { Route } from "next";
import type * as React from "react";

import { ActionButton } from "@/components/shared/action-button";
import type { NavItem, ShellAction } from "@/components/shared/navigation";
import { cn } from "@/lib/utils/cn";

import { MarketingMobileNav } from "./marketing-mobile-nav";

export type MarketingShellProps = {
  logo?: React.ReactNode;
  /** Where the logo links to. */
  homeHref?: Route;
  navItems?: NavItem[];
  activeNavId?: string;
  /** Right-aligned CTAs (e.g. "Đăng nhập", "Dùng thử"). */
  actions?: ShellAction[];
  children: React.ReactNode;
  className?: string;
};

function marketingLinkClass(active: boolean) {
  return cn(
    "text-sm font-medium whitespace-nowrap transition-colors",
    active ? "text-primary" : "text-text-secondary hover:text-text-primary"
  );
}

/**
 * MarketingShell — public top-header layout for landing / pricing / FAQ and
 * other unauthenticated pages. Sticky translucent header, no sidebar. Desktop
 * shows the nav inline with right-aligned CTAs; below `md` the nav collapses
 * into a `Sheet`.
 */
function MarketingShell({
  logo,
  homeHref = "/",
  navItems = [],
  activeNavId,
  actions = [],
  children,
  className,
}: MarketingShellProps) {
  return (
    <div className={cn("min-h-svh overflow-x-hidden bg-background", className)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-primary"
      >
        Bỏ qua điều hướng
      </a>
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <Link href={homeHref} className="flex shrink-0 items-center">
              {logo}
            </Link>
            {navItems.length > 0 ? (
              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href ?? homeHref}
                    aria-current={item.id === activeNavId ? "page" : undefined}
                    className={marketingLinkClass(item.id === activeNavId)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {actions.map((action, index) => (
              <ActionButton
                key={action.id ?? action.label}
                action={{
                  ...action,
                  variant: action.variant ?? (index === actions.length - 1 ? "primary" : "ghost"),
                }}
                size="sm"
              />
            ))}
          </div>

          {(navItems.length > 0 || actions.length > 0) ? (
            <MarketingMobileNav
              navItems={navItems}
              homeHref={homeHref}
              {...(activeNavId !== undefined ? { activeNavId } : {})}
              actions={actions}
            />
          ) : null}
        </div>
      </header>

      <main id="main-content">{children}</main>
    </div>
  );
}

export { MarketingShell };
