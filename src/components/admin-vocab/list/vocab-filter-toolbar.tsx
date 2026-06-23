"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { VOCAB_SOURCES } from "@/features/admin-vocab/types/vocab-item.types";
import type { VocabStatus } from "@/features/admin-vocab/types/vocab-item.types";
import type { VocabFilterState } from "@/features/admin-vocab/hooks/use-vocab-list-filters";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: VocabStatus; label: string }[] = [
  { value: "draft", label: "Nháp" },
  { value: "in_review", label: "Đang duyệt" },
  { value: "reviewed", label: "Đã duyệt" },
  { value: "published", label: "Đã xuất bản" },
  { value: "rejected", label: "Từ chối" },
  { value: "archived", label: "Lưu trữ" },
];

const LANG_OPTIONS = [
  { value: "en", label: "🇬🇧 Tiếng Anh" },
  { value: "ja", label: "🇯🇵 Tiếng Nhật" },
  { value: "zh", label: "🇨🇳 Tiếng Trung" },
];

const BOOL_OPTIONS = [
  { value: "any", label: "Bất kỳ" },
  { value: "yes", label: "Có" },
  { value: "no", label: "Chưa có" },
] as const;

type BoolOption = "any" | "yes" | "no";

function boolOptionToValue(opt: BoolOption): boolean | undefined {
  if (opt === "yes") return true;
  if (opt === "no") return false;
  return undefined;
}

function boolValueToOption(val: boolean | undefined): BoolOption {
  if (val === true) return "yes";
  if (val === false) return "no";
  return "any";
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VocabFilterToolbarProps {
  filters: VocabFilterState;
  activeAdvancedFilterCount: number;
  hasAnyFilter: boolean;
  onFiltersChange: (filters: VocabFilterState) => void;
  onClearFilters: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VocabFilterToolbar({
  filters,
  activeAdvancedFilterCount,
  hasAnyFilter,
  onFiltersChange,
  onClearFilters,
  className,
}: VocabFilterToolbarProps) {
  const [expanded, setExpanded] = useState(false);

  function patchString(key: keyof VocabFilterState, raw: string) {
    if (raw === "" || raw === "all") {
      const next = { ...filters };
      delete next[key];
      onFiltersChange(next);
    } else {
      // key is always a string-typed field when called from patchString
      onFiltersChange({ ...filters, [key]: raw as never });
    }
  }

  function patchBool(key: "hasAudio" | "hasExample", val: boolean | undefined) {
    if (val === undefined) {
      const next = { ...filters };
      delete next[key];
      onFiltersChange(next);
    } else {
      onFiltersChange({ ...filters, [key]: val });
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* ── Visible row ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-48 flex-1 max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Tìm theo từ hoặc phiên âm"
            placeholder="Tìm theo từ hoặc phiên âm…"
            value={filters.search ?? ""}
            onChange={(e) => patchString("search", e.target.value)}
            className="h-9 pl-8"
          />
        </div>

        {/* Language */}
        <Select
          value={filters.lang ?? "all"}
          onValueChange={(v) => patchString("lang", v)}
        >
          <SelectTrigger aria-label="Ngôn ngữ" className="h-9 w-44">
            <SelectValue placeholder="Ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ngôn ngữ</SelectItem>
            {LANG_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) =>
            patchString("status", v)
          }
        >
          <SelectTrigger aria-label="Trạng thái" className="h-9 w-44">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <SlidersHorizontal aria-hidden className="h-3.5 w-3.5" />
          Bộ lọc
          {activeAdvancedFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="h-4 min-w-4 px-1 text-[10px] tabular-nums"
            >
              {activeAdvancedFilterCount}
            </Badge>
          )}
          {expanded ? (
            <ChevronUp aria-hidden className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown aria-hidden className="h-3.5 w-3.5" />
          )}
        </Button>

        {/* Clear filters — only when active */}
        {hasAnyFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-1"
            onClick={onClearFilters}
          >
            <X aria-hidden className="h-3.5 w-3.5" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* ── Advanced panel ────────────────────────────────────── */}
      {expanded && (
        <div className="flex flex-wrap items-start gap-2 border-t pt-2">
          {/* POS */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="adv-pos"
              className="text-xs font-medium text-muted-foreground"
            >
              Từ loại
            </label>
            <Input
              id="adv-pos"
              placeholder="Noun, Verb…"
              value={filters.pos ?? ""}
              onChange={(e) => patchString("pos", e.target.value)}
              className="h-9 w-36"
            />
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Nguồn
            </label>
            <Select
              value={filters.source ?? "all"}
              onValueChange={(v) => patchString("source", v)}
            >
              <SelectTrigger aria-label="Nguồn" className="h-9 w-32">
                <SelectValue placeholder="Nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bất kỳ</SelectItem>
                {VOCAB_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reviewer */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="adv-reviewer"
              className="text-xs font-medium text-muted-foreground"
            >
              Người duyệt
            </label>
            <Input
              id="adv-reviewer"
              placeholder="Tên người duyệt…"
              value={filters.reviewer ?? ""}
              onChange={(e) => patchString("reviewer", e.target.value)}
              className="h-9 w-40"
            />
          </div>

          {/* Audio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Audio
            </label>
            <Select
              value={boolValueToOption(filters.hasAudio)}
              onValueChange={(v) =>
                patchBool("hasAudio", boolOptionToValue(v as BoolOption))
              }
            >
              <SelectTrigger aria-label="Audio" className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Example */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Ví dụ
            </label>
            <Select
              value={boolValueToOption(filters.hasExample)}
              onValueChange={(v) =>
                patchBool("hasExample", boolOptionToValue(v as BoolOption))
              }
            >
              <SelectTrigger aria-label="Ví dụ" className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Missing data */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Thiếu dữ liệu
            </label>
            <Select
              value={filters.missing ?? "all"}
              onValueChange={(v) => patchString("missing", v)}
            >
              <SelectTrigger aria-label="Thiếu dữ liệu" className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bất kỳ</SelectItem>
                <SelectItem value="audio">Thiếu âm thanh</SelectItem>
                <SelectItem value="example">Thiếu ví dụ</SelectItem>
                <SelectItem value="issues">Có cảnh báo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
