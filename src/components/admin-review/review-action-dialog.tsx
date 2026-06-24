"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  Globe,
  MessageSquare,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  "Cơ bản",
  "Scripts",
  "Phát âm",
  "Audio",
  "Nghĩa",
  "Bản dịch",
  "Ví dụ",
  "Nguồn",
  "Khác",
];

const REJECT_REASONS = [
  "Sai nghĩa / dịch không chính xác",
  "Nguồn / license không hợp lệ",
  "Trùng lặp với mục từ đã có",
  "Không đạt tiêu chuẩn nội dung",
  "Nội dung AI chưa được kiểm chứng",
];

/* ── Request Changes dialog ─────────────────────────────────────────────── */

export interface RequestChangesData {
  section: string;
  severity: "blocker" | "major" | "minor";
  comment: string;
}

interface RequestChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RequestChangesData) => void;
}

export function RequestChangesDialog({
  open,
  onClose,
  onSubmit,
}: RequestChangesDialogProps) {
  const [section, setSection] = React.useState("");
  const [severity, setSeverity] = React.useState<RequestChangesData["severity"] | "">("");
  const [comment, setComment] = React.useState("");

  const isValid = !!section && !!severity && comment.trim().length > 0;

  function handleSubmit() {
    if (!isValid || !severity) return;
    onSubmit({ section, severity, comment: comment.trim() });
    setSection("");
    setSeverity("");
    setComment("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary-soft">
              <MessageSquare className="size-4 text-primary-soft-foreground" aria-hidden />
            </span>
            <DialogTitle>Yêu cầu chỉnh sửa</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rc-section">
                Phần / trường ảnh hưởng <span className="text-danger-foreground">*</span>
              </Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger id="rc-section" aria-required>
                  <SelectValue placeholder="— Chọn phần —" />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rc-severity">
                Mức độ <span className="text-danger-foreground">*</span>
              </Label>
              <Select
                value={severity}
                onValueChange={(v) =>
                  setSeverity(v as RequestChangesData["severity"])
                }
              >
                <SelectTrigger id="rc-severity" aria-required>
                  <SelectValue placeholder="— Chọn mức —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocker">Chặn xuất bản</SelectItem>
                  <SelectItem value="major">Quan trọng</SelectItem>
                  <SelectItem value="minor">Nhỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rc-comment">
              Bình luận chi tiết <span className="text-danger-foreground">*</span>
            </Label>
            <Textarea
              id="rc-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Mô tả thay đổi cần thực hiện…"
              className="min-h-[88px] resize-none"
              aria-required
            />
          </div>

          {!isValid && (comment || section || severity) && (
            <p className="flex items-center gap-1.5 text-xs text-danger-foreground">
              <AlertTriangle className="size-3 shrink-0" aria-hidden />
              Cần chọn phần, mức độ và nhập bình luận.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button disabled={!isValid} onClick={handleSubmit}>
            Gửi yêu cầu sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Reject dialog ──────────────────────────────────────────────────────── */

export interface RejectData {
  reason: string;
  comment: string;
}

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RejectData) => void;
}

export function RejectDialog({ open, onClose, onSubmit }: RejectDialogProps) {
  const [reason, setReason] = React.useState("");
  const [comment, setComment] = React.useState("");

  const isValid = !!reason && comment.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ reason, comment: comment.trim() });
    setReason("");
    setComment("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-danger-soft">
              <X className="size-4 text-danger-foreground" aria-hidden />
            </span>
            <DialogTitle>Từ chối mục từ</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Nhập lý do từ chối để tác giả có thể chỉnh sửa và gửi lại.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="rej-reason">
              Lý do từ chối <span className="text-danger-foreground">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="rej-reason" aria-required>
                <SelectValue placeholder="— Chọn lý do —" />
              </SelectTrigger>
              <SelectContent>
                {REJECT_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rej-comment">
              Bình luận chi tiết <span className="text-danger-foreground">*</span>
            </Label>
            <Textarea
              id="rej-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Giải thích rõ để tác giả hiểu vì sao bị từ chối…"
              className="min-h-[88px] resize-none"
              aria-required
            />
          </div>

          {!isValid && (comment || reason) && (
            <p className="flex items-center gap-1.5 text-xs text-danger-foreground">
              <AlertTriangle className="size-3 shrink-0" aria-hidden />
              Cần chọn lý do và nhập bình luận.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" disabled={!isValid} onClick={handleSubmit}>
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Approve dialog ─────────────────────────────────────────────────────── */

interface ApproveDialogProps {
  open: boolean;
  canPublish: boolean;
  onClose: () => void;
  onApprove: (andPublish: boolean) => void;
}

export function ApproveDialog({
  open,
  canPublish,
  onClose,
  onApprove,
}: ApproveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-success-soft">
              <Check className="size-4 text-success-foreground" aria-hidden />
            </span>
            <DialogTitle>Phê duyệt mục từ</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Chọn bước tiếp theo sau khi phê duyệt:
          </p>

          {!canPublish && (
            <div className={cn(
              "flex items-start gap-2 rounded-lg border px-3 py-2.5",
              "border-warning-soft bg-warning-soft",
            )}>
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning-foreground" aria-hidden />
              <p className="text-xs text-warning-foreground">
                Còn lỗi xác thực — chỉ có thể phê duyệt, chưa thể xuất bản trực tiếp.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => onApprove(false)}
            >
              <Check className="size-4" aria-hidden />
              Chỉ phê duyệt
            </Button>
            <Button
              className="justify-start gap-2"
              disabled={!canPublish}
              onClick={() => onApprove(true)}
            >
              <Globe className="size-4" aria-hidden />
              Phê duyệt &amp; xuất bản
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
