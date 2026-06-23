"use client";

import { MoreHorizontal, Eye, Pencil, Copy, Send, Globe, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { VocabItem } from "@/features/admin-vocab/types/vocab-item.types";

export interface VocabRowMenuProps {
  item: VocabItem;
  onOpenQuickView: (item: VocabItem) => void;
  onEdit: (item: VocabItem) => void;
  onDuplicate: (item: VocabItem) => void;
  onSendReview: (item: VocabItem) => void;
  onPublish: (item: VocabItem) => void;
  onArchive: (item: VocabItem) => void;
}

export function VocabRowMenu({
  item,
  onOpenQuickView,
  onEdit,
  onDuplicate,
  onSendReview,
  onPublish,
  onArchive,
}: VocabRowMenuProps) {
  const canSendReview = !["in_review", "published", "archived"].includes(item.status);
  const canPublish =
    item.issues.length === 0 && !["published", "archived"].includes(item.status);
  const canArchive = item.status !== "archived";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Hành động"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(item);
          }}
        >
          <Eye aria-hidden />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
        >
          <Pencil aria-hidden />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(item);
          }}
        >
          <Copy aria-hidden />
          Nhân bản
        </DropdownMenuItem>

        {canSendReview && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSendReview(item);
              }}
            >
              <Send aria-hidden />
              Gửi duyệt
            </DropdownMenuItem>
          </>
        )}

        {canPublish && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onPublish(item);
            }}
          >
            <Globe aria-hidden />
            Xuất bản
          </DropdownMenuItem>
        )}

        {canArchive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(item);
              }}
            >
              <Archive aria-hidden />
              Lưu trữ
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
