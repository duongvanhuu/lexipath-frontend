import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type HeroProductMockupProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * HeroProductMockup — decorative browser-chrome frame with a soft brand glow.
 * Drop a product preview inside as children. Presentation only — not for
 * interactive content.
 */
function HeroProductMockup({ children, className }: HeroProductMockupProps) {
  return (
    <div
      className={cn(
        "mx-auto overflow-hidden rounded-card border border-border bg-card shadow-pop",
        className
      )}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-border bg-surface-muted px-3">
        <span className="size-2.5 rounded-full bg-danger/60" />
        <span className="size-2.5 rounded-full bg-golden/70" />
        <span className="size-2.5 rounded-full bg-success/60" />
        <span className="mx-2 h-5 flex-1 rounded border border-border bg-card" />
      </div>
      {children}
    </div>
  );
}

export { HeroProductMockup };
