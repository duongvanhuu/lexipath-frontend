"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/navigation/breadcrumb";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import { SourceInfoPanel } from "@/components/admin/source-info-panel";
import { cn } from "@/lib/utils/cn";
import type {
  ReviewComment,
  ReviewTaskDetail,
  ReviewTaskPriority,
  ReviewTaskStatus,
  ValidationCheck,
} from "@/features/admin-review";

import { ReviewDiffViewer } from "./review-diff-viewer";
import { ReviewCommentThread } from "./review-comment-thread";
import { ReviewValidationSummary } from "./review-validation-summary";
import {
  ApproveDialog,
  RequestChangesDialog,
  RejectDialog,
  type RequestChangesData,
  type RejectData,
} from "./review-action-dialog";

const LANG_FLAG: Record<string, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

const PRIORITY_LABEL: Record<ReviewTaskPriority, string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

const PRIORITY_CLASS: Record<ReviewTaskPriority, string> = {
  high: "bg-danger-soft text-danger-foreground",
  medium: "bg-warning-soft text-warning-foreground",
  low: "bg-surface-muted text-text-secondary",
};

const STATUS_LABEL: Record<ReviewTaskStatus, string> = {
  pending: "Chờ duyệt",
  changes_requested: "Cần sửa",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  published: "Đã xuất bản",
};

const STATUS_CLASS: Record<ReviewTaskStatus, string> = {
  pending: "bg-warning-soft text-warning-foreground",
  changes_requested: "bg-primary-soft text-primary-soft-foreground",
  approved: "bg-success-soft text-success-foreground",
  rejected: "bg-danger-soft text-danger-foreground",
  published: "bg-success-soft text-success-foreground",
};

function buildValidationChecks(
  detail: ReviewTaskDetail,
): ValidationCheck[] {
  const isCjk = detail.item.lang !== "en";
  const isAiContent = isCjk;
  const currentStatus = detail.status;
  return [
    { label: "Có canonical form", ok: true, level: "error" },
    { label: "Có ít nhất một nghĩa", ok: true, level: "error" },
    { label: "Có bản dịch tiếng Việt", ok: true, level: "error" },
    { label: "Nguồn / license hợp lệ", ok: true, level: "error" },
    {
      label: "Nội dung AI đã được duyệt",
      ok: !isAiContent || currentStatus === "approved" || currentStatus === "published",
      level: "error",
    },
    {
      label: "Có audio phát âm",
      ok: detail.item.lang === "en",
      level: "warning",
    },
    { label: "Có ví dụ câu", ok: true, level: "warning" },
  ];
}

function buildSourceInfo(lang: string) {
  const sources: Record<string, { origin: string; license: string }> = {
    en: { origin: "Oxford Advanced Learner's (OAL)", license: "Commercial" },
    ja: { origin: "Jisho.org", license: "Free" },
    zh: { origin: "Pleco Chinese Dictionary", license: "Commercial" },
  };
  return sources[lang] ?? { origin: "Nhập thủ công", license: "Internal" };
}

type ActiveDialog = "approve" | "changes" | "reject" | null;

interface ReviewDetailClientProps {
  detail: ReviewTaskDetail;
}

