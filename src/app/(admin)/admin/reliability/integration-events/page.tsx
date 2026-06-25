import type { Metadata } from "next";
import { MOCK_INTEGRATION_EVENTS } from "@/features/admin-reliability";
import { IntegrationEventsClient } from "@/components/admin-reliability/integration-events-client";

export const metadata: Metadata = { title: "Integration events" };

export default function AdminIntegrationEventsPage() {
  return <IntegrationEventsClient events={MOCK_INTEGRATION_EVENTS} />;
}
