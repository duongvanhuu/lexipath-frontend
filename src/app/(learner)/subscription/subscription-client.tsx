"use client";

import * as React from "react";
import {
  ArrowUpCircle,
  BadgeCheck,
  Calendar,
  CreditCard,
  Info,
  Package,
  Receipt,
  RefreshCw,
} from "lucide-react";

import { PageHeader } from "@/components/layouts/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EntitlementBadge } from "@/components/shared/badges/entitlement-badge";
import { PaymentStatusBadge } from "@/components/shared/badges/payment-status-badge";
import { PlanComparisonCard } from "@/components/payment/plan-comparison-card";
import { SubscriptionFeatureRow } from "@/components/payment/subscription-feature-row";
import { SubscriptionPaymentRow } from "@/components/payment/subscription-payment-row";
import { cn } from "@/lib/utils/cn";
import {
  MOCK_CURRENT_SUBSCRIPTION,
  MOCK_FEATURE_USAGE_FREE,
  MOCK_FEATURE_USAGE_PRO,
  MOCK_PAYMENT_HISTORY,
  MOCK_SUBSCRIPTION_PLANS,
} from "@/features/subscription/mock-data";

type BillingCycle = "monthly" | "yearly";

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
      {title}
    </p>
  );
}

function MetaItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-secondary">
      <Icon className="size-3 shrink-0" aria-hidden />
      {text}
    </span>
  );
}

export function SubscriptionClient() {
  const [billing, setBilling] = React.useState<BillingCycle>("monthly");
  const { plan: currentPlan, startDate, renewalDate, billingLabel } =
    MOCK_CURRENT_SUBSCRIPTION;
  const isPro = currentPlan !== "free";

  const featureUsage = isPro ? MOCK_FEATURE_USAGE_PRO : MOCK_FEATURE_USAGE_FREE;

  const fmtVN = (n: number) =>
    n === 0 ? "Miễn phí" : n.toLocaleString("vi-VN") + "₫";

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <PageHeader
        title="Gói đăng ký"
        description="Quản lý gói, theo dõi hạn mức và xem lịch sử thanh toán."
      />

      {/* ── Current Plan ── */}
      <section>
        <SectionHeader title="Gói hiện tại" />
        <Card className="p-[22px]">
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={cn(
                "flex size-[50px] shrink-0 items-center justify-center rounded-[14px]",
                isPro
                  ? "bg-success-soft text-success-foreground"
                  : "bg-surface-muted text-text-muted"
              )}
            >
              {isPro ? (
                <BadgeCheck className="size-6" aria-hidden />
              ) : (
                <Package className="size-6" aria-hidden />
              )}
            </span>

            <div className="min-w-[200px] flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                <span className="text-lg font-extrabold text-text-primary">
                  {isPro ? "LexiPath Pro" : "LexiPath Miễn phí"}
                </span>
                <EntitlementBadge tier={isPro ? "pro" : "free"} />
                <PaymentStatusBadge status="active" />
              </div>
              {isPro ? (
                <div className="flex flex-wrap gap-4">
                  {startDate && (
                    <MetaItem icon={Calendar} text={`Bắt đầu ${startDate}`} />
                  )}
                  {renewalDate && (
                    <MetaItem icon={RefreshCw} text={`Gia hạn ${renewalDate}`} />
                  )}
                  {billingLabel && (
                    <MetaItem icon={CreditCard} text={billingLabel} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">
                  Nâng cấp lên Pro để mở khóa toàn bộ tính năng.
                </p>
              )}
            </div>

            {!isPro && (
              <Button className="shrink-0">
                <ArrowUpCircle className="size-4" aria-hidden />
                Nâng cấp lên Pro
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* ── Feature Usage ── */}
      <section>
        <SectionHeader title="Hạn mức và tính năng" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {featureUsage.map((f) => (
            <SubscriptionFeatureRow key={f.id} feature={f} />
          ))}
        </div>
        {!isPro && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3.5 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-primary-soft-foreground">
                Nâng cấp để mở khóa tất cả tính năng
              </p>
              <p className="text-xs text-text-secondary">
                Bộ sưu tập không giới hạn · Từ điển đầy đủ · Thống kê nâng cao
              </p>
            </div>
            <Button size="sm" className="shrink-0">
              Xem gói Pro
            </Button>
          </div>
        )}
      </section>

      {/* ── Plan Comparison ── */}
      <section>
        <SectionHeader title="So sánh gói" />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm font-medium",
              billing === "monthly" ? "text-text-primary" : "text-text-muted"
            )}
          >
            Hàng tháng
          </Label>
          <Switch
            id="billing-toggle"
            checked={billing === "yearly"}
            onCheckedChange={(v) => setBilling(v ? "yearly" : "monthly")}
            aria-label="Chuyển chu kỳ thanh toán"
          />
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm font-medium",
              billing === "yearly" ? "text-text-primary" : "text-text-muted"
            )}
          >
            Hàng năm
          </Label>
          {billing === "yearly" && (
            <Badge className="bg-success-soft text-success-foreground hover:bg-success-soft">
              Tiết kiệm 26%
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-[640px]">
          {MOCK_SUBSCRIPTION_PLANS.map((p) => {
            const price = billing === "yearly" ? p.yearly : p.monthly;
            const isCurrent = p.id === currentPlan;
            return (
              <PlanComparisonCard
                key={p.id}
                plan={{
                  id: p.id,
                  name: p.name,
                  priceLabel: fmtVN(price),
                  ...(price > 0
                    ? { billingCycleLabel: billing === "yearly" ? "/năm" : "/tháng" }
                    : {}),
                  description: p.description,
                  features: [],
                  featureList: p.featureList,
                  ...(p.highlighted ? { highlighted: true } : {}),
                  ctaLabel:
                    isCurrent
                      ? "Gói hiện tại"
                      : p.id === "free"
                        ? "Hạ xuống miễn phí"
                        : "Nâng cấp Pro",
                }}
                isCurrentPlan={isCurrent}
                {...(!isCurrent && p.id !== "free"
                  ? {
                      onSelect: (_id: string) => {
                        /* TODO: wire to checkout flow */
                      },
                    }
                  : {})}
              />
            );
          })}
        </div>
      </section>

      {/* ── Payment History ── */}
      <section>
        <SectionHeader title="Lịch sử thanh toán" />
        <Card className="overflow-hidden p-0">
          {MOCK_PAYMENT_HISTORY.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-8 text-center">
              <Receipt className="size-7 text-text-muted opacity-45" aria-hidden />
              <p className="text-sm text-text-muted">Chưa có giao dịch nào</p>
            </div>
          ) : (
            MOCK_PAYMENT_HISTORY.map((t, i) => (
              <SubscriptionPaymentRow
                key={t.id}
                payment={t}
                isLast={i === MOCK_PAYMENT_HISTORY.length - 1}
              />
            ))
          )}
        </Card>
        <p className="mt-2 flex items-center gap-1.5 pl-0.5 text-xs text-text-muted">
          <Info className="size-3 shrink-0" aria-hidden />
          Biên nhận từ nhà cung cấp (VNPay, Momo) được gửi tới email đăng ký sau khi thanh toán thành công.
        </p>
      </section>
    </div>
  );
}
