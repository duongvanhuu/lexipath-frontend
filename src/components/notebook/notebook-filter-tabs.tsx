import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";
import type { NotebookTab } from "./types";

export type NotebookFilterTabsProps = {
  tabs: NotebookTab[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
};

function NotebookFilterTabs({
  tabs,
  activeId,
  onTabChange,
  className,
}: NotebookFilterTabsProps) {
  return (
    <Tabs
      value={activeId}
      onValueChange={onTabChange}
      className={cn(className)}
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex-1 gap-1.5"
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="rounded-pill bg-muted px-1.5 py-0.5 text-[10px] text-text-muted">
                {tab.count}
              </span>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { NotebookFilterTabs };
