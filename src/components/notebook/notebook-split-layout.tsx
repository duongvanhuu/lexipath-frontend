"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

export type NotebookSplitLayoutProps = {
  list: React.ReactNode;
  detail: React.ReactNode;
  detailOpen?: boolean;
  onDetailOpenChange?: (open: boolean) => void;
  detailTitle?: string;
  className?: string;
};

function NotebookSplitLayout({
  list,
  detail,
  detailOpen = false,
  onDetailOpenChange,
  detailTitle = "Chi tiết",
  className,
}: NotebookSplitLayoutProps) {
  return (
    <>
      {/* Desktop */}
      <div
        className={cn(
          "hidden h-full md:grid md:grid-cols-[320px_1fr]",
          className
        )}
      >
        <aside className="flex flex-col overflow-hidden border-r border-border bg-card">
          {list}
        </aside>
        <main className="overflow-auto bg-card">{detail}</main>
      </div>

      {/* Mobile */}
      <div className="flex h-full flex-col md:hidden">
        <div className="flex-1 overflow-auto bg-card">{list}</div>
        <Sheet
          open={detailOpen}
          {...(onDetailOpenChange !== undefined
            ? { onOpenChange: onDetailOpenChange }
            : {})}
        >
          <SheetContent side="bottom" className="h-[85dvh]">
            <SheetHeader>
              <SheetTitle>{detailTitle}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-auto">{detail}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export { NotebookSplitLayout };
