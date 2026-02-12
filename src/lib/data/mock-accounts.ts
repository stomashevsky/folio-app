import type { Account } from "@/lib/types";
import { generateId } from "./id-generator";

export const mockAccounts: Account[] = [
  {
    id: "act_3ocpY1q1aBvfWMY4YNvdi9vgtTGx",
    name: "Alexander J Sample",
    birthdate: "1977-07-17",
    address: "600 California Street, San Francisco, CA 94109, USA",
    age: 48,
    status: "active",
    type: "User",
    createdAt: "2026-02-10T16:41:00.000Z",
    updatedAt: "2026-02-10T16:54:05.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 2,
  },
  {
    id: "act_7FgHiJkLmNoPqRsTuVwXyZaBcDeF",
    name: "Maria Gonzalez",
    birthdate: "1990-03-03",
    address: "Calle Mayor 15, Madrid, Spain",
    age: 35,
    status: "active",
    type: "User",
    referenceId: "user_mg_001",
    createdAt: "2026-02-10T14:22:00.000Z",
    updatedAt: "2026-02-10T14:28:17.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 1,
  },
  {
    id: "act_9HiJkLmNoPqRsTuVwXyZaBcDeFgH",
    name: "John Williams",
    birthdate: "1985-08-15",
    address: "42 Baker Street, London, UK",
    age: 40,
    status: "suspended",
    type: "User",
    createdAt: "2026-02-10T12:05:00.000Z",
    updatedAt: "2026-02-10T12:15:42.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 0,
  },
  {
    id: "act_2AbCdEfGhIjKlMnOpQrStUvWxYz",
    name: "Yuki Tanaka",
    birthdate: "1988-12-22",
    address: "1-1 Shibuya, Tokyo, Japan",
    age: 37,
    status: "default",
    type: "User",
    referenceId: "user_yt_003",
    createdAt: "2026-02-10T10:33:00.000Z",
    updatedAt: "2026-02-10T10:41:22.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 2,
  },
  {
    id: "act_4EfGhIjKlMnOpQrStUvWxYzAbCdE",
    name: "Emma Johnson",
    birthdate: "1995-06-10",
    address: "789 Elm Avenue, Chicago, IL 60601, USA",
    age: 30,
    status: "default",
    type: "User",
    createdAt: "2026-02-10T09:15:00.000Z",
    updatedAt: "2026-02-10T09:15:00.000Z",
    inquiryCount: 1,
    verificationCount: 0,
    reportCount: 0,
  },
  {
    id: "act_6GhIjKlMnOpQrStUvWxYzAbCdEfG",
    name: "Carlos Martinez",
    birthdate: "1982-11-28",
    address: "Av. Reforma 222, Mexico City, Mexico",
    age: 43,
    status: "active",
    type: "User",
    createdAt: "2026-02-09T18:45:00.000Z",
    updatedAt: "2026-02-09T18:52:30.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 1,
  },
  {
    id: "act_8IjKlMnOpQrStUvWxYzAbCdEfGhI",
    name: "Sophie Dupont",
    birthdate: "1993-04-14",
    address: "25 Rue de Rivoli, Paris, France",
    age: 32,
    status: "active",
    type: "User",
    referenceId: "user_sd_005",
    createdAt: "2026-02-09T16:20:00.000Z",
    updatedAt: "2026-02-09T16:26:45.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 1,
  },
  {
    id: "act_5OpQrStUvWxYzAbCdEfGhIjKlMnO",
    name: "Lars Eriksson",
    birthdate: "1979-09-05",
    address: "Drottninggatan 10, Stockholm, Sweden",
    age: 46,
    status: "default",
    type: "User",
    createdAt: "2026-02-09T09:30:00.000Z",
    updatedAt: "2026-02-09T09:39:05.000Z",
    inquiryCount: 1,
    verificationCount: 2,
    reportCount: 1,
  },
];

/* ── Generate accounts from shared seed data ── */
import { generatedPeople } from "./mock-data-seed";

for (const p of generatedPeople) {
  const finished = p.status === "approved" || p.status === "declined" || p.status === "needs_review";
  const hasSelfie = p.templateName.includes("Selfie");
  const isAml = p.templateName.includes("AML");

  // Derive account status from inquiry status
  let accStatus: Account["status"];
  if (p.status === "approved") accStatus = "active";
  else if (p.status === "declined") accStatus = "suspended";
  else accStatus = "default";

  // Count verifications (govId attempts + selfie attempts)
  const verCount = finished
    ? p.verificationAttempts.governmentId + (hasSelfie ? p.verificationAttempts.selfie : 0)
    : 0;

  // Count reports (AML completed inquiries get watchlist + PEP)
  const repCount = finished && isAml ? 2 : 0;

  const updatedAt = p.completedAt ?? p.createdAt;

  mockAccounts.push({
    id: generateId("act", 100 + p.index),
    name: p.name,
    birthdate: p.birthdate,
    address: p.address,
    age: p.age,
    status: accStatus,
    type: "User",
    referenceId: p.referenceId,
    createdAt: p.createdAt,
    updatedAt,
    inquiryCount: 1,
    verificationCount: verCount,
    reportCount: repCount,
  });
}
