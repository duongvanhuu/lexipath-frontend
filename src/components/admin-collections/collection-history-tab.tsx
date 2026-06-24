"use client";

import { Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { VersionHistoryPanel } from "@/components/admin/version-history-panel";
import type { AdminCollectionVersion, AdminCollectionStatus } from "@/features/admin-collections/types";
import { cn } from "@/lib/utils/cn";

function mapStatus(s: AdminCollectionStatus): ContentStatus {
  if (s === "review") return "in_review";
  if (s === "archived") return "archived";
  if (s === "published") return "published";
  return "draft";
}

const WORKFLOW_STEPS: Array<{ id: AdminCollectionStatus; label: string }> = [
  { id: "draft", label: "Bản nháp" },
  { id: "review", label: "Chờ duyệt" },
  { id: "published", label: "Đã xuất bản" },
];

export interface CollectionHistoryTabProps {
  collectionId: string;
  status: AdminCollectionStatus;
  versions: AdminCollectionVersion[];
  onSubmitReview: () => void;
  onRestoreVersion?: (versionId: string) => void;
}

export function CollectionHistoryTab({
  status,
  versions,
  onSubmitReview,
  onRestoreVersion,
}: CollectionHistoryTabProps) {
  const statusIdx = WORKFLOW_STEPS.findIndex((s) => s.id === status);

  const historyItems = versions.map((v) => ({
    id: v.id,
    title: `v${v.version}`,
    description: v.note,
    createdAtLabel: v.date,
    actorName: v.author,
    ...(v.isCurrent !== undefined ? { isCurrent: v.isCurrent } : {}),
  }));

  return (
    <div className="grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-[1fr_280px] items-start">
      <Card>
        <CardContent className="pt-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Lịch sử phiên bản
          </p>
          <VersionHistoryPanel
            items={historyItems}
            {...(onRestoreVersion ? { onRestore: onRestoreVersion } : {})}
          />
          {versions.length === 0 && (
            <p className="py-5 text-center text-sm text-text-muted">
              Chưa có lịch sử.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Quy trình duyệt
          </p>

          <div className="space-y-3">
            {WORKFLOW_STEPS.map((step, i) => {
              const done = statusIdx > i;
              const active = step.id === status;
              return (
                <div key={step.id} className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active
                        ? "border-primary bg-primary"
                        : done
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background",
                    )}
                    aria-hidden
                  >
                    {done ? (
                      <ContentStatusBadge
                        status="published"
                        className="hidden"
                      />
                    ) : active ? (
                      <span className="size-2 rounded-full bg-white" />
                    ) : (
                      <span className="text-[11px] font-bold text-text-muted">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      active || done
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary",
                    )}
                  >
                    {step.label}
                  </span>
                  {active && (
                    <Badge className="ml-auto bg-primary/10 text-primary text-xs">
                      Hiện tại
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {status === "draft" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={onSubmitReview}
            >
              <Send className="mr-1.5 size-3.5" />
              Gửi để duyệt
            </Button>
          )}

          {status === "review" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-soft px-3 py-2.5 text-sm text-text-secondary">
              <Clock className="size-4 shrink-0 text-warning" aria-hidden />
              Đang chờ phê duyệt…
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
