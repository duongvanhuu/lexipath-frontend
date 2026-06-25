import * as React from "react";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import type { LexiStatus } from "@/lib/styles/variants";

type StatusEntry = {
  label: string;
  status: LexiStatus;
};

const STATUS_MAP: Record<string, StatusEntry> = {
  active: { label: "Hoạt động", status: "success" },
  success: { label: "Thành công", status: "success" },
  processed: { label: "Đã xử lý", status: "success" },
  approved: { label: "Đã duyệt", status: "success" },
  trialing: { label: "Dùng thử", status: "info" },
  pending: { label: "Chờ xử lý", status: "info" },
  received: { label: "Đã nhận", status: "info" },
  past_due: { label: "Quá hạn", status: "warning" },
  requested: { label: "Chờ duyệt", status: "warning" },
  draft: { label: "Bản nháp", status: "neutral" },
  cancelled: { label: "Đã hủy", status: "neutral" },
  refunded: { label: "Đã hoàn", status: "neutral" },
  expired: { label: "Hết hạn", status: "danger" },
  failed: { label: "Thất bại", status: "danger" },
  rejected: { label: "Từ chối", status: "danger" },
};

export function PaymentStatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, status: "neutral" as LexiStatus };
  return <StatusBadge status={entry.status}>{entry.label}</StatusBadge>;
}
