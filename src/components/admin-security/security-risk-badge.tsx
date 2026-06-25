import * as React from "react";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import type { RiskLevel } from "@/features/admin-security";

const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const RISK_STATUS = {
  low: "success",
  medium: "warning",
  high: "danger",
} as const;

export function SecurityRiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <StatusBadge status={RISK_STATUS[risk]} dot>
      {RISK_LABEL[risk]}
    </StatusBadge>
  );
}
