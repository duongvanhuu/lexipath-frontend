import * as React from "react";
import { StatusBadge, type LexiStatus } from "@/components/shared/badges/status-badge";

type StatusEntry = {
  label: string;
  status: LexiStatus;
};

const STATUS_MAP: Record<string, StatusEntry> = {
  completed: { label: "Hoàn tất", status: "success" },
  published: { label: "Đã đẩy", status: "success" },
  processed: { label: "Đã xử lý", status: "success" },
  in_progress: { label: "Đang chạy", status: "info" },
  pending: { label: "Chờ xử lý", status: "info" },
  duplicate: { label: "Trùng lặp", status: "warning" },
  failed: { label: "Thất bại", status: "danger" },
};

export function ReliabilityStatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, status: "neutral" as LexiStatus };
  return (
    <StatusBadge status={entry.status} dot>
      {entry.label}
    </StatusBadge>
  );
}
