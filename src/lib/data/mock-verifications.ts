import type { Verification, Check, VerificationPhoto } from "@/lib/types";
import { generateId } from "./id-generator";

const govIdChecksAllPassed: Check[] = [
  { name: "Age comparison", status: "passed", category: "validity", required: true },
  { name: "Color", status: "passed", category: "user_action_required", required: true },
  { name: "Compromised submission", status: "passed", category: "fraud", required: true },
  { name: "Allowed country", status: "passed", category: "validity", required: true },
  { name: "Allowed ID type", status: "passed", category: "validity", required: true },
  { name: "Double side", status: "passed", category: "user_action_required", required: true },
  { name: "Government ID", status: "passed", category: "validity", required: true },
  { name: "Expiration", status: "passed", category: "validity", required: true },
  { name: "Fabrication", status: "passed", category: "fraud", required: true },
  { name: "MRZ Detected", status: "passed", category: "validity", required: true },
  { name: "Portrait clarity", status: "passed", category: "user_action_required", required: true },
  { name: "Portrait", status: "passed", category: "user_action_required", required: true },
  { name: "ID-to-Selfie comparison", status: "passed", category: "biometrics", required: true },
  { name: "ID image tampering", status: "passed", category: "fraud", required: true },
  { name: "Processable submission", status: "passed", category: "user_action_required", required: true },
  { name: "Barcode", status: "passed", category: "validity", required: false },
  { name: "Blur", status: "passed", category: "user_action_required", required: false },
  { name: "Electronic replica", status: "passed", category: "fraud", required: false },
  { name: "Glare", status: "passed", category: "user_action_required", required: false },
];

const selfieChecksAllPassed: Check[] = [
  { name: "Selfie-to-ID comparison", status: "passed", category: "biometrics", required: true },
  { name: "Pose position", status: "passed", category: "biometrics", required: true },
  { name: "Multiple faces", status: "passed", category: "fraud", required: true },
  { name: "Pose repeat", status: "passed", category: "fraud", required: true },
  { name: "Suspicious entity", status: "passed", category: "fraud", required: true },
  { name: "Selfie liveness", status: "passed", category: "biometrics", required: true },
  { name: "Face covering", status: "passed", category: "user_action_required", required: true },
  { name: "Glasses", status: "passed", category: "user_action_required", required: false },
  { name: "Portrait quality", status: "passed", category: "user_action_required", required: false },
];

// ─── Per-person photo sets (document + selfie must match the same person) ───

const personPhotos = [
  {
    govId: [
      { url: "/images/id-andre-front.png", label: "Front", captureMethod: "manual" as const },
      { url: "/images/id-andre-back.png", label: "Back", captureMethod: "manual" as const },
    ],
    selfie: [
      { url: "/images/selfie-andre-look-ahead.png", label: "Look ahead", captureMethod: "auto" as const },
      { url: "/images/selfie-andre-look-left.png", label: "Look left", captureMethod: "auto" as const },
      { url: "/images/selfie-andre-look-right.png", label: "Look right", captureMethod: "auto" as const },
    ],
  },
  {
    govId: [
      { url: "/images/id-maria-front.png", label: "Front", captureMethod: "manual" as const },
      { url: "/images/id-maria-back.png", label: "Back", captureMethod: "manual" as const },
    ],
    selfie: [
      { url: "/images/selfie-maria-look-ahead.png", label: "Look ahead", captureMethod: "auto" as const },
      { url: "/images/selfie-maria-look-left.png", label: "Look left", captureMethod: "auto" as const },
      { url: "/images/selfie-maria-look-right.png", label: "Look right", captureMethod: "auto" as const },
    ],
  },
  {
    govId: [{ url: "/images/passport-carmen.png", label: "Front", captureMethod: "manual" as const }],
    selfie: [
      { url: "/images/selfie-carmen-look-ahead.png", label: "Look ahead", captureMethod: "auto" as const },
      { url: "/images/selfie-carmen-look-left.png", label: "Look left", captureMethod: "auto" as const },
      { url: "/images/selfie-carmen-look-right.png", label: "Look right", captureMethod: "auto" as const },
    ],
  },
] satisfies { govId: VerificationPhoto[]; selfie: VerificationPhoto[] }[];

/** Get photo set for a person index (cycles through 3 people) */
function getPersonPhotos(personIndex: number) {
  return personPhotos[personIndex % personPhotos.length];
}

const govIdChecksFailed: Check[] = govIdChecksAllPassed.map((c) =>
  c.name === "ID image tampering"
    ? { ...c, status: "failed" as const, reasons: ["Suspected digital alteration detected"] }
    : c.name === "Fabrication"
      ? { ...c, status: "failed" as const, reasons: ["Document appears fabricated"] }
      : c
);

const selfieChecksFailedLiveness: Check[] = selfieChecksAllPassed.map((c) =>
  c.name === "Selfie liveness"
    ? { ...c, status: "failed" as const, reasons: ["Liveness check failed — potential spoofing detected"] }
    : c
);

const govIdChecksExpired: Check[] = govIdChecksAllPassed.map((c) =>
  c.name === "Expiration"
    ? { ...c, status: "failed" as const, reasons: ["Document has expired"] }
    : c
);

