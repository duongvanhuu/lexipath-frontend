import type { Metadata } from "next";
import { MOCK_OUTBOX } from "@/features/admin-reliability";
import { OutboxClient } from "@/components/admin-reliability/outbox-client";

export const metadata: Metadata = { title: "Outbox events" };

export default function AdminOutboxPage() {
  return <OutboxClient events={MOCK_OUTBOX} />;
}
