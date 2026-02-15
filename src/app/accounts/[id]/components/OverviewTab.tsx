"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SectionHeading,
  KeyValueTable,
  DocumentViewer,
} from "@/components/shared";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import { DateTime } from "luxon";
import type { Account, Inquiry, Verification, DocumentViewerItem } from "@/lib/types";

export function OverviewTab({
  account,
  inquiries,
  verifications,
}: {
  account: Account;
  inquiries: Inquiry[];
  verifications: Verification[];
}) {
  // Compute account age
  const createdDt = DateTime.fromISO(account.createdAt);
  const now = DateTime.now();
  const diff = now.diff(createdDt, ["days"]);
  const ageDays = Math.floor(diff.days);
  const ageLabel =
    ageDays === 0 ? "Today" : ageDays === 1 ? "1 day" : `${ageDays} days`;

  // Find last activity date across inquiries and verifications
  const allDates = [
    ...inquiries.map((i) => i.completedAt).filter(Boolean),
    ...verifications.map((v) => v.completedAt).filter(Boolean),
  ] as string[];
  const lastActivity =
    allDates.length > 0
      ? allDates.sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        )[0]
      : null;

  // Collect photos from all verifications
  const govIdVerifications = verifications.filter(
    (v) => v.type === "government_id"
  );
  const selfieVerifications = verifications.filter(
    (v) => v.type === "selfie"
  );

  const viewerItems: DocumentViewerItem[] = [
    ...govIdVerifications.flatMap(
      (v) =>
        (v.photos ?? []).map((photo) => ({
          photo,
          extractedData: v.extractedData,
          verificationType: "Government ID",
        }))
    ),
    ...selfieVerifications.flatMap(
      (v) =>
        (v.photos ?? []).map((photo) => ({
          photo,
          extractedData: undefined,
          verificationType: "Selfie",
        }))
    ),
  ];
  const hasPhotos = viewerItems.length > 0;

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build verification type label for Collected header
  const verTypeLabels: string[] = [];
  if (govIdVerifications.length > 0) verTypeLabels.push("Government ID");
  if (selfieVerifications.length > 0) verTypeLabels.push("Selfie");

  // Get first gov ID verification for attributes
  const firstGovId = govIdVerifications[0];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <SectionHeading>Summary</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Total Inquiries", value: inquiries.length },
            { label: "Total Verifications", value: verifications.length },
            { label: "Account Age", value: ageLabel },
            {
              label: "Last Activity",
              value: lastActivity
                ? `${formatDateTime(lastActivity)} UTC`
                : "—",
            },
          ]}
        />
      </div>

      {/* Collected photos */}
      {hasPhotos && (
        <div>
          <h2 className="heading-sm mb-1 text-[var(--color-text)]">
            Collected
          </h2>
          {verTypeLabels.length > 0 && (
            <p className="mb-3 text-sm text-[var(--color-text-tertiary)]">
              {verTypeLabels.join(" + ")}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {viewerItems.map((item, i) => (
              <button
                key={item.photo.label + i}
                className="group flex min-w-[100px] cursor-pointer flex-col gap-1.5 outline-none"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={item.photo.url}
                  alt={item.photo.label}
                  width={160}
                  height={160}
                  className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                />
                <span className="w-full truncate text-center text-xs text-[var(--color-text-tertiary)]">
                  {item.photo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Document viewer */}
      {lightboxIndex !== null && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Attributes */}
      <div>
        <SectionHeading>Attributes</SectionHeading>
        {firstGovId?.extractedData &&
        Object.keys(firstGovId.extractedData).length > 0 ? (
          <KeyValueTable
            rows={Object.entries(firstGovId.extractedData).map(
              ([key, val]) => ({
                label: key,
                value:
                  (key === "Full name" || key === "Address") &&
                  typeof val === "string"
                    ? toTitleCase(val)
                    : val,
              })
            )}
          />
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              No attributes collected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
