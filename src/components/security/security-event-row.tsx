import * as React from "react";
import { Info, AlertTriangle, ShieldAlert } from "lucide-react";

import { StatusBadge } from "@/components/shared/badges/status-badge";
import type { LexiStatus } from "@/components/shared/badges/status-badge";
import type { SecurityEvent } from "./types";

export interface SecurityEventRowProps {
  event: SecurityEvent;
}

type Severity = SecurityEvent["severity"];

const SEVERITY_ICONS = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
} as const;

const SEVERITY_ICON_CLASSES: Record<Severity, string> = {
  info: "text-primary-soft-foreground",
  warning: "text-warning-foreground",
  danger: "text-danger-foreground",
};

const SEVERITY_TO_LEXI: Record<Severity, LexiStatus> = {
  info: "neutral",
  warning: "warning",
  danger: "danger",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  info: "Thông tin",
  warning: "Cảnh báo",
  danger: "Nguy hiểm",
};

function SecurityEventRow({ event }: SecurityEventRowProps) {
  const { title, description, severity, createdAtLabel, ipAddress } = event;

  const SeverityIcon = SEVERITY_ICONS[severity];

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className="mt-0.5 shrink-0"
        aria-hidden
      >
        <SeverityIcon
          className={`size-4 ${SEVERITY_ICON_CLASSES[severity]}`}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{title}</span>
          <StatusBadge status={SEVERITY_TO_LEXI[severity]}>
            {SEVERITY_LABELS[severity]}
          </StatusBadge>
        </div>

        {description ? (
          <p className="text-sm text-text-secondary">{description}</p>
        ) : null}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
          <span>{createdAtLabel}</span>
          {ipAddress ? <span>{ipAddress}</span> : null}
        </div>
      </div>
    </div>
  );
}

export { SecurityEventRow };
