"use client";

import { useState } from "react";
import { Badge } from "@plexui/ui/components/Badge";
import { Search } from "@plexui/ui/components/Icon";
import {
  InlineEmpty,
  DocumentViewer,
  CardHeader,
  KeyValueTable,
} from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DocumentViewerItem } from "@/lib/types";
import type { mockVerifications } from "@/lib/data";
import { CheckRow } from "./CheckRow";

function VerificationCard({
  v,
  onOpenLightbox,
}: {
  v: (typeof mockVerifications)[0];
  onOpenLightbox: (verId: string, index: number) => void;
}) {
  const [checksSearch, setChecksSearch] = useState("");

  const typeLabel =
    v.type === "government_id"
      ? "Government ID verification"
      : v.type === "selfie"
        ? "Selfie verification"
        : `${v.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} verification`;

  const filteredChecks = checksSearch
    ? v.checks.filter((c) =>
        c.name.toLowerCase().includes(checksSearch.toLowerCase())
      )
    : v.checks;

  const duration =
    v.createdAt && v.completedAt
      ? Math.round(
          (new Date(v.completedAt).getTime() -
            new Date(v.createdAt).getTime()) /
            1000
        )
      : null;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <CardHeader
        title={typeLabel}
        badge={<StatusBadge status={v.status} />}
        startedAt={v.createdAt}
        endedAt={v.completedAt}
        duration={duration}
      />

      {/* Photos */}
      {v.photos && v.photos.length > 0 && (
        <div className="border-b border-[var(--color-border)] px-4 py-4">
          <div className="flex flex-wrap gap-4">
            {v.photos.map((photo, i) => (
              <button
                key={photo.label + i}
                className="group flex cursor-pointer flex-col gap-1.5 outline-none"
                onClick={() => onOpenLightbox(v.id, i)}
              >
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                />
                <span className="w-full truncate text-center text-xs text-[var(--color-text-tertiary)]">
                  {photo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Extracted data */}
      {v.extractedData && Object.keys(v.extractedData).length > 0 && (
        <KeyValueTable
          bare
          rows={Object.entries(v.extractedData).map(([key, val]) => ({
            label: key,
            value: val,
          }))}
        />
      )}

      {/* Checks */}
      <div>
        <div className="flex items-center gap-2 border-y border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2">
          <span className="heading-xs text-[var(--color-text)]">Checks</span>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search..."
              value={checksSearch}
              onChange={(e) => setChecksSearch(e.target.value)}
              className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-solid-bg)]"
            />
          </div>
        </div>
        {filteredChecks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="w-2/5 px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">Check name</th>
                <th className="w-[140px] px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">Type</th>
                <th className="w-[80px] px-4 py-2 text-center text-xs font-medium text-[var(--color-text-tertiary)]">Required</th>
                <th className="w-[100px] px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecks.map((check, i) => (
                <CheckRow key={i} check={check} />
              ))}
            </tbody>
          </table>
        ) : checksSearch ? (
          <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
            No checks matching &ldquo;{checksSearch}&rdquo;
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function VerificationsTab({
  verifications,
}: {
  verifications: typeof mockVerifications;
}) {
  const [lightboxVerId, setLightboxVerId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  if (verifications.length === 0) {
    return (
      <InlineEmpty>No verifications linked to this inquiry.</InlineEmpty>
    );
  }

  // Build viewer items for the active lightbox verification
  const lightboxVer = lightboxVerId ? verifications.find((vv) => vv.id === lightboxVerId) : null;
  const lightboxItems: DocumentViewerItem[] = lightboxVer
    ? (lightboxVer.photos ?? []).map((photo) => ({
        photo,
        extractedData: lightboxVer.extractedData,
        verificationType: lightboxVer.type === "government_id" ? "Government ID" : lightboxVer.type === "selfie" ? "Selfie" : lightboxVer.type,
      }))
    : [];

  return (
    <div className="space-y-6">
      {verifications.map((v) => (
        <VerificationCard
          key={v.id}
          v={v}
          onOpenLightbox={(verId, index) => {
            setLightboxVerId(verId);
            setLightboxIndex(index);
          }}
        />
      ))}

      {/* Document viewer lightbox */}
      {lightboxVerId !== null && lightboxItems.length > 0 && (
        <DocumentViewer
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxVerId(null)}
        />
      )}
    </div>
  );
}
