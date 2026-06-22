import * as React from "react";

import { cn } from "@/lib/utils/cn";

import { MarketingEyebrowBadge } from "./marketing-eyebrow-badge";
import type { EyebrowTone } from "../types/marketing.types";

export type MarketingSectionHeaderProps = {
  eyebrow?: string;
  eyebrowTone?: EyebrowTone;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * MarketingSectionHeader — eyebrow pill + display heading + subtitle for a
 * marketing section. Use the `<h1>` hero (`LandingHero`) for the page title;
 * this renders an `<h2>` section heading.
 */
function MarketingSectionHeader({
  eyebrow,
  eyebrowTone = "primary",
  title,
  subtitle,
  align = "center",
  className,
}: MarketingSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <MarketingEyebrowBadge tone={eyebrowTone}>{eyebrow}</MarketingEyebrowBadge>
      ) : null}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-balance text-text-primary sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base text-text-secondary sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export { MarketingSectionHeader };
