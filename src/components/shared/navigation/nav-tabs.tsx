"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

export type NavTabItem = {
  id: string;
  label: string;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type NavTabsProps = {
  items: NavTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  "aria-label"?: string;
};

/**
 * NavTabs — underline-style segmented navigation built on the shadcn `Tabs`
 * primitive (`variant="line"`). Controlled section switcher: it does not render
 * panels, so callers drive content from `activeId`.
 */
function NavTabs({
  items,
  activeId,
  onChange,
  className,
  "aria-label": ariaLabel,
}: NavTabsProps) {
  return (
    <Tabs
      value={activeId}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList
        variant="line"
        aria-label={ariaLabel}
        className="w-full justify-start border-b border-border"
      >
        {items.map((item) => (
          <TabsTrigger key={item.id} value={item.id} disabled={item.disabled}>
            {item.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { NavTabs };
