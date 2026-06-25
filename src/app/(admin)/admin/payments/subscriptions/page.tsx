import type { Metadata } from "next";
import { MOCK_SUBSCRIPTIONS, MOCK_ENTITLEMENTS } from "@/features/admin-payment";
import { SubscriptionsClient } from "@/components/admin-payment/subscriptions-client";

export const metadata: Metadata = { title: "Đăng ký" };

export default function AdminPaymentSubscriptionsPage() {
  return (
    <SubscriptionsClient
      subscriptions={MOCK_SUBSCRIPTIONS}
      entitlementsMap={MOCK_ENTITLEMENTS}
    />
  );
}
