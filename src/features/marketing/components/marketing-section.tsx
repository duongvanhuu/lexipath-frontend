import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type MarketingSectionTone = "default" | "muted" | "primary-soft";

export type MarketingSectionProps = {
  id?: string;
  /** Background surface for the section band. */
  tone?: MarketingSectionTone;
  /** Render children edge-to-edge without the centered max-width container. */
  fullBleed?: boolean;
  className?: string;
  /** Override the inner container width. Defaults to the marketing 1180px. */
  containerClassName?: string;
  children: React.ReactNode;
};

const toneClass: Record<MarketingSectionTone, string> = {
  default: "bg-background",
  muted: "bg-surface-muted",
  "primary-soft": "bg-primary-soft text-primary-soft-foreground",
};

/**
 * MarketingSection — semantic `<section>` band for public pages: tone surface +
 * vertical rhythm + centered max-width container. Wrap every landing block in
 * one. Purely presentational (Server Component).
 */
function MarketingSection({
  id,
  tone = "default",
  fullBleed = false,
  className,
  containerClassName,
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        toneClass[tone],
        className
      )}
    >
      {fullBleed ? (
        children
      ) : (
        <div className={cn("mx-auto w-full max-w-[1180px]", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}

export { MarketingSection };
