"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockVerifications } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { applyVerificationFilters } from "@/lib/utils/filters";
import { useRouter } from "next/navigation";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Verification } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import {
  DateRangePicker,
  type DateRange,
} from "@plexui/ui/components/DateRangePicker";
import { Plus, Download } from "@plexui/ui/components/Icon";
import { LIST_PAGE_DATE_SHORTCUTS } from "@/lib/constants/date-shortcuts";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import {
  VERIFICATION_STATUS_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  VERIFICATION_COLUMN_CONFIG,
  VERIFICATION_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = VERIFICATION_STATUS_OPTIONS;
const TYPE_OPTIONS = VERIFICATION_TYPE_OPTIONS;

const COLUMN_CONFIG: ColumnConfig[] = VERIFICATION_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = VERIFICATION_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Verification, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">
        {VERIFICATION_TYPE_LABELS[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Verification ID",
    size: 220,
    cell: idCell<Verification>((r) => r.id),
  },
  {
    accessorKey: "inquiryId",
    header: "Inquiry ID",
    size: 220,
    cell: idCell<Verification>((r) => r.inquiryId),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Verification>((r) => r.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Verification>((r) => r.status),
  },
  {
    accessorKey: "completedAt",
    header: "Completed at (UTC)",
    size: 180,
    cell: dateTimeCell<Verification>((r) => r.completedAt),
  },
];

// ─── Page ───

export default function VerificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [completedRange, setCompletedRange] = useState<DateRange | null>(null);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters =
    statusFilter.length > 0 ||
    typeFilter.length > 0 ||
    !!dateRange ||
    !!completedRange;

  const filteredData = useMemo(
    () =>
      applyVerificationFilters(mockVerifications, {
        statuses: statusFilter,
        types: typeFilter,
        dateFrom: dateRange ? dateRange[0] : null,
        dateTo: dateRange ? dateRange[1] : null,
        completedFrom: completedRange ? completedRange[0] : null,
        completedTo: completedRange ? completedRange[1] : null,
      }),
    [statusFilter, typeFilter, dateRange, completedRange]
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setTypeFilter([]);
    setDateRange(null);
    setCompletedRange(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Verifications"
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
              <span className="hidden md:inline">Create Verification</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search verifications..."
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

            {/* ── Type filter ── */}
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={180}
                options={TYPE_OPTIONS}
                value={typeFilter}
                onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                placeholder="Type"
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
            {columnVisibility.completedAt !== false && (
              <DateRangePicker
                clearable
                value={completedRange}
                onChange={(range) => setCompletedRange(range)}
                shortcuts={LIST_PAGE_DATE_SHORTCUTS}
                placeholder="Completed at"
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
          onRowClick={(row) => router.push(`/verifications/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: false,
            inquiryId: false,
            completedAt: false,
          }}
        />
      </div>
    </div>
  );
}
