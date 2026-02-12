"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, InlineEmpty, EventTimeline, DocumentViewer, TagEditModal } from "@/components/shared";
import {
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForInquiry,
  getSessionsForInquiry,
  getSignalsForInquiry,
  getBehavioralRiskForInquiry,
  signalDescriptions,
} from "@/lib/data";
import {
  formatDateTime,
  formatDuration,
  truncateId,
} from "@/lib/utils/format";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useMemo, useRef, useState } from "react";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Tabs } from "@plexui/ui/components/Tabs";
import {
  CheckCircle,
  Copy,
  ExclamationMarkCircle,
  Globe,
  Desktop,
  InfoCircle,
  MapPin,
  Search,
} from "@plexui/ui/components/Icon";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import type { BehavioralRisk, Check, DocumentViewerItem, InquirySignal, SignalCategory } from "@/lib/types";

const tabs = [
  "Overview",
  "Verifications",
  "Sessions",
  "Signals",
  "Reports",
] as const;
type Tab = (typeof tabs)[number];

// ─── Check descriptions (tooltip text) ───

const checkDescriptions: Record<string, string> = {
  "Age comparison": "Detect if the age listed on the ID meets the age restriction.",
  "Color": "Verify the document image is in color and not grayscale.",
  "Compromised submission": "Check if the submission has been previously flagged as compromised.",
  "Allowed country": "Verify the document's issuing country is in the allowed list.",
  "Allowed ID type": "Verify the document type is in the allowed list.",
  "Double side": "Verify both front and back of the document were captured.",
  "Government ID": "Verify the submitted document is a valid government-issued ID.",
  "Expiration": "Check if the document has not expired.",
  "Fabrication": "Detect if the document was digitally fabricated.",
  "MRZ Detected": "Verify that the Machine Readable Zone was detected on the document.",
  "Portrait clarity": "Verify the portrait on the document is clear and legible.",
  "Portrait": "Verify a portrait is present on the document.",
  "ID-to-Selfie comparison": "Compare the selfie photo to the portrait on the ID document.",
  "ID image tampering": "Detect signs of physical or digital tampering on the document.",
  "Processable submission": "Verify the submission is processable and not corrupted.",
  "Barcode": "Verify the barcode on the document can be read and decoded.",
  "Blur": "Detect if the document image is blurry.",
  "Electronic replica": "Detect if the document is a photo of a screen or electronic copy.",
  "Glare": "Detect if glare is obscuring parts of the document.",
  "Selfie-to-ID comparison": "Compare the selfie photo to the portrait on the ID document.",
  "Pose position": "Verify the selfie pose matches the expected position.",
  "Multiple faces": "Detect if multiple faces are present in the selfie.",
  "Pose repeat": "Detect if the same pose image was submitted multiple times.",
  "Suspicious entity": "Detect if the selfie contains a suspicious entity such as a mask.",
  "Selfie liveness": "Verify the selfie is of a live person and not a photo of a photo.",
  "Face covering": "Detect if the face in the selfie is partially covered.",
  "Glasses": "Detect if the person is wearing glasses in the selfie.",
  "Portrait quality": "Verify the selfie portrait meets minimum quality standards.",
};

// ─── Check Row ───

function CheckRow({ check }: { check: Check }) {
  const desc = checkDescriptions[check.name];
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
        <span className="inline-flex items-center gap-1.5">
          {check.name}
          {desc && (
            <Tooltip content={desc} side="top" maxWidth={260}>
              <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                <InfoCircle style={{ width: 14, height: 14 }} />
              </span>
            </Tooltip>
          )}
        </span>
      </td>
      <td className="px-4 py-2.5 text-sm capitalize text-[var(--color-text-secondary)]">
        {check.category.replace(/_/g, " ")}
      </td>
      <td className="px-4 py-2.5 text-center text-sm text-[var(--color-text-tertiary)]">
        {check.required && "✓"}
      </td>
      <td className="px-4 py-2.5">
        {check.status === "passed" ? (
          <Badge color="success" size="sm">Passed</Badge>
        ) : check.status === "failed" ? (
          <Badge color="danger" size="sm">Failed</Badge>
        ) : (
          <Badge color="secondary" size="sm">N/A</Badge>
        )}
      </td>
    </tr>
  );
}

// ─── Map Embed (blocks scroll-zoom until clicked) ───

