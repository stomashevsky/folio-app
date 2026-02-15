import { Badge } from "@plexui/ui/components/Badge";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";
import { checkDescriptions } from "@/lib/data/check-descriptions";
import { CHECK_CATEGORY_LABELS, CHECK_CATEGORY_DESCRIPTIONS } from "@/lib/constants/check-category-labels";
import type { Check } from "@/lib/types";

export function CheckRow({ check }: { check: Check }) {
  const desc = checkDescriptions[check.name];
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
        <span className="inline-flex items-center gap-1.5">
          {check.name}
          {desc && (
            <Tooltip content={desc} side="top" maxWidth={260}>
              <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                <InfoCircle style={{ width: 14, height: 14 }} />
              </span>
            </Tooltip>
          )}
        </span>
      </td>
      <td className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)]">
        <Tooltip content={CHECK_CATEGORY_DESCRIPTIONS[check.category]} side="top" maxWidth={280}>
          <span className="cursor-help border-b border-dashed border-[var(--color-border)]">
            {CHECK_CATEGORY_LABELS[check.category]}
          </span>
        </Tooltip>
      </td>
      <td className="px-4 py-2.5 text-center text-sm text-[var(--color-text-tertiary)]">
        {check.required && "✓"}
      </td>
      <td className="px-4 py-2.5">
        {check.status === "passed" ? (
          <Badge color="success" size="sm">Passed</Badge>
        ) : check.status === "failed" ? (
          <Badge color="danger" size="sm">Failed</Badge>
        ) : (
          <Badge color="secondary" size="sm">N/A</Badge>
        )}
      </td>
    </tr>
  );
}
