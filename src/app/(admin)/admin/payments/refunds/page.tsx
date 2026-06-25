import type { Metadata } from "next";
import { MOCK_REFUNDS } from "@/features/admin-payment";
import { RefundsClient } from "@/components/admin-payment/refunds-client";

export const metadata: Metadata = { title: "Hoàn tiền" };

export default function AdminPaymentRefundsPage() {
  return <RefundsClient refunds={MOCK_REFUNDS} />;
}
