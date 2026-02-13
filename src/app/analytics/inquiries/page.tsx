"use client";

import React, { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar } from "@/components/layout/TopBar";
import { ChartCard, MetricCard } from "@/components/shared";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { RatesLineChart } from "@/components/charts/RatesLineChart";
import { FunnelSankey, type SankeyMetric } from "@/components/charts/FunnelSankey";
import { FunnelTrendChart } from "@/components/charts/FunnelTrendChart";
import {
  deriveHighlights,
  generateTimeSeries,
  generateRateTimeSeries,
  generateFunnelSteps,
  generateFunnelTimeSeries,
  deriveFunnelHighlights,
  generateSankeyFunnel,
} from "@/lib/data";
import { aggregateVolume, aggregateRates, aggregateFunnelRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRangeShortcut, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Select } from "@plexui/ui/components/Select";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";

const tabs = ["Overview", "Funnel"] as const;
type Tab = (typeof tabs)[number];

const INTERVAL_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const OptionDesc = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-[var(--color-text-secondary)]">
    {children}
  </div>
);

const FUNNEL_METRIC_OPTIONS = [
  { value: "counts", label: "Counts", description: <OptionDesc>Absolute count at each step</OptionDesc> },
  { value: "rates", label: "Rates", description: <OptionDesc>% of created inquiries reaching each step</OptionDesc> },
];

const FUNNEL_METRIC_DESCRIPTIONS: Record<SankeyMetric, string> = {
  counts: "Absolute inquiry counts at each verification step",
  rates: "Percentage of total created inquiries reaching each step",
};

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange(); // Last 30 days

export default function InquiryAnalyticsPage() {
  return (
    <Suspense>
      <InquiryAnalyticsContent />
    </Suspense>
  );
}

function InquiryAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");
  const [funnelMetric, setFunnelMetric] = useState<SankeyMetric>("counts");

  const handleRangeChange = useCallback(
    (next: DateRange | null, _shortcut?: DateRangeShortcut) => {
      setDateRange(next);
    },
    [],
  );

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const highlights = useMemo(() => deriveHighlights(days), [days]);
  const volumeData = useMemo(
    () => aggregateVolume(generateTimeSeries(days), interval),
    [days, interval],
  );
  const ratesData = useMemo(
    () => aggregateRates(generateRateTimeSeries(days), interval),
    [days, interval],
  );

  const funnelSteps = useMemo(() => generateFunnelSteps(days), [days]);
  const funnelHighlights = useMemo(
    () => deriveFunnelHighlights(funnelSteps),
    [funnelSteps],
  );
  const funnelTrendData = useMemo(
    () => aggregateFunnelRates(generateFunnelTimeSeries(days), interval),
    [days, interval],
  );
  const sankeyData = useMemo(() => generateSankeyFunnel(days), [days]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Inquiry Analytics"
        actions={
          <DateRangePicker
            value={dateRange}
            onChange={handleRangeChange}
            shortcuts={DASHBOARD_DATE_SHORTCUTS}
            size="md"
            pill={false}
            max={DateTime.local().endOf("day")}
            triggerDateFormat="MM/dd/yy"
          />
        }
        tabs={
          <Tabs
            value={activeTab}
            onChange={(v) => setActiveTab(v as Tab)}
            variant="underline"
            flush
            aria-label="Analytics views"
            size="lg"
          >
            <Tabs.Tab value="Overview">Overview</Tabs.Tab>
            <Tabs.Tab value="Funnel">Conversion Funnel</Tabs.Tab>
          </Tabs>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        {activeTab === "Overview" && (
          <>
            {/* Highlights */}
            <div>
              <h3 className="heading-sm text-[var(--color-text)] mb-3">Highlights</h3>
              <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
                {highlights.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    description={metric.description}
                    tooltip={metric.tooltip}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

            {/* Interval selector */}
            <div className="mt-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(opt) => {
                    if (opt) setInterval(opt.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill={false}
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            {/* Charts */}
            <div className="mt-3 space-y-4">
              <ChartCard
                title="Inquiry Volume"
                description="Number of verifications created"
              >
                <SimpleBarChart data={volumeData} />
              </ChartCard>

              <ChartCard
                title="Approval & Completion Rates"
                description="Percentage trends over time"
              >
                <RatesLineChart data={ratesData} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "Funnel" && (
          <>
            {/* Funnel Highlights */}
            <div>
              <h3 className="heading-sm text-[var(--color-text)] mb-3">Highlights</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {funnelHighlights.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    description={metric.description}
                    tooltip={metric.tooltip}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

            {/* Main Funnel Chart — Sankey */}
            <div className="mt-6">
              <ChartCard
                title="Verification Flow"
                description={FUNNEL_METRIC_DESCRIPTIONS[funnelMetric]}
                actions={
                  <div className="w-[120px]">
                    <Select
                      options={FUNNEL_METRIC_OPTIONS}
                      value={funnelMetric}
                      onChange={(opt) => {
                        if (opt) setFunnelMetric(opt.value as SankeyMetric);
                      }}
                      size="sm"
                      pill={false}
                      variant="outline"
                      align="end"
                      listMinWidth={340}
                      optionClassName="!font-medium"
                    />
                  </div>
                }
              >
                <FunnelSankey data={sankeyData} metric={funnelMetric} />
              </ChartCard>
            </div>

            {/* Interval selector for trend chart */}
            <div className="mt-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(opt) => {
                    if (opt) setInterval(opt.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill={false}
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            {/* Funnel Trends */}
            <div className="mt-3">
              <ChartCard
                title="Funnel Trends"
                description="Step conversion rates over time"
              >
                <FunnelTrendChart data={funnelTrendData} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
