"use client";

import { ArrowUpSm, ArrowDownSm, InfoCircle } from "@plexui/ui/components/Icon";
import { Tooltip } from "@plexui/ui/components/Tooltip";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  tooltip?: string;
  description?: string;
  variant?: "default" | "compact";
}

export function MetricCard({
  label,
  value,
  trend,
  tooltip,
  description,
  variant = "default",
}: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  if (variant === "compact") {
    return (
      <div className="h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="flex items-center gap-1">
          <p className="text-xs whitespace-nowrap text-[var(--color-text-secondary)]">{label}</p>
          {tooltip && (
            <Tooltip content={tooltip}>
              <InfoCircle className="h-3.5 w-3.5 shrink-0 cursor-help text-[var(--color-text-tertiary)]" />
            </Tooltip>
          )}
        </div>
        <p className="mt-1.5 heading-md text-[var(--color-text)]">{value}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {/* Top row: label + trend badge */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
         {trend && (
           <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
             {isPositive ? (
               <ArrowUpSm className="h-3 w-3" />
             ) : (
               <ArrowDownSm className="h-3 w-3" />
             )}
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Value */}
      <p className="mt-3 heading-xl text-[var(--color-text)]">{value}</p>

      {/* Bottom row: description + trend label */}
      {(description || trend?.label) && (
        <div className="mt-2">
          {description && (
            <p className="text-sm text-[var(--color-text)]">{description}</p>
          )}
          {trend?.label && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {trend.label}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