export function ReviewDetailClient({ detail }: ReviewDetailClientProps) {
  const [status, setStatus] = React.useState<ReviewTaskStatus>(detail.status);
  const [comments, setComments] = React.useState<ReviewComment[]>(
    detail.comments,
  );
  const [activeDialog, setActiveDialog] = React.useState<ActiveDialog>(null);

  const isCjk = detail.item.lang !== "en";
  const isAiContent = isCjk;
  const checks = buildValidationChecks({ ...detail, status });
  const canPublish = checks
    .filter((c) => c.level === "error")
    .every((c) => c.ok);
  const sourceInfo = buildSourceInfo(detail.item.lang);

  const isActionable =
    status === "pending" || status === "changes_requested";

  function addComment(
    text: string,
    role: ReviewComment["role"] = "reviewer",
    meta?: { field?: string; severity?: ReviewComment["severity"] },
  ) {
    const newComment: ReviewComment = {
      id: `c-${Date.now()}`,
      author: "Thảo Nguyễn",
      role,
      text,
      timestamp: "Vừa xong",
      resolved: false,
      ...(meta?.field !== undefined ? { field: meta.field } : {}),
      ...(meta?.severity !== undefined ? { severity: meta.severity } : {}),
    };
    setComments((prev) => [...prev, newComment]);
  }

  function toggleResolved(id: string) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)),
    );
  }

  function handleRequestChanges(data: RequestChangesData) {
    setStatus("changes_requested");
    addComment(data.comment, "reviewer", {
      field: data.section,
      severity: data.severity,
    });
    setActiveDialog(null);
  }

  function handleReject(data: RejectData) {
    setStatus("rejected");
    addComment(`Từ chối — ${data.reason}: ${data.comment}`, "reviewer");
    setActiveDialog(null);
  }

  function handleApprove(andPublish: boolean) {
    setStatus(andPublish ? "published" : "approved");
    setActiveDialog(null);
  }

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-1.5 mb-2 gap-1.5"
        >
          <Link href={"/admin/review" as Route}>
            <ArrowLeft className="size-3.5" aria-hidden />
            Bảng duyệt
          </Link>
        </Button>
        <Breadcrumb
          items={[
            { label: "Duyệt nội dung", href: "/admin/review" as Route },
            { label: detail.item.title },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_308px]">
        {/* ── Main column ── */}
        <div className="space-y-4">
          {/* Item header card */}
          <Card>
            <CardContent className="pt-5 pb-5 px-5">
              {/* Title row */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <h1
                      className={cn(
                        "text-2xl font-bold leading-tight text-text-primary",
                        isCjk && "tracking-wide",
                      )}
                    >
                      {detail.item.title}
                    </h1>
                    <span className="text-lg" aria-label={`Ngôn ngữ: ${detail.item.lang}`}>
                      {LANG_FLAG[detail.item.lang]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {detail.item.type}
                    </Badge>
                    <ContentStatusBadge
                      status={
                        detail.item.contentStatus === "draft"
                          ? "draft"
                          : "in_review"
                      }
                    />
                    <Badge
                      className={cn(
                        "text-xs",
                        PRIORITY_CLASS[detail.priority],
                      )}
                    >
                      {PRIORITY_LABEL[detail.priority]}
                    </Badge>
                    {isAiContent && (
                      <Badge className="bg-primary-soft text-primary-soft-foreground text-xs">
                        AI Generated
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className={cn("shrink-0 text-xs", STATUS_CLASS[status])}>
                  {STATUS_LABEL[status]}
                </Badge>
              </div>

              {/* AI warning */}
              {isAiContent && (
                <div
                  className={cn(
                    "mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5",
                    "border-primary bg-primary-soft",
                  )}
                >
                  <Sparkles
                    className="mt-0.5 size-3.5 shrink-0 text-primary-soft-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-semibold text-primary-soft-foreground">
                      Nội dung AI — yêu cầu kiểm tra kỹ
                    </p>
                    <p className="text-xs text-primary-soft-foreground/80">
                      Checklist: nghĩa chính xác · ví dụ tự nhiên · nguồn rõ ràng · không bịa đặt thông tin.
                    </p>
                  </div>
                </div>
              )}

              {/* Diff viewer */}
              {detail.diff.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Thay đổi so sánh (phiên bản trước → hiện tại)
                  </p>
                  <ReviewDiffViewer rows={detail.diff} />
                </div>
              )}

              {/* Actions */}
              {isActionable ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActiveDialog("approve")}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveDialog("changes")}
                  >
                    Yêu cầu sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveDialog("reject")}
                  >
                    Từ chối
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/admin/vocab/new?lang=${detail.item.lang}` as Route}
                      target="_blank"
                    >
                      <ExternalLink className="size-3.5" aria-hidden />
                      Mở editor
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={cn("text-xs", STATUS_CLASS[status])}>
                    {STATUS_LABEL[status]}
                  </Badge>
                  <span className="text-sm text-text-muted">
                    {status === "approved" && "Đã phê duyệt — sẵn sàng xuất bản."}
                    {status === "published" && "Đã xuất bản cho học viên."}
                    {status === "rejected" && "Đã từ chối."}
                  </span>
                  {status === "approved" && (
                    <Button
                      size="sm"
                      disabled={!canPublish}
                      onClick={() => handleApprove(true)}
                    >
                      <Globe className="size-3.5" aria-hidden />
                      Xuất bản ngay
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comment thread */}
          <Card>
            <CardContent className="px-5 py-5">
              <ReviewCommentThread
                comments={comments}
                currentUserName="Thảo Nguyễn"
                onAddComment={(text) => addComment(text)}
                onToggleResolved={toggleResolved}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <ReviewValidationSummary checks={checks} />

          {/* Source & license */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Nguồn &amp; License</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <SourceInfoPanel
                info={{
                  origin: sourceInfo.origin,
                  license: sourceInfo.license,
                  notes: "Có trích dẫn",
                }}
              />
            </CardContent>
          </Card>

          {/* Task metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Thông tin duyệt</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <dl className="space-y-0 divide-y divide-border">
                {[
                  { label: "Người gửi", value: detail.authorName },
                  { label: "Người duyệt", value: detail.assigneeName },
                  {
                    label: "Mức ưu tiên",
                    value: PRIORITY_LABEL[detail.priority],
                  },
                  { label: "Ngày tạo", value: detail.created },
                  { label: "Cập nhật", value: detail.updated },
                  { label: "Số thay đổi", value: detail.changeCount },
                  { label: "Bình luận", value: comments.length },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 py-2"
                  >
                    <dt className="text-xs text-text-muted">{row.label}</dt>
                    <dd className="text-xs font-medium text-text-primary">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ApproveDialog
        open={activeDialog === "approve"}
        canPublish={canPublish}
        onClose={() => setActiveDialog(null)}
        onApprove={handleApprove}
      />
      <RequestChangesDialog
        open={activeDialog === "changes"}
        onClose={() => setActiveDialog(null)}
        onSubmit={handleRequestChanges}
      />
      <RejectDialog
        open={activeDialog === "reject"}
        onClose={() => setActiveDialog(null)}
        onSubmit={handleReject}
      />
    </>
  );
}
