"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  InlineEmpty,
  EventTimeline,
  TagEditModal,
  SectionHeading,
  InfoRow,
} from "@/components/shared";
import {
  mockAccounts,
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForAccount,
} from "@/lib/data";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { formatDateTime } from "@/lib/utils/format";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { Tabs } from "@plexui/ui/components/Tabs";
import { useParams } from "next/navigation";
import { Suspense, useMemo, useState, type CSSProperties } from "react";
import {
  OverviewTab,
  VerificationsTab,
  ReportsTab,
} from "./components";

const tabs = ["Overview", "Verifications", "Reports"] as const;
type Tab = (typeof tabs)[number];

export default function AccountDetailPage() {
  return (
    <Suspense fallback={null}>
      <AccountDetailContent />
    </Suspense>
  );
}

function AccountDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const account = mockAccounts.find((a) => a.id === params.id);
  const accountInquiries = mockInquiries.filter(
    (inquiry) => inquiry.accountId === account?.id
  );
  const accountVerifications = mockVerifications.filter((verification) =>
    accountInquiries.some((inquiry) => inquiry.id === verification.inquiryId)
  );
  const accountReports = mockReports.filter(
    (report) => report.accountId === account?.id
  );

  const [tags, setTags] = useState<string[]>(() =>
    Array.from(
      new Set(accountInquiries.flatMap((inquiry) => inquiry.tags))
    ).filter(Boolean)
  );
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = useMemo(
    () =>
      Array.from(new Set(mockInquiries.flatMap((inquiry) => inquiry.tags)))
        .filter(Boolean)
        .sort(),
    []
  );

  if (!account) {
    return (
      <NotFoundPage
        section="Accounts"
        backHref="/accounts"
        entity="Account"
      />
    );
  }

  const events = getEventsForAccount(account.id);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Account"
        backHref="/accounts"
        actions={
          <div className="flex items-center gap-2">
            <Button color="primary" size="md" pill={false}>
              <Plus />
              <span className="hidden md:inline">Create inquiry</span>
            </Button>
            <Button
              color="secondary"
              variant="outline"
              size="md"
              pill={false}
            >
              <DotsHorizontal />
              <span className="hidden md:inline">More</span>
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div
            className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6"
            style={{ "--color-ring": "transparent" } as CSSProperties}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value as Tab)}
              variant="underline"
              aria-label="Account sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab
                value="Verifications"
                badge={
                  accountVerifications.length
                    ? { content: accountVerifications.length, pill: true }
                    : undefined
                }
              >
                Verifications
              </Tabs.Tab>
              <Tabs.Tab
                value="Reports"
                badge={
                  accountReports.length
                    ? { content: accountReports.length, pill: true }
                    : undefined
                }
              >
                Reports
              </Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <OverviewTab
                account={account}
                inquiries={accountInquiries}
                verifications={accountVerifications}
              />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab verifications={accountVerifications} />
            )}
            {activeTab === "Reports" && (
              <ReportsTab reports={accountReports} />
            )}
          </div>
        </div>

        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Account Type">{account.type}</InfoRow>
              <InfoRow label="Account ID" copyValue={account.id} mono>
                {account.id}
              </InfoRow>
              <InfoRow
                label="Reference ID"
                copyValue={account.referenceId ?? undefined}
                mono={!!account.referenceId}
              >
                {account.referenceId ?? (
                  <span className="text-[var(--color-text-tertiary)]">
                    No reference ID
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={account.status} />
              </InfoRow>
              <InfoRow label="Created at">
                {formatDateTime(account.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Last updated at">
                {formatDateTime(account.updatedAt)} UTC
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
                  {tags.length > 0 ? "Edit" : "Add"}
                </Button>
              }
            >
              Tags
            </SectionHeading>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} color="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <InlineEmpty>No tags assigned.</InlineEmpty>
            )}
          </div>

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
