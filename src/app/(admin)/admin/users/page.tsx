import type { Metadata } from "next";
import { MOCK_RBAC_USERS, MOCK_ROLES } from "@/features/admin-rbac";
import { UsersClient } from "@/components/admin-rbac/users-client";

export const metadata: Metadata = { title: "Người dùng quản trị" };

export default function AdminUsersPage() {
  return <UsersClient users={MOCK_RBAC_USERS} roles={MOCK_ROLES} />;
}
