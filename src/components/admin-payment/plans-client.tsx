"use client";

import * as React from "react";
import { Plus, Package, TrendingUp, Users, FileText } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { PaymentStatCards } from "@/components/admin-payment/payment-stat-cards";
import { PlanCard } from "@/components/admin-payment/plan-card";
import { toast } from "@/components/shared/feedback/toast";
import type { SubscriptionPlan } from "@/features/admin-payment";

export type PlansClientProps = {
  plans: SubscriptionPlan[];
};

export function PlansClient({ plans }: PlansClientProps) {
  const activePlans = plans.filter((p) => p.status === "active").length;
  const draftPlans = plans.filter((p) => p.status === "draft").length;
  const paidSubscribers = plans
    .filter((p) => p.code !== "free")
    .reduce((sum, p) => sum + p.subscribers, 0);

  function handleEdit(plan: SubscriptionPlan) {
    toast.info(`Chỉnh sửa gói: ${plan.name}`);
  }

  function handleCreate() {
    toast.info("Tạo gói dịch vụ mới");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gói dịch vụ"
        description="Quản lý các gói đăng ký và quyền lợi người dùng"
        actions={[
          {
            id: "create-plan",
            label: "Tạo gói",
            icon: <Plus className="size-4" aria-hidden />,
            onClick: handleCreate,
          },
        ]}
      />

      <PaymentStatCards
        items={[
          {
            label: "Gói đang bán",
            value: activePlans,
            icon: <Package className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Tổng người đăng ký",
            value: "26.8K",
            icon: <Users className="size-5" aria-hidden />,
            colorClass: "text-success-foreground",
          },
          {
            label: "Người trả phí",
            value: paidSubscribers.toLocaleString("vi-VN"),
            icon: <TrendingUp className="size-5" aria-hidden />,
            colorClass: "text-warning",
          },
          {
            label: "Gói nháp",
            value: draftPlans,
            icon: <FileText className="size-5" aria-hidden />,
            colorClass: "text-text-muted",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}
