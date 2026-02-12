import type { BehavioralRisk, InquirySignal } from "@/lib/types";
import { mockInquiries } from "./mock-inquiries";

const featuredSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Behavior Threat Level", type: "Processed", category: "featured" },
  { name: "Geolocation To Residency Delta", type: "Raw", category: "featured" },
  { name: "Proxy Detected", type: "Raw", category: "featured" },
  { name: "Rooted Device Detected", type: "Raw", category: "featured" },
  { name: "Sessions Geolocation Delta", type: "Raw", category: "featured" },
  { name: "Network Threat Level", type: "Raw", category: "featured" },
  { name: "User Agent Spoof Attempts", type: "Raw", category: "featured" },
];

const networkSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "IP Count", type: "Raw", category: "network" },
  { name: "ISP Count", type: "Raw", category: "network" },
  { name: "Proxy Detected", type: "Raw", category: "network" },
  { name: "Network Threat Level", type: "Raw", category: "network" },
  { name: "Tor Detected", type: "Raw", category: "network" },
];

const behavioralSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Apple App Attestation", type: "Raw", category: "behavioral" },
  { name: "Behavior Anomaly", type: "Raw", category: "behavioral" },
  { name: "Behavior Threat Level", type: "Processed", category: "behavioral" },
  { name: "Bot Score", type: "Raw", category: "behavioral" },
  { name: "Country Comparison", type: "Raw", category: "behavioral" },
  { name: "Distraction Events", type: "Raw", category: "behavioral" },
  { name: "Geolocation To Residency Delta", type: "Raw", category: "behavioral" },
  { name: "Google Play Integrity", type: "Raw", category: "behavioral" },
  { name: "Impossible Travel GPS", type: "Raw", category: "behavioral" },
  { name: "Last Two Verifications Geolocation Delta", type: "Raw", category: "behavioral" },
  { name: "Off-hours Activity", type: "Processed", category: "behavioral" },
  { name: "Selfie Liveness Risk Level", type: "Raw", category: "behavioral" },
  { name: "Session Count", type: "Raw", category: "behavioral" },
  { name: "Sessions Geolocation Delta", type: "Raw", category: "behavioral" },
  { name: "Shortcut Copies", type: "Raw", category: "behavioral" },
  { name: "Shortcut Pastes", type: "Raw", category: "behavioral" },
  { name: "Time to Complete", type: "Raw", category: "behavioral" },
  { name: "Unrecognized Referer", type: "Raw", category: "behavioral" },
  { name: "Virtual Camera Risk Level", type: "Raw", category: "behavioral" },
];

const deviceSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Browser Count", type: "Raw", category: "device" },
  { name: "Incognito Browsing Detected", type: "Raw", category: "device" },
  { name: "Locale", type: "Raw", category: "device" },
  { name: "Request Spoof Attempts", type: "Raw", category: "device" },
  { name: "Timezone", type: "Raw", category: "device" },
];

