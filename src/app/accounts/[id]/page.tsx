"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ChartCard,
  NotFoundPage,
  InlineEmpty,
  DetailInfoList,
  EntityCard,
  InfoRow,
  SectionHeading,
  TagEditModal,
} from "@/components/shared";
import { mockAccounts, mockInquiries, mockVerifications, mockReports } from "@/lib/data";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { formatDateTime, formatDate, truncateId } from "@/lib/utils/format";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { Tabs } from "@plexui/ui/components/Tabs";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState, type CSSProperties } from "react";

const tabs = ["Overview", "Inquiries", "Verifications", "Reports"] as const;
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const account = mockAccounts.find((a) => a.id === params.id);
  const accountInquiries = mockInquiries.filter((inquiry) => inquiry.accountId === account?.id);
  const accountVerifications = mockVerifications.filter((verification) =>
    accountInquiries.some((inquiry) => inquiry.id === verification.inquiryId)
  );
  const accountReports = mockReports.filter((report) => report.accountId === account?.id);

  const [tags, setTags] = useState<string[]>(() =>
    Array.from(new Set(accountInquiries.flatMap((inquiry) => inquiry.tags))).filter(Boolean)
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
    return <NotFoundPage section="Accounts" backHref="/accounts" entity="Account" />;
  }

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
            <Button color="secondary" variant="outline" size="md" pill={false}>
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
              <Tabs.Tab value="Inquiries" badge={accountInquiries.length ? { content: accountInquiries.length, pill: true } : undefined}>
                Inquiries
              </Tabs.Tab>
              <Tabs.Tab
                value="Verifications"
                badge={accountVerifications.length ? { content: accountVerifications.length, pill: true } : undefined}
              >
                Verifications
              </Tabs.Tab>
              <Tabs.Tab value="Reports" badge={accountReports.length ? { content: accountReports.length, pill: true } : undefined}>
                Reports
              </Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <ChartCard title="Profile">
                <DetailInfoList
                  items={[
                    ["Account ID", account.id],
                    ["Reference ID", account.referenceId ?? "-"],
                    ["Status", <StatusBadge key="status" status={account.status} />],
                    ["Type", account.type],
                    ["Birthdate", account.birthdate ? formatDate(account.birthdate) : "-"],
                    ["Age", account.age ? `${account.age} years` : "-"],
                    ["Address", account.address ?? "-"],
                    ["Created At", `${formatDateTime(account.createdAt)} UTC`],
                    ["Updated At", `${formatDateTime(account.updatedAt)} UTC`],
                  ]}
                />
              </ChartCard>
            )}

            {activeTab === "Inquiries" && (
              <div className="space-y-3">
                {accountInquiries.length === 0 ? (
                  <InlineEmpty>No inquiries for this account.</InlineEmpty>
                ) : (
                  accountInquiries.map((inquiry) => (
                    <EntityCard
                      key={inquiry.id}
                      title={inquiry.templateName}
                      subtitle={`${truncateId(inquiry.id)} - ${formatDateTime(inquiry.createdAt)}`}
                      status={inquiry.status}
                      onClick={() => router.push(`/inquiries/${inquiry.id}`)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "Verifications" && (
              <div className="space-y-3">
                {accountVerifications.length === 0 ? (
                  <InlineEmpty>No verifications for this account.</InlineEmpty>
                ) : (
                  accountVerifications.map((verification) => (
                    <EntityCard
                      key={verification.id}
                      title={`${verification.type.replace("_", " ")} Verification`}
                      subtitle={`${truncateId(verification.id)} - ${formatDateTime(verification.createdAt)}`}
                      status={verification.status}
                      onClick={() => router.push(`/verifications/${verification.id}`)}
                      titleClassName="capitalize"
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "Reports" && (
              <div className="space-y-3">
                {accountReports.length === 0 ? (
                  <InlineEmpty>No reports for this account.</InlineEmpty>
                ) : (
                  accountReports.map((report) => (
                    <EntityCard
                      key={report.id}
                      title={report.templateName}
                      subtitle={`${truncateId(report.id)} - ${formatDateTime(report.createdAt)}`}
                      status={report.status}
                      onClick={() => router.push(`/reports/${report.id}`)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            <div className="mb-4 flex items-center gap-3">
              <Avatar name={account.name} size={48} color="primary" />
              <div>
                <h3 className="heading-sm text-[var(--color-text)]">{account.name}</h3>
                <p className="font-mono text-xs text-[var(--color-text-tertiary)]">{account.id}</p>
              </div>
            </div>

            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Account ID" copyValue={account.id} mono>
                {account.id}
              </InfoRow>
              <InfoRow label="Reference ID" copyValue={account.referenceId} mono={!!account.referenceId}>
                {account.referenceId ?? <span className="text-[var(--color-text-tertiary)]">-</span>}
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={account.status} />
              </InfoRow>
              <InfoRow label="Type">{account.type}</InfoRow>
              <InfoRow label="Birthdate">
                {account.birthdate ? formatDate(account.birthdate) : <span className="text-[var(--color-text-tertiary)]">-</span>}
              </InfoRow>
              <InfoRow label="Age">
                {account.age ? `${account.age} years` : <span className="text-[var(--color-text-tertiary)]">-</span>}
              </InfoRow>
              <InfoRow label="Address">
                {account.address ?? <span className="text-[var(--color-text-tertiary)]">-</span>}
              </InfoRow>
              <InfoRow label="Created At">{formatDateTime(account.createdAt)} UTC</InfoRow>
              <InfoRow label="Updated At">{formatDateTime(account.updatedAt)} UTC</InfoRow>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <SectionHeading>Activity</SectionHeading>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Inquiries</span>
                <span className="heading-xs text-[var(--color-text)]">{accountInquiries.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Verifications</span>
                <span className="heading-xs text-[var(--color-text)]">{accountVerifications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Reports</span>
                <span className="heading-xs text-[var(--color-text)]">{accountReports.length}</span>
              </div>
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
