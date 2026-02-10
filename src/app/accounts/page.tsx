"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockAccounts } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Account } from "@/lib/types";

const columns: ColumnDef<Account, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 240,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-soft-bg)] text-xs font-semibold text-[var(--color-primary-soft-text)]">
          {row.original.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Account ID",
    size: 220,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
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

export default function AccountsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Accounts"
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
          data={mockAccounts}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/accounts/${row.id}`)}
          pageSize={10}
        />
      </div>
    </div>
  );
}
