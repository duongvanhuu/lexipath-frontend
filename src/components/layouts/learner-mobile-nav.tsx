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

import type { LanguageOption } from "./learner-chrome";
import { LanguageMenu } from "./learner-account-menu";
import { StatPill } from "./learner-status-cluster";

type LearnerMobileNavProps = {
  navItems: NavItem[];
  homeHref: Route;
  activeNavId?: string;
  streak?: number;
  xp?: number;
  languages?: LanguageOption[];
  activeLanguage?: string;
  onLanguageChange?: (code: string) => void;
};

function LearnerMobileNav({
  navItems,
  homeHref,
  activeNavId,
  streak,
  xp,
  languages,
  activeLanguage,
  onLanguageChange,
}: LearnerMobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
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
          <LanguageMenu
            languages={languages}
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { LearnerMobileNav };
