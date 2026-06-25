import type { Metadata } from "next";
import {
  MOCK_ACCOUNT_LOCKS,
  MOCK_DEVICES,
  MOCK_SEC_EVENTS,
  MOCK_SESSIONS,
} from "@/features/admin-security";
import { SecurityClient } from "@/components/admin-security/security-client";

export const metadata: Metadata = { title: "Bảo mật" };

export default function AdminSecurityPage() {
  return (
    <SecurityClient
      sessions={MOCK_SESSIONS}
      devices={MOCK_DEVICES}
      events={MOCK_SEC_EVENTS}
      locks={MOCK_ACCOUNT_LOCKS}
    />
  );
}
