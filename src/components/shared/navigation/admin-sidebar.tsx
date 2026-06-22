import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import type { NavItem, NavSection } from "./types";

type SidebarNavLinkProps = {
  item: NavItem;
  active: boolean;
  onNavigate?: (() => void) | undefined;
};

function SidebarNavLink({ item, active, onNavigate }: SidebarNavLinkProps) {
  const className = cn(
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground [&_svg]:text-sidebar-primary"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground [&_svg]:text-sidebar-foreground/60",
    item.disabled && "pointer-events-none opacity-50"
  );

  const content = (
    <>
      {item.icon}
      <span className="truncate">{item.label}</span>
    </>
  );

  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        onClick={() => onNavigate?.()}
        aria-current={active ? "page" : undefined}
        className={className}
        {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        item.onClick?.();
        onNavigate?.();
      }}
      disabled={item.disabled}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {content}
    </button>
  );
}

export type AdminSidebarProps = {
  /** Brand / logo slot rendered at the top. */
  logo?: React.ReactNode;
  /** Grouped navigation. Pass a single unlabelled section for a flat list. */
  sections: NavSection[];
  activeNavId?: string | undefined;
  /** Bottom slot — e.g. the signed-in admin summary. */
  footer?: React.ReactNode;
  /** Fired after any item is chosen — used to close the mobile sheet. */
  onNavigate?: (() => void) | undefined;
  className?: string;
};

/**
 * AdminSidebar — the dark, 240px navigation rail for internal / admin surfaces.
 * Self-contained (no fetching): the page supplies sections, the active id, and
 * an optional footer. The `dark` class flips the shadcn `sidebar` tokens so the
 * rail stays dark in both light and dark page themes.
 */
function AdminSidebar({
  logo,
  sections,
  activeNavId,
  footer,
  onNavigate,
  className,
}: AdminSidebarProps) {
  return (
    <div
      className={cn(
        "dark flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {logo ? (
        <div className="flex h-14 shrink-0 items-center px-5">{logo}</div>
      ) : null}

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id ?? section.label ?? sectionIndex}
            className="flex flex-col gap-1"
          >
            {section.label ? (
              <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => (
              <SidebarNavLink
                key={item.id}
                item={item}
                active={item.id === activeNavId}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      {footer ? (
        <div className="shrink-0 border-t border-sidebar-border p-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export { AdminSidebar };
