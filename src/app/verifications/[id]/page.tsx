"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard } from "@/components/shared";
import { mockVerifications } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import {
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Check } from "@/lib/types";

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

export default function VerificationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const verification = mockVerifications.find((v) => v.id === params.id);

  if (!verification) {
    return (
      <main className="flex-1">
        <TopBar title="Verification Not Found" />
        <div className="px-6 pb-6 pt-6">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-[var(--color-text-secondary)]">
              The verification you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              color="primary"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/verifications")}
            >
              Back to Verifications
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const requiredChecks = verification.checks.filter((c) => c.required);
  const optionalChecks = verification.checks.filter((c) => !c.required);
  const passedCount = verification.checks.filter(
    (c) => c.status === "passed"
  ).length;
  const failedCount = verification.checks.filter(
    (c) => c.status === "failed"
  ).length;

  return (
    <main className="flex-1">
      <TopBar
        title={`${verification.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} Verification`}
        description={truncateId(verification.id)}
        backHref="/verifications"
      />
      <div className="px-6 pb-6 pt-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Status
            </span>
            <div className="mt-2">
              <StatusBadge status={verification.status} />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Created At
            </span>
            <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
              {formatDateTime(verification.createdAt)}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Checks Passed
            </span>
            <p className="mt-2 text-lg font-semibold text-[var(--color-success-soft-text)]">
              {passedCount}{" "}
              <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                / {verification.checks.length}
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Checks Failed
            </span>
            <p className={`mt-2 text-lg font-semibold ${failedCount > 0 ? "text-[var(--color-danger-soft-text)]" : "text-[var(--color-text)]"}`}>
              {failedCount}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Verification Details">
            <div className="space-y-3">
              {[
                ["Verification ID", verification.id],
                ["Inquiry ID", verification.inquiryId],
                ["Type", verification.type.replace("_", " ")],
                ["Created At", formatDateTime(verification.createdAt)],
                [
                  "Completed At",
                  verification.completedAt
                    ? formatDateTime(verification.completedAt)
                    : "—",
                ],
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

          {verification.extractedData &&
            Object.keys(verification.extractedData).length > 0 && (
              <ChartCard title="Extracted Data">
                <div className="space-y-3">
                  {Object.entries(verification.extractedData).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between"
                      >
                        <span className="text-sm text-[var(--color-text-tertiary)] capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-medium text-[var(--color-text)] text-right max-w-[60%]">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </ChartCard>
            )}
        </div>

        {/* Checks */}
        <div className="mt-6 space-y-4">
          {requiredChecks.length > 0 && (
            <ChartCard
              title="Required Checks"
              description={`${requiredChecks.filter((c) => c.status === "passed").length} of ${requiredChecks.length} passed`}
            >
              <div className="space-y-1">
                {requiredChecks.map((check, i) => (
                  <CheckRow key={i} check={check} />
                ))}
              </div>
            </ChartCard>
          )}

          {optionalChecks.length > 0 && (
            <ChartCard
              title="Optional Checks"
              description={`${optionalChecks.filter((c) => c.status === "passed").length} of ${optionalChecks.length} passed`}
            >
              <div className="space-y-1">
                {optionalChecks.map((check, i) => (
                  <CheckRow key={i} check={check} />
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </main>
  );
}
