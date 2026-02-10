import type { Verification, Check } from "@/lib/types";
import { generateId } from "./id-generator";

const govIdChecksAllPassed: Check[] = [
  { name: "Age comparison", status: "passed", category: "user_behavior", required: true },
  { name: "Color", status: "passed", category: "fraud", required: true },
  { name: "Compromised submission", status: "passed", category: "fraud", required: true },
  { name: "Allowed country", status: "passed", category: "user_behavior", required: true },
  { name: "Allowed ID type", status: "passed", category: "user_behavior", required: true },
  { name: "Double side", status: "passed", category: "user_behavior", required: true },
  { name: "Government ID", status: "passed", category: "user_behavior", required: true },
  { name: "Expiration", status: "passed", category: "user_behavior", required: true },
  { name: "Fabrication", status: "passed", category: "fraud", required: true },
  { name: "MRZ Detected", status: "passed", category: "user_behavior", required: true },
  { name: "Portrait clarity", status: "passed", category: "user_behavior", required: true },
  { name: "Portrait", status: "passed", category: "user_behavior", required: true },
  { name: "ID-to-Selfie comparison", status: "passed", category: "fraud", required: true },
  { name: "ID image tampering", status: "passed", category: "fraud", required: true },
  { name: "Processable submission", status: "passed", category: "user_behavior", required: true },
  { name: "Barcode", status: "passed", category: "user_behavior", required: false },
  { name: "Blur", status: "passed", category: "user_behavior", required: false },
  { name: "Electronic replica", status: "passed", category: "fraud", required: false },
  { name: "Glare", status: "passed", category: "user_behavior", required: false },
];

const selfieChecksAllPassed: Check[] = [
  { name: "Selfie-to-ID comparison", status: "passed", category: "fraud", required: true },
  { name: "Pose position", status: "passed", category: "fraud", required: true },
  { name: "Multiple faces", status: "passed", category: "fraud", required: true },
  { name: "Pose repeat", status: "passed", category: "fraud", required: true },
  { name: "Suspicious entity", status: "passed", category: "fraud", required: true },
  { name: "Selfie liveness", status: "passed", category: "fraud", required: true },
  { name: "Face covering", status: "passed", category: "user_behavior", required: true },
  { name: "Glasses", status: "passed", category: "user_behavior", required: false },
  { name: "Portrait quality", status: "passed", category: "user_behavior", required: false },
];

const govIdChecksFailed: Check[] = govIdChecksAllPassed.map((c) =>
  c.name === "ID image tampering"
    ? { ...c, status: "failed" as const, reasons: ["Suspected digital alteration detected"] }
    : c.name === "Fabrication"
      ? { ...c, status: "failed" as const, reasons: ["Document appears fabricated"] }
      : c
);

export const mockVerifications: Verification[] = [
  {
    id: "ver_51kzkptBT2GGHMTQCZPgGv1BEiRy",
    inquiryId: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T16:53:00.000Z",
    completedAt: "2026-02-10T16:53:09.000Z",
    checks: govIdChecksAllPassed,
    extractedData: {
      "Full name": "ALEXANDER J SAMPLE",
      "Birthdate": "17 Jul 1977",
      "ID number": "I1234562",
      "Address": "600 CALIFORNIA STREET, SAN FRANCISCO, CA 94109",
      "Issuing country": "United States",
      "Expiration date": "10 Feb 2031",
    },
  },
  {
    id: "ver_KsbxBStZvX9RFpty2N8mmbCsP1TQ",
    inquiryId: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    type: "selfie",
    status: "passed",
    createdAt: "2026-02-10T16:54:01.000Z",
    completedAt: "2026-02-10T16:54:02.000Z",
    checks: selfieChecksAllPassed,
  },
  {
    id: "ver_A2bCdEfGhIjKlMnOpQrStUvWxYzA",
    inquiryId: "inq_8kLmNpRsTuVwXyZaAbCdEfGhIjKl",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T14:25:00.000Z",
    completedAt: "2026-02-10T14:25:30.000Z",
    checks: govIdChecksAllPassed,
    extractedData: {
      "Full name": "MARIA GONZALEZ",
      "Birthdate": "03 Mar 1990",
      "ID number": "AB1234567",
      "Issuing country": "Spain",
    },
  },
  {
    id: "ver_B3cDeFgHiJkLmNoPqRsTuVwXyZaB",
    inquiryId: "inq_8kLmNpRsTuVwXyZaAbCdEfGhIjKl",
    type: "selfie",
    status: "passed",
    createdAt: "2026-02-10T14:26:00.000Z",
    completedAt: "2026-02-10T14:26:15.000Z",
    checks: selfieChecksAllPassed,
  },
  {
    id: "ver_C4dEfGhIjKlMnOpQrStUvWxYzAbC",
    inquiryId: "inq_3MnOpQrStUvWxYzAaBbCcDdEeFfGg",
    type: "government_id",
    status: "failed",
    createdAt: "2026-02-10T12:10:00.000Z",
    completedAt: "2026-02-10T12:12:00.000Z",
    checks: govIdChecksFailed,
    extractedData: {
      "Full name": "JOHN WILLIAMS",
      "Birthdate": "15 Aug 1985",
    },
  },
  {
    id: "ver_D5eFgHiJkLmNoPqRsTuVwXyZaBcD",
    inquiryId: "inq_3MnOpQrStUvWxYzAaBbCcDdEeFfGg",
    type: "selfie",
    status: "passed",
    createdAt: "2026-02-10T12:13:00.000Z",
    completedAt: "2026-02-10T12:13:20.000Z",
    checks: selfieChecksAllPassed,
  },
  {
    id: "ver_E6fGhIjKlMnOpQrStUvWxYzAbCdE",
    inquiryId: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T10:36:00.000Z",
    completedAt: "2026-02-10T10:36:40.000Z",
    checks: govIdChecksAllPassed,
    extractedData: {
      "Full name": "YUKI TANAKA",
      "Birthdate": "22 Dec 1988",
      "ID number": "TK9876543",
      "Issuing country": "Japan",
    },
  },
  {
    id: "ver_F7gHiJkLmNoPqRsTuVwXyZaBcDeF",
    inquiryId: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    type: "selfie",
    status: "passed",
    createdAt: "2026-02-10T10:37:00.000Z",
    completedAt: "2026-02-10T10:37:15.000Z",
    checks: selfieChecksAllPassed,
  },
];

/* ── Generate additional verifications ── */
const verTypes: Verification["type"][] = ["government_id", "selfie", "government_id", "selfie", "document"];
const verStatuses: Verification["status"][] = ["passed", "passed", "passed", "failed", "passed"];

for (let i = 0; i < 40; i++) {
  const date = new Date(2026, 0, 15 + Math.floor(i / 4), 8 + (i % 12), (i * 7) % 60);
  const type = verTypes[i % verTypes.length];
  const status = verStatuses[i % verStatuses.length];
  mockVerifications.push({
    id: generateId("ver", 200 + i),
    inquiryId: generateId("inq", 100 + Math.floor(i / 2)),
    type,
    status,
    createdAt: date.toISOString(),
    completedAt: new Date(date.getTime() + 15000 + (i * 3000)).toISOString(),
    checks: type === "selfie" ? selfieChecksAllPassed : (status === "failed" ? govIdChecksFailed : govIdChecksAllPassed),
  });
}
