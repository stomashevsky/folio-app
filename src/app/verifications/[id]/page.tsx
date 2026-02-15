"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { DotsHorizontal, Plus, Search } from "@plexui/ui/components/Icon";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  InfoRow,
  DocumentViewer,
  KeyValueTable,
  SectionHeading,
  TagEditModal,
  CardHeader,
} from "@/components/shared";
import { mockVerifications, mockInquiries } from "@/lib/data";
import { formatDateTime, formatDuration, toTitleCase } from "@/lib/utils/format";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import {
  CHECK_TYPE_OPTIONS,
  CHECK_REQUIREMENT_OPTIONS,
} from "@/lib/constants/filter-options";
import type { DocumentViewerItem } from "@/lib/types";
import { CheckRow } from "./components";

const TYPE_OPTIONS = CHECK_TYPE_OPTIONS;
const REQUIREMENT_OPTIONS = CHECK_REQUIREMENT_OPTIONS;

export default function VerificationDetailPage() {
  return (
    <Suspense fallback={null}>
      <VerificationDetailContent />
    </Suspense>
  );
}

function VerificationDetailContent() {
  const params = useParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [checksSearch, setChecksSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [reqFilter, setReqFilter] = useState<string[]>([]);

  const verification = mockVerifications.find((v) => v.id === params.id);

  const [tags, setTags] = useState<string[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = useMemo(
    () =>
      Array.from(new Set(mockInquiries.flatMap((i) => i.tags)))
        .filter(Boolean)
        .sort(),
    [],
  );

  if (!verification) {
    return (
      <NotFoundPage
        section="Verifications"
        backHref="/verifications"
        entity="Verification"
      />
    );
  }

  const inquiry = mockInquiries.find((i) => i.id === verification.inquiryId);
  const typeLabel =
    VERIFICATION_TYPE_LABELS[verification.type] ?? verification.type;
  const duration =
    verification.createdAt && verification.completedAt
      ? Math.round(
          (new Date(verification.completedAt).getTime() -
            new Date(verification.createdAt).getTime()) /
            1000,
        )
      : null;

  const lowerSearch = checksSearch.toLowerCase();
  const filteredChecks = verification.checks.filter((c) => {
    if (checksSearch && !c.name.toLowerCase().includes(lowerSearch)) return false;
    if (typeFilter.length > 0 && !typeFilter.includes(c.category)) return false;
    if (reqFilter.length > 0) {
      const isRequired = c.required;
      if (reqFilter.includes("required") && !reqFilter.includes("optional") && !isRequired) return false;
      if (reqFilter.includes("optional") && !reqFilter.includes("required") && isRequired) return false;
    }
    return true;
  });

  const lightboxItems: DocumentViewerItem[] = (
    verification.photos ?? []
  ).map((photo) => ({
    photo,
    extractedData: verification.extractedData,
    verificationType: typeLabel,
  }));

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Verification"
        backHref="/verifications"
        actions={
          <Button
            color="secondary"
            variant="outline"
            size="md"
            pill={false}
          >
            <DotsHorizontal />
            <span className="hidden md:inline">More</span>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        {/* Main content */}
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader
                title={`${typeLabel} verification`}
                badge={<StatusBadge status={verification.status} />}
                startedAt={verification.createdAt}
                endedAt={verification.completedAt}
                duration={duration}
              />

              {/* Photos */}
              {verification.photos && verification.photos.length > 0 && (
                <div className="border-b border-[var(--color-border)] px-4 py-4">
                  <div className="flex flex-wrap gap-6">
                    {verification.photos.map((photo, i) => (
                      <div key={photo.label + i} className="flex flex-col">
                        <button
                          className="group flex cursor-pointer flex-col gap-1.5 outline-none"
                          onClick={() => setLightboxIndex(i)}
                        >
                          <Image
                             src={photo.url}
                             alt={photo.label}
                             width={160}
                             height={160}
                             className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                           />
                          <span className="w-full truncate text-left text-xs text-[var(--color-text-tertiary)]">
                            {photo.label}
                          </span>
                        </button>
                        <div className="mt-2 space-y-0.5">
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            Capture method ({photo.label.toLowerCase()})
                          </p>
                          <p className="text-xs text-[var(--color-text)]">
                            {photo.captureMethod === "auto" ? "Live (autocapture)" : "Manual"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <KeyValueTable
                bare
                rows={[
                  ...(verification.extractedData
                    ? Object.entries(verification.extractedData).map(
                        ([key, val]) => ({
                          label: key,
                          value:
                            (key === "Full name" || key === "Address") &&
                            typeof val === "string"
                              ? toTitleCase(val)
                              : val,
                        }),
                      )
                    : []),
                  { label: "Sourced from", value: "User" },
                ]}
              />
            </div>

            {/* Checks – separate block */}
            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="px-4 py-3">
                <span className="heading-xs text-[var(--color-text)]">
                  Checks
                </span>

                {/* Toolbar */}
                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
                  <div className="w-56">
                    <Input
                      placeholder="Search checks..."
                      value={checksSearch}
                      onChange={(e) => setChecksSearch(e.target.value)}
                      onClear={checksSearch ? () => setChecksSearch("") : undefined}
                      startAdornment={<Search style={{ width: 16, height: 16 }} />}
                      size="sm"
                      pill
                    />
                  </div>
                  <div className="w-52">
                    <Select
                      multiple
                      clearable
                      block
                      pill
                      listMinWidth={220}
                      options={TYPE_OPTIONS}
                      value={typeFilter}
                      onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                      placeholder="Type"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                  <div className="w-44">
                    <Select
                      multiple
                      clearable
                      block
                      pill
                      listMinWidth={180}
                      options={REQUIREMENT_OPTIONS}
                      value={reqFilter}
                      onChange={(opts) => setReqFilter(opts.map((o) => o.value))}
                      placeholder="Requirement"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-[200px]">
              {filteredChecks.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-[var(--color-border)]">
                      <th className="w-[100px] px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                        Check name
                      </th>
                      <th className="w-[190px] px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                        Type
                      </th>
                      <th className="w-[80px] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChecks.map((check, i) => (
                      <CheckRow key={i} check={check} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
                  {checksSearch || typeFilter.length > 0 || reqFilter.length > 0
                    ? "No checks matching current filters"
                    : "No checks"}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Verification ID" copyValue={verification.id} mono>
                {verification.id}
              </InfoRow>
              <InfoRow label="Type">{typeLabel}</InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={verification.status} />
              </InfoRow>
              {inquiry && (
                <InfoRow
                  label="Account ID"
                  copyValue={inquiry.accountId}
                  mono
                >
                  <Link
                    href={`/accounts/${inquiry.accountId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {inquiry.accountId}
                  </Link>
                </InfoRow>
              )}
              <InfoRow
                label="Inquiry ID"
                copyValue={verification.inquiryId}
                mono
              >
                <Link
                  href={`/inquiries/${verification.inquiryId}`}
                  className="text-[var(--color-primary-solid-bg)] hover:underline"
                >
                  {verification.inquiryId}
                </Link>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(verification.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Completed At">
                {verification.completedAt ? (
                  `${formatDateTime(verification.completedAt)} UTC`
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">
                    &mdash;
                  </span>
                )}
              </InfoRow>
              {duration !== null && (
                <InfoRow label="Duration">{formatDuration(duration)}</InfoRow>
              )}
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
                  {tags.length > 0 ? "Edit" : <><Plus /><span>Add tag</span></>}
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

      {lightboxIndex !== null && lightboxItems.length > 0 && (
        <DocumentViewer
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

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
