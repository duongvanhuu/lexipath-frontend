import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import { MarketingEyebrowBadge } from "./marketing-eyebrow-badge";

export type LandingHeroProps = {
  eyebrow?: string;
  /** Headline — pass a node to emphasise part of it (e.g. brand-coloured run). */
  headline: React.ReactNode;
  sub?: string;
  ctaLabel?: string;
  ctaHref: Route;
  secondaryLabel?: string;
  secondaryHref?: Route;
  /** Optional product mockup rendered below the CTAs. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * LandingHero — the above-the-fold hero for the public landing page: eyebrow +
 * display headline + sub + dual CTAs + an optional product-mockup slot.
 */
function LandingHero({
  eyebrow,
  headline,
  sub,
  ctaLabel = "Bắt đầu miễn phí",
  ctaHref,
  secondaryLabel = "Xem demo",
  secondaryHref,
  children,
  className,
}: LandingHeroProps) {
  return (
    <section
      className={cn(
        "px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pt-24",
        className
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        {eyebrow ? (
          <MarketingEyebrowBadge
            className="mb-5"
            icon={<span className="size-1.5 rounded-full bg-current" />}
          >
            {eyebrow}
          </MarketingEyebrowBadge>
        ) : null}

        <h1 className="font-heading text-4xl leading-[1.12] font-bold tracking-tight text-balance text-text-primary sm:text-5xl lg:text-6xl">
          {headline}
        </h1>

        {sub ? (
          <p className="mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
            {sub}
          </p>
        ) : null}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 bg-primary px-7 text-base text-primary-foreground shadow-card hover:bg-primary-hover"
          >
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          {secondaryLabel && secondaryHref ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {children ? (
        <div className="mx-auto mt-14 max-w-5xl">{children}</div>
      ) : null}
    </section>
  );
}

export { LandingHero };
