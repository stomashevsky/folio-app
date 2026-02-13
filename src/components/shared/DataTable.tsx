"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import {
  ChevronLeftMd,
  ChevronRightMd,
  ArrowUpSm,
  ArrowDownSm,
  Sort,
  Search,
} from "@plexui/ui/components/Icon";

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

/* ------------------------------------------------------------------ */
/*  Standalone search pill – used inside TopBar toolbar                */
/* ------------------------------------------------------------------ */
interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = "Search...",
}: TableSearchProps) {
  return (
    <div className="w-56">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={value ? () => onChange("") : undefined}
        startAdornment={<Search style={{ width: 16, height: 16 }} />}
        size="sm"
        pill
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DataTable                                                          */
/* ------------------------------------------------------------------ */
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  /** External filter value (controlled mode – search rendered in TopBar) */
  globalFilter?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  /** Default sorting state */
  initialSorting?: SortingState;
  /** Controlled column visibility state */
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Columns to hide on mobile (<768px). Merged with columnVisibility. */
  mobileColumnVisibility?: VisibilityState;
}

export function DataTable<T>({
  data,
  columns,
  globalFilter: externalFilter = "",
  onRowClick,
  pageSize = 10,
  initialSorting = [],
  columnVisibility,
  onColumnVisibilityChange,
  mobileColumnVisibility,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const isMobile = useIsMobile();

  // Merge desktop visibility with mobile overrides
  const mergedVisibility = useMemo(() => {
    if (!isMobile || !mobileColumnVisibility) return columnVisibility;
    return { ...columnVisibility, ...mobileColumnVisibility };
  }, [isMobile, mobileColumnVisibility, columnVisibility]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: externalFilter,
      ...(mergedVisibility !== undefined && { columnVisibility: mergedVisibility }),
    },
    onSortingChange: setSorting,
    ...(onColumnVisibilityChange && {
      onColumnVisibilityChange: (updater) => {
        const next =
          typeof updater === "function"
            ? updater(mergedVisibility ?? {})
            : updater;
        onColumnVisibilityChange(next);
      },
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Table – scrollable area */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={header.getSize() !== 150 ? { minWidth: header.getSize(), width: header.getSize() } : undefined}
                    className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-[var(--color-text)]"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpSm style={{ width: 14, height: 14 }} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDownSm style={{ width: 14, height: 14 }} />
                            ) : (
                              <Sort style={{ width: 14, height: 14 }} className="opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="py-12 text-center text-sm text-[var(--color-text-tertiary)]"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-secondary)] ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="truncate max-w-0 py-2 pr-2 align-middle text-sm text-[var(--color-text)]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination – pinned bottom */}
      <div className="shrink-0 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] py-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Rows per page
          </span>
          <div className="w-20">
            <Select
              options={PAGE_SIZE_OPTIONS}
              value={String(table.getState().pagination.pageSize)}
              onChange={(opt) => table.setPageSize(Number(opt.value))}
              size="sm"
              pill={false}
              block
            />
          </div>
        </div>

        {/* Page info + nav */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {totalRows === 0
              ? "0 results"
              : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–${Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  totalRows
                )} of ${totalRows}`}
          </span>
          <div className="flex items-center gap-1">
            <Button
              color="secondary"
              variant="outline"
              size="sm"
              uniform
              pill={false}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeftMd />
            </Button>
            <Button
              color="secondary"
              variant="outline"
              size="sm"
              uniform
              pill={false}
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRightMd />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
