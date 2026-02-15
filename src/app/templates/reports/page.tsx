"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { useTemplateStore } from "@/lib/stores/template-store";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { ReportTemplate } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Plus } from "@plexui/ui/components/Icon";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { TEMPLATE_STATUS_OPTIONS } from "@/lib/constants/filter-options";
import {
  REPORT_TEMPLATE_COLUMN_CONFIG,
  REPORT_TEMPLATE_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = TEMPLATE_STATUS_OPTIONS;

const TYPE_OPTIONS = Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const COLUMN_CONFIG: ColumnConfig[] = REPORT_TEMPLATE_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = REPORT_TEMPLATE_DEFAULT_VISIBILITY;

const columns: ColumnDef<ReportTemplate, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 280,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Template ID",
    size: 280,
    cell: idCell<ReportTemplate>((r) => r.id),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 200,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {REPORT_TYPE_LABELS[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<ReportTemplate>((r) => r.status),
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated at (UTC)",
    size: 180,
    cell: dateTimeCell<ReportTemplate>((r) => r.updatedAt),
  },
];

export default function ReportTemplatesPage() {
  const router = useRouter();
  const { reportTemplates } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const allTemplates = reportTemplates.getAll();

  const hasActiveFilters = statusFilter.length > 0 || typeFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allTemplates.filter((t) => {
        if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false;
        if (typeFilter.length > 0 && !typeFilter.includes(t.type)) return false;
        return true;
      }),
    [allTemplates, statusFilter, typeFilter],
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setTypeFilter([]);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Report Templates"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button
              color="primary"
              size="md"
              pill={false}
              onClick={() => router.push("/templates/reports/new")}
            >
              <Plus />
              <span className="hidden md:inline">Create Template</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search by template ID or name..."
            />

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

            <div className="w-44">
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
          pageSize={50}
          initialSorting={[{ id: "updatedAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onRowClick={(row) => router.push(`/templates/reports/${row.id}`)}
          mobileColumnVisibility={{
            id: false,
            updatedAt: false,
          }}
        />
      </div>
    </div>
  );
}
