import type { InquirySession } from "@/lib/types";
import { mockInquiries } from "./mock-inquiries";
import { generateId } from "./id-generator";

const deviceProfiles = [
  { type: "desktop", os: "Mac 26.2.0", browser: "Chrome 144.0.7559.133" },
  { type: "desktop", os: "Windows 11", browser: "Chrome 144.0.7559.133" },
  { type: "desktop", os: "Mac 26.2.0", browser: "Safari 19.3" },
  { type: "desktop", os: "Windows 11", browser: "Edge 144.0.3654.82" },
  { type: "desktop", os: "Mac 26.2.0", browser: "Firefox 138.0.1" },
  { type: "mobile", os: "iOS 19.3.1", browser: "Safari 19.3" },
  { type: "mobile", os: "Android 16", browser: "Chrome 144.0.7559.107" },
];

const locations: {
  lat: number;
  lng: number;
  region: string;
  country: string;
}[] = [
  { lat: 37.751, lng: -97.822, region: "California", country: "United States" },
  { lat: 40.7128, lng: -74.006, region: "New York", country: "United States" },
  { lat: 51.5074, lng: -0.1278, region: "London", country: "United Kingdom" },
  { lat: 48.8566, lng: 2.3522, region: "Île-de-France", country: "France" },
  { lat: 35.6762, lng: 139.6503, region: "Tokyo", country: "Japan" },
  { lat: 52.52, lng: 13.405, region: "Berlin", country: "Germany" },
  { lat: 40.4168, lng: -3.7038, region: "Madrid", country: "Spain" },
  { lat: 55.7558, lng: 37.6173, region: "Moscow", country: "Russia" },
];

const ipAddresses = [
  "62.42.98.207",
  "184.23.156.45",
  "91.108.42.33",
  "203.67.11.89",
  "72.134.88.201",
  "156.43.21.99",
  "88.215.77.143",
  "110.45.200.12",
];

const isps = [
  "Service Provider",
  "Comcast Cable",
  "AT&T Internet",
  "Verizon Fios",
  "BT Group",
  "Deutsche Telekom",
  "Orange S.A.",
  "NTT Communications",
];

function deterministicHex(seed: number, length: number): string {
  let result = "";
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    result += "0123456789abcdef"[s % 16];
  }
  return result;
}

export function getSessionsForInquiry(inquiryId: string): InquirySession[] {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return [];

  // Deterministic index based on inquiry ID
  const idx =
    inquiryId.charCodeAt(4) +
    inquiryId.charCodeAt(5) * 7 +
    inquiryId.charCodeAt(6) * 13;

  const loc = locations[idx % locations.length];
  const device = deviceProfiles[idx % deviceProfiles.length];
  const sessionStart = new Date(
    new Date(inquiry.createdAt).getTime() + 3000,
  );
  const expiredAt =
    inquiry.status === "approved" || inquiry.status === "declined"
      ? new Date(sessionStart.getTime() + 24 * 60 * 60 * 1000).toISOString()
      : undefined;

  return [
    {
      id: generateId("ses", idx),
      inquiryId,
      // Timestamps
      createdAt: sessionStart.toISOString(),
      startedAt: sessionStart.toISOString(),
      expiredAt,
      // Network details
      ipAddress: ipAddresses[idx % ipAddresses.length],
      networkThreatLevel: "Low",
      networkCountry: loc.country,
      networkRegion: loc.region,
      ipLatitude: loc.lat,
      ipLongitude: loc.lng,
      torConnection: false,
      vpn: false,
      publicProxy: false,
      privateProxy: false,
      isp: isps[idx % isps.length],
      ipConnectionType: device.type === "mobile" ? "mobile" : "residential",
      httpReferer: "Unknown",
      // Device details
      deviceToken: generateId("dev", idx + 1000),
      deviceHandoffMethod: "N/A",
      deviceType: device.type,
      deviceOs: device.os,
      browser: device.browser,
      browserFingerprint: deterministicHex(idx * 31 + 7, 32),
      gpsLatitude: loc.lat,
      gpsLongitude: loc.lng,
    },
  ];
}
