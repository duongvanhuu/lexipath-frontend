import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { SourceInfo } from "./types";

export interface SourceInfoPanelProps {
  info: SourceInfo;
  className?: string;
}

export function SourceInfoPanel({ info, className }: SourceInfoPanelProps) {
  const hasAnyValue =
    info.origin ??
    info.author ??
    info.license ??
    info.url ??
    info.retrievedAtLabel ??
    info.notes;

  if (!hasAnyValue) {
    return (
      <div className={cn("rounded-lg border bg-card p-4", className)}>
        <p className="text-sm text-muted-foreground">
          No source information available.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
        {info.origin && (
          <>
            <dt className="font-medium text-muted-foreground">Origin</dt>
            <dd className="text-foreground">{info.origin}</dd>
          </>
        )}

        {info.author && (
          <>
            <dt className="font-medium text-muted-foreground">Author</dt>
            <dd className="text-foreground">{info.author}</dd>
          </>
        )}

        {info.license && (
          <>
            <dt className="font-medium text-muted-foreground">License</dt>
            <dd className="text-foreground">{info.license}</dd>
          </>
        )}

        {info.url && (
          <>
            <dt className="font-medium text-muted-foreground">URL</dt>
            <dd className="text-foreground">
              <a
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary underline-offset-2 hover:underline"
              >
                <ExternalLink className="size-3 shrink-0" aria-hidden />
                {info.url}
              </a>
            </dd>
          </>
        )}

        {info.retrievedAtLabel && (
          <>
            <dt className="font-medium text-muted-foreground">Retrieved</dt>
            <dd className="text-foreground">{info.retrievedAtLabel}</dd>
          </>
        )}

        {info.notes && (
          <>
            <dt className="font-medium text-muted-foreground">Notes</dt>
            <dd className="text-foreground">{info.notes}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
