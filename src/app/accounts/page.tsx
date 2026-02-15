"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockAccounts } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { applyAccountFilters } from "@/lib/utils/filters";
import { useRouter } from "next/navigation";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Account } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import {
  DateRangePicker,
  type DateRange,
} from "@plexui/ui/components/DateRangePicker";
import { Plus, Download } from "@plexui/ui/components/Icon";
import { LIST_PAGE_DATE_SHORTCUTS } from "@/lib/constants/date-shortcuts";
import { ACCOUNT_STATUS_OPTIONS } from "@/lib/constants/filter-options";
import {
  ACCOUNT_COLUMN_CONFIG,
  ACCOUNT_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = ACCOUNT_STATUS_OPTIONS;

const COLUMN_CONFIG: ColumnConfig[] = ACCOUNT_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = ACCOUNT_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Account, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 240,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Account ID",
    size: 220,
    cell: idCell<Account>((r) => r.id),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Account>((r) => r.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Account>((r) => r.status),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at (UTC)",
    size: 180,
    cell: dateTimeCell<Account>((r) => r.updatedAt),
  },
  {
    accessorKey: "referenceId",
    header: "Reference ID",
    size: 180,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.referenceId ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "inquiryCount",
    header: "Inquiries",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.inquiryCount}
      </span>
    ),
  },
  {
    accessorKey: "verificationCount",
    header: "Verifications",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.verificationCount}
      </span>
    ),
  },
  {
    accessorKey: "reportCount",
    header: "Reports",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.reportCount}
      </span>
    ),
  },
];

// ─── Page ───

export default function AccountsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [updatedRange, setUpdatedRange] = useState<DateRange | null>(null);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters =
    statusFilter.length > 0 ||
    !!dateRange ||
    !!updatedRange;

  const filteredData = useMemo(
    () =>
      applyAccountFilters(mockAccounts, {
        statuses: statusFilter,
        dateFrom: dateRange ? dateRange[0] : null,
        dateTo: dateRange ? dateRange[1] : null,
        updatedFrom: updatedRange ? updatedRange[0] : null,
        updatedTo: updatedRange ? updatedRange[1] : null,
      }),
    [statusFilter, dateRange, updatedRange]
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setDateRange(null);
    setUpdatedRange(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Accounts"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button
              color="secondary"
              variant="outline"
              size="md"
              pill={false}
            >
              <Download />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button color="primary" size="md" pill={false}>
              <Plus />
              <span className="hidden md:inline">Create Account</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search accounts..."
            />

            {/* ── Status filter ── */}
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={180}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size="sm"
              />
            </div>

            {/* ── Date filter ── */}
            <DateRangePicker
              clearable
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              shortcuts={LIST_PAGE_DATE_SHORTCUTS}
              placeholder="Created at"
              variant="outline"
              size="sm"
              pill
            />

            {/* ── Dynamic filters for toggled columns ── */}
            {columnVisibility.updatedAt !== false && (
              <DateRangePicker
                clearable
                value={updatedRange}
                onChange={(range) => setUpdatedRange(range)}
                shortcuts={LIST_PAGE_DATE_SHORTCUTS}
                placeholder="Updated at"
                variant="outline"
                size="sm"
                pill
              />
            )}

            {/* ── Clear all filters ── */}
            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/accounts/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: false,
            createdAt: false,
            updatedAt: false,
            referenceId: false,
            inquiryCount: false,
            verificationCount: false,
            reportCount: false,
          }}
        />
      </div>
    </div>
  );
}
