import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";

import type { ReviewReason } from "../types";
import { ReviewReasonChip } from "../golden-time/review-reason-chip";

/* -------------------------------------------------------------------------- */
/* NextBestStepCard                                                            */
/* -------------------------------------------------------------------------- */

export type NextBestStepCardProps = {
  title: string;
  description?: string;
  ctaLabel: string;
  href?: string;
  itemCount?: number;
  estimatedMinutes?: number;
  reason?: ReviewReason;
  badge?: string;
  className?: string;
};

/**
 * NextBestStepCard — card surfacing the next recommended learning action.
 * Primary-soft surface with a prominent CTA. If href is provided, the CTA
 * wraps in a Link. Otherwise the Button renders standalone (parent owns onClick).
 */
function NextBestStepCard({
  title,
  description,
  ctaLabel,
  href,
  itemCount,
  estimatedMinutes,
  reason,
  badge,
  className,
}: NextBestStepCardProps) {
  const hasStats =
    typeof itemCount === "number" || typeof estimatedMinutes === "number";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border border-primary/30 bg-primary-soft p-5",
        className
      )}
    >
      {/* Badge row */}
      {badge ? (
        <Badge className="w-fit rounded-pill bg-primary-soft-foreground/10 text-primary-soft-foreground">
          {badge}
        </Badge>
      ) : null}

      {/* Title */}
      <h3 className="font-semibold text-text-primary">{title}</h3>

      {/* Description */}
      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}

      {/* Stats row */}
      {(hasStats || reason) ? (
        <div className="flex flex-wrap items-center gap-2">
          {typeof itemCount === "number" ? (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <BookOpen className="size-3.5" aria-hidden />
              {itemCount} từ
            </span>
          ) : null}
          {typeof estimatedMinutes === "number" ? (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Clock className="size-3.5" aria-hidden />
              ~{estimatedMinutes} phút
            </span>
          ) : null}
          {reason ? <ReviewReasonChip reason={reason} /> : null}
        </div>
      ) : null}

      {/* CTA */}
      {href ? (
        <Button
          asChild
          size="sm"
          className={cn(buttonToneVariants({ tone: "nextStep" }), "self-start")}
        >
          <Link href={href as Route}>{ctaLabel}</Link>
        </Button>
      ) : (
        <Button
          size="sm"
          className={cn(buttonToneVariants({ tone: "nextStep" }), "self-start")}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

export { NextBestStepCard };