function MapEmbed({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [interactive, setInteractive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div
      className="relative"
      onMouseLeave={() => setInteractive(false)}
    >
      <iframe
        key={resetKey}
        title="Session location"
        width="100%"
        height="300"
        className="border-0"
        loading="lazy"
        suppressHydrationWarning
        src={src}
      />
      {!interactive && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setInteractive(true)}
        />
      )}
      {interactive && (
        <Button
          color="secondary"
          variant="ghost"
          size="sm"
          uniform
          className="absolute right-2 top-2 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
          onClick={() => { setResetKey((k) => k + 1); setInteractive(false); }}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Copy Button ───

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      color="secondary"
      variant="ghost"
      size="sm"
      uniform
      pill={false}
      onClick={handleCopy}
    >
      {copied ? (
        <CheckCircle className="h-4 w-4 text-[var(--color-background-success-solid)]" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

// ─── Location Table (field-name | value rows under map) ───

function LocationTable({
  title,
  session,
  lat,
  lng,
  borderLeft,
}: {
  title: string;
  session: { deviceOs: string; deviceType: string; networkRegion: string; networkCountry: string };
  lat: number;
  lng: number;
  borderLeft?: boolean;
}) {
  const rows = [
    { label: "Device", value: `${session.deviceOs}, ${session.deviceType}` },
    { label: "Coordinates", value: `${lat.toFixed(4)}° N ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}` },
    { label: "Region", value: session.networkRegion },
    { label: "Country", value: session.networkCountry },
  ];

  return (
    <div className={borderLeft ? "border-l border-[var(--color-border)]" : ""}>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2">
        <span className="text-xs font-medium text-[var(--color-text-tertiary)]">{title}</span>
      </div>
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[var(--color-border)] last:border-b-0">
              <td className="w-2/5 px-4 py-2 text-sm text-[var(--color-text-tertiary)]">{row.label}</td>
              <td className="px-4 py-2 text-sm text-[var(--color-text)]">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section Heading ───

function SectionHeading({ children, badge }: { children: React.ReactNode; badge?: number }) {
  return (
    <h2 className="heading-sm mb-3 flex items-center gap-2 text-[var(--color-text)]">
      {children}
      {badge != null && badge > 0 && <Badge color="secondary" size="sm">{badge}</Badge>}
    </h2>
  );
}

// ─── Card Header ───

function CardHeader({
  title,
  icon,
  badge,
  startedAt,
  endedAt,
  duration,
}: {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  startedAt?: string;
  endedAt?: string;
  duration?: number | null;
}) {
  const subtitle = startedAt
    ? [
        formatDateTime(startedAt),
        endedAt ? `– ${formatDateTime(endedAt)}` : null,
        duration != null ? `· ${duration}s` : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <div className="border-b border-[var(--color-border)] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 heading-xs text-[var(--color-text)]">
          {icon && <span className="text-[var(--color-text-tertiary)]">{icon}</span>}
          {title}
        </span>
        {badge}
      </div>
      {subtitle && (
        <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Info Row ───

function InfoRow({
  label,
  children,
  copyValue,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  copyValue?: string;
  mono?: boolean;
}) {
  return (
    <div className="py-2">
      <div className="text-sm text-[var(--color-text-tertiary)]">{label}</div>
      <div className={`mt-1 flex items-center gap-1.5 text-md text-[var(--color-text)]${mono ? " font-mono" : ""}`}>
        <span className="min-w-0 break-all">{children}</span>
        {copyValue && <CopyButton value={copyValue} />}
      </div>
    </div>
  );
}

// ─── Info Tooltip ───

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip content={text} side="top" maxWidth={260}>
      <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
        <InfoCircle style={{ width: 16, height: 16 }} />
      </span>
    </Tooltip>
  );
}

function SignalValue({ signal }: { signal: InquirySignal }) {
  const v = signal.value;
  const lowered = v.toLowerCase();

  // Threat / risk levels → colored badge
  if (lowered === "low" || lowered === "minimal") {
    return <Badge color="success" size="sm">{v}</Badge>;
  }
  if (lowered === "medium" || lowered === "moderate") {
    return <Badge color="warning" size="sm">{v}</Badge>;
  }
  if (lowered === "high" || lowered === "critical") {
    return <Badge color="danger" size="sm">{v}</Badge>;
  }

  // Boolean flags — sentence case
  if (lowered === "true") {
    const isBad = /proxy|tor|rooted|incognito|spoof|unrecognized/i.test(signal.name);
    return <Badge color={isBad ? "danger" : "success"} size="sm">True</Badge>;
  }
  if (lowered === "false") {
    return <Badge color="secondary" size="sm">False</Badge>;
  }

  // N/A
  if (lowered === "n/a") {
    return <span className="text-[var(--color-text-tertiary)]">{v}</span>;
  }

  // Default: plain text
  return <>{v}</>;
}

// ─── Signal Table ───

function SignalTable({
  title,
  signals,
}: {
  title: string;
  signals: InquirySignal[];
}) {
  if (signals.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <span className="heading-xs text-[var(--color-text)]">{title}</span>
      </div>
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-2/5" />
          <col />
        </colgroup>
        <tbody>
          {signals.map((s) => {
            const desc = signalDescriptions[s.name];
            return (
              <tr
                key={s.name + s.category}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  <span className="inline-flex items-center gap-1">
                    {s.name}
                    {desc && <InfoTip text={desc} />}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  <span className="inline-flex items-center gap-1.5">
                    <SignalValue signal={s} />
                    {s.flagged && (
                      <Tooltip content="This signal has been flagged" side="top">
                        <span className="inline-flex shrink-0 cursor-help text-[var(--color-background-danger-solid)]">
                          <ExclamationMarkCircle style={{ width: 16, height: 16 }} />
                        </span>
                      </Tooltip>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ───

export default function InquiryDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

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
              Review
            </Button>
            <Button color="secondary" variant="outline" size="md" pill={false}>
              More
            </Button>
          </div>
        }
      />

      {/* Content + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Tabs */}
          <div className="shrink-0 px-6 pt-4" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
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
          <div className="flex-1 overflow-auto px-6 py-6">
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
        <div className="w-[440px] shrink-0 overflow-auto border-l border-[var(--color-border)] bg-[var(--color-surface)]">
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
            <div className="flex items-center justify-between">
              <h3 className="heading-sm text-[var(--color-text)]">Tags</h3>
              <Button
                color="secondary"
                variant="ghost"
                size="sm"
                onClick={() => setTagModalOpen(true)}
              >
                {tags.length > 0 ? "Edit" : "Add"}
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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
                <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
                  No events recorded.
                </p>
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

// ─── Tab Components ───

// ─── Behavioral Risk Signals ───

const behavioralRiskDescriptions: Record<string, string> = {
  "Behavior threat level": "Predicted risk level based on combined behavioral signals",
  "Bot score": "Likelihood score that the session was automated",
  "Request spoof attempts": "Number of requests that were likely spoofed",
  "User agent spoof attempts": "Number of user agent headers that were likely spoofed",
  "Restricted mobile SDK requests": "Requests from restricted mobile SDK versions",
  "Restricted API version requests": "Requests from restricted API versions",
  "User completion time": "Time from start to finish of flow",
  "Distraction events": "Number of times user left the flow",
  "Hesitation percentage": "Percentage of time with no user inputs",
  "Shortcut usage (copies)": "Times user used keyboard shortcut to copy",
  "Shortcut usage (pastes)": "Times user used keyboard shortcut to paste",
  "Autofill starts": "Times user autofilled a form field",
};

function ThreatBadge({ level }: { level: string }) {
  const color = level === "low" ? "success" : level === "medium" ? "warning" : "danger";
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <Badge color={color} size="sm">
      {label}
    </Badge>
  );
}

function RiskRow({ label, children }: { label: string; children: React.ReactNode }) {
  const desc = behavioralRiskDescriptions[label];
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
        <span className="inline-flex items-center gap-1">
          {label}
          {desc && <InfoTip text={desc} />}
        </span>
      </td>
      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
        {children}
      </td>
    </tr>
  );
}

function RiskSectionHeader({ title }: { title: string }) {
  return (
    <tr className="border-b border-[var(--color-border)]">
      <td colSpan={2} className="bg-[var(--color-surface-secondary)] px-4 py-2">
        <span className="heading-xs text-[var(--color-text)]">{title}</span>
      </td>
    </tr>
  );
}

function BehavioralRiskSignals({ risk }: { risk: BehavioralRisk }) {
  const mins = Math.floor(risk.completionTime / 60);
  const secs = risk.completionTime % 60;
  const completionStr = `${mins}m ${secs}s`;

  return (
    <div>
      <SectionHeading>Behavioral risk signals</SectionHeading>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-2/5" />
            <col />
          </colgroup>
          <tbody>
            <RiskSectionHeader title="Overall risk scores" />
            <RiskRow label="Behavior threat level">
              <ThreatBadge level={risk.behaviorThreatLevel} />
            </RiskRow>
            <RiskRow label="Bot score">{risk.botScore}</RiskRow>

            <RiskSectionHeader title="Spoof attempts" />
            <RiskRow label="Request spoof attempts">{risk.requestSpoofAttempts}</RiskRow>
            <RiskRow label="User agent spoof attempts">{risk.userAgentSpoofAttempts}</RiskRow>
            <RiskRow label="Restricted mobile SDK requests">{risk.mobileSdkRestricted}</RiskRow>
            <RiskRow label="Restricted API version requests">{risk.apiVersionRestricted}</RiskRow>

            <RiskSectionHeader title="User behavior" />
            <RiskRow label="User completion time">{completionStr}</RiskRow>
            <RiskRow label="Distraction events">{risk.distractionEvents}</RiskRow>
            <RiskRow label="Hesitation percentage">{risk.hesitationPercent}%</RiskRow>

            <RiskSectionHeader title="Form filling" />
            <RiskRow label="Shortcut usage (copies)">{risk.shortcutCopies}</RiskRow>
            <RiskRow label="Shortcut usage (pastes)">{risk.pastes}</RiskRow>
            <RiskRow label="Autofill starts">{risk.autofillStarts}</RiskRow>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Overview Tab ───

function OverviewTab({
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
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full table-fixed">
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Time to Finish
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.timeToFinish
                    ? formatDuration(inquiry.timeToFinish)
                    : "—"}
                </td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Government ID Attempts
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.verificationAttempts.governmentId}
                </td>
              </tr>
              <tr>
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Selfie Attempts
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.verificationAttempts.selfie}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <img
                  src={item.photo.url}
                  alt={item.photo.label}
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
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {verifications.length > 0 && verifications[0].extractedData ? (
            <table className="w-full table-fixed">
              <tbody>
                {Object.entries(verifications[0].extractedData).map(
                  ([key, val]) => (
                    <tr
                      key={key}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                        {key}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                        {val}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-4">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                No attributes collected.
              </p>
            </div>
          )}
        </div>
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
            <div className="grid grid-cols-2 border-t border-[var(--color-border)]">
              <LocationTable
                title="IP Lookup"
                session={session}
                lat={session.ipLatitude}
                lng={session.ipLongitude}
              />
              <LocationTable
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
        <table className="w-full table-fixed">
          <tbody>
            {Object.entries(v.extractedData).map(([key, val]) => (
              <tr
                key={key}
                className="border-b border-[var(--color-border)]"
              >
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  {key}
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Checks */}
      <div>
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2">
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

function VerificationsTab({
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

function SessionDataRow({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">{label}</td>
      <td className={`px-4 py-2.5 text-sm text-[var(--color-text)]${mono ? " font-mono" : ""}`}>{children}</td>
    </tr>
  );
}

function SessionSectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <tr className="border-b border-[var(--color-border)]">
      <td colSpan={2} className="bg-[var(--color-surface-secondary)] px-4 py-2">
        <span className="inline-flex items-center gap-2">
          <span className="text-[var(--color-text-tertiary)]">{icon}</span>
          <span className="heading-xs text-[var(--color-text)]">{title}</span>
        </span>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
        )}
      </td>
    </tr>
  );
}

function SessionsTab({
  sessions,
}: {
  sessions: ReturnType<typeof getSessionsForInquiry>;
}) {
  if (sessions.length === 0) {
    return <InlineEmpty>No sessions recorded for this inquiry.</InlineEmpty>;
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="heading-sm text-[var(--color-text)]">Summary</h2>
        </div>
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-2/5" />
            <col />
          </colgroup>
          <tbody>
            {sessions.map((s, idx) => (
              <Fragment key={s.id}>
                <SessionSectionHeader
                  icon={<Desktop className="h-4 w-4" />}
                  title={`Session ${idx + 1}`}
                  subtitle={
                    s.expiredAt
                      ? `${formatDateTime(s.createdAt)} – ${formatDateTime(s.expiredAt)}`
                      : formatDateTime(s.createdAt)
                  }
                />
                <SessionDataRow label="Device">{s.deviceOs}, {s.browser}</SessionDataRow>
                <SessionDataRow label="Device token" mono>{s.deviceToken}</SessionDataRow>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sessions detail */}
      <div className="space-y-6">
        {sessions.map((s, idx) => (
          <div
            key={s.id}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <CardHeader
              icon={<Desktop className="h-4 w-4" />}
              title={`Session ${idx + 1}`}
              startedAt={s.createdAt}
              endedAt={s.expiredAt ?? undefined}
            />

            {/* Map + Location tables */}
            <MapEmbed latitude={s.ipLatitude} longitude={s.ipLongitude} />
            <div className="grid grid-cols-2 border-t border-[var(--color-border)]">
              <LocationTable
                title="IP Lookup"
                session={s}
                lat={s.ipLatitude}
                lng={s.ipLongitude}
              />
              <LocationTable
                title="GPS"
                session={s}
                lat={s.gpsLatitude}
                lng={s.gpsLongitude}
                borderLeft
              />
            </div>

            {/* Network details */}
            <table className="w-full table-fixed border-t border-[var(--color-border)]">
              <colgroup>
                <col className="w-2/5" />
                <col />
              </colgroup>
              <tbody>
                  <SessionSectionHeader icon={<Globe className="h-4 w-4" />} title="Network details" />
                  <SessionDataRow label="IP address">{s.ipAddress}</SessionDataRow>
                  <SessionDataRow label="Network threat level">{s.networkThreatLevel}</SessionDataRow>
                  <SessionDataRow label="Tor connection">{s.torConnection ? "Yes" : "No"}</SessionDataRow>
                  <SessionDataRow label="VPN">{s.vpn ? "Yes" : "No"}</SessionDataRow>
                  <SessionDataRow label="Public proxy">{s.publicProxy ? "Yes" : "No"}</SessionDataRow>
                  <SessionDataRow label="Private proxy">{s.privateProxy ? "Yes" : "No"}</SessionDataRow>
                  <SessionDataRow label="ISP">{s.isp}</SessionDataRow>
                  <SessionDataRow label="IP Connection Type">{s.ipConnectionType}</SessionDataRow>
                  <SessionDataRow label="HTTP Referer">{s.httpReferer}</SessionDataRow>

                  {/* Device details */}
                  <SessionSectionHeader icon={<Desktop className="h-4 w-4" />} title="Device details" />
                  <SessionDataRow label="Device token" mono>{s.deviceToken}</SessionDataRow>
                  <SessionDataRow label="Device handoff method">{s.deviceHandoffMethod}</SessionDataRow>
                  <SessionDataRow label="Device type">{s.deviceType}</SessionDataRow>
                  <SessionDataRow label="Device OS">{s.deviceOs}</SessionDataRow>
                  <SessionDataRow label="Browser">{s.browser}</SessionDataRow>
                  <SessionDataRow label="Browser fingerprint" mono>{s.browserFingerprint}</SessionDataRow>
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
}

function SignalsTab({ signals }: { signals: InquirySignal[] }) {
  if (signals.length === 0) {
    return (
      <InlineEmpty>
        No signals recorded for this inquiry.
      </InlineEmpty>
    );
  }

  const byCategory = (cat: SignalCategory) =>
    signals.filter((s) => s.category === cat);

  const featured = byCategory("featured");
  const network = byCategory("network");
  const behavioral = byCategory("behavioral");
  const device = byCategory("device");

  return (
    <div className="space-y-6">
      <SignalTable title="Featured" signals={featured} />
      <SignalTable title="Network" signals={network} />
      <SignalTable title="Behavioral" signals={behavioral} />
      <SignalTable title="Device" signals={device} />
      <SignalTable title="All Signals" signals={signals} />
    </div>
  );
}

function ReportsTab({ reports }: { reports: typeof mockReports }) {
  if (reports.length === 0) {
    return (
      <InlineEmpty>No reports linked to this inquiry.</InlineEmpty>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[100px]" />
          <col />
          <col className="w-[180px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                Primary Input
                <Tooltip content="The name or identifier used as the primary search input for this report" side="top" maxWidth={260}>
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Status
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                Report ID
                <Tooltip content="Unique identifier for the report. Click to view report details." side="top" maxWidth={260}>
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Last updated at
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const typeLabel = r.type === "pep"
              ? "Politically Exposed Person Report"
              : r.type === "watchlist"
                ? "Watchlist Report"
                : "Adverse Media Report";
            return (
              <tr
                key={r.id}
                className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-secondary)]"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {r.primaryInput}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                      {typeLabel}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={r.status}
                    label={r.status === "no_matches" ? "No Matches" : undefined}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/reports/${r.id}`}
                    className="block truncate font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-solid-bg)] hover:underline"
                    title={r.id}
                  >
                    {r.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                  {r.completedAt ? formatDateTime(r.completedAt) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


