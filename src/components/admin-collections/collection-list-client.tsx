"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { ColumnDef } from "@tanstack/react-table";
import { Star, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { BulkActionToolbar } from "@/components/admin/bulk-action-toolbar";
import { FilterToolbar } from "@/components/admin/filter-toolbar";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { PageHeader } from "@/components/layouts/page-header";
import type { AdminCollection, AdminCollectionStatus } from "@/features/admin-collections/types";
import {
  COLL_LANG_LABELS,
  COLL_TYPE_OPTS,
  COLL_PLAN_OPTS,
} from "@/features/admin-collections/types";
import { cn } from "@/lib/utils/cn";

const LANG_FLAG: Record<string, string> = { ja: "🇯🇵", en: "🇬🇧", zh: "🇨🇳" };
const PLAN_TONE: Record<string, string> = {
  free: "bg-success-soft text-success-foreground",
  pro: "bg-info-soft text-info-foreground",
  team: "bg-warning-soft text-warning-foreground",
  enterprise: "bg-warning-soft text-warning-foreground",
};

function mapStatus(s: AdminCollectionStatus): ContentStatus {
  if (s === "review") return "in_review";
  if (s === "archived") return "archived";
  if (s === "published") return "published";
  return "draft";
}

function PlanBadge({ plan }: { plan: string }) {
  const label = COLL_PLAN_OPTS.find((o) => o.v === plan)?.l ?? plan;
  return (
    <Badge className={cn("text-xs", PLAN_TONE[plan] ?? "bg-muted text-muted-foreground")}>
      {label}
    </Badge>
  );
}

export interface CollectionListClientProps {
  initialCollections: AdminCollection[];
}

export function CollectionListClient({
  initialCollections,
}: CollectionListClientProps) {
  const router = useRouter();
  const [collections, setCollections] = React.useState(initialCollections);
  const [selected, setSelected] = React.useState<AdminCollection[]>([]);
  const [filters, setFilters] = React.useState<Record<string, string | undefined>>({});

  const filtered = collections.filter((c) => {
    const q = (filters.search ?? "").toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.slug.includes(q)) return false;
    if (filters.language && filters.language !== "all" && c.language_code !== filters.language) return false;
    if (filters.type && filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.status && filters.status !== "all" && c.status_code !== filters.status) return false;
    return true;
  });

  const columns: ColumnDef<AdminCollection>[] = [
    {
      id: "name",
      header: "Bộ sưu tập",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-semibold">{row.original.name}</div>
          <div className="mt-0.5 text-xs text-text-secondary">
            {row.original.slug} ·{" "}
            {COLL_TYPE_OPTS.find((o) => o.v === row.original.type)?.l ?? row.original.type}
          </div>
        </div>
      ),
    },
    {
      id: "language_code",
      header: "Ngôn ngữ",
      cell: ({ row }) => (
        <span>
          {LANG_FLAG[row.original.language_code]}{" "}
          {COLL_LANG_LABELS[row.original.language_code] ?? row.original.language_code}
        </span>
      ),
    },
    {
      id: "cert_type",
      header: "Chứng chỉ",
      cell: ({ row }) => {
        const { cert_type, level_min, level_max } = row.original;
        if (cert_type === "Không có") return <span className="text-text-muted">—</span>;
        const range = level_min === level_max ? level_min : `${level_min}–${level_max}`;
        return <span className="text-sm">{cert_type} ({range})</span>;
      },
    },
    {
      id: "total_lessons",
      header: "Bài học",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{row.original.total_lessons}</span>
      ),
    },
    {
      id: "total_items",
      header: "Từ",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{row.original.total_items.toLocaleString("vi-VN")}</span>
      ),
    },
    {
      id: "min_plan",
      header: "Gói",
      cell: ({ row }) => <PlanBadge plan={row.original.min_plan} />,
    },
    {
      id: "is_featured",
      header: "Nổi bật",
      cell: ({ row }) =>
        row.original.is_featured ? (
          <Star className="size-4 text-warning fill-warning" aria-label="Nổi bật" />
        ) : (
          <span className="text-text-muted">—</span>
        ),
    },
    {
      id: "status_code",
      header: "Trạng thái",
      cell: ({ row }) => <ContentStatusBadge status={mapStatus(row.original.status_code)} />,
    },
    {
      id: "updated",
      header: "Cập nhật",
      cell: ({ row }) => (
        <span className="text-xs text-text-secondary">{row.original.updated}</span>
      ),
    },
  ];

  const selectedIds = selected.map((_, i) => String(i));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bộ sưu tập & Bài học"
        description={`${collections.length} bộ sưu tập`}
        actions={[
          {
            label: "Tạo bộ sưu tập",
            variant: "primary",
            onClick: () => router.push("/admin/collections/new" as Route),
          },
        ]}
      />

      <BulkActionToolbar
        selectedCount={selected.length}
        selectedIds={selectedIds}
        onClearSelection={() => setSelected([])}
        actions={[
          {
            id: "feature",
            label: "Nổi bật",
            icon: <Star className="size-3.5" />,
            onClick: () => {
              setCollections((prev) =>
                prev.map((c) =>
                  selected.some((s) => s.id === c.id)
                    ? { ...c, is_featured: true }
                    : c,
                ),
              );
              setSelected([]);
            },
          },
          {
            id: "archive",
            label: "Lưu trữ",
            variant: "danger",
            icon: <Archive className="size-3.5" />,
            onClick: () => {
              setCollections((prev) =>
                prev.map((c) =>
                  selected.some((s) => s.id === c.id)
                    ? { ...c, status_code: "archived" as const }
                    : c,
                ),
              );
              setSelected([]);
            },
          },
        ]}
      />

      <FilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClear={() => setFilters({})}
        resultCount={filtered.length}
        fields={[
          {
            id: "search",
            label: "Tìm kiếm",
            type: "search",
            placeholder: "Tìm bộ sưu tập…",
          },
          {
            id: "language",
            label: "Ngôn ngữ",
            type: "select",
            placeholder: "Tất cả ngôn ngữ",
            options: [
              { value: "ja", label: "🇯🇵 Tiếng Nhật" },
              { value: "en", label: "🇬🇧 Tiếng Anh" },
              { value: "zh", label: "🇨🇳 Tiếng Trung" },
            ],
          },
          {
            id: "type",
            label: "Loại",
            type: "select",
            placeholder: "Tất cả loại",
            options: COLL_TYPE_OPTS.map((o) => ({ value: o.v, label: o.l })),
          },
          {
            id: "status",
            label: "Trạng thái",
            type: "select",
            placeholder: "Tất cả trạng thái",
            options: [
              { value: "published", label: "Đã xuất bản" },
              { value: "draft", label: "Bản nháp" },
              { value: "review", label: "Đang duyệt" },
              { value: "archived", label: "Lưu trữ" },
            ],
          },
        ]}
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        emptyTitle="Không tìm thấy bộ sưu tập"
        emptyDescription="Thay đổi bộ lọc hoặc tạo bộ sưu tập mới."
        onSelectionChange={setSelected}
        onRowClick={(row) => router.push(`/admin/collections/${row.id}` as Route)}
      />
    </div>
  );
}
