import type { Report, ReportMatch } from "@/lib/types";
import { generateId } from "./id-generator";

const watchlistSources = [
  "OFAC SDN List",
  "EU Consolidated Sanctions",
  "UN Security Council",
  "UK HMT Sanctions",
  "Australia DFAT Sanctions",
  "Canada OSFI List",
];

const pepSources = [
  "PEP Database — National",
  "PEP Database — International",
  "World Leaders Index",
];

function generateMatches(
  primaryInput: string,
  matchCount: number,
  reportType: string,
  seed: number,
): ReportMatch[] {
  const sources = reportType === "pep" ? pepSources : watchlistSources;
  const matches: ReportMatch[] = [];
  const names = primaryInput.split(" ");
  const surname = names[names.length - 1];

  const matchNames = [
    primaryInput,
    `${names[0]} ${surname.charAt(0)}. ${surname}`,
    `${surname}, ${names[0]}`,
    `${names[0]} ${surname}-HASSAN`,
  ];

  const countries = ["Iran", "North Korea", "Syria", "Russia", "Myanmar", "Libya"];

  for (let i = 0; i < matchCount; i++) {
    const idx = (seed + i) % matchNames.length;
    const sourceIdx = (seed + i) % sources.length;
    const countryIdx = (seed + i * 3) % countries.length;
    const score = i === 0 ? 92 - (seed % 10) : 78 - (i * 7) - (seed % 5);

    matches.push({
      id: `mtch_${generateId("m", seed * 100 + i).slice(2)}`,
      name: matchNames[idx],
      score: Math.max(55, Math.min(98, score)),
      source: sources[sourceIdx],
      country: countries[countryIdx],
      matchType: score > 85 ? "exact" : score > 70 ? "partial" : "fuzzy",
      listedDate: `20${10 + (seed % 15)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (seed % 28)).padStart(2, "0")}`,
      aliases: i === 0 ? [`${surname} ${names[0]}`, `${names[0].charAt(0)}. ${surname}`] : undefined,
      status: i === 0 ? "pending_review" : "pending_review",
    });
  }

  return matches;
}

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
    matches: generateMatches("YUKI TANAKA", 2, "watchlist", 41),
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
    matches: generateMatches("LARS ERIKSSON", 1, "watchlist", 39),
  },
];

/* ── Generate reports from shared seed data ── */
import { generatedPeople } from "./mock-data-seed";

let repIdx = 300;

for (const p of generatedPeople) {
  const isAml = p.templateName.includes("AML");
  const finished = p.status === "approved" || p.status === "declined" || p.status === "needs_review";

  // Only AML-template completed inquiries get reports
  if (!isAml || !finished) continue;

  const inquiryId = generateId("inq", 100 + p.index);
  const accountId = generateId("act", 100 + p.index);
  const reportDate = p.completedAt ?? p.createdAt;
  const reportTime = new Date(new Date(reportDate).getTime() + 1000);

  // needs_review → watchlist match; others → no_matches
  const watchlistStatus: Report["status"] = p.status === "needs_review" ? "match" : "no_matches";
  const watchlistMatches = watchlistStatus === "match" ? 1 + (p.index % 3) : 0;

  // Watchlist report
  mockReports.push({
    id: generateId("rep", repIdx++),
    inquiryId,
    accountId,
    type: "watchlist",
    status: watchlistStatus,
    primaryInput: p.name.toUpperCase(),
    templateName: "KYC + AML: Watchlist Report",
    createdAt: reportTime.toISOString(),
    completedAt: new Date(reportTime.getTime() + 1000).toISOString(),
    continuousMonitoring: watchlistStatus === "match" || p.index % 4 === 0,
    createdBy: "workflow",
    matchCount: watchlistMatches,
    matches:
      watchlistMatches > 0
        ? generateMatches(p.name.toUpperCase(), watchlistMatches, "watchlist", p.index)
        : undefined,
  });

  // PEP report
  mockReports.push({
    id: generateId("rep", repIdx++),
    inquiryId,
    accountId,
    type: "pep",
    status: "no_matches",
    primaryInput: p.name.toUpperCase(),
    templateName: "KYC + AML: PEP Report",
    createdAt: reportTime.toISOString(),
    completedAt: new Date(reportTime.getTime() + 1000).toISOString(),
    continuousMonitoring: false,
    createdBy: "workflow",
    matchCount: 0,
  });
}
