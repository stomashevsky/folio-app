// ─── Status Types ───

export type InquiryStatus =
  | "created"
  | "pending"
  | "completed"
  | "approved"
  | "declined"
  | "needs_review"
  | "expired";

export type VerificationStatus =
  | "initiated"
  | "submitted"
  | "passed"
  | "failed"
  | "requires_retry"
  | "canceled";

export type VerificationType = "government_id" | "selfie" | "database" | "document";

export type ReportStatus = "pending" | "ready" | "no_matches" | "match";

export type ReportType = "watchlist" | "pep" | "adverse_media";

export type AccountStatus = "default" | "active" | "suspended" | "closed";

export type CheckStatus = "passed" | "failed" | "not_applicable";

export type CheckCategory = "fraud" | "user_action_required" | "validity" | "biometrics";

export type SignalLevel = "low" | "medium" | "high";

// ─── Core Entities ───

export interface Inquiry {
  id: string; // inq_...
  referenceId?: string;
  accountId: string; // act_...
  accountName: string;
  status: InquiryStatus;
  templateName: string;
  createdAt: string; // ISO 8601
  completedAt?: string;
  timeToFinish?: number; // seconds
  verificationAttempts: {
    governmentId: number;
    selfie: number;
  };
  tags: string[];
}

export interface Verification {
  id: string; // ver_...
  inquiryId: string;
  type: VerificationType;
  status: VerificationStatus;
  createdAt: string;
  completedAt?: string;
  checks: Check[];
  extractedData?: Record<string, string>;
  photos?: VerificationPhoto[];
}

export interface VerificationPhoto {
  url: string;
  label: string; // "Front", "Back", "Look ahead", etc.
  captureMethod: "manual" | "auto";
}

export interface DocumentViewerItem {
  photo: VerificationPhoto;
  extractedData?: Record<string, string>;
  verificationType: string; // "Government ID", "Selfie"
}

export interface Check {
  name: string;
  status: CheckStatus;
  category: CheckCategory;
  required: boolean;
  reasons?: string[];
}

export interface ReportMatch {
  id: string;
  name: string;
  score: number;
  source: string;
  country?: string;
  matchType: "exact" | "partial" | "fuzzy";
  listedDate?: string;
  aliases?: string[];
  status: "pending_review" | "confirmed" | "dismissed";
}

export interface Report {
  id: string; // rep_...
  inquiryId?: string;
  accountId?: string;
  type: ReportType;
  status: ReportStatus;
  primaryInput: string; // name
  templateName: string;
  createdAt: string;
  completedAt?: string;
  continuousMonitoring: boolean;
  createdBy: "workflow" | "manual" | "api";
  matchCount: number;
  matches?: ReportMatch[];
}

export interface Account {
  id: string; // act_...
  referenceId?: string;
  name: string;
  birthdate?: string;
  address?: string;
  age?: number;
  status: AccountStatus;
  type: string; // "User"
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  inquiryCount: number;
  verificationCount: number;
  reportCount: number;
}

// ─── Signals ───

export interface Signal {
  name: string;
  value: string | number | boolean;
  type: "processed" | "raw";
  level?: SignalLevel;
}

export interface BehavioralRisk {
  behaviorThreatLevel: SignalLevel;
  botScore: number;
  requestSpoofAttempts: number;
  userAgentSpoofAttempts: number;
  completionTime: number; // seconds
  distractionEvents: number;
  hesitationPercent: number;
  shortcutCopies: number;
  pastes: number;
  autofillStarts: number;
  mobileSdkRestricted: number;
  apiVersionRestricted: number;
}

// ─── Analytics ───

export interface AnalyticsOverview {
  totalInquiries: number;
  approvalRate: number;
  avgCompletionTime: number; // seconds
  pendingReview: number;
  inquiriesTrend: number; // % change
  approvalTrend: number;
  completionTimeTrend: number;
  pendingReviewTrend: number;
}

export interface TimeSeriesPoint {
  date: string; // ISO 8601 date
  value: number;
  label?: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  key: string; // machine key, e.g. "doc_uploaded"
  count: number;
  percentage: number; // relative to first step
  dropoff: number; // % dropped from previous step
  color: string; // hex color for chart rendering
}

// ─── Sankey Funnel ───

export type SankeyLinkType = "success" | "failure" | "abandon";

export interface SankeyNode {
  name: string;
  color: string;
  count: number;
}

export interface SankeyLink {
  source: number; // index into nodes array
  target: number;
  value: number; // flow count
  type: SankeyLinkType;
}

export interface SankeyFunnelData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Funnel time series: each day has a conversion rate (0-100) per funnel step
export interface FunnelTimeSeriesPoint {
  date: string; // ISO 8601 date
  [stepKey: string]: number | string; // step keys map to rates
}

// Analytics interval for chart granularity
export type AnalyticsInterval = "daily" | "weekly" | "monthly";

// Rate time series: each day has completion + approval rates
export interface RateTimeSeriesPoint {
  date: string; // ISO 8601 date
  completionRate: number; // 0-100
  approvalRate: number; // 0-100
}

// Highlights strip: compact metrics shown in a horizontal row
export interface HighlightMetric {
  label: string;
  value: string;
  description?: string;
  tooltip?: string;
}

// ─── Table & UI Types ───

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  search?: string;
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// ─── Event Timeline ───

export type TimelineEventLevel = "info" | "success" | "error" | "warning";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  level: TimelineEventLevel;
  description: string;
  actor?: string; // "workflow", "system", "user"
}

// ─── Inquiry Session ───

export interface InquirySession {
  id: string;
  inquiryId: string;
  // Timestamps
  createdAt: string;
  startedAt: string;
  expiredAt?: string;
  // Network details
  ipAddress: string;
  networkThreatLevel: string; // "Low" | "Medium" | "High"
  networkCountry: string;
  networkRegion: string;
  ipLatitude: number;
  ipLongitude: number;
  torConnection: boolean;
  vpn: boolean;
  publicProxy: boolean;
  privateProxy: boolean;
  isp: string;
  ipConnectionType: string; // "residential" | "corporate" | "mobile"
  httpReferer: string;
  // Device details
  deviceToken: string;
  deviceHandoffMethod: string;
  deviceType: string; // "desktop" | "mobile"
  deviceOs: string;
  browser: string;
  browserFingerprint: string;
  gpsLatitude: number;
  gpsLongitude: number;
}

// ─── Inquiry Signal ───

export type SignalCategory = "featured" | "network" | "behavioral" | "device";

export interface InquirySignal {
  name: string;
  value: string;
  type: "Processed" | "Raw";
  flagged: boolean;
  category: SignalCategory;
}
