"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockInquiries } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { applyInquiryFilters } from "@/lib/utils/filters";
import { useRouter } from "next/navigation";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Inquiry } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import {
  DateRangePicker,
  type DateRange,
} from "@plexui/ui/components/DateRangePicker";
import { Plus } from "@plexui/ui/components/Icon";
import { Download } from "@plexui/ui/components/Icon";
import { LIST_PAGE_DATE_SHORTCUTS } from "@/lib/constants/date-shortcuts";
import {
  INQUIRY_STATUS_OPTIONS,
  INQUIRY_TEMPLATE_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  INQUIRY_COLUMN_CONFIG,
  INQUIRY_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = INQUIRY_STATUS_OPTIONS;
const TEMPLATE_OPTIONS = INQUIRY_TEMPLATE_OPTIONS;

const TAG_OPTIONS = Array.from(
  new Set(mockInquiries.flatMap((inq) => inq.tags))
)
  .filter(Boolean)
  .sort()
  .map((tag) => ({ value: tag, label: tag }));

const COLUMN_CONFIG: ColumnConfig[] = INQUIRY_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = INQUIRY_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Inquiry, unknown>[] = [
  {
    accessorKey: "accountName",
    header: "Name",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.accountName}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Inquiry ID",
    size: 220,
    cell: idCell<Inquiry>((r) => r.id),
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
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Inquiry>((r) => r.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Inquiry>((r) => r.status),
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
    accessorKey: "completedAt",
    header: "Completed at (UTC)",
    size: 180,
    cell: dateTimeCell<Inquiry>((r) => r.completedAt),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) =>
      row.original.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((tag) => (
            <Badge key={tag} color="secondary" variant="soft">
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-[var(--color-text-tertiary)]">—</span>
      ),
  },
];

// ─── Page ───

export default function InquiriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [templateFilter, setTemplateFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [completedRange, setCompletedRange] = useState<DateRange | null>(null);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters =
    statusFilter.length > 0 ||
    templateFilter.length > 0 ||
    tagFilter.length > 0 ||
    !!dateRange ||
    !!completedRange;

  const filteredData = useMemo(
    () =>
      applyInquiryFilters(mockInquiries, {
        statuses: statusFilter,
        templates: templateFilter,
        tags: tagFilter,
        dateFrom: dateRange ? dateRange[0] : null,
        dateTo: dateRange ? dateRange[1] : null,
        completedFrom: completedRange ? completedRange[0] : null,
        completedTo: completedRange ? completedRange[1] : null,
      }),
    [statusFilter, templateFilter, tagFilter, dateRange, completedRange]
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setTemplateFilter([]);
    setTagFilter([]);
    setDateRange(null);
    setCompletedRange(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Inquiries"
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
              <span className="hidden md:inline">Create Inquiry</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search inquiries..."
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

            {/* ── Template filter ── */}
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={220}
                options={TEMPLATE_OPTIONS}
                value={templateFilter}
                onChange={(opts) => setTemplateFilter(opts.map((o) => o.value))}
                placeholder="Template"
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

            {columnVisibility.tags !== false && (
              <div className="w-36">
                <Select
                  multiple
                  clearable
                  block
                  pill
                  listMinWidth={180}
                  options={TAG_OPTIONS}
                  value={tagFilter}
                  onChange={(opts) => setTagFilter(opts.map((o) => o.value))}
                  placeholder="Tags"
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
          onRowClick={(row) => router.push(`/inquiries/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: false,
            templateName: false,
            referenceId: false,
            completedAt: false,
            tags: false,
          }}
        />
      </div>
    </div>
  );
}
