"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";

interface SimpleBarChartProps {
  data: TimeSeriesPoint[];
}

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid
          stroke="var(--color-border)"
          strokeDasharray=""
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
          }}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="var(--color-text-tertiary)"
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
          itemStyle={{ color: "var(--color-text)" }}
          labelStyle={{ color: "var(--color-text)" }}
          labelFormatter={(label: string) => {
            const d = new Date(label);
            return d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
          formatter={(value: number) => [value, "Inquiries"]}
          cursor={{ fill: "var(--color-surface-secondary)" }}
        />
        <Bar
          dataKey="value"
          fill={CHART_COLORS.accent}
          radius={[2, 2, 0, 0]}
          maxBarSize={14}
          name="Inquiries"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
