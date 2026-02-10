import type { Report } from "@/lib/types";
import { generateId } from "./id-generator";

export const mockReports: Report[] = [
  {
    id: "rep_QYcXF5Py6QMkzZagc1XFKyTNPspV",
    inquiryId: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    accountId: "act_3ocpY1q1aBvfWMY4YNvdi9vgtTGx",
    type: "watchlist",
    status: "no_matches",
    primaryInput: "ALEXANDER J SAMPLE",
    templateName: "KYC + AML: Watchlist Report",
    createdAt: "2026-02-10T16:54:04.000Z",
    completedAt: "2026-02-10T16:54:05.000Z",
    continuousMonitoring: false,
    createdBy: "workflow",
    matchCount: 0,
  },
  {
    id: "rep_jEJ37Nhiqg1hWgxCNiWWr9RK38L",
    inquiryId: "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD",
    accountId: "act_3ocpY1q1aBvfWMY4YNvdi9vgtTGx",
    type: "pep",
    status: "no_matches",
    primaryInput: "ALEXANDER J SAMPLE",
    templateName: "KYC + AML: PEP Report",
    createdAt: "2026-02-10T16:54:04.000Z",
    completedAt: "2026-02-10T16:54:05.000Z",
    continuousMonitoring: false,
    createdBy: "workflow",
    matchCount: 0,
  },
  {
    id: "rep_A1bCdEfGhIjKlMnOpQrStUvWxYz",
    inquiryId: "inq_8kLmNpRsTuVwXyZaAbCdEfGhIjKl",
    accountId: "act_7FgHiJkLmNoPqRsTuVwXyZaBcDeF",
    type: "watchlist",
    status: "no_matches",
    primaryInput: "MARIA GONZALEZ",
    templateName: "KYC + AML: Watchlist Report",
    createdAt: "2026-02-10T14:28:16.000Z",
    completedAt: "2026-02-10T14:28:17.000Z",
    continuousMonitoring: true,
    createdBy: "workflow",
    matchCount: 0,
  },
  {
    id: "rep_B2cDeFgHiJkLmNoPqRsTuVwXyZaB",
    inquiryId: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    accountId: "act_2AbCdEfGhIjKlMnOpQrStUvWxYz",
    type: "watchlist",
    status: "match",
    primaryInput: "YUKI TANAKA",
    templateName: "KYC + AML: Watchlist Report",
    createdAt: "2026-02-10T10:41:21.000Z",
    completedAt: "2026-02-10T10:41:22.000Z",
    continuousMonitoring: true,
    createdBy: "workflow",
    matchCount: 2,
  },
  {
    id: "rep_C3dEfGhIjKlMnOpQrStUvWxYzAbC",
    inquiryId: "inq_5RsTuVwXyZaAbBcCdDdEeFfGgHhIi",
    accountId: "act_2AbCdEfGhIjKlMnOpQrStUvWxYz",
    type: "pep",
    status: "no_matches",
    primaryInput: "YUKI TANAKA",
    templateName: "KYC + AML: PEP Report",
    createdAt: "2026-02-10T10:41:21.000Z",
    completedAt: "2026-02-10T10:41:22.000Z",
    continuousMonitoring: false,
    createdBy: "workflow",
    matchCount: 0,
  },
  {
    id: "rep_D4eFgHiJkLmNoPqRsTuVwXyZaBcD",
    accountId: "act_5OpQrStUvWxYzAbCdEfGhIjKlMnO",
    type: "watchlist",
    status: "match",
    primaryInput: "LARS ERIKSSON",
    templateName: "Manual Watchlist Screening",
    createdAt: "2026-02-09T09:39:00.000Z",
    completedAt: "2026-02-09T09:39:05.000Z",
    continuousMonitoring: true,
    createdBy: "manual",
    matchCount: 1,
  },
];

/* ── Generate additional reports ── */
const reportNames = [
  "DAVID KIM", "MEGAN FOX", "RAJ GUPTA", "ISABELLA ROSSI", "OLIVER BROWN",
  "NADIA PETROV", "THOMAS WRIGHT", "LING ZHANG", "STEFAN MUELLER", "AISHA KHAN",
  "LUCAS SILVA", "EVA NOVAK", "MICHAEL O'BRIEN", "HANA WATANABE", "ROBERT TAYLOR",
  "CAMILLE BERNARD", "VIKTOR KOZLOV", "AMARA OBI", "HENRIK JOHANSSON", "CLARA VEGA",
  "DANIEL PARK", "SARA NILSSON", "ANDREI POPESCU", "LEILA AMIRI", "GEORGE WILSON",
  "NATASHA VOLKOV", "FELIPE MORENO", "FREYA SCHMIDT", "KENJI ITO", "ZARA HUSSAIN",
  "PIERRE LEFEBVRE", "MAYA SINGH", "IVAN HORVAT", "ELISA TORRES", "OSCAR LINDBERG",
];
const repTypes: Report["type"][] = ["watchlist", "pep", "watchlist", "adverse_media"];
const repStatuses: Report["status"][] = ["no_matches", "no_matches", "no_matches", "match"];
const repTemplates = ["KYC + AML: Watchlist Report", "KYC + AML: PEP Report", "Manual Watchlist Screening"];

for (let i = 0; i < reportNames.length; i++) {
  const date = new Date(2026, 0, 15 + Math.floor(i / 3), 9 + (i % 10), (i * 11) % 60);
  const status = repStatuses[i % repStatuses.length];
  mockReports.push({
    id: generateId("rep", 300 + i),
    accountId: generateId("act", 100 + i),
    type: repTypes[i % repTypes.length],
    status,
    primaryInput: reportNames[i],
    templateName: repTemplates[i % repTemplates.length],
    createdAt: date.toISOString(),
    completedAt: new Date(date.getTime() + 1000).toISOString(),
    continuousMonitoring: i % 3 === 0,
    createdBy: i % 5 === 0 ? "manual" : "workflow",
    matchCount: status === "match" ? 1 + (i % 3) : 0,
  });
}
