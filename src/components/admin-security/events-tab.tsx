"use client";

import * as React from "react";
import { Info, ShieldAlert, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SecuritySeverityBadge } from "@/components/admin-security/security-severity-badge";
import {
  RiskDetailSheet,
  type RiskDetailData,
} from "@/components/admin-security/risk-detail-sheet";
import type { EventSeverity, SecurityEventRecord } from "@/features/admin-security";
import { cn } from "@/lib/utils/cn";

const SEVERITY_ICON: Record<EventSeverity, React.ReactNode> = {
  critical: <ShieldAlert className="size-4" aria-hidden />,
  warning: <TriangleAlert className="size-4" aria-hidden />,
  info: <Info className="size-4" aria-hidden />,
};

const SEVERITY_ICON_CLASS: Record<EventSeverity, string> = {
  critical: "bg-danger-soft text-danger-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  info: "bg-primary-soft text-primary-soft-foreground",
};

export function EventsTab({ events }: { events: SecurityEventRecord[] }) {
  const [sel, setSel] = React.useState<SecurityEventRecord | null>(null);

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <ul role="list" className="divide-y divide-border">
          {events.map((ev) => (
            <li key={ev.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-3.5 transition-colors hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                onClick={() => setSel(ev)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
                      SEVERITY_ICON_CLASS[ev.severity]
                    )}
                  >
                    {SEVERITY_ICON[ev.severity]}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {ev.event}
                      </span>
                      <span className="text-xs text-text-muted">· {ev.user}</span>
                      <SecuritySeverityBadge severity={ev.severity} />
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">
                      {ev.description}
                    </p>
                  </div>

                  <time className="shrink-0 text-xs text-text-muted">
                    {ev.timestamp}
                  </time>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <RiskDetailSheet
        open={!!sel}
        onClose={() => setSel(null)}
        data={
          sel
            ? ({
                user: sel.user,
                email: sel.email,
                risk: sel.risk,
                lastActive: sel.timestamp,
                ...(sel.device !== undefined ? { device: sel.device } : {}),
                ...(sel.ip !== undefined ? { ip: sel.ip } : {}),
                ...(sel.location !== undefined ? { location: sel.location } : {}),
              } satisfies RiskDetailData)
            : null
        }
      />
    </>
  );
}
