"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusDistribution } from "@/lib/types";

interface StatusDonutChartProps {
  data: StatusDistribution[];
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex items-center gap-8">
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "13px",
              color: "var(--color-text)",
            }}
            formatter={(value: number, name: string) => {
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
              return [`${value.toLocaleString()} (${pct}%)`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {data.map((entry) => (
          <div key={entry.status} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {entry.status}
            </span>
            <span className="text-sm font-medium text-[var(--color-text)]">
              {entry.count.toLocaleString()}
            </span>
            <span className="text-sm text-[var(--color-text-tertiary)]">
              ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
