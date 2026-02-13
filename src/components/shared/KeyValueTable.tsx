interface KeyValueRow {
  label: React.ReactNode;
  value: React.ReactNode;
}

interface KeyValueSection {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  rows: KeyValueRow[];
}

interface KeyValueTableProps {
  /** Simple flat rows (no sections) */
  rows?: KeyValueRow[];
  /** Grouped rows with section headers */
  sections?: KeyValueSection[];
  /** Optional title header at the top */
  title?: string;
  /** Label column width class (default: "w-2/5") */
  labelWidth?: string;
  /** When true, skip outer border/rounded wrapper (use inside a parent card) */
  bare?: boolean;
}

export type { KeyValueRow, KeyValueSection };

function SectionHeader({
  title,
  icon,
  subtitle,
}: {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <tr className="border-b border-[var(--color-border)]">
      <td
        colSpan={2}
        className="bg-[var(--color-surface-secondary)] px-4 py-2"
      >
        <span className="inline-flex items-center gap-2">
          {icon && (
            <span className="text-[var(--color-text-tertiary)]">{icon}</span>
          )}
          <span className="heading-xs text-[var(--color-text)]">{title}</span>
        </span>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
            {subtitle}
          </p>
        )}
      </td>
    </tr>
  );
}

function Row({ label, value }: KeyValueRow) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
        {label}
      </td>
      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
        {value}
      </td>
    </tr>
  );
}

export function KeyValueTable({
  rows,
  sections,
  title,
  labelWidth = "w-2/5",
  bare = false,
}: KeyValueTableProps) {
  const content = (
    <>
      {title && (
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <span className="heading-xs text-[var(--color-text)]">{title}</span>
        </div>
      )}
      <table className="w-full table-fixed">
        <colgroup>
          <col className={labelWidth} />
          <col />
        </colgroup>
        <tbody>
          {rows?.map((row, i) => (
            <Row key={i} label={row.label} value={row.value} />
          ))}
          {sections?.map((section) => (
            <SectionRows key={section.title} section={section} />
          ))}
        </tbody>
      </table>
    </>
  );

  if (bare) return content;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {content}
    </div>
  );
}

function SectionRows({ section }: { section: KeyValueSection }) {
  return (
    <>
      <SectionHeader
        title={section.title}
        icon={section.icon}
        subtitle={section.subtitle}
      />
      {section.rows.map((row, i) => (
        <Row key={i} label={row.label} value={row.value} />
      ))}
    </>
  );
}
