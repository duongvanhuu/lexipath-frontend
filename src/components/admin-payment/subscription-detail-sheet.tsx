"use client";

import * as React from "react";
import { Check, Gift, XCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import { cn } from "@/lib/utils/cn";
import type { Entitlement, Subscription } from "@/features/admin-payment";

function KVRow({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span
        className={cn(
          "break-all text-right text-sm font-medium",
          mono && "font-mono text-xs"
        )}
      >
        {children}
      </span>
    </div>
  );
}

const TIER_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  pro: { label: "Plus", variant: "default" },
  team: { label: "Team", variant: "secondary" },
  free: { label: "Miễn phí", variant: "outline" },
};

export type SubscriptionDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  entitlements: Entitlement[];
};

export function SubscriptionDetailSheet({
  open,
  onClose,
  subscription,
  entitlements,
}: SubscriptionDetailSheetProps) {
  if (!subscription) return null;

  const tier = TIER_CONFIG[subscription.tier] ?? {
    label: subscription.tier,
    variant: "secondary" as const,
  };
  const canCancel =
    subscription.status === "active" || subscription.status === "trialing";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[460px] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>{subscription.user}</SheetTitle>
          <SheetDescription>
            {subscription.email} · Quyền lợi đăng ký
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 py-3">
            <Badge variant={tier.variant}>{tier.label}</Badge>
            <PaymentStatusBadge status={subscription.status} />
          </div>

          <Separator className="mb-3" />

          <KVRow label="Gói">{subscription.plan}</KVRow>
          <KVRow label="Giá">{subscription.amount}</KVRow>
          <KVRow label="Phương thức">{subscription.method}</KVRow>
          <KVRow label="Bắt đầu">{subscription.started}</KVRow>
          <KVRow label="Gia hạn">{subscription.renews}</KVRow>
          <KVRow label="Mã đăng ký" mono>
            {subscription.id}
          </KVRow>

          {entitlements.length > 0 && (
            <>
              <div className="mt-5 mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Quyền lợi đang áp dụng
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {entitlements.map((ent, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-success-soft text-success-foreground">
                      <Check className="size-3" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {ent.feature}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {ent.source === "grant" ? "Cấp thủ công" : "Từ gói"} · Hết hạn{" "}
                        {ent.expires}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="text-danger-foreground border-danger/30 hover:bg-danger-soft"
            >
              <XCircle className="mr-1.5 size-3.5" aria-hidden />
              Hủy gia hạn
            </Button>
          )}
          <Button size="sm">
            <Gift className="mr-1.5 size-3.5" aria-hidden />
            Cấp quyền lợi
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
