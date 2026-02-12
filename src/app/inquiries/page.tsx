"use client";

import { useState, useMemo } from "react";
import { DateTime } from "luxon";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockInquiries } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
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
import { Download } from "lucide-react";

// ─── Filter options ───

const STATUS_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "expired", label: "Expired" },
  { value: "declined", label: "Declined" },
];

const TEMPLATE_OPTIONS = [
  { value: "KYC + AML: GovID + Selfie", label: "KYC + AML: GovID + Selfie" },
  { value: "KYC: GovID Only", label: "KYC: GovID Only" },
];

const TAG_OPTIONS = Array.from(
  new Set(mockInquiries.flatMap((inq) => inq.tags))
)
  .filter(Boolean)
  .sort()
  .map((tag) => ({ value: tag, label: tag }));

const DATE_SHORTCUTS = [
  {
    label: "Today",
    getDateRange: (): DateRange => {
      const today = DateTime.local();
      return [today.startOf("day"), today.endOf("day")];
    },
  },
  {
    label: "Last 7 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 6 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
  {
    label: "Last 30 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 29 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
  {
    label: "Last 90 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 89 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
];

// ─── Column config for ColumnSettings panel ───

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "accountName", label: "Name" },
  { id: "id", label: "Inquiry ID" },
  { id: "templateName", label: "Template" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "referenceId", label: "Reference ID" },
  { id: "completedAt", label: "Completed at" },
  { id: "tags", label: "Tags" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  accountName: true,
  id: true,
  templateName: true,
  createdAt: true,
  status: true,
  referenceId: false,
  completedAt: false,
  tags: false,
};

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
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
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
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.completedAt
          ? formatDateTime(row.original.completedAt)
          : "—"}
      </span>
    ),
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
              size="sm"
              pill={false}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button color="primary" size="sm" pill={false}>
              <Plus />
              Create Inquiry
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
            <Select
              multiple
              clearable
              block={false}
              pill
              listMinWidth={180}
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
              placeholder="Status"
              variant="outline"
              size="sm"
            />

            {/* ── Template filter ── */}
            <Select
              multiple
              clearable
              block={false}
              pill
              options={TEMPLATE_OPTIONS}
              value={templateFilter}
              onChange={(opts) => setTemplateFilter(opts.map((o) => o.value))}
              placeholder="Template"
              variant="outline"
              size="sm"
            />

            {/* ── Date filter ── */}
            <DateRangePicker
              clearable
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              shortcuts={DATE_SHORTCUTS}
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
                shortcuts={DATE_SHORTCUTS}
                placeholder="Completed at"
                variant="outline"
                size="sm"
                pill
              />
            )}

            {columnVisibility.tags !== false && (
              <Select
                multiple
                clearable
                block={false}
                pill
                listMinWidth={180}
                options={TAG_OPTIONS}
                value={tagFilter}
                onChange={(opts) => setTagFilter(opts.map((o) => o.value))}
                placeholder="Tags"
                variant="outline"
                size="sm"
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

      <div className="flex min-h-0 flex-1 flex-col px-6 pt-2">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/inquiries/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>
    </div>
  );
}
