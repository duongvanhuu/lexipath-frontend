import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { LexiLogo } from "./lexi-logo";
import type { FooterColumn } from "../types/marketing.types";

export type PublicFooterProps = {
  columns?: FooterColumn[];
  /** Short brand tagline under the logo. */
  tagline?: string;
  copyright?: string;
  className?: string;
};

/**
 * PublicFooter — multi-column footer for public/marketing pages: brand block,
 * link columns, and copyright. Last element on every public page.
 */
function PublicFooter({
  columns = [],
  tagline = "Học từ vựng thông minh hơn — không chỉ nhiều hơn.",
  copyright = "© 2026 LexiPath Vocabulary. Đã đăng ký bản quyền.",
  className,
}: PublicFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-surface-muted px-4 pt-14 pb-8 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <LexiLogo />
            <p className="max-w-56 text-sm text-text-muted">{tagline}</p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="mb-3.5 text-xs font-semibold tracking-wide text-text-primary uppercase">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-text-muted">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export { PublicFooter };
