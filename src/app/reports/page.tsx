"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockReports } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { toTitleCase } from "@/lib/utils/format";
import { applyReportFilters } from "@/lib/utils/filters";
import { useRouter } from "next/navigation";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Report } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import {
  DateRangePicker,
  type DateRange,
} from "@plexui/ui/components/DateRangePicker";
import { Plus, Download } from "@plexui/ui/components/Icon";
import { LIST_PAGE_DATE_SHORTCUTS } from "@/lib/constants/date-shortcuts";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import {
  REPORT_STATUS_OPTIONS,
  REPORT_CREATED_BY_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  REPORT_COLUMN_CONFIG,
  REPORT_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = REPORT_STATUS_OPTIONS;

const TYPE_OPTIONS = Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const CREATED_BY_OPTIONS = REPORT_CREATED_BY_OPTIONS;

const COLUMN_CONFIG: ColumnConfig[] = REPORT_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = REPORT_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Report, unknown>[] = [
  {
    accessorKey: "primaryInput",
    header: "Primary Input",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{toTitleCase(row.original.primaryInput)}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 220,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {REPORT_TYPE_LABELS[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Report ID",
    size: 220,
    cell: idCell<Report>((r) => r.id),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Report>((r) => r.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Report>((r) => r.status),
  },
  {
    accessorKey: "templateName",
    header: "Template",
    size: 220,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.templateName}
      </span>
    ),
  },
  {
    accessorKey: "completedAt",
    header: "Completed at (UTC)",
    size: 180,
    cell: dateTimeCell<Report>((r) => r.completedAt),
  },
  {
    accessorKey: "createdBy",
    header: "Created by",
    size: 140,
    cell: ({ row }) => (
      <span className="capitalize text-[var(--color-text-secondary)]">
        {row.original.createdBy}
      </span>
    ),
  },
  {
    accessorKey: "matchCount",
    header: "Matches",
    size: 100,
    cell: ({ row }) => (
      <span
        className={
          row.original.matchCount > 0
            ? "font-medium text-[var(--color-danger-soft-text)]"
            : "text-[var(--color-text-secondary)]"
        }
      >
        {row.original.matchCount}
      </span>
    ),
  },
  {
    accessorKey: "continuousMonitoring",
    header: "Monitoring",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.continuousMonitoring ? "Yes" : "No"}
      </span>
    ),
  },
];

// ─── Page ───

export default function ReportsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [createdByFilter, setCreatedByFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [completedRange, setCompletedRange] = useState<DateRange | null>(null);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters =
    statusFilter.length > 0 ||
    typeFilter.length > 0 ||
    createdByFilter.length > 0 ||
    !!dateRange ||
    !!completedRange;

  const filteredData = useMemo(
    () =>
      applyReportFilters(mockReports, {
        statuses: statusFilter,
        types: typeFilter,
        createdBy: createdByFilter,
        dateFrom: dateRange ? dateRange[0] : null,
        dateTo: dateRange ? dateRange[1] : null,
        completedFrom: completedRange ? completedRange[0] : null,
        completedTo: completedRange ? completedRange[1] : null,
      }),
    [statusFilter, typeFilter, createdByFilter, dateRange, completedRange]
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setTypeFilter([]);
    setCreatedByFilter([]);
    setDateRange(null);
    setCompletedRange(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Reports"
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
              <span className="hidden md:inline">Create Report</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search reports..."
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
                listMinWidth={260}
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

            {columnVisibility.createdBy !== false && (
              <div className="w-36">
                <Select
                  multiple
                  clearable
                  block
                  pill
                  listMinWidth={160}
                  options={CREATED_BY_OPTIONS}
                  value={createdByFilter}
                  onChange={(opts) => setCreatedByFilter(opts.map((o) => o.value))}
                  placeholder="Created by"
                  variant="outline"
                  size="sm"
                />
              </div>
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
          onRowClick={(row) => router.push(`/reports/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: false,
            createdAt: false,
            templateName: false,
            completedAt: false,
            createdBy: false,
            matchCount: false,
            continuousMonitoring: false,
          }}
        />
      </div>
    </div>
  );
}
