import type { Metadata } from "next";
import { MOCK_WEBHOOKS, WEBHOOK_PAYLOAD } from "@/features/admin-payment";
import { WebhooksClient } from "@/components/admin-payment/webhooks-client";

export const metadata: Metadata = { title: "Webhook" };

export default function AdminPaymentWebhooksPage() {
  return <WebhooksClient webhooks={MOCK_WEBHOOKS} payload={WEBHOOK_PAYLOAD} />;
}
