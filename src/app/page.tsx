"use client";

import { useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { ButtonLink } from "@plexui/ui/components/Button";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, ChartCard } from "@/components/shared";
import { RecentInquiriesTable } from "@/components/shared/RecentInquiriesTable";
import { InquiriesTrendChart } from "@/components/charts/InquiriesTrendChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import {
  mockInquiries,
  generateTimeSeries,
} from "@/lib/data";
import { formatNumber, formatPercent, formatDuration } from "@/lib/utils/format";
import type { StatusDistribution } from "@/lib/types";

type DateRange = [DateTime, DateTime];
type DateRangeShortcut = {
  label: string;
  getDateRange: () => DateRange;
};

const shortcuts: DateRangeShortcut[] = [
  {
    label: "Last 7 days",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ days: 6 }).startOf("day"), today];
    },
  },
  {
    label: "Last 30 days",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ days: 29 }).startOf("day"), today];
    },
  },
  {
    label: "Last 3 months",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ months: 3 }).plus({ days: 1 }).startOf("day"), today];
    },
  },
  {
    label: "All time",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [DateTime.fromISO("2024-01-01"), today];
    },
  },
];

/* ── Seeded pseudo-random (Mulberry32) for stable derived data ── */
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Derive all dashboard data from the number of days in the range */
function deriveMetrics(days: number) {
  // Scale: ~42 inquiries/day base rate
  const dailyRate = 42;
  const totalInquiries = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));
  const approvalRate = 85 + seededRandom(days * 3) * 7; // 85–92%
  const avgCompletionTime = 230 + Math.round(seededRandom(days * 5) * 70); // 230–300s

  // Trends: smaller periods show bigger relative swings
  const trendScale = Math.min(1, 30 / days);
  const inquiriesTrend = (5 + seededRandom(days * 7) * 30) * trendScale;
  const approvalTrend = (0.5 + seededRandom(days * 11) * 5) * trendScale;
  const completionTimeTrend = -(1 + seededRandom(days * 13) * 12) * trendScale;
  const pendingReviewTrend = (-5 + seededRandom(days * 17) * 25) * trendScale;

  return {
    totalInquiries,
    approvalRate: Math.round(approvalRate * 10) / 10,
    avgCompletionTime,
    pendingReview: 23,
    inquiriesTrend: Math.round(inquiriesTrend * 10) / 10,
    approvalTrend: Math.round(approvalTrend * 10) / 10,
    completionTimeTrend: Math.round(completionTimeTrend * 10) / 10,
    pendingReviewTrend: Math.round(pendingReviewTrend * 10) / 10,
  };
}

function deriveStatusDistribution(days: number): StatusDistribution[] {
  const dailyRate = 42;
  const total = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));
  const approvalRate = 85 + seededRandom(days * 3) * 7;
  const declinedRate = 3 + seededRandom(days * 9) * 5;
  const needsReviewRate = 0.2 + seededRandom(days * 15) * 2.5;
  const pendingRate = 1 + seededRandom(days * 19) * 3;
  const expiredRate = 0.5 + seededRandom(days * 23) * 2.5;
  const createdRate = 100 - approvalRate - declinedRate - needsReviewRate - pendingRate - expiredRate;

  const rates = [
    { status: "Approved", rate: approvalRate, color: "#30a46c" },
    { status: "Declined", rate: declinedRate, color: "#e5484d" },
    { status: "Needs Review", rate: needsReviewRate, color: "#f5a623" },
    { status: "Pending", rate: pendingRate, color: "#8b8d98" },
    { status: "Expired", rate: expiredRate, color: "#63646e" },
    { status: "Created", rate: Math.max(0.1, createdRate), color: "#505159" },
  ];

  return rates.map((r) => ({
    status: r.status,
    count: Math.max(1, Math.round((r.rate / 100) * total)),
    percentage: Math.round(r.rate * 10) / 10,
    color: r.color,
  }));
}

function describePeriod(days: number, shortcutLabel?: string): string {
  if (shortcutLabel) return shortcutLabel;
  if (days === 1) return "1 day";
  return `${days} days`;
}

function trendLabel(days: number, shortcutLabel?: string): string {
  if (shortcutLabel === "All time") return "all time";
  if (shortcutLabel === "Last 7 days") return "vs prev 7 days";
  if (shortcutLabel === "Last 30 days") return "vs prev 30 days";
  if (shortcutLabel === "Last 3 months") return "vs prev 3 months";
  if (days === 1) return "vs prev day";
  return `vs prev ${days} days`;
}

// Default range: last 30 days
const defaultRange: DateRange = shortcuts[1].getDateRange();

export default function DashboardHome() {
  const recentInquiries = mockInquiries.slice(0, 10);
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [activeShortcutLabel, setActiveShortcutLabel] = useState<string | undefined>("Last 30 days");

  const handleRangeChange = useCallback(
    (next: DateRange | null, shortcut?: DateRangeShortcut) => {
      setDateRange(next);
      setActiveShortcutLabel(shortcut?.label);
    },
    [],
  );

  const days = useMemo(() => {
    if (!dateRange) return 30;
    // +1 to count both start and end days inclusively
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const metrics = useMemo(() => deriveMetrics(days), [days]);
  const currentTrendLabel = trendLabel(days, activeShortcutLabel);
  const periodDesc = describePeriod(days, activeShortcutLabel);
  const trendData = useMemo(() => generateTimeSeries(days), [days]);
  const statusData = useMemo(() => deriveStatusDistribution(days), [days]);

  return (
    <main className="flex-1">
      <TopBar
        title="Overview"
        actions={
          <DateRangePicker
            value={dateRange}
            onChange={handleRangeChange}
            shortcuts={shortcuts}
            size="md"
            pill={false}
            max={DateTime.local().endOf("day")}
            triggerDateFormat="MM/dd/yy"
          />
        }
      />
      <div className="px-6 pb-6 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Inquiries"
            value={formatNumber(metrics.totalInquiries)}
            trend={{ value: metrics.inquiriesTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Approval Rate"
            value={formatPercent(metrics.approvalRate)}
            trend={{ value: metrics.approvalTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Avg Completion Time"
            value={formatDuration(metrics.avgCompletionTime)}
            trend={{ value: metrics.completionTimeTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Pending Review"
            value={formatNumber(metrics.pendingReview)}
            trend={{ value: metrics.pendingReviewTrend, label: currentTrendLabel }}
          />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Inquiries Trend" description={periodDesc}>
            <InquiriesTrendChart data={trendData} />
          </ChartCard>
          <ChartCard title="Status Distribution" description={periodDesc}>
            <StatusDonutChart data={statusData} />
          </ChartCard>
        </div>

        {/* Recent Inquiries */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading-sm text-[var(--color-text)]">
                Recent Inquiries
              </h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                Last 10 inquiries
              </p>
            </div>
            <ButtonLink href="/inquiries" color="secondary" variant="soft" size="sm" pill={false}>
              View all
            </ButtonLink>
          </div>
          <div className="mt-4">
            <RecentInquiriesTable data={recentInquiries} />
          </div>
        </div>
      </div>
    </main>
  );
}
