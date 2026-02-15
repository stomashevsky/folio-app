"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, InlineEmpty, EventTimeline, TagEditModal, SectionHeading, InfoRow } from "@/components/shared";
import {
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForInquiry,
  getSessionsForInquiry,
  getSignalsForInquiry,
  getBehavioralRiskForInquiry,
} from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Eye, DotsHorizontal } from "@plexui/ui/components/Icon";
import {
  OverviewTab,
  VerificationsTab,
  SessionsTab,
  SignalsTab,
  ReportsTab,
} from "./components";

const tabs = [
  "Overview",
  "Verifications",
  "Sessions",
  "Signals",
  "Reports",
] as const;
type Tab = (typeof tabs)[number];

export default function InquiryDetailPage() {
  return (
    <Suspense fallback={null}>
      <InquiryDetailContent />
    </Suspense>
  );
}

function InquiryDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const inquiry = mockInquiries.find((i) => i.id === params.id);
  const [tags, setTags] = useState<string[]>(() => inquiry?.tags ?? []);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = useMemo(
    () =>
      Array.from(new Set(mockInquiries.flatMap((i) => i.tags)))
        .filter(Boolean)
        .sort(),
    [],
  );

  const verifications = mockVerifications.filter(
    (v) => v.inquiryId === inquiry?.id
  );
  const reports = mockReports.filter((r) => r.inquiryId === inquiry?.id);

  if (!inquiry) {
    return (
      <NotFoundPage
        section="Inquiries"
        backHref="/inquiries"
        entity="Inquiry"
      />
    );
  }

  const events = getEventsForInquiry(inquiry.id);
  const sessions = getSessionsForInquiry(inquiry.id);
  const signals = getSignalsForInquiry(inquiry.id);
  const behavioralRisk = getBehavioralRiskForInquiry(inquiry.id);

  const featuredSignals = signals.filter((s) => s.category === "featured");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <TopBar
        title="Inquiry"
        backHref="/inquiries"
        actions={
          <div className="flex items-center gap-2">
            <Button color="primary" size="md" pill={false}>
              <Eye />
              <span className="hidden md:inline">Review</span>
            </Button>
            <Button color="secondary" variant="outline" size="md" pill={false}>
              <DotsHorizontal />
              <span className="hidden md:inline">More</span>
            </Button>
          </div>
        }
      />

      {/* Content + Sidebar */}
      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        {/* Main content */}
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          {/* Tabs */}
          <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              variant="underline"
              aria-label="Inquiry sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Verifications" badge={verifications.length ? { content: verifications.length, pill: true } : undefined}>Verifications</Tabs.Tab>
              <Tabs.Tab value="Sessions" badge={sessions.length ? { content: sessions.length, pill: true } : undefined}>Sessions</Tabs.Tab>
              <Tabs.Tab value="Signals">Signals</Tabs.Tab>
              <Tabs.Tab value="Reports" badge={reports.length ? { content: reports.length, pill: true } : undefined}>Reports</Tabs.Tab>
            </Tabs>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <OverviewTab
                inquiry={inquiry}
                verifications={verifications}
                sessions={sessions}
                signals={featuredSignals}
                behavioralRisk={behavioralRisk}
              />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab verifications={verifications} />
            )}
            {activeTab === "Sessions" && <SessionsTab sessions={sessions} />}
            {activeTab === "Signals" && <SignalsTab signals={signals} />}
            {activeTab === "Reports" && <ReportsTab reports={reports} />}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            {/* Info section */}
            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Inquiry ID" copyValue={inquiry.id} mono>
                {inquiry.id}
              </InfoRow>
              <InfoRow label="Reference ID" copyValue={inquiry.referenceId} mono={!!inquiry.referenceId}>
                {inquiry.referenceId ?? (
                  <span className="text-[var(--color-text-tertiary)]">—</span>
                )}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={inquiry.accountId} mono>
                <Link
                  href={`/accounts/${inquiry.accountId}`}
                  className="text-[var(--color-primary-solid-bg)] hover:underline"
                >
                  {inquiry.accountId}
                </Link>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(inquiry.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Template">
                <span className="text-[var(--color-primary-solid-bg)]">
                  {inquiry.templateName}
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={inquiry.status} />
                  </div>
                  {inquiry.status !== "created" && inquiry.status !== "pending" && (
                    <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                      by Workflow: {inquiry.templateName}
                    </p>
                  )}
                </div>
              </InfoRow>
              <InfoRow label="Notes">
                <span className="text-[var(--color-text-tertiary)]">—</span>
              </InfoRow>
            </div>
          </div>

          {/* Tags */}
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
                  {tags.length > 0 ? "Edit" : "Add"}
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

          {/* Event Timeline */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            {events.length > 0 ? (
              <EventTimeline events={events} />
            ) : (
              <div>
                <h3 className="heading-sm text-[var(--color-text)]">
                  Event timeline (UTC)
                </h3>
                <InlineEmpty>No events recorded.</InlineEmpty>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag Edit Modal */}
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
