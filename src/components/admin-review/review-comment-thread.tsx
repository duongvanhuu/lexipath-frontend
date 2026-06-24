"use client";

import * as React from "react";
import { CheckCircle, Circle, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import type { ReviewComment, ReviewCommentSeverity } from "@/features/admin-review";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const SEVERITY_LABEL: Record<ReviewCommentSeverity, string> = {
  blocker: "Chặn",
  major: "Quan trọng",
  minor: "Nhỏ",
};

const SEVERITY_CLASS: Record<ReviewCommentSeverity, string> = {
  blocker: "bg-danger-soft text-danger-foreground",
  major: "bg-warning-soft text-warning-foreground",
  minor: "bg-primary-soft text-primary-soft-foreground",
};

interface ReviewCommentThreadProps {
  comments: ReviewComment[];
  currentUserName: string;
  onAddComment: (text: string) => void;
  onToggleResolved: (id: string) => void;
}

export function ReviewCommentThread({
  comments,
  currentUserName,
  onAddComment,
  onToggleResolved,
}: ReviewCommentThreadProps) {
  const [draft, setDraft] = React.useState("");

  function handleSubmit() {
    if (!draft.trim()) return;
    onAddComment(draft.trim());
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm font-semibold">
        Luồng bình luận ({comments.length})
      </p>

      <div className="mb-4 flex flex-col gap-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={cn("flex gap-3", comment.resolved && "opacity-60")}
          >
            <Avatar size="sm" className="shrink-0 mt-0.5">
              <AvatarFallback className="text-xs">
                {getInitials(comment.author)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold">{comment.author}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    comment.role === "reviewer"
                      ? "bg-primary-soft text-primary-soft-foreground"
                      : "bg-surface-muted text-text-secondary",
                  )}
                >
                  {comment.role === "reviewer" ? "Người duyệt" : "Tác giả"}
                </span>
                {comment.field && (
                  <Badge variant="secondary" className="text-[10px]">
                    {comment.field}
                  </Badge>
                )}
                {comment.severity && (
                  <Badge
                    className={cn(
                      "text-[10px]",
                      SEVERITY_CLASS[comment.severity],
                    )}
                  >
                    {SEVERITY_LABEL[comment.severity]}
                  </Badge>
                )}
                <span className="ml-auto text-[10px] text-text-muted">
                  {comment.timestamp}
                </span>
              </div>
              <div
                className={cn(
                  "rounded-lg bg-surface-muted px-3 py-2.5 text-sm leading-relaxed",
                  comment.resolved && "line-through",
                )}
              >
                {comment.text}
              </div>
              <button
                type="button"
                onClick={() => onToggleResolved(comment.id)}
                className={cn(
                  "mt-1.5 flex items-center gap-1 text-xs transition-colors",
                  comment.resolved
                    ? "text-success-foreground"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label={
                  comment.resolved
                    ? "Đánh dấu chưa giải quyết"
                    : "Đánh dấu đã giải quyết"
                }
              >
                {comment.resolved ? (
                  <CheckCircle className="size-3" aria-hidden />
                ) : (
                  <Circle className="size-3" aria-hidden />
                )}
                {comment.resolved ? "Đã giải quyết" : "Đánh dấu đã giải quyết"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Avatar size="sm" className="shrink-0 mt-1">
          <AvatarFallback className="text-xs">
            {getInitials(currentUserName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Thêm bình luận… (Ctrl+Enter để gửi)"
            className="mb-2 min-h-[64px] resize-none text-sm"
            aria-label="Viết bình luận mới"
          />
          <Button
            size="sm"
            disabled={!draft.trim()}
            onClick={handleSubmit}
          >
            <Send className="size-3.5" aria-hidden />
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
