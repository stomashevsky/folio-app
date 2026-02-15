"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SectionHeading,
  KeyValueTable,
  DocumentViewer,
} from "@/components/shared";
import {
  formatDuration,
  toTitleCase,
} from "@/lib/utils/format";
import type { BehavioralRisk, DocumentViewerItem, InquirySignal } from "@/lib/types";
import type { mockInquiries, mockVerifications } from "@/lib/data";
import type { getSessionsForInquiry } from "@/lib/data";
import { MapEmbed } from "./MapEmbed";
import { LocationPanel } from "./LocationPanel";
import { SignalTable } from "./SignalTable";
import { BehavioralRiskSignals } from "./BehavioralRiskSignals";

export function OverviewTab({
  inquiry,
  verifications,
  sessions,
  signals,
  behavioralRisk,
}: {
  inquiry: (typeof mockInquiries)[0];
  verifications: typeof mockVerifications;
  sessions: ReturnType<typeof getSessionsForInquiry>;
  signals: InquirySignal[];
  behavioralRisk: BehavioralRisk | null;
}) {
  // Collect photos from verifications with extraction data
  const govIdVer = verifications.find((v) => v.type === "government_id");
  const selfieVer = verifications.find((v) => v.type === "selfie");
  const viewerItems: DocumentViewerItem[] = [
    ...(govIdVer?.photos ?? []).map((photo) => ({
      photo,
      extractedData: govIdVer?.extractedData,
      verificationType: "Government ID",
    })),
    ...(selfieVer?.photos ?? []).map((photo) => ({
      photo,
      extractedData: undefined,
      verificationType: "Selfie",
    })),
  ];
  const hasPhotos = viewerItems.length > 0;

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Get first session for location
  const session = sessions[0];

  // Build verification type label for Collected header
  const verTypeLabels: string[] = [];
  if (govIdVer) verTypeLabels.push("Government ID");
  if (selfieVer) verTypeLabels.push("Selfie");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <SectionHeading>Summary</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Time to Finish", value: inquiry.timeToFinish ? formatDuration(inquiry.timeToFinish) : "—" },
            { label: "Government ID Attempts", value: inquiry.verificationAttempts.governmentId },
            { label: "Selfie Attempts", value: inquiry.verificationAttempts.selfie },
          ]}
        />
      </div>

      {/* Collected photos */}
      {hasPhotos && (
        <div>
          <h2 className="heading-sm mb-1 text-[var(--color-text)]">Collected</h2>
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
        {verifications.length > 0 && verifications[0].extractedData ? (
          <KeyValueTable
            rows={Object.entries(verifications[0].extractedData).map(
              ([key, val]) => ({
                label: key,
                value:
                  (key === "Full name" || key === "Address") && typeof val === "string"
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

      {/* Location */}
      {session && (
        <div>
          <SectionHeading>Location</SectionHeading>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <MapEmbed
              latitude={session.ipLatitude}
              longitude={session.ipLongitude}
            />
            {/* Two-column detail: IP Lookup | GPS */}
            <div className="grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-2">
              <LocationPanel
                title="IP Lookup"
                session={session}
                lat={session.ipLatitude}
                lng={session.ipLongitude}
              />
              <LocationPanel
                title="GPS"
                session={session}
                lat={session.gpsLatitude}
                lng={session.gpsLongitude}
                borderLeft
              />
            </div>
          </div>
        </div>
      )}

      {/* Signals preview */}
      {signals.length > 0 && (
        <div>
          <SectionHeading>Signals</SectionHeading>
          <SignalTable title="Featured" signals={signals} />
        </div>
      )}

      {/* Behavioral risk signals */}
      {behavioralRisk && <BehavioralRiskSignals risk={behavioralRisk} />}
    </div>
  );
}
