import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type FinalCTABandProps = {
  headline?: string;
  sub?: string;
  ctaLabel?: string;
  ctaHref: Route;
  secondaryLabel?: string;
  secondaryHref?: Route;
  className?: string;
};

/**
 * FinalCTABand — full-width closing CTA on the brand-emerald surface. Place it
 * as the last section before the footer.
 */
function FinalCTABand({
  headline = "Bắt đầu học từ vựng thông minh hôm nay",
  sub,
  ctaLabel = "Bắt đầu miễn phí",
  ctaHref,
  secondaryLabel,
  secondaryHref,
  className,
}: FinalCTABandProps) {
  return (
    <section
      className={cn(
        "bg-primary px-4 py-20 text-center text-primary-foreground sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {headline}
        </h2>
        {sub ? (
          <p className="mt-4 text-base text-primary-foreground/80 sm:text-lg">
            {sub}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 bg-card px-7 text-base text-primary hover:bg-card/90"
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
              className="h-12 border-primary-foreground/35 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { FinalCTABand };