export const mockVerifications: Verification[] = [
  // Inquiry 1: Alexander J Sample → person 0 (Andre)
  {
    id: "ver_51kzkptBT2GGHMTQCZPgGv1BEiRy",
    inquiryId: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T16:53:00.000Z",
    completedAt: "2026-02-10T16:53:09.000Z",
    checks: govIdChecksAllPassed,
    photos: getPersonPhotos(0).govId,
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
    photos: getPersonPhotos(0).selfie,
  },
  // Inquiry 2: Maria Gonzalez → person 1 (Maria)
  {
    id: "ver_A2bCdEfGhIjKlMnOpQrStUvWxYzA",
    inquiryId: "inq_8kLmNpRsTuVwXyZaAbCdEfGhIjKl",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T14:25:00.000Z",
    completedAt: "2026-02-10T14:25:30.000Z",
    checks: govIdChecksAllPassed,
    photos: getPersonPhotos(1).govId,
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
    photos: getPersonPhotos(1).selfie,
  },
  // Inquiry 3: John Williams → person 2 (Carmen)
  {
    id: "ver_C4dEfGhIjKlMnOpQrStUvWxYzAbC",
    inquiryId: "inq_3MnOpQrStUvWxYzAaBbCcDdEeFfGg",
    type: "government_id",
    status: "failed",
    createdAt: "2026-02-10T12:10:00.000Z",
    completedAt: "2026-02-10T12:12:00.000Z",
    checks: govIdChecksFailed,
    photos: getPersonPhotos(2).govId,
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
    photos: getPersonPhotos(2).selfie,
  },
  // Inquiry 4: Yuki Tanaka → person 0 (Andre)
  {
    id: "ver_E6fGhIjKlMnOpQrStUvWxYzAbCdE",
    inquiryId: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    type: "government_id",
    status: "passed",
    createdAt: "2026-02-10T10:36:00.000Z",
    completedAt: "2026-02-10T10:36:40.000Z",
    checks: govIdChecksAllPassed,
    photos: getPersonPhotos(0).govId,
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
    photos: getPersonPhotos(0).selfie,
  },
];

/* ── Generate verifications from shared seed data ── */
import { generatedPeople } from "./mock-data-seed";

let verIdx = 200;

for (const p of generatedPeople) {
  const inquiryId = generateId("inq", 100 + p.index);
  const photos = getPersonPhotos(p.index);
  const hasSelfie = p.templateName.includes("Selfie");
  const createdDate = new Date(p.createdAt);
  const finished = p.status === "approved" || p.status === "declined" || p.status === "needs_review";

  if (!finished) continue; // no verifications for pending/created/expired

  // ── Government ID verification(s) ──
  const govIdAttempts = p.verificationAttempts.governmentId;
  for (let attempt = 0; attempt < govIdAttempts; attempt++) {
    const isLastAttempt = attempt === govIdAttempts - 1;
    const attemptTime = new Date(createdDate.getTime() + (attempt + 1) * 45000);

    // Determine status: last attempt reflects final outcome, earlier attempts always fail
    let govStatus: Verification["status"];
    let govChecks: Check[];
    if (!isLastAttempt) {
      govStatus = "failed";
      govChecks = attempt % 2 === 0 ? govIdChecksFailed : govIdChecksExpired;
    } else if (p.status === "declined" && p.verificationAttempts.selfie <= 1) {
      // Declined due to gov ID
      govStatus = "failed";
      govChecks = govIdChecksFailed;
    } else {
      govStatus = "passed";
      govChecks = govIdChecksAllPassed;
    }

    mockVerifications.push({
      id: generateId("ver", verIdx++),
      inquiryId,
      type: "government_id",
      status: govStatus,
      createdAt: attemptTime.toISOString(),
      completedAt: new Date(attemptTime.getTime() + 8000 + attempt * 2000).toISOString(),
      checks: govChecks,
      photos: photos.govId,
      extractedData: {
        "Full name": p.name.toUpperCase(),
        "Birthdate": p.birthdateFormatted,
        "ID number": p.idNumber,
        "Issuing country": p.issuingCountry,
        "Expiration date": p.expirationDate,
      },
    });
  }

  // ── Selfie verification(s) ──
  if (hasSelfie) {
    const selfieAttempts = p.verificationAttempts.selfie;
    for (let attempt = 0; attempt < selfieAttempts; attempt++) {
      const isLastAttempt = attempt === selfieAttempts - 1;
      const attemptTime = new Date(
        createdDate.getTime() + govIdAttempts * 45000 + (attempt + 1) * 30000
      );

      let selfieStatus: Verification["status"];
      let selfieChecks: Check[];
      if (!isLastAttempt) {
        selfieStatus = "failed";
        selfieChecks = selfieChecksFailedLiveness;
      } else if (p.status === "declined" && p.verificationAttempts.governmentId <= 1) {
        // Declined due to selfie
        selfieStatus = "failed";
        selfieChecks = selfieChecksFailedLiveness;
      } else {
        selfieStatus = "passed";
        selfieChecks = selfieChecksAllPassed;
      }

      mockVerifications.push({
        id: generateId("ver", verIdx++),
        inquiryId,
        type: "selfie",
        status: selfieStatus,
        createdAt: attemptTime.toISOString(),
        completedAt: new Date(attemptTime.getTime() + 2000).toISOString(),
        checks: selfieChecks,
        photos: photos.selfie,
      });
    }
  }
}
