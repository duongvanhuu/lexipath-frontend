"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";

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
import { Menu } from "lucide-react";

type MarketingMobileNavProps = {
  navItems: NavItem[];
  homeHref: Route;
  activeNavId?: string;
  actions?: ShellAction[];
};

function MarketingMobileNav({
  navItems,
  homeHref,
  activeNavId,
  actions = [],
}: MarketingMobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
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
  );
}

export { MarketingMobileNav };
