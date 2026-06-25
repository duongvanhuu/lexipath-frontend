import type { Metadata } from "next";
import { MOCK_IDEMPOTENCY } from "@/features/admin-reliability";
import { IdempotencyClient } from "@/components/admin-reliability/idempotency-client";

export const metadata: Metadata = { title: "Idempotency" };

export default function AdminIdempotencyPage() {
  return <IdempotencyClient records={MOCK_IDEMPOTENCY} />;
}
