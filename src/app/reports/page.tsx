"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockReports } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Report } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Plus, Download } from "lucide-react";

const typeLabels: Record<string, string> = {
  watchlist: "🌐 Watchlist Report",
  pep: "🏛️ Politically Exposed Person",
  adverse_media: "📰 Adverse Media",
};

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
        {typeLabels[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Report ID",
    size: 220,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
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
            <Button color="secondary" variant="outline" size="sm" pill={false}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button color="primary" size="sm" pill={false}>
              <Plus className="h-4 w-4" />
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
      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <DataTable
          data={mockReports}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/reports/${row.id}`)}
          pageSize={10}
        />
      </div>
    </div>
  );
}
