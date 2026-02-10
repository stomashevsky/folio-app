"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockVerifications } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Verification } from "@/lib/types";

const columns: ColumnDef<Verification, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium capitalize">
        {row.original.type.replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Verification ID",
    size: 220,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
  },
  {
    accessorKey: "inquiryId",
    header: "Inquiry ID",
    size: 220,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.inquiryId)}
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

export default function VerificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Verifications"
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by type or ID..."
          />
        }
      />
      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <DataTable
          data={mockVerifications}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/verifications/${row.id}`)}
          pageSize={10}
        />
      </div>
    </div>
  );
}
