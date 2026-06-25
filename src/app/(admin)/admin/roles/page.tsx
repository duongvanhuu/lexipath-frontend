import type { Metadata } from "next";
import { MOCK_ROLES, MOCK_PERMISSIONS } from "@/features/admin-rbac";
import { RolesClient } from "@/components/admin-rbac/roles-client";

export const metadata: Metadata = { title: "Vai trò & Phân quyền" };

export default function AdminRolesPage() {
  return <RolesClient roles={MOCK_ROLES} permissions={MOCK_PERMISSIONS} />;
}
