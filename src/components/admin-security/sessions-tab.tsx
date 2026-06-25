"use client";

import * as React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/feedback/confirm-dialog";
import { SecurityStatCards } from "@/components/admin-security/security-stat-cards";
import { SecurityRiskBadge } from "@/components/admin-security/security-risk-badge";
import {
  RiskDetailSheet,
  type RiskDetailData,
} from "@/components/admin-security/risk-detail-sheet";
import { toast } from "@/components/shared/feedback/toast";
import type { SessionRecord } from "@/features/admin-security";

const DEVICE_ICON: Record<string, React.ReactNode> = {
  desktop: <Monitor className="size-4" aria-hidden />,
  mobile: <Smartphone className="size-4" aria-hidden />,
  tablet: <Tablet className="size-4" aria-hidden />,
};

export function SessionsTab({ sessions }: { sessions: SessionRecord[] }) {
  const [sel, setSel] = React.useState<SessionRecord | null>(null);
  const [revokeTarget, setRevokeTarget] = React.useState<SessionRecord | null>(null);

  const activeSessions = sessions.length;
  const highRisk = sessions.filter((s) => s.risk === "high").length;
  const mobile = sessions.filter((s) => s.type === "mobile").length;

  function handleRevoke(row: SessionRecord) {
    toast.success(`Đã thu hồi phiên của ${row.user}`);
    setRevokeTarget(null);
    setSel(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <SecurityStatCards
        activeSessions={activeSessions}
        highRiskSessions={highRisk}
        mobileSessions={mobile}
        criticalEvents={0}
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Người dùng</TableHead>
                <TableHead>Thiết bị</TableHead>
                <TableHead>Vị trí / IP</TableHead>
                <TableHead>Rủi ro</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead className="pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => setSel(row)}
                >
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{row.user}</span>
                      {row.current ? (
                        <Badge variant="secondary" className="text-[11px]">
                          Hiện tại
                        </Badge>
                      ) : null}
                    </div>
                    <div className="text-xs text-text-muted">{row.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      {DEVICE_ICON[row.type]}
                      <span className="text-sm">{row.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{row.location}</div>
                    <code className="text-xs text-text-muted">{row.ip}</code>
                  </TableCell>
                  <TableCell>
                    <SecurityRiskBadge risk={row.risk} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.lastActive}
                  </TableCell>
                  <TableCell className="pr-4">
                    {!row.current ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-foreground hover:bg-danger-soft"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRevokeTarget(row);
                        }}
                      >
                        Thu hồi
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <RiskDetailSheet
        open={!!sel}
        onClose={() => setSel(null)}
        data={
          sel
            ? ({
                user: sel.user,
                email: sel.email,
                risk: sel.risk,
                device: sel.device,
                ip: sel.ip,
                location: sel.location,
                started: sel.started,
                lastActive: sel.lastActive,
                current: sel.current,
              } satisfies RiskDetailData)
            : null
        }
        {...(sel && !sel.current ? { onRevoke: () => setRevokeTarget(sel) } : {})}
      />

      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(v) => !v && setRevokeTarget(null)}
        title="Thu hồi phiên đăng nhập?"
        description={
          revokeTarget
            ? `Phiên của ${revokeTarget.user} trên ${revokeTarget.device} sẽ bị đăng xuất ngay lập tức.`
            : undefined
        }
        confirmLabel="Thu hồi"
        tone="danger"
        onConfirm={() => revokeTarget && handleRevoke(revokeTarget)}
      />
    </div>
  );
}
