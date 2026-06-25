import * as React from "react";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import type { EventSeverity } from "@/features/admin-security";

const SEVERITY_LABEL: Record<EventSeverity, string> = {
  critical: "Nghiêm trọng",
  warning: "Cảnh báo",
  info: "Thông tin",
};

const SEVERITY_STATUS = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

export function SecuritySeverityBadge({ severity }: { severity: EventSeverity }) {
  return (
    <StatusBadge status={SEVERITY_STATUS[severity]} dot>
      {SEVERITY_LABEL[severity]}
    </StatusBadge>
  );
}
