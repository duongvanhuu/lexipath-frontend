"use client";

import * as React from "react";
import { Eye, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layouts/page-header";
import { PermissionDeniedState } from "@/components/shared/feedback/permission-denied-state";
import { toast } from "@/components/shared/feedback/toast";
import { RoleStatCards } from "@/components/admin-rbac/role-stat-cards";
import { RoleCard } from "@/components/admin-rbac/role-card";
import { RoleDetailView } from "@/components/admin-rbac/role-detail-view";
import { PermissionMatrix } from "@/components/admin-rbac/permission-matrix";
import type { AdminPermission, AdminRole } from "@/features/admin-rbac";

export type RolesClientProps = {
  roles: AdminRole[];
  permissions: AdminPermission[];
};

export function RolesClient({ roles, permissions }: RolesClientProps) {
  const [tab, setTab] = React.useState("roles");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null);

  const selectedRole = selectedRoleId
    ? roles.find((r) => r.id === selectedRoleId) ?? null
    : null;

  const usersWithRoles = roles.reduce((acc, r) => acc + r.users, 0);
  const systemRoles = roles.filter((r) => r.system).length;

  function handleBack() {
    setSelectedRoleId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Only show header when not in detail view */}
      {!selectedRole && (
        <PageHeader
          title="Vai trò & Phân quyền"
          description={`${roles.length} vai trò · ${permissions.length} quyền hệ thống`}
          actions={[
            {
              label: "Tạo vai trò",
              icon: <Plus className="size-4" aria-hidden />,
              onClick: () => toast.info("Mở biểu mẫu tạo vai trò"),
            },
          ]}
        />
      )}

      {selectedRole ? (
        <RoleDetailView
          role={selectedRole}
          allPermissions={permissions}
          onBack={handleBack}
        />
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="roles">Vai trò</TabsTrigger>
            <TabsTrigger value="matrix">Ma trận quyền</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-6 flex flex-col gap-6">
            <RoleStatCards
              totalRoles={roles.length}
              totalPermissions={permissions.length}
              usersWithRoles={usersWithRoles}
              systemRoles={systemRoles}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <RoleCard key={role.id} role={role} onClick={(r) => setSelectedRoleId(r.id)} />
              ))}
            </div>

            {/* Permission denied preview card */}
            <Card className="flex items-center justify-between gap-4 bg-surface-muted/40">
              <CardContent className="flex items-center gap-3 pt-4 pb-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-muted">
                  <Eye className="size-4.5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Trạng thái từ chối quyền</p>
                  <p className="text-xs text-text-secondary">
                    Xem trước những gì người dùng thiếu quyền sẽ thấy.
                  </p>
                </div>
              </CardContent>
              <div className="pr-4 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTab("denied-preview")}
                >
                  Xem trước
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="matrix" className="mt-6">
            <PermissionMatrix permissions={permissions} roles={roles} />
          </TabsContent>

          <TabsContent value="denied-preview" className="mt-6">
            <Card>
              <CardContent className="pt-4">
                <PermissionDeniedState
                  title="Bạn không có quyền truy cập trang này"
                  description="Trang Quản lý thanh toán yêu cầu quyền payment.view. Liên hệ quản trị viên để được cấp quyền phù hợp."
                  action={{
                    label: "Quay lại Vai trò",
                    onClick: () => setTab("roles"),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
