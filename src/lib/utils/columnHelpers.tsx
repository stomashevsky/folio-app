import type { CellContext } from "@tanstack/react-table";
import { formatDateTime } from "./format";
import { StatusBadge } from "@/components/shared/StatusBadge";

/** Renders a monospace ID cell */
export function idCell<T>(accessor: (row: T) => string) {
  function IdCell({ row }: CellContext<T, unknown>) {
    return (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {accessor(row.original)}
      </span>
    );
  }
  IdCell.displayName = "IdCell";
  return IdCell;
}

/** Renders a formatted datetime cell */
export function dateTimeCell<T>(
  accessor: (row: T) => string | null | undefined,
) {
  function DateTimeCell({ row }: CellContext<T, unknown>) {
    const val = accessor(row.original);
    return (
      <span className="text-[var(--color-text-secondary)]">
        {val ? formatDateTime(val) : "—"}
      </span>
    );
  }
  DateTimeCell.displayName = "DateTimeCell";
  return DateTimeCell;
}

/** Renders a StatusBadge cell */
export function statusCell<T>(accessor: (row: T) => string) {
  function StatusCell({ row }: CellContext<T, unknown>) {
    return <StatusBadge status={accessor(row.original)} />;
  }
  StatusCell.displayName = "StatusCell";
  return StatusCell;
}
