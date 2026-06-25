"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layouts/page-header";
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import { SubscriptionDetailSheet } from "@/components/admin-payment/subscription-detail-sheet";
import type { Entitlement, Subscription } from "@/features/admin-payment";

const TIER_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  pro: { label: "Plus", variant: "default" },
  team: { label: "Team", variant: "secondary" },
  free: { label: "Miễn phí", variant: "outline" },
};

export type SubscriptionsClientProps = {
  subscriptions: Subscription[];
  entitlementsMap: Record<string, Entitlement[]>;
};

export function SubscriptionsClient({
  subscriptions,
  entitlementsMap,
}: SubscriptionsClientProps) {
  const [selected, setSelected] = React.useState<Subscription | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Đăng ký"
        description="Quản lý đăng ký người dùng và quyền lợi"
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Người dùng</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Gia hạn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((row) => {
                const tier = TIER_CONFIG[row.tier] ?? {
                  label: row.tier,
                  variant: "secondary" as const,
                };
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(row)}
                  >
                    <TableCell className="pl-4">
                      <div className="font-medium text-text-primary">{row.user}</div>
                      <div className="text-xs text-text-muted">{row.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={tier.variant} className="text-[11px]">
                          {tier.label}
                        </Badge>
                        <span className="text-sm text-text-secondary">{row.plan}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium text-text-primary">{row.amount}</div>
                      <div className="text-xs text-text-muted">{row.method}</div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">
                      {row.renews}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <SubscriptionDetailSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        subscription={selected}
        entitlements={selected ? (entitlementsMap[selected.id] ?? []) : []}
      />
    </div>
  );
}
