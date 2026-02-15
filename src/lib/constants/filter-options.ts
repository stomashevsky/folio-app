// Filter option arrays for Select components across the app.
// Organized by entity type for easy discovery and reuse.

// Inquiry filter options

export const INQUIRY_STATUS_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "expired", label: "Expired" },
  { value: "declined", label: "Declined" },
];

export const INQUIRY_TEMPLATE_OPTIONS = [
  { value: "KYC + AML: GovID + Selfie", label: "KYC + AML: GovID + Selfie" },
  { value: "KYC: GovID Only", label: "KYC: GovID Only" },
];

// TAG_OPTIONS is dynamic (derived from mock data), so it's not included here
// It's generated in the page component using: Array.from(new Set(...)).map(...)

// Verification filter options

export const VERIFICATION_STATUS_OPTIONS = [
  { value: "initiated", label: "Initiated" },
  { value: "submitted", label: "Submitted" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "requires_retry", label: "Requires Retry" },
  { value: "canceled", label: "Canceled" },
];

export const VERIFICATION_TYPE_OPTIONS = [
  { value: "government_id", label: "Government ID" },
  { value: "selfie", label: "Selfie" },
  { value: "database", label: "Database" },
  { value: "document", label: "Document" },
];

// Report filter options

export const REPORT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "ready", label: "Ready" },
  { value: "no_matches", label: "No Matches" },
  { value: "match", label: "Match" },
];

// REPORT_TYPE_OPTIONS is derived from REPORT_TYPE_LABELS in the page component
// It's generated using: Object.entries(REPORT_TYPE_LABELS).map(...)

export const REPORT_CREATED_BY_OPTIONS = [
  { value: "workflow", label: "Workflow" },
  { value: "manual", label: "Manual" },
  { value: "api", label: "API" },
];

// Account filter options

export const ACCOUNT_STATUS_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "closed", label: "Closed" },
];

// Check filter options (verification detail page)

export const CHECK_TYPE_OPTIONS = [
  { value: "fraud", label: "Fraud" },
  { value: "user_action_required", label: "User action required" },
  { value: "validity", label: "Validity" },
  { value: "biometrics", label: "Biometrics" },
];

export const CHECK_REQUIREMENT_OPTIONS = [
  { value: "required", label: "Required" },
  { value: "optional", label: "Optional" },
];

// Template filter options

export const TEMPLATE_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "disabled", label: "Disabled" },
];

// Analytics options

export const ANALYTICS_INTERVAL_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// ANALYTICS_FUNNEL_METRIC_OPTIONS has description JSX, so it's defined in the page component
// It's generated using: [{ value: "counts", label: "Counts", description: <OptionDesc>...</OptionDesc> }, ...]
