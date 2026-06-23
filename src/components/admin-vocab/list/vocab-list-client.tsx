"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Plus, Send, Tag, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { BulkActionToolbar } from "@/components/admin/bulk-action-toolbar";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { showSuccessToast } from "@/components/shared/feedback/toast";
import type { VocabItem } from "@/features/admin-vocab/types/vocab-item.types";
import { useVocabListFilters } from "@/features/admin-vocab/hooks/use-vocab-list-filters";
import { VocabStatusStrip } from "./vocab-status-strip";
import { VocabFilterToolbar } from "./vocab-filter-toolbar";
import { createVocabTableColumns } from "./vocab-table-columns";
import { VocabQuickDrawer } from "./vocab-quick-drawer";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface VocabListClientProps {
  initialItems: readonly VocabItem[];
}

// ── Page size constant (must match hook) ──────────────────────────────────────

const PAGE_SIZE = 8;

// ── Component ─────────────────────────────────────────────────────────────────

export function VocabListClient({ initialItems }: VocabListClientProps) {
  const router = useRouter();

  // Local mutable item list — never mutate initialItems
  const [items, setItems] = useState<VocabItem[]>(() => [...initialItems]);

  // Drawer state
  const [drawerItem, setDrawerItem] = useState<VocabItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Bulk archive confirmation dialog state
  const [bulkArchiveOpen, setBulkArchiveOpen] = useState(false);

  // Selection state — synced from AdminDataTable.onSelectionChange
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter + pagination hook
  const list = useVocabListFilters(items);

  // ── Derived ───────────────────────────────────────────────────────────────

  const hasAnyFilter =
    list.stripFilter !== "all" ||
    (list.filters.search !== undefined && list.filters.search !== "") ||
    (list.filters.lang !== undefined && list.filters.lang !== "") ||
    list.filters.status !== undefined ||
    list.activeAdvancedFilterCount > 0;

  const paginationStart = (list.page - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(list.page * PAGE_SIZE, list.filtered.length);

  // ── Item mutations ────────────────────────────────────────────────────────

  function mutate(id: string, patch: Partial<VocabItem>) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );
  }

  // ── Row action callbacks ──────────────────────────────────────────────────

  function handleOpenQuickView(item: VocabItem) {
    setDrawerItem(item);
    setDrawerOpen(true);
  }

  function handleEdit(item: VocabItem) {
    router.push(`/admin/vocab/${item.id}/edit` as Route);
  }

  function handleDuplicate(item: VocabItem) {
    setItems((prev) => {
      const ts = Date.now();
      const copy: VocabItem = {
        ...item,
        id: `${item.id}-copy-${ts}`,
        canonicalForm: `${item.canonicalForm} (bản sao)`,
        status: "draft",
        updatedAt: new Date(ts).toISOString(),
        isAiGenerated: false,
        issues: [],
      };
      return [copy, ...prev];
    });
    showSuccessToast(`Đã tạo bản sao: ${item.canonicalForm} (bản sao)`);
  }

  function handleSendReview(item: VocabItem) {
    if (["in_review", "published", "archived"].includes(item.status)) return;
    mutate(item.id, { status: "in_review" });
    showSuccessToast(`Đã gửi duyệt: ${item.canonicalForm}`);
  }

  function handlePublish(item: VocabItem) {
    if (
      item.issues.length > 0 ||
      ["published", "archived"].includes(item.status)
    )
      return;
    mutate(item.id, { status: "published" });
    showSuccessToast(`Đã xuất bản: ${item.canonicalForm}`);
  }

  function handleArchive(item: VocabItem) {
    mutate(item.id, { status: "archived" });
    showSuccessToast(`Đã lưu trữ: ${item.canonicalForm}`);
  }

  // ── Selection sync from AdminDataTable ───────────────────────────────────

  const handleSelectionChange = useCallback((rows: VocabItem[]) => {
    setSelectedIds(rows.map((r) => r.id));
  }, []);

  // ── Bulk actions ─────────────────────────────────────────────────────────

  function handleBulkSendReview(ids: string[]) {
    setItems((prev) =>
      prev.map((i) =>
        ids.includes(i.id) &&
        !["in_review", "published", "archived"].includes(i.status)
          ? { ...i, status: "in_review" }
          : i,
      ),
    );
    showSuccessToast(`Đã gửi duyệt ${ids.length} mục từ`);
    setSelectedIds([]);
  }

  function handleBulkArchive() {
    setItems((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id) ? { ...i, status: "archived" } : i,
      ),
    );
    showSuccessToast(`Đã lưu trữ ${selectedIds.length} mục từ`);
    setSelectedIds([]);
    setBulkArchiveOpen(false);
  }

  const bulkActions = useMemo(
    () => [
      {
        id: "send-review",
        label: "Gửi duyệt",
        icon: <Send className="h-3.5 w-3.5" aria-hidden />,
        variant: "default" as const,
        onClick: (ids: string[]) => handleBulkSendReview(ids),
      },
      {
        id: "tag",
        label: "Thêm tag",
        icon: <Tag className="h-3.5 w-3.5" aria-hidden />,
        variant: "secondary" as const,
        onClick: (_ids: string[]) => {
          showSuccessToast("Tính năng thêm tag sẽ sớm ra mắt");
        },
      },
      {
        id: "archive",
        label: "Lưu trữ",
        icon: <Archive className="h-3.5 w-3.5" aria-hidden />,
        variant: "danger" as const,
        onClick: (_ids: string[]) => setBulkArchiveOpen(true),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds],
  );

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns = useMemo(
    () =>
      createVocabTableColumns({
        onOpenQuickView: handleOpenQuickView,
        onEdit: handleEdit,
        onDuplicate: handleDuplicate,
        onSendReview: handleSendReview,
        onPublish: handlePublish,
        onArchive: handleArchive,
      }),
    // Column definitions capture stable closures; re-creating them on every
    // render would reset sort state. Only recreate when items changes shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Pagination page numbers ────────────────────────────────────────────────

  const pageNumbers = useMemo((): (number | "ellipsis")[] => {
    const total = list.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (list.page > 3) pages.push("ellipsis");
    for (
      let p = Math.max(2, list.page - 1);
      p <= Math.min(total - 1, list.page + 1);
      p++
    ) {
      pages.push(p);
    }
    if (list.page < total - 2) pages.push("ellipsis");
    pages.push(total);
    return pages;
  }, [list.page, list.totalPages]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* 1. Page header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Từ vựng</h1>
          <p className="text-sm text-muted-foreground">
            {list.filtered.length} / {items.length} mục từ
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={"/admin/vocab/new" as Route}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden />
            Thêm mục từ
          </Link>
        </Button>
      </div>

      {/* 2. Status strip */}
      <VocabStatusStrip
        value={list.stripFilter}
        counts={list.statusCounts}
        onChange={list.setStripFilter}
      />

      {/* 3. Filter toolbar */}
      <VocabFilterToolbar
        filters={list.filters}
        activeAdvancedFilterCount={list.activeAdvancedFilterCount}
        hasAnyFilter={hasAnyFilter}
        onFiltersChange={list.setFilters}
        onClearFilters={list.clearFilters}
      />

      {/* 4. Bulk action toolbar — animates in/out via BulkActionToolbar internals */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        actions={bulkActions}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* 5. Table or empty state */}
      {list.filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy mục từ nào"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          action={{
            label: "Xóa bộ lọc",
            onClick: list.clearFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <AdminDataTable
              data={list.paginated}
              columns={columns}
              emptyTitle="Không tìm thấy mục từ nào"
              emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
              onSelectionChange={handleSelectionChange}
              onRowClick={(row) => {
                setDrawerItem(row);
                setDrawerOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 6. Pagination */}
      {list.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {paginationStart}–{paginationEnd} / {list.filtered.length} mục
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={list.page === 1}
              onClick={() => list.setPage(list.page - 1)}
              aria-label="Trang trước"
            >
              ← Trang trước
            </Button>
            {pageNumbers.map((p, idx) =>
              p === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="select-none px-1"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={list.page === p ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => list.setPage(p)}
                  aria-label={`Trang ${p}`}
                  aria-current={list.page === p ? "page" : undefined}
                >
                  {p}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={list.page === list.totalPages}
              onClick={() => list.setPage(list.page + 1)}
              aria-label="Trang sau"
            >
              Trang sau →
            </Button>
          </div>
        </div>
      )}

      {/* 7. Quick drawer */}
      <VocabQuickDrawer
        item={drawerItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={(item) => {
          router.push(`/admin/vocab/${item.id}/edit` as Route);
        }}
        onSendReview={(item) => {
          if (["in_review", "published", "archived"].includes(item.status))
            return;
          mutate(item.id, { status: "in_review" });
          showSuccessToast(`Đã gửi duyệt: ${item.canonicalForm}`);
        }}
      />

      {/* 8. Bulk archive confirm dialog */}
      <AlertDialog
        open={bulkArchiveOpen}
        onOpenChange={(open) => {
          if (!open) setBulkArchiveOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Lưu trữ {selectedIds.length} mục từ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Các mục từ đã chọn sẽ được chuyển sang trạng thái Lưu trữ. Bạn
              có thể khôi phục sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive}>
              Lưu trữ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
