"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";

interface InquiriesTrendChartProps {
  data: TimeSeriesPoint[];
}

export function InquiriesTrendChart({ data }: InquiriesTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="inquiryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
            <stop offset="80%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke={CHART_COLORS.muted}
          strokeDasharray=""
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
          stroke={CHART_COLORS.textMuted}
          fontSize={13}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke={CHART_COLORS.textMuted}
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--color-text)",
          }}
          labelFormatter={(label: string) => {
            const d = new Date(label);
            return d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
        />
        <Area
          type="linear"
          dataKey="value"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          fill="url(#inquiryGradient)"
          name="Inquiries"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
