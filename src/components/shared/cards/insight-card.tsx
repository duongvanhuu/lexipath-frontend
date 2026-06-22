import * as React from "react";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { LexiCard } from "./lexi-card";
import { type LexiCardTone } from "./card-variants";

export type InsightCardProps = {
  title: string;
  /** Short insight summary. Omit if using `children` for richer content. */
  description?: string;
  /** Leading accent icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  /** Single primary action, e.g. a `LexiButton`. Rendered in the footer. */
  action?: React.ReactNode;
  /** Insight surfaces default to the brand-soft `insight` tone. */
  tone?: Extract<LexiCardTone, "insight" | "primary" | "golden" | "default">;
  className?: string;
  children?: React.ReactNode;
};

/**
 * InsightCard — a learning insight (title + explanation) paired with a single
 * next action. Maps the prototype "insight" card; keeps LexiPath identity by
 * defaulting to the brand-soft surface and a one-action footer.
 */
function InsightCard({
  title,
  description,
  icon,
  action,
  tone = "insight",
  className,
  children,
}: InsightCardProps) {
  return (
    <LexiCard tone={tone} className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon ? (
            <span className="inline-flex text-current [&_svg]:size-4" aria-hidden>
              {icon}
            </span>
          ) : null}
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className={cn(tone !== "default" && "text-current/80")}>
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
      {action ? <CardFooter className="bg-transparent border-0 pt-0">{action}</CardFooter> : null}
    </LexiCard>
  );
}

export { InsightCard };
