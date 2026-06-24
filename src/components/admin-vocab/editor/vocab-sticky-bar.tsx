"use client";

import { Save, Send, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import type { VocabStatus } from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_STATUS_LABELS } from "@/features/admin-vocab/types/vocab-item.types";

type VocabStickyBarProps = {
  status: VocabStatus;
  isDirty: boolean;
  lastSaved: string | null;
  hardErrorCount: number;
  onSaveDraft: () => void;
  onSendReview: () => void;
  onPublish: () => void;
  canSendReview?: boolean;
  className?: string;
};

const STATUS_DOT_CLASS: Record<VocabStatus, string> = {
  draft:      "bg-muted-foreground",
  in_review:  "bg-amber-500",
  reviewed:   "bg-sky-500",
  published:  "bg-primary",
  rejected:   "bg-destructive",
  archived:   "bg-muted-foreground",
};

function formatLastSaved(isoOrTime: string): string {
  const d = new Date(isoOrTime);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }
  return isoOrTime;
}

export function VocabStickyBar({
  status,
  isDirty,
  lastSaved,
  hardErrorCount,
  onSaveDraft,
  onSendReview,
  onPublish,
  canSendReview,
  className,
}: VocabStickyBarProps) {
  const showSendReview =
    canSendReview === true ||
    (canSendReview === undefined && status !== "in_review" && status !== "published");

  const publishDisabled = hardErrorCount > 0;

  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex flex-wrap items-center gap-3 border-t bg-background/95 backdrop-blur px-4 py-2.5",
        className,
      )}
    >
      {/* Left: status + save state */}
      <div className="mr-auto flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_DOT_CLASS[status])}
        />
        <span className="text-xs text-muted-foreground">
          {VOCAB_STATUS_LABELS[status]}
        </span>
        {isDirty ? (
          <span className="text-xs font-medium text-amber-600">· Chưa lưu thay đổi</span>
        ) : lastSaved !== null ? (
          <span className="text-xs text-muted-foreground">
            · Đã lưu: {formatLastSaved(lastSaved)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">· Chưa lưu</span>
        )}
      </div>

      {/* Right: action buttons */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!isDirty}
        onClick={onSaveDraft}
        className="gap-1.5"
      >
        <Save className="h-3.5 w-3.5" aria-hidden="true" />
        Lưu nháp
      </Button>

      {showSendReview && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onSendReview}
          className="gap-1.5"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          Gửi duyệt
        </Button>
      )}

      {publishDisabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex">
                <Button
                  type="button"
                  size="sm"
                  disabled
                  className="gap-1.5 pointer-events-none"
                  aria-disabled="true"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Xuất bản
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              Cần sửa {hardErrorCount} lỗi trước khi xuất bản
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={onPublish}
          className="gap-1.5"
        >
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          Xuất bản
        </Button>
      )}
    </div>
  );
}
