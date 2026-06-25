"use client";

import * as React from "react";
import { CheckCheck, Loader, RefreshCw, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layouts/page-header";
import { ReliabilityStatCards } from "@/components/admin-reliability/reliability-stat-cards";
import { ReliabilityStatusBadge } from "@/components/admin-reliability/reliability-status-badge";
import { toast } from "@/components/shared/feedback/toast";
import type { IdempotencyRecord } from "@/features/admin-reliability";

export type IdempotencyClientProps = {
  records: IdempotencyRecord[];
};

export function IdempotencyClient({ records }: IdempotencyClientProps) {
  function handleRefresh() {
    toast.info("Đã làm mới danh sách");
  }

  const completed = records.filter((r) => r.status === "completed").length;
  const inProgress = records.filter((r) => r.status === "in_progress").length;
  const failed = records.filter((r) => r.status === "failed").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Idempotency"
        description={`${records.length} bản ghi — bảng idempotency_records`}
        actions={[
          {
            id: "refresh",
            label: "Làm mới",
            icon: <RefreshCw className="size-4" aria-hidden />,
            variant: "outline",
            onClick: handleRefresh,
          },
        ]}
      />

      <ReliabilityStatCards
        items={[
          {
            label: "Hoàn tất",
            value: completed,
            icon: <CheckCheck className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Đang chạy",
            value: inProgress,
            icon: <Loader className="size-5" aria-hidden />,
            colorClass: "text-info-foreground",
          },
          {
            label: "Thất bại",
            value: failed,
            icon: <TriangleAlert className="size-5" aria-hidden />,
            colorClass: "text-danger-foreground",
          },
        ]}
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Idempotency key</TableHead>
                <TableHead>Phạm vi</TableHead>
                <TableHead>Thao tác</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead>Hết hạn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4">
                    <code className="font-mono text-xs">{row.key}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {row.scope}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="font-mono text-xs text-text-secondary">
                      {row.operation}
                    </code>
                  </TableCell>
                  <TableCell>
                    <ReliabilityStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.created}
                  </TableCell>
                  <TableCell className="text-sm text-text-muted">
                    {row.expires}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
