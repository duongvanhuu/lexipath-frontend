"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { cn } from "@/lib/utils/cn";

export interface AdminDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageIndex?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (row: TData) => void;
}

function TableSkeletonRows({
  columnCount,
  rowCount,
}: {
  columnCount: number;
  rowCount: number;
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function AdminDataTable<TData>({
  data,
  columns,
  isLoading = false,
  emptyTitle = "No results",
  emptyDescription = "There is nothing here yet.",
  pageIndex,
  pageCount,
  onPageChange,
  onSelectionChange,
  onRowClick,
}: AdminDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const selectionColumn: ColumnDef<TData> = {
    id: "__select__",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        data-state={
          table.getIsSomePageRowsSelected() ? "indeterminate" : undefined
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    size: 40,
  };

  const allColumns: ColumnDef<TData>[] = [selectionColumn, ...columns];

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    // Sorting is opt-in per column via enableSorting: true
    defaultColumn: { enableSorting: false },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageCount ?? -1,
  });

  React.useEffect(() => {
    if (!onSelectionChange) return;
    // Compute from rowSelection state (default row IDs are string indices)
    const selected = data.filter((_, idx) => rowSelection[String(idx)] === true);
    onSelectionChange(selected);
  }, [data, rowSelection, onSelectionChange]);

  const hasPagination =
    pageCount !== undefined && pageCount > 0 && onPageChange !== undefined;
  const currentPage = pageIndex ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        !canSort
                          ? undefined
                          : sorted === "asc"
                            ? "ascending"
                            : sorted === "desc"
                              ? "descending"
                              : "none"
                      }
                    >
                      {canSort ? (
                        <button
                          type="button"
                          className="inline-flex cursor-pointer select-none items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => header.column.toggleSorting()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {sorted === "asc" && (
                            <ChevronUp className="h-3.5 w-3.5" />
                          )}
                          {sorted === "desc" && (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                          {!sorted && (
                            <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                          )}
                        </button>
                      ) : header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="p-0"
                  role="status"
                  aria-busy
                  aria-label="Loading"
                >
                  <Table className="w-full">
                    <TableBody>
                      <TableSkeletonRows
                        columnCount={allColumns.length}
                        rowCount={3}
                      />
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="py-10 text-center"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    "data-[state=selected]:bg-muted",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount - 1}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
