"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { mockVerifications } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
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
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={mockVerifications}
          columns={columns}
          globalFilter={search}
          onRowClick={(row) => router.push(`/verifications/${row.id}`)}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          mobileColumnVisibility={{
            id: false,
            inquiryId: false,
          }}
        />
      </div>
    </div>
  );
}
