import { Globe, Desktop } from "@plexui/ui/components/Icon";
import {
  InlineEmpty,
  CardHeader,
  KeyValueTable,
} from "@/components/shared";
import { formatDateTime } from "@/lib/utils/format";
import type { getSessionsForInquiry } from "@/lib/data";
import { MapEmbed } from "./MapEmbed";
import { LocationPanel } from "./LocationPanel";

export function SessionsTab({
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
      <KeyValueTable
        title="Summary"
        sections={sessions.map((s, idx) => ({
          title: `Session ${idx + 1}`,
          icon: <Desktop className="h-4 w-4" />,
          subtitle: s.expiredAt
            ? `${formatDateTime(s.createdAt)} – ${formatDateTime(s.expiredAt)}`
            : formatDateTime(s.createdAt),
          rows: [
            { label: "Device", value: `${s.deviceOs}, ${s.browser}` },
            { label: "Device token", value: <span className="font-mono">{s.deviceToken}</span> },
          ],
        }))}
      />

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
            <div className="grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-2">
              <LocationPanel
                title="IP Lookup"
                session={s}
                lat={s.ipLatitude}
                lng={s.ipLongitude}
              />
              <LocationPanel
                title="GPS"
                session={s}
                lat={s.gpsLatitude}
                lng={s.gpsLongitude}
                borderLeft
              />
            </div>

            {/* Network + Device details */}
            <KeyValueTable
              bare
              sections={[
                {
                  title: "Network details",
                  icon: <Globe className="h-4 w-4" />,
                  rows: [
                    { label: "IP address", value: s.ipAddress },
                    { label: "Network threat level", value: s.networkThreatLevel },
                    { label: "Tor connection", value: s.torConnection ? "Yes" : "No" },
                    { label: "VPN", value: s.vpn ? "Yes" : "No" },
                    { label: "Public proxy", value: s.publicProxy ? "Yes" : "No" },
                    { label: "Private proxy", value: s.privateProxy ? "Yes" : "No" },
                    { label: "ISP", value: s.isp },
                    { label: "IP Connection Type", value: s.ipConnectionType },
                    { label: "HTTP Referer", value: s.httpReferer },
                  ],
                },
                {
                  title: "Device details",
                  icon: <Desktop className="h-4 w-4" />,
                  rows: [
                    { label: "Device token", value: <span className="font-mono">{s.deviceToken}</span> },
                    { label: "Device handoff method", value: s.deviceHandoffMethod },
                    { label: "Device type", value: s.deviceType },
                    { label: "Device OS", value: s.deviceOs },
                    { label: "Browser", value: s.browser },
                    { label: "Browser fingerprint", value: <span className="font-mono">{s.browserFingerprint}</span> },
                  ],
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
