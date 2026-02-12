import type { Inquiry } from "@/lib/types";
import { generateId } from "./id-generator";

export const mockInquiries: Inquiry[] = [
  {
    id: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    accountId: "act_3ocpY1q1aBvfWMY4YNvdi9vgtTGx",
    accountName: "Alexander J Sample",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-10T16:41:00.000Z",
    completedAt: "2026-02-10T16:54:03.000Z",
    timeToFinish: 591,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: [],
  },
  {
    id: "inq_8kLmNpRsTuVwXyZaAbCdEfGhIjKl",
    accountId: "act_7FgHiJkLmNoPqRsTuVwXyZaBcDeF",
    accountName: "Maria Gonzalez",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-10T14:22:00.000Z",
    completedAt: "2026-02-10T14:28:15.000Z",
    timeToFinish: 375,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: ["Premium"],
  },
  {
    id: "inq_3MnOpQrStUvWxYzAaBbCcDdEeFfGg",
    accountId: "act_9HiJkLmNoPqRsTuVwXyZaBcDeFgH",
    accountName: "John Williams",
    status: "declined",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-10T12:05:00.000Z",
    completedAt: "2026-02-10T12:15:42.000Z",
    timeToFinish: 642,

    verificationAttempts: { governmentId: 2, selfie: 1 },
    tags: [],
  },
  {
    id: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    accountId: "act_2AbCdEfGhIjKlMnOpQrStUvWxYz",
    accountName: "Yuki Tanaka",
    status: "needs_review",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-10T10:33:00.000Z",
    completedAt: "2026-02-10T10:41:20.000Z",
    timeToFinish: 500,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: ["High-risk"],
  },
  {
    id: "inq_7VwXyZaAbBcCdDdEeFfGgHhIiJjKk",
    accountId: "act_4EfGhIjKlMnOpQrStUvWxYzAbCdE",
    accountName: "Emma Johnson",
    status: "pending",
    templateName: "KYC: GovID Only",
    createdAt: "2026-02-10T09:15:00.000Z",
    timeToFinish: undefined,

    verificationAttempts: { governmentId: 0, selfie: 0 },
    tags: [],
  },
  {
    id: "inq_9XyZaAbBcCdDdEeFfGgHhIiJjKkLl",
    accountId: "act_6GhIjKlMnOpQrStUvWxYzAbCdEfG",
    accountName: "Carlos Martinez",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-09T18:45:00.000Z",
    completedAt: "2026-02-09T18:52:30.000Z",
    timeToFinish: 450,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: [],
  },
  {
    id: "inq_2ZaAbBcCdDdEeFfGgHhIiJjKkLlMm",
    accountId: "act_8IjKlMnOpQrStUvWxYzAbCdEfGhI",
    accountName: "Sophie Dupont",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-09T16:20:00.000Z",
    completedAt: "2026-02-09T16:26:45.000Z",
    timeToFinish: 405,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: ["Premium"],
  },
  {
    id: "inq_4BcCdDdEeFfGgHhIiJjKkLlMmNnOo",
    accountId: "act_1KlMnOpQrStUvWxYzAbCdEfGhIjK",
    accountName: "Ahmed Hassan",
    status: "declined",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-09T14:10:00.000Z",
    completedAt: "2026-02-09T14:22:18.000Z",
    timeToFinish: 738,

    verificationAttempts: { governmentId: 3, selfie: 1 },
    tags: [],
  },
  {
    id: "inq_6DdEeFfGgHhIiJjKkLlMmNnOoPpQq",
    accountId: "act_3MnOpQrStUvWxYzAbCdEfGhIjKlM",
    accountName: "Olivia Smith",
    status: "approved",
    templateName: "KYC: GovID Only",
    createdAt: "2026-02-09T11:55:00.000Z",
    completedAt: "2026-02-09T12:01:10.000Z",
    timeToFinish: 370,

    verificationAttempts: { governmentId: 1, selfie: 0 },
    tags: [],
  },
  {
    id: "inq_8FfGgHhIiJjKkLlMmNnOoPpQqRrSs",
    accountId: "act_5OpQrStUvWxYzAbCdEfGhIjKlMnO",
    accountName: "Lars Eriksson",
    status: "needs_review",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-09T09:30:00.000Z",
    completedAt: "2026-02-09T09:38:55.000Z",
    timeToFinish: 535,

    verificationAttempts: { governmentId: 1, selfie: 2 },
    tags: ["EU-resident"],
  },
  {
    id: "inq_1HhIiJjKkLlMmNnOoPpQqRrSsTtUu",
    accountId: "act_7QrStUvWxYzAbCdEfGhIjKlMnOpQ",
    accountName: "Priya Patel",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-08T17:40:00.000Z",
    completedAt: "2026-02-08T17:46:20.000Z",
    timeToFinish: 380,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: [],
  },
  {
    id: "inq_3JjKkLlMmNnOoPpQqRrSsTtUuVvWw",
    accountId: "act_9StUvWxYzAbCdEfGhIjKlMnOpQrS",
    accountName: "Wei Chen",
    status: "expired",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-08T15:00:00.000Z",
    timeToFinish: undefined,

    verificationAttempts: { governmentId: 0, selfie: 0 },
    tags: [],
  },
  {
    id: "inq_5LlMmNnOoPpQqRrSsTtUuVvWwXxYy",
    accountId: "act_2UvWxYzAbCdEfGhIjKlMnOpQrStU",
    accountName: "Anna Kowalski",
    status: "approved",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-08T12:25:00.000Z",
    completedAt: "2026-02-08T12:31:40.000Z",
    timeToFinish: 400,

    verificationAttempts: { governmentId: 1, selfie: 1 },
    tags: ["Premium"],
  },
  {
    id: "inq_7NnOoPpQqRrSsTtUuVvWwXxYyZzAa",
    accountId: "act_4WxYzAbCdEfGhIjKlMnOpQrStUvW",
    accountName: "James Brown",
    status: "approved",
    templateName: "KYC: GovID Only",
    createdAt: "2026-02-08T10:10:00.000Z",
    completedAt: "2026-02-08T10:16:05.000Z",
    timeToFinish: 365,

    verificationAttempts: { governmentId: 1, selfie: 0 },
    tags: [],
  },
  {
    id: "inq_9PpQqRrSsTtUuVvWwXxYyZzAaBbCc",
    accountId: "act_6YzAbCdEfGhIjKlMnOpQrStUvWxY",
    accountName: "Fatima Al-Rashid",
    status: "created",
    templateName: "KYC + AML: GovID + Selfie",
    createdAt: "2026-02-10T17:00:00.000Z",
    timeToFinish: undefined,

    verificationAttempts: { governmentId: 0, selfie: 0 },
    tags: [],
  },
];

/* ── Generate 115 inquiries from shared seed data ── */
import { generatedPeople } from "./mock-data-seed";

for (const p of generatedPeople) {
  mockInquiries.push({
    id: generateId("inq", 100 + p.index),
    accountId: generateId("act", 100 + p.index),
    accountName: p.name,
    status: p.status,
    templateName: p.templateName,
    createdAt: p.createdAt,
    completedAt: p.completedAt,
    timeToFinish: p.timeToFinish,
    referenceId: p.referenceId,
    verificationAttempts: p.verificationAttempts,
    tags: p.tags,
  });
}

/* Sort all inquiries by createdAt descending */
mockInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
