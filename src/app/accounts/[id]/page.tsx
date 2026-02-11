"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard } from "@/components/shared";
import { mockAccounts, mockInquiries, mockVerifications, mockReports } from "@/lib/data";
import { formatDateTime, formatDate, truncateId } from "@/lib/utils/format";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import {
  User,
  FileSearch,
  ShieldCheck,
  FileText,
} from "lucide-react";

const tabs = ["Overview", "Inquiries", "Verifications", "Reports"] as const;
type Tab = (typeof tabs)[number];

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const account = mockAccounts.find((a) => a.id === params.id);
  const accountInquiries = mockInquiries.filter(
    (i) => i.accountId === account?.id
  );
  const accountVerifications = mockVerifications.filter((v) =>
    accountInquiries.some((i) => i.id === v.inquiryId)
  );
  const accountReports = mockReports.filter(
    (r) => r.accountId === account?.id
  );

  if (!account) {
    return (
      <main className="flex-1">
        <TopBar title="Account Not Found" />
        <div className="px-6 pb-6 pt-6">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-[var(--color-text-secondary)]">
              The account you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              color="primary"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/accounts")}
            >
              Back to Accounts
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <TopBar
        title={account.name}
        description={truncateId(account.id)}
        backHref="/accounts"
      />
      <div className="px-6 pb-6 pt-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-soft-bg)]">
            <User className="h-8 w-8 text-[var(--color-primary-soft-text)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {account.name}
            </h2>
            <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
              {account.id}
            </p>
            {account.address && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {account.address}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={account.status} />
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {account.inquiryCount}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Inquiries
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {account.verificationCount}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Verifications
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {account.reportCount}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-[var(--color-border)]">
          {tabs.map((tab) => {
            const count =
              tab === "Inquiries"
                ? accountInquiries.length
                : tab === "Verifications"
                  ? accountVerifications.length
                  : tab === "Reports"
                    ? accountReports.length
                    : null;
            return (
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
                {count !== null && (
                  <span className="ml-1.5 text-xs text-[var(--color-text-tertiary)]">
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="Profile">
                <div className="space-y-3">
                  {[
                    ["Account ID", account.id],
                    ["Reference ID", account.referenceId ?? "—"],
                    ["Type", account.type],
                    ["Birthdate", account.birthdate ? formatDate(account.birthdate) : "—"],
                    ["Age", account.age ? `${account.age} years` : "—"],
                    ["Address", account.address ?? "—"],
                    ["Created At", formatDateTime(account.createdAt)],
                    ["Updated At", formatDateTime(account.updatedAt)],
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

              <ChartCard title="Activity Summary">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-secondary)] p-3">
                    <FileSearch className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {accountInquiries.length} Inquiries
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {accountInquiries.filter((i) => i.status === "approved")
                          .length}{" "}
                        approved
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-secondary)] p-3">
                    <ShieldCheck className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {accountVerifications.length} Verifications
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {accountVerifications.filter(
                          (v) => v.status === "passed"
                        ).length}{" "}
                        passed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-secondary)] p-3">
                    <FileText className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {accountReports.length} Reports
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {accountReports.filter(
                          (r) => r.status === "no_matches"
                        ).length}{" "}
                        clean
                      </p>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          )}

          {activeTab === "Inquiries" && (
            <div className="space-y-3">
              {accountInquiries.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No inquiries for this account.
                </p>
              ) : (
                accountInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-surface-secondary)]"
                    onClick={() => router.push(`/inquiries/${inq.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {inq.templateName}
                      </p>
                      <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
                        {truncateId(inq.id)} · {formatDateTime(inq.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={inq.status} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Verifications" && (
            <div className="space-y-3">
              {accountVerifications.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No verifications for this account.
                </p>
              ) : (
                accountVerifications.map((v) => (
                  <div
                    key={v.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-surface-secondary)]"
                    onClick={() => router.push(`/verifications/${v.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium capitalize text-[var(--color-text)]">
                        {v.type.replace("_", " ")} Verification
                      </p>
                      <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
                        {truncateId(v.id)} · {formatDateTime(v.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="space-y-3">
              {accountReports.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No reports for this account.
                </p>
              ) : (
                accountReports.map((r) => (
                  <div
                    key={r.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-surface-secondary)]"
                    onClick={() => router.push(`/reports/${r.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {r.templateName}
                      </p>
                      <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
                        {truncateId(r.id)} · {formatDateTime(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
