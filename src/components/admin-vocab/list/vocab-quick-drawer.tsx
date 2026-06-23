"use client";

import { AlertTriangle, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import type {
  VocabItem,
  VocabLang,
  VocabStatus,
} from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_STATUS_LABELS } from "@/features/admin-vocab/types/vocab-item.types";

// ── helpers ──────────────────────────────────────────────────────────────────

const CJK_LANGS = new Set<VocabLang>(["ja", "zh"]);

const LANG_FLAG: Record<VocabLang, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

function getVocabLangFlag(lang: VocabLang): string {
  return LANG_FLAG[lang];
}

function getVocabStatusLabel(status: VocabStatus): string {
  return VOCAB_STATUS_LABELS[status];
}

const STATUS_CLASS: Record<VocabStatus, string> = {
  draft: "border bg-background text-muted-foreground",
  in_review: "bg-amber-100 text-amber-800 border-amber-200",
  reviewed: "bg-sky-100 text-sky-800 border-sky-200",
  published: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  archived: "border bg-muted text-muted-foreground",
};

function getVocabStatusClassName(status: VocabStatus): string {
  return STATUS_CLASS[status] ?? "";
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface VocabQuickDrawerProps {
  item: VocabItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: VocabItem) => void;
  onSendReview: (item: VocabItem) => void;
}

// ── component ────────────────────────────────────────────────────────────────

export function VocabQuickDrawer({
  item,
  open,
  onOpenChange,
  onEdit,
  onSendReview,
}: VocabQuickDrawerProps) {
  const canSendReview =
    item !== null &&
    !["in_review", "published", "archived"].includes(item.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-[368px]"
      >
        {item === null ? (
          // Guard: keep Sheet mounted but render nothing inside when no item
          <>
            <SheetHeader>
              <SheetTitle className="sr-only">Chi tiết từ vựng</SheetTitle>
              <SheetDescription className="sr-only">
                Chưa có từ vựng nào được chọn.
              </SheetDescription>
            </SheetHeader>
          </>
        ) : (
          <>
            {/* Header */}
            <SheetHeader className="shrink-0 border-b pb-3">
              <SheetTitle asChild>
                <div>
                  <span
                    className={cn(
                      "block text-2xl font-bold leading-tight",
                      CJK_LANGS.has(item.lang) && "font-sans"
                    )}
                  >
                    {item.canonicalForm}
                  </span>
                  {item.pronunciation && (
                    <p className="mt-0.5 font-mono text-sm font-normal text-muted-foreground">
                      {item.pronunciation}
                    </p>
                  )}
                </div>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Chi tiết từ vựng: {item.canonicalForm}
              </SheetDescription>
            </SheetHeader>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto py-3">
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">
                  {getVocabLangFlag(item.lang)} {item.lang.toUpperCase()}
                </Badge>
                <Badge variant="outline">{item.itemType}</Badge>
                {item.pos && <Badge variant="outline">{item.pos}</Badge>}
                {item.level && <Badge variant="secondary">{item.level}</Badge>}
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                    getVocabStatusClassName(item.status)
                  )}
                >
                  {getVocabStatusLabel(item.status)}
                </span>
                {item.isAiGenerated && (
                  <Badge className="border border-violet-200 bg-violet-100 text-violet-800">
                    <Bot className="mr-1 size-3" aria-hidden />
                    AI Generated
                  </Badge>
                )}
              </div>

              {/* AI warning banner */}
              {item.isAiGenerated && (
                <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                  <AlertTriangle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden
                  />
                  <span>
                    Từ vựng do AI tạo — cần kiểm tra trước khi xuất bản
                  </span>
                </div>
              )}

              {/* Senses */}
              {item.senses.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nghĩa
                  </p>
                  {item.senses.map((sense, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="shrink-0 text-muted-foreground">
                        {i + 1}.
                      </span>
                      <div>
                        <span className="font-medium">{sense.pos}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {sense.def}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Metadata */}
              <div className="space-y-1.5 text-xs">
                <p className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Thông tin
                </p>
                {(
                  [
                    ["Nguồn", item.source ?? "—"],
                    ["Người duyệt", item.reviewer ?? "—"],
                    [
                      "Cập nhật",
                      new Date(item.updatedAt).toLocaleDateString("vi-VN"),
                    ],
                    ["Âm thanh", item.hasAudio ? "Có" : "Chưa có"],
                    ["Ví dụ", item.hasExample ? "Có" : "Chưa có"],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* Issues */}
              {item.issues.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Vấn đề ({item.issues.length})
                  </p>
                  {item.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex gap-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800"
                    >
                      <AlertTriangle
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <SheetFooter className="shrink-0 gap-2 border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(item)}
              >
                Chỉnh sửa
              </Button>
              {canSendReview && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onSendReview(item)}
                >
                  Gửi duyệt
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
