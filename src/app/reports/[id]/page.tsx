"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard } from "@/components/shared";
import { mockReports } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Eye, Shield } from "lucide-react";

const typeLabels: Record<string, string> = {
  watchlist: "🌐 Watchlist Report",
  pep: "🏛️ Politically Exposed Person",
  adverse_media: "📰 Adverse Media",
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();

  const report = mockReports.find((r) => r.id === params.id);

  if (!report) {
    return (
      <main className="flex-1">
        <TopBar title="Report Not Found" />
        <div className="px-6 pb-6 pt-6">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-[var(--color-text-secondary)]">
              The report you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              color="primary"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/reports")}
            >
              Back to Reports
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <TopBar
        title={report.primaryInput}
        description={typeLabels[report.type] ?? report.type}
        backHref="/reports"
      />
      <div className="px-6 pb-6 pt-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Status
            </span>
            <div className="mt-2">
              <StatusBadge status={report.status} />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Matches
            </span>
            <p className={`mt-2 text-lg font-semibold ${report.matchCount > 0 ? "text-[var(--color-danger-soft-text)]" : "text-[var(--color-success-soft-text)]"}`}>
              {report.matchCount}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Continuous Monitoring
            </span>
            <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
              {report.continuousMonitoring ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Created By
            </span>
            <p className="mt-2 text-sm font-medium capitalize text-[var(--color-text)]">
              {report.createdBy}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Report Details">
            <div className="space-y-3">
              {[
                ["Report ID", report.id],
                ["Type", typeLabels[report.type] ?? report.type],
                ["Primary Input", report.primaryInput],
                ["Template", report.templateName],
                ["Created At", formatDateTime(report.createdAt)],
                [
                  "Completed At",
                  report.completedAt
                    ? formatDateTime(report.completedAt)
                    : "—",
                ],
                ["Inquiry ID", report.inquiryId ? truncateId(report.inquiryId) : "—"],
                ["Account ID", report.accountId ? truncateId(report.accountId) : "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between">
                  <span className="text-sm text-[var(--color-text-tertiary)]">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text)] text-right max-w-[60%] font-mono">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Screening Results">
            {report.matchCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Shield className="h-10 w-10 text-[var(--color-success-soft-text)]" />
                <p className="mt-3 text-sm font-medium text-[var(--color-text)]">
                  No matches found
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  The subject was screened against all available databases.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Eye className="h-10 w-10 text-[var(--color-danger-soft-text)]" />
                <p className="mt-3 text-sm font-medium text-[var(--color-text)]">
                  {report.matchCount} match{report.matchCount > 1 ? "es" : ""}{" "}
                  found
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  Review required. Match details available via API.
                </p>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </main>
  );
}
