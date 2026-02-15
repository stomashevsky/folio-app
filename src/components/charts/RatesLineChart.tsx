"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RateTimeSeriesPoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";

interface RatesLineChartProps {
  data: RateTimeSeriesPoint[];
}

export function RatesLineChart({ data }: RatesLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
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
          formatter={(value: number) => [`${value}%`]}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "13px", color: "var(--color-text-secondary)" }}
        />
        <Line
          type="monotone"
          dataKey="completionRate"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Completion Rate"
        />
        <Line
          type="monotone"
          dataKey="approvalRate"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Approval Rate"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
