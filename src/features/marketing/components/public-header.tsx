import * as React from "react";

import { MarketingShell } from "@/components/layouts/marketing-shell";
import type { NavItem, ShellAction } from "@/components/shared/navigation";

import { LexiLogo } from "./lexi-logo";
import type { MarketingNavItem } from "../types/marketing.types";

export type PublicHeaderProps = {
  navItems?: MarketingNavItem[];
  /** Right-aligned CTAs (e.g. "Đăng nhập", "Dùng thử"). */
  actions?: ShellAction[];
  activeNavId?: string;
  children: React.ReactNode;
};

/**
 * PublicHeader — the marketing/public chrome. Thin wrapper over the canonical
 * {@link MarketingShell} (sticky translucent header, mobile sheet nav) that
 * supplies the LexiPath wordmark and adapts the marketing nav model. The page
 * renders its sections as `children`.
 */
function PublicHeader({
  navItems = [],
  actions = [],
  activeNavId,
  children,
}: PublicHeaderProps) {
  const shellNav: NavItem[] = navItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
  }));

  return (
    <MarketingShell
      logo={<LexiLogo />}
      navItems={shellNav}
      actions={actions}
      {...(activeNavId !== undefined ? { activeNavId } : {})}
    >
      {children}
    </MarketingShell>
  );
}

export { PublicHeader };
