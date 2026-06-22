"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "default" | "wide";
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "default",
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(size === "wide" && "sm:max-w-2xl")}
      >
        <SheetHeader className="border-b pb-3">
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {children}
        </div>

        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