function generateValue(
  signal: Omit<InquirySignal, "value" | "flagged">,
  idx: number
): { value: string; flagged: boolean } {
  switch (signal.name) {
    // Featured / shared
    case "Behavior Threat Level":
      return { value: idx % 5 === 0 ? "Medium" : "Low", flagged: idx % 5 === 0 };
    case "Geolocation To Residency Delta": {
      const dist = (idx * 317) % 5000;
      return {
        value: dist > 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist} m`,
        flagged: dist > 2000,
      };
    }
    case "Proxy Detected":
      return { value: idx % 7 === 0 ? "true" : "false", flagged: idx % 7 === 0 };
    case "Rooted Device Detected":
      return { value: "false", flagged: false };
    case "Sessions Geolocation Delta":
      return { value: `${(idx * 13) % 100} m`, flagged: false };
    case "Network Threat Level":
      return { value: idx % 4 === 0 ? "Medium" : "Low", flagged: idx % 4 === 0 };
    case "User Agent Spoof Attempts":
      return { value: String((idx * 3) % 2), flagged: (idx * 3) % 2 > 0 };

    // Network
    case "IP Count":
      return { value: String(1 + (idx % 3)), flagged: (idx % 3) > 1 };
    case "ISP Count":
      return { value: String(1 + (idx % 2)), flagged: false };
    case "Tor Detected":
      return { value: "false", flagged: false };

    // Behavioral
    case "Apple App Attestation":
      return { value: "N/A", flagged: false };
    case "Behavior Anomaly":
      return { value: idx % 6 === 0 ? "Moderate" : "Minimal", flagged: idx % 6 === 0 };
    case "Bot Score":
      return { value: String(1 + (idx % 3)), flagged: (idx % 3) > 1 };
    case "Country Comparison":
      return { value: idx % 10 === 0 ? "false" : "true", flagged: idx % 10 === 0 };
    case "Distraction Events":
      return { value: String((idx * 7) % 12), flagged: (idx * 7) % 12 > 8 };
    case "Google Play Integrity":
      return { value: "N/A", flagged: false };
    case "Impossible Travel GPS":
      return { value: idx % 8 === 0 ? "Medium" : "Low", flagged: idx % 8 === 0 };
    case "Last Two Verifications Geolocation Delta":
      return { value: `${(idx * 5) % 50} m`, flagged: false };
    case "Off-hours Activity":
      return { value: idx % 9 === 0 ? "true" : "false", flagged: idx % 9 === 0 };
    case "Selfie Liveness Risk Level":
      return { value: "N/A", flagged: false };
    case "Session Count":
      return { value: String(1 + (idx % 2)), flagged: false };
    case "Shortcut Copies":
      return { value: String((idx * 2) % 3), flagged: false };
    case "Shortcut Pastes":
      return { value: String((idx * 3) % 4), flagged: false };
    case "Time to Complete": {
      const secs = 120 + (idx * 17) % 600;
      const mins = Math.floor(secs / 60);
      const rem = secs % 60;
      return { value: `${mins}m ${rem}s`, flagged: false };
    }
    case "Unrecognized Referer":
      return { value: "false", flagged: false };
    case "Virtual Camera Risk Level":
      return { value: "Minimal", flagged: false };

    // Device
    case "Browser Count":
      return { value: String(1 + (idx % 2)), flagged: false };
    case "Incognito Browsing Detected":
      return { value: idx % 12 === 0 ? "true" : "false", flagged: idx % 12 === 0 };
    case "Locale": {
      const locales = ["English", "Spanish", "French", "German", "Japanese", "Chinese"];
      return { value: locales[idx % locales.length], flagged: false };
    }
    case "Request Spoof Attempts":
      return { value: String((idx * 2) % 2), flagged: (idx * 2) % 2 > 0 };
    case "Timezone": {
      const tzs = ["America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai"];
      return { value: tzs[idx % tzs.length], flagged: false };
    }

    default:
      return { value: "—", flagged: false };
  }
}

export function getSignalsForInquiry(inquiryId: string): InquirySignal[] {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return [];

  // No signals for very early statuses
  if (inquiry.status === "created") return [];

  const idx =
    inquiryId.charCodeAt(4) +
    inquiryId.charCodeAt(5) * 3 +
    inquiryId.charCodeAt(6) * 7;

  const allSignalDefs = [
    ...featuredSignals,
    ...networkSignals,
    ...behavioralSignals,
    ...deviceSignals,
  ];

  return allSignalDefs.map((def) => {
    const { value, flagged } = generateValue(def, idx);
    return { ...def, value, flagged };
  });
}

// ─── Signal Descriptions (for tooltips) ───

export const signalDescriptions: Record<string, string> = {
  // Featured
  "Behavior Threat Level": "Predicted risk level based on combined behavioral signals",
  "Geolocation To Residency Delta": "Distance between session location and residence address",
  "Proxy Detected": "Whether a proxy or VPN server was detected",
  "Rooted Device Detected": "Whether the device has been rooted or jailbroken",
  "Sessions Geolocation Delta": "Distance between multiple session locations",
  "Network Threat Level": "Predicted risk level based on network signals",
  "User Agent Spoof Attempts": "Number of user agent headers that were likely spoofed",
  // Network
  "IP Count": "Number of unique IP addresses used during the session",
  "ISP Count": "Number of unique internet service providers detected",
  "Tor Detected": "Whether a Tor exit node was detected",
  // Behavioral
  "Apple App Attestation": "Apple device attestation verification result",
  "Behavior Anomaly": "Degree of anomalous behavior detected during the session",
  "Bot Score": "Likelihood score that the session was automated",
  "Country Comparison": "Whether the session country matches the document country",
  "Distraction Events": "Number of times user left the flow",
  "Google Play Integrity": "Google Play Integrity verification result",
  "Impossible Travel GPS": "Risk level based on impossible GPS location changes",
  "Last Two Verifications Geolocation Delta": "Distance between last two verification locations",
  "Off-hours Activity": "Whether the session occurred outside normal business hours",
  "Selfie Liveness Risk Level": "Risk level for selfie liveness detection",
  "Session Count": "Number of sessions created for this inquiry",
  "Shortcut Copies": "Number of times user used keyboard shortcut to copy",
  "Shortcut Pastes": "Number of times user used keyboard shortcut to paste",
  "Time to Complete": "Time from start to finish of flow",
  "Unrecognized Referer": "Whether the session came from an unrecognized source",
  "Virtual Camera Risk Level": "Risk level for virtual camera detection",
  // Device
  "Browser Count": "Number of unique browsers used during the session",
  "Incognito Browsing Detected": "Whether incognito or private browsing was detected",
  "Locale": "Browser language locale detected",
  "Request Spoof Attempts": "Number of requests that were likely spoofed",
  "Timezone": "Timezone detected from the user's device",
};

export function getBehavioralRiskForInquiry(inquiryId: string): BehavioralRisk | null {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return null;
  if (inquiry.status === "created") return null;

  const idx =
    inquiryId.charCodeAt(4) +
    inquiryId.charCodeAt(5) * 3 +
    inquiryId.charCodeAt(6) * 7;

  const completionSecs = 120 + (idx * 17) % 600;

  return {
    behaviorThreatLevel: idx % 5 === 0 ? "medium" : "low",
    botScore: 1 + (idx % 3),
    requestSpoofAttempts: (idx * 2) % 2,
    userAgentSpoofAttempts: (idx * 3) % 2,
    completionTime: completionSecs,
    distractionEvents: (idx * 7) % 12,
    hesitationPercent: parseFloat((40 + (idx * 11.3) % 55).toFixed(3)),
    shortcutCopies: (idx * 2) % 3,
    pastes: (idx * 3) % 4,
    autofillStarts: idx % 3,
    mobileSdkRestricted: 0,
    apiVersionRestricted: 0,
  };
}
