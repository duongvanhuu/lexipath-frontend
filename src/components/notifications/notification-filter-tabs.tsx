"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { NotifFilterTab } from "@/features/notifications/types";

interface FilterTabItem {
  id: NotifFilterTab;
  label: string;
  count: number;
}

interface NotificationFilterTabsProps {
  tabs: FilterTabItem[];
  active: NotifFilterTab;
  onChange: (tab: NotifFilterTab) => void;
}

function NotificationFilterTabs({
  tabs,
  active,
  onChange,
}: NotificationFilterTabsProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5"
      role="tablist"
      aria-label="Lọc thông báo"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap",
            active === tab.id
              ? "border-transparent bg-primary-soft text-primary-soft-foreground font-semibold"
              : "border-border bg-card text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          )}
        >
          {tab.label}
          {tab.count > 0 ? (
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full text-xs leading-none",
                active === tab.id
                  ? "text-primary-soft-foreground/80"
                  : "text-text-muted"
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export { NotificationFilterTabs };
