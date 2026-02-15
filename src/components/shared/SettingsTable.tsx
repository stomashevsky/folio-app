interface SettingsTableColumn<T> {
  header: string;
  align?: "left" | "right";
  render: (item: T) => React.ReactNode;
}

interface SettingsTableProps<T> {
  columns: SettingsTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  renderMobileCard: (item: T) => React.ReactNode;
}

export function SettingsTable<T>({
  columns,
  data,
  keyExtractor,
  renderMobileCard,
}: SettingsTableProps<T>) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-[var(--color-border)] md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)] ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={`px-4 py-3 ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="rounded-lg border border-[var(--color-border)] p-4"
          >
            {renderMobileCard(item)}
          </div>
        ))}
      </div>
    </>
  );
}
