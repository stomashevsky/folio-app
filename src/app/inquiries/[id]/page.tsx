"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard } from "@/components/shared";
import { mockInquiries } from "@/lib/data";
import { mockVerifications } from "@/lib/data";
import {
  formatDateTime,
  formatDuration,
  truncateId,
} from "@/lib/utils/format";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import {
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Check } from "@/lib/types";

const tabs = ["Overview", "Verifications", "Signals"] as const;
type Tab = (typeof tabs)[number];

function CheckRow({ check }: { check: Check }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[var(--color-surface-secondary)]">
      <div className="flex items-center gap-2">
        {check.status === "passed" ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--color-success-soft-text)]" />
        ) : check.status === "failed" ? (
          <XCircle className="h-4 w-4 text-[var(--color-danger-soft-text)]" />
        ) : (
          <div className="h-4 w-4 rounded-full bg-[var(--color-surface-secondary)]" />
        )}
        <span className="text-sm text-[var(--color-text)]">{check.name}</span>
        {check.required && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Required
          </span>
        )}
      </div>
      <span className="text-xs capitalize text-[var(--color-text-secondary)]">
        {check.category.replace("_", " ")}
      </span>
    </div>
  );
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const inquiry = mockInquiries.find((i) => i.id === params.id);
  const verifications = mockVerifications.filter(
    (v) => v.inquiryId === inquiry?.id
  );

  if (!inquiry) {
    return (
      <main className="flex-1">
        <TopBar title="Inquiry Not Found" />
        <div className="px-6 pb-6 pt-6">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-[var(--color-text-secondary)]">
              The inquiry you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              color="primary"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/inquiries")}
            >
              Back to Inquiries
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <TopBar
        title={inquiry.accountName}
        description={truncateId(inquiry.id)}
        backHref="/inquiries"
      />
      <div className="px-6 pb-6 pt-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Status
            </span>
            <div className="mt-2">
              <StatusBadge status={inquiry.status} />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Time to Finish
            </span>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              {inquiry.timeToFinish
                ? formatDuration(inquiry.timeToFinish)
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Verifications
            </span>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              GovID: {inquiry.verificationAttempts.governmentId} / Selfie:{" "}
              {inquiry.verificationAttempts.selfie}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              List Matches
            </span>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              {inquiry.listMatches}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-[var(--color-border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[var(--color-primary-solid-bg)] text-[var(--color-text)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab}
              {tab === "Verifications" && verifications.length > 0 && (
                <span className="ml-1.5 text-xs text-[var(--color-text-tertiary)]">
                  ({verifications.length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="Inquiry Details">
                <div className="space-y-3">
                  {[
                    ["Inquiry ID", inquiry.id],
                    ["Account ID", inquiry.accountId],
                    ["Template", inquiry.templateName],
                    ["Created At", formatDateTime(inquiry.createdAt)],
                    [
                      "Completed At",
                      inquiry.completedAt
                        ? formatDateTime(inquiry.completedAt)
                        : "—",
                    ],
                    [
                      "Tags",
                      inquiry.tags.length > 0 ? inquiry.tags.join(", ") : "—",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between"
                    >
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

              <ChartCard title="Linked Account">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft-bg)]">
                    <User className="h-6 w-6 text-[var(--color-primary-soft-text)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {inquiry.accountName}
                    </p>
                    <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
                      {truncateId(inquiry.accountId)}
                    </p>
                  </div>
                </div>
              </ChartCard>
            </div>
          )}

          {activeTab === "Verifications" && (
            <div className="space-y-4">
              {verifications.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No verifications linked to this inquiry.
                </p>
              ) : (
                verifications.map((v) => (
                  <ChartCard
                    key={v.id}
                    title={`${v.type
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) =>
                        c.toUpperCase()
                      )} Verification`}
                    description={truncateId(v.id)}
                    actions={<StatusBadge status={v.status} />}
                  >
                    <div className="space-y-1">
                      {v.checks.map((check, i) => (
                        <CheckRow key={i} check={check} />
                      ))}
                    </div>
                  </ChartCard>
                ))
              )}
            </div>
          )}

          {activeTab === "Signals" && (
            <ChartCard
              title="Behavioral Signals"
              description="Risk signals from this inquiry"
            >
              <p className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                Signal data will be available when connected to a live API.
              </p>
            </ChartCard>
          )}
        </div>
      </div>
    </main>
  );
}
