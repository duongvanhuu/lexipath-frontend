"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Menu } from "lucide-react";

import { ActionButton } from "@/components/shared/action-button";
import { IconButton } from "@/components/shared/icon-button";
import type { NavItem, ShellAction } from "@/components/shared/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

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
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("min-h-svh bg-background", className)}>
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

          {(navItems.length > 0 || actions.length > 0) && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <IconButton variant="outline" label="Mở menu">
                  <Menu />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 gap-0 p-0">
                <SheetHeader>
                  <SheetTitle>Điều hướng</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href ?? homeHref}
                      onClick={() => setOpen(false)}
                      aria-current={item.id === activeNavId ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        item.id === activeNavId
                          ? "bg-primary-soft text-primary-soft-foreground"
                          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {actions.length > 0 ? (
                  <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                    {actions.map((action, index) => (
                      <ActionButton
                        key={action.id ?? action.label}
                        action={{
                          ...action,
                          variant:
                            action.variant ?? (index === actions.length - 1 ? "primary" : "outline"),
                          onClick: action.onClick
                            ? () => {
                                setOpen(false);
                                action.onClick?.();
                              }
                            : undefined,
                        }}
                        fullWidth
                      />
                    ))}
                  </div>
                ) : null}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {children}
    </div>
  );
}

export { MarketingShell };
