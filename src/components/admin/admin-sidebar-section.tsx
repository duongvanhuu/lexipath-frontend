"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn";

import type { AdminSidebarNavSection, AdminSidebarNavItem } from "./types";

export interface AdminSidebarSectionProps {
  section: AdminSidebarNavSection;
  activeId?: string;
  onSelect?: (id: string) => void;
}

function NavItem({
  item,
  isActive,
  onSelect,
}: {
  item: AdminSidebarNavItem;
  isActive: boolean;
  onSelect?: (id: string) => void;
}) {
  const baseClasses = cn(
    "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors",
    isActive
      ? "bg-primary/10 font-medium text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    item.disabled && "pointer-events-none cursor-not-allowed opacity-50",
  );

  const content = (
    <>
      {item.icon && (
        <span className="size-4 shrink-0 [&_svg]:size-4" aria-hidden>
          {item.icon}
        </span>
      )}
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge !== null && (
        <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.href && !item.disabled) {
    return (
      <Link href={item.href as Route} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      disabled={item.disabled}
      onClick={(e) => {
        e.preventDefault();
        onSelect?.(item.id);
      }}
    >
      {content}
    </button>
  );
}

function NavItemList({
  items,
  activeId,
  onSelect,
}: {
  items: AdminSidebarNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <NavItem
            item={item}
            isActive={item.id === activeId}
            {...(onSelect ? { onSelect } : {})}
          />
        </li>
      ))}
    </ul>
  );
}

export function AdminSidebarSection({
  section,
  activeId,
  onSelect,
}: AdminSidebarSectionProps) {
  if (!section.label) {
    return (
      <NavItemList
        items={section.items}
        {...(activeId !== undefined ? { activeId } : {})}
        {...(onSelect ? { onSelect } : {})}
      />
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="section">
      <AccordionItem value="section" className="border-none">
        <AccordionTrigger className="px-2.5 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:no-underline">
          {section.label}
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <NavItemList
            items={section.items}
            {...(activeId !== undefined ? { activeId } : {})}
            {...(onSelect ? { onSelect } : {})}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
