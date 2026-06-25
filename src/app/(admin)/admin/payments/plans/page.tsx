import type { Metadata } from "next";
import { MOCK_PLANS } from "@/features/admin-payment";
import { PlansClient } from "@/components/admin-payment/plans-client";

export const metadata: Metadata = { title: "Gói dịch vụ" };

export default function AdminPaymentPlansPage() {
  return <PlansClient plans={MOCK_PLANS} />;
}
