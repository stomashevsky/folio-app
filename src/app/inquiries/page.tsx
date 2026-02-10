"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockInquiries } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Inquiry } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Plus, Download } from "lucide-react";

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
];

export default function InquiriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Inquiries"
        actions={
          <div className="flex items-center gap-2">
            <Button color="secondary" variant="outline" size="sm" pill={false}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button color="primary" size="sm" pill={false}>
              <Plus className="h-4 w-4" />
              Create Inquiry
            </Button>
          </div>
        }
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by name, ID, or template..."
          />
        }
      />
      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <DataTable
          data={mockInquiries}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/inquiries/${row.id}`)}
          pageSize={10}
        />
      </div>
    </div>
  );
}
