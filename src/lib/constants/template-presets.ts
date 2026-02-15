import type {
  InquiryTemplateStep,
  ReportType,
  VerificationType,
  VerificationCheckConfig,
} from "@/lib/types";

// ─── Shared types ───

export interface TemplatePreset<T extends "inquiry" | "verification" | "report"> {
  id: string;
  name: string;
  description: string;
  icon: string;
  templateType: T;
  defaults: T extends "inquiry"
    ? InquiryPresetDefaults
    : T extends "verification"
      ? VerificationPresetDefaults
      : ReportPresetDefaults;
}

export interface InquiryPresetDefaults {
  name: string;
  description: string;
  steps: InquiryTemplateStep[];
  settings: {
    expiresInDays: number;
    redirectUrl?: string;
  };
}

export interface VerificationPresetDefaults {
  name: string;
  type: VerificationType;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
}

export interface ReportPresetDefaults {
  name: string;
  type: ReportType;
  screeningSources: string[];
  settings: {
    matchThreshold: number;
    continuousMonitoring: boolean;
    monitoringFrequencyDays: number;
    enableFuzzyMatch: boolean;
  };
}

// ─── Inquiry Template Presets ───

export const INQUIRY_TEMPLATE_PRESETS: TemplatePreset<"inquiry">[] = [
  {
    id: "inq_preset_gov_id_selfie",
    name: "Government ID + Selfie",
    description: "Full identity verification with government ID and biometric selfie match",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "KYC: GovID + Selfie",
      description: "Identity verification with government ID and selfie match",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
  {
    id: "inq_preset_gov_id_only",
    name: "Government ID Only",
    description: "Basic identity check using a government-issued ID document",
    icon: "🆔",
    templateType: "inquiry",
    defaults: {
      name: "KYC: GovID Only",
      description: "Basic identity verification with government ID only",
      steps: [
        { verificationType: "government_id", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_selfie_only",
    name: "Selfie Only",
    description: "Low-friction selfie-based liveness check for returning users",
    icon: "🤳",
    templateType: "inquiry",
    defaults: {
      name: "Quick Onboarding: Selfie Only",
      description: "Selfie-only flow for low-friction returning user verification",
      steps: [
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 3 },
    },
  },
  {
    id: "inq_preset_document",
    name: "Document Verification",
    description: "Verify uploaded documents like utility bills or bank statements",
    icon: "📄",
    templateType: "inquiry",
    defaults: {
      name: "Document Verification",
      description: "Document upload verification for proof of address or other documents",
      steps: [
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 21 },
    },
  },
  {
    id: "inq_preset_enhanced_dd",
    name: "Enhanced Due Diligence",
    description: "Multi-step verification for high-risk accounts with all check types",
    icon: "🔒",
    templateType: "inquiry",
    defaults: {
      name: "Enhanced Due Diligence",
      description: "Multi-step verification for high-risk accounts with document, selfie, and database checks",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 2 },
        { verificationType: "selfie", required: true, onPass: "continue", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
        { verificationType: "database", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
  {
    id: "inq_preset_database_only",
    name: "Database Check Only",
    description: "Automated database verification without document or biometric steps",
    icon: "🗄️",
    templateType: "inquiry",
    defaults: {
      name: "Database Check",
      description: "Automated database verification without document or biometric steps",
      steps: [
        { verificationType: "database", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
];

// ─── Verification Template Presets ───

export const VERIFICATION_TEMPLATE_PRESETS: TemplatePreset<"verification">[] = [
  {
    id: "ver_preset_gov_id",
    name: "Government ID",
    description: "Standard government ID verification with authenticity and expiry checks",
    icon: "🪪",
    templateType: "verification",
    defaults: {
      name: "Government ID",
      type: "government_id",
      checks: [
        { name: "ID Document Authenticity", category: "fraud", required: true, enabled: true },
        { name: "ID Not Expired", category: "validity", required: true, enabled: true },
        { name: "Barcode Detection", category: "validity", required: false, enabled: true },
        { name: "ID Tampering Detection", category: "fraud", required: true, enabled: true },
        { name: "Face Clarity", category: "biometrics", required: false, enabled: true },
        { name: "Country Supported", category: "validity", required: true, enabled: true },
      ],
      settings: { allowedCountries: ["US", "CA", "GB"], maxRetries: 3, captureMethod: "auto" },
    },
  },
  {
    id: "ver_preset_selfie",
    name: "Selfie",
    description: "Biometric selfie verification with liveness detection and face matching",
    icon: "🤳",
    templateType: "verification",
    defaults: {
      name: "Selfie",
      type: "selfie",
      checks: [
        { name: "Liveness Detection", category: "biometrics", required: true, enabled: true },
        { name: "Face Match to ID", category: "biometrics", required: true, enabled: true },
        { name: "Face Clarity", category: "biometrics", required: false, enabled: true },
        { name: "Glasses Detection", category: "biometrics", required: false, enabled: false },
      ],
      settings: { allowedCountries: ["US", "CA", "AU", "NZ"], maxRetries: 2, captureMethod: "both" },
    },
  },
  {
    id: "ver_preset_document",
    name: "Document",
    description: "Document upload verification for proof of address and similar documents",
    icon: "📄",
    templateType: "verification",
    defaults: {
      name: "Document Upload",
      type: "document",
      checks: [
        { name: "Document Readable", category: "validity", required: true, enabled: true },
        { name: "Document Not Expired", category: "validity", required: true, enabled: true },
        { name: "Document Tampering", category: "fraud", required: true, enabled: true },
        { name: "Name Matches ID", category: "validity", required: false, enabled: true },
      ],
      settings: { allowedCountries: ["US", "GB", "IE"], maxRetries: 2, captureMethod: "manual" },
    },
  },
  {
    id: "ver_preset_database",
    name: "Database",
    description: "Automated database verification against identity records",
    icon: "🗄️",
    templateType: "verification",
    defaults: {
      name: "Database Verification",
      type: "database",
      checks: [
        { name: "Name Match", category: "validity", required: true, enabled: true },
        { name: "Date of Birth Match", category: "validity", required: true, enabled: true },
        { name: "Address Match", category: "validity", required: false, enabled: true },
        { name: "SSN/TIN Match", category: "validity", required: false, enabled: false },
      ],
      settings: { allowedCountries: ["US"], maxRetries: 2, captureMethod: "auto" },
    },
  },
];

// ─── Report Template Presets ───

export const REPORT_TEMPLATE_PRESETS: TemplatePreset<"report">[] = [
  {
    id: "rep_preset_watchlist",
    name: "Watchlist",
    description: "Screen against global sanctions and watchlists including OFAC, UN, and EU",
    icon: "🔍",
    templateType: "report",
    defaults: {
      name: "Watchlist Screening",
      type: "watchlist",
      screeningSources: [
        "OFAC SDN List",
        "UN Consolidated List",
        "EU Sanctions List",
        "UK HMT Sanctions",
        "Australia DFAT Sanctions",
        "Canada OSFI",
      ],
      settings: {
        matchThreshold: 85,
        continuousMonitoring: true,
        monitoringFrequencyDays: 1,
        enableFuzzyMatch: true,
      },
    },
  },
  {
    id: "rep_preset_pep",
    name: "Politically Exposed Person",
    description: "Identify politically exposed persons and their close associates",
    icon: "🏛️",
    templateType: "report",
    defaults: {
      name: "PEP Report",
      type: "pep",
      screeningSources: [
        "Global PEP Database",
        "National PEP Lists",
        "Relatives & Close Associates",
        "State-Owned Enterprises",
      ],
      settings: {
        matchThreshold: 82,
        continuousMonitoring: true,
        monitoringFrequencyDays: 7,
        enableFuzzyMatch: true,
      },
    },
  },
  {
    id: "rep_preset_adverse_media",
    name: "Adverse Media",
    description: "Monitor for negative news coverage including financial crime and regulatory actions",
    icon: "📰",
    templateType: "report",
    defaults: {
      name: "Adverse Media Monitoring",
      type: "adverse_media",
      screeningSources: [
        "Financial Crime News",
        "Regulatory Actions",
        "Court Records",
        "Negative News Screening",
      ],
      settings: {
        matchThreshold: 68,
        continuousMonitoring: true,
        monitoringFrequencyDays: 2,
        enableFuzzyMatch: true,
      },
    },
  },
];
