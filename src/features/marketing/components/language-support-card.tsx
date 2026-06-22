import * as React from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type LanguageSupportCardProps = {
  language: string;
  /** Flag / glyph — a `lucide-react` icon or short string. */
  flag?: React.ReactNode;
  scripts?: string[];
  features?: string[];
  className?: string;
};

/**
 * LanguageSupportCard — a supported target language with its scripts and
 * feature highlights. Use in the "Ngôn ngữ hỗ trợ" section.
 */
function LanguageSupportCard({
  language,
  flag,
  scripts = [],
  features = [],
  className,
}: LanguageSupportCardProps) {
  return (
    <Card className={cn("gap-3 p-5", className)}>
      <div className="flex items-center gap-3">
        {flag ? <span className="text-2xl leading-none">{flag}</span> : null}
        <h3 className="text-lg font-semibold text-text-primary">{language}</h3>
      </div>

      {scripts.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {scripts.map((s) => (
            <span
              key={s}
              className="rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}

      {features.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-foreground">
                <Check className="size-2.5" aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

export { LanguageSupportCard };
