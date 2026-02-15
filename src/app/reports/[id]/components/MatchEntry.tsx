import { Badge } from "@plexui/ui/components/Badge";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";
import { toTitleCase } from "@/lib/utils/format";
import type { ReportMatch } from "@/lib/types";

type BadgeColor =
  | "danger"
  | "warning"
  | "secondary"
  | "success"
  | "info"
  | "discovery"
  | "caution";

const matchTypeColors: Record<string, BadgeColor> = {
  exact: "danger",
  partial: "warning",
  fuzzy: "secondary",
};

const matchStatusLabels: Record<string, string> = {
  pending_review: "Pending Review",
  confirmed: "Confirmed",
  dismissed: "Dismissed",
};

const matchStatusColors: Record<string, BadgeColor> = {
  pending_review: "warning",
  confirmed: "danger",
  dismissed: "secondary",
};

function getScoreColor(score: number): BadgeColor {
  if (score >= 85) return "danger";
  if (score >= 70) return "warning";
  return "secondary";
}

const thClass =
  "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

function MatchRow({ match }: { match: ReportMatch }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-secondary)]">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {toTitleCase(match.name)}
          </p>
          {match.aliases && match.aliases.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-[var(--color-text-tertiary)]">
              aka {match.aliases.map((a) => toTitleCase(a)).join(", ")}
            </p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text)]">
        {match.source}
      </td>
      <td className="px-4 py-3">
        <Badge color={getScoreColor(match.score)} size="sm">
          {match.score}%
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text)]">
        {match.country ?? "—"}
      </td>
      <td className="px-4 py-3">
        <Badge
          color={matchTypeColors[match.matchType] ?? "secondary"}
          size="sm"
        >
          {match.matchType.charAt(0).toUpperCase() + match.matchType.slice(1)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge
          color={matchStatusColors[match.status] ?? "secondary"}
          size="sm"
          variant="outline"
        >
          {matchStatusLabels[match.status] ?? match.status}
        </Badge>
      </td>
    </tr>
  );
}

export function MatchTable({ matches }: { matches: ReportMatch[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[25%]" />
          <col className="w-[22%]" />
          <col className="w-[90px]" />
          <col className="w-[12%]" />
          <col className="w-[100px]" />
          <col className="w-[130px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className={thClass}>
              <span className="inline-flex items-center gap-1">
                Matched Name
                <Tooltip
                  content="Name or alias found in the screening database that matches the report subject"
                  side="top"
                  maxWidth={260}
                >
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className={thClass}>Source</th>
            <th className={thClass}>
              <span className="inline-flex items-center gap-1">
                Score
                <Tooltip
                  content="Match confidence score (0–100%). Higher scores indicate a stronger match."
                  side="top"
                  maxWidth={260}
                >
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className={thClass}>Country</th>
            <th className={thClass}>Type</th>
            <th className={thClass}>Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
