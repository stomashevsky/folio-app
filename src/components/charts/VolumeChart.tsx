"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VolumeTimeSeriesPoint } from "@/lib/types";

interface VolumeChartProps {
  data: VolumeTimeSeriesPoint[];
  volumeLabel: string;
  rateLabel: string;
  rateSublabel?: string;
}

export function VolumeChart({
  data,
  volumeLabel,
  rateLabel,
  rateSublabel,
}: VolumeChartProps) {
  return (
    <div className="flex gap-6">
      {/* Chart area */}
      <div className="flex-1 min-w-0">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--color-border)"
              strokeDasharray=""
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return d.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                });
              }}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            {/* Left Y-axis: volume count */}
            <YAxis
              yAxisId="volume"
              orientation="left"
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            {/* Right Y-axis: rate percentage */}
            <YAxis
              yAxisId="rate"
              orientation="right"
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
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
              labelFormatter={(label: string) => {
                const d = new Date(label);
                return d.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              formatter={(value: number, name: string) => {
                if (name === "rate") return [`${value}%`, rateLabel];
                return [value.toLocaleString(), volumeLabel];
              }}
            />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#b8e0ff"
              radius={[2, 2, 0, 0]}
              barSize={14}
              name="volume"
            />
            <Line
              yAxisId="rate"
              dataKey="rate"
              stroke="#3451b2"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3451b2", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#3451b2", strokeWidth: 0 }}
              name="rate"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="mt-1 text-center text-xs text-[var(--color-text-tertiary)]">
          Inquiry created date
        </p>
      </div>

      {/* Legend (right side like Persona) */}
      <div className="w-44 shrink-0 space-y-4 pt-2">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">Volume</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#b8e0ff]" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {volumeLabel}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">Rate</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3451b2]" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {rateLabel}
            </span>
          </div>
          {rateSublabel && (
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-text-tertiary)] opacity-40" />
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {rateSublabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
