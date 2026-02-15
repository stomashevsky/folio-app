"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, InfoRow, SectionHeading, TagEditModal } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ShieldCheck, ExclamationMarkCircleFilled } from "@plexui/ui/components/Icon";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { mockReports, mockInquiries } from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";

export default function ReportDetailPage() {
  return (
    <Suspense fallback={null}>
      <ReportDetailContent />
    </Suspense>
  );
}

function ReportDetailContent() {
  const params = useParams();
  const report = mockReports.find((r) => r.id === params.id);
  const [tags, setTags] = useState<string[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = useMemo(
    () =>
      Array.from(new Set(mockInquiries.flatMap((i) => i.tags)))
        .filter(Boolean)
        .sort(),
    [],
  );

  if (!report) {
    return <NotFoundPage section="Reports" backHref="/reports" entity="Report" />;
  }

  const reportType = REPORT_TYPE_LABELS[report.type] ?? report.type;

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Report"
        backHref="/reports"
        actions={
          <Button color="secondary" variant="outline" size="md" pill={false}>
            <DotsHorizontal />
            <span className="hidden md:inline">More</span>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="heading-sm text-[var(--color-text)]">Screening results</h2>
              <div className="mt-4">
                {report.matchCount === 0 ? (
                  <EmptyMessage fill="none">
                    <EmptyMessage.Icon size="sm">
                      <ShieldCheck />
                    </EmptyMessage.Icon>
                    <EmptyMessage.Title>No matches found</EmptyMessage.Title>
                    <EmptyMessage.Description>
                      The subject was screened against all available databases.
                    </EmptyMessage.Description>
                  </EmptyMessage>
                ) : (
                  <EmptyMessage fill="none">
                    <EmptyMessage.Icon size="sm" color="danger">
                      <ExclamationMarkCircleFilled />
                    </EmptyMessage.Icon>
                    <EmptyMessage.Title color="danger">
                      {report.matchCount} match{report.matchCount > 1 ? "es" : ""} found
                    </EmptyMessage.Title>
                    <EmptyMessage.Description>
                      Review required. Match details available via API.
                    </EmptyMessage.Description>
                  </EmptyMessage>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Report ID" copyValue={report.id} mono>
                {report.id}
              </InfoRow>
              <InfoRow label="Type">{reportType}</InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={report.status} />
              </InfoRow>
              <InfoRow label="Primary Input">{report.primaryInput}</InfoRow>
              <InfoRow label="Template">{report.templateName}</InfoRow>
              <InfoRow label="Created By">
                <span className="capitalize">{report.createdBy}</span>
              </InfoRow>
              <InfoRow label="Created At">{formatDateTime(report.createdAt)} UTC</InfoRow>
              <InfoRow label="Completed At">
                {report.completedAt ? (
                  `${formatDateTime(report.completedAt)} UTC`
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">&mdash;</span>
                )}
              </InfoRow>
              <InfoRow label="Inquiry ID" copyValue={report.inquiryId} mono>
                {report.inquiryId ? (
                  <Link
                    href={`/inquiries/${report.inquiryId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {report.inquiryId}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">&mdash;</span>
                )}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={report.accountId} mono>
                {report.accountId ? (
                  <Link
                    href={`/accounts/${report.accountId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {report.accountId}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">&mdash;</span>
                )}
              </InfoRow>
              <InfoRow label="Continuous Monitoring">
                {report.continuousMonitoring ? "Enabled" : "Disabled"}
              </InfoRow>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <SectionHeading
              action={
                <Button
                  color="secondary"
                  variant="ghost"
                  size="sm"
                  pill={false}
                  onClick={() => setTagModalOpen(true)}
                >
                  {tags.length > 0 ? (
                    "Edit"
                  ) : (
                    <>
                      <Plus />
                      <span>Add tag</span>
                    </>
                  )}
                </Button>
              }
            >
              Tags
            </SectionHeading>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} color="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TagEditModal
        open={tagModalOpen}
        onOpenChange={setTagModalOpen}
        tags={tags}
        onSave={setTags}
        allTags={allKnownTags}
      />
    </div>
  );
}
