"use client";

import * as React from "react";
import { CheckCheck, Copy, GitMerge, Info } from "lucide-react";
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
import type { IntegrationEvent } from "@/features/admin-reliability";

export type IntegrationEventsClientProps = {
  events: IntegrationEvent[];
};

export function IntegrationEventsClient({ events }: IntegrationEventsClientProps) {
  const processed = events.filter((e) => e.status === "processed").length;
  const duplicate = events.filter((e) => e.status === "duplicate").length;
  const sources = new Set(events.map((e) => e.source)).size;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Integration events"
        description={`${events.length} sự kiện đã xử lý — bảng processed_integration_events`}
      />

      <ReliabilityStatCards
        items={[
          {
            label: "Đã xử lý",
            value: processed,
            icon: <CheckCheck className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Trùng lặp (bỏ qua)",
            value: duplicate,
            icon: <Copy className="size-5" aria-hidden />,
            colorClass: "text-warning",
          },
          {
            label: "Nguồn",
            value: sources,
            icon: <GitMerge className="size-5" aria-hidden />,
            colorClass: "text-info-foreground",
          },
        ]}
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Event ID</TableHead>
                <TableHead>Nguồn</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Consumer</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Xử lý lúc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4">
                    <code className="font-mono text-xs">{row.eventId}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {row.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="font-mono text-xs text-text-secondary">
                      {row.event}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.consumer}
                  </TableCell>
                  <TableCell>
                    <ReliabilityStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.processedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-text-muted">
        <Info className="size-3.5 shrink-0" aria-hidden />
        Bảng này dùng để khử trùng lặp (deduplication) — mỗi event ID chỉ được xử lý một lần.
      </p>
    </div>
  );
}
