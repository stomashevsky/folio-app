"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { mockReports } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Report } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Plus, Download } from "@plexui/ui/components/Icon";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";

const columns: ColumnDef<Report, unknown>[] = [
  {
    accessorKey: "primaryInput",
    header: "Primary Input",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.primaryInput}</span>
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
];

export default function ReportsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Reports"
        actions={
          <div className="flex items-center gap-2">
            <Button color="secondary" variant="outline" size="md" pill={false}>
              <Download />
              Export
            </Button>
            <Button color="primary" size="md" pill={false}>
              <Plus />
              Create Report
            </Button>
          </div>
        }
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by name or ID..."
          />
        }
      />
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={mockReports}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/reports/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          mobileColumnVisibility={{
            id: false,
            createdAt: false,
          }}
        />
      </div>
    </div>
  );
}
