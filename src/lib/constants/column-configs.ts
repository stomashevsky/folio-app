import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import type { VisibilityState } from "@tanstack/react-table";

// Inquiry columns

export const INQUIRY_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "accountName", label: "Name" },
  { id: "id", label: "Inquiry ID" },
  { id: "templateName", label: "Template" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "referenceId", label: "Reference ID" },
  { id: "completedAt", label: "Completed at" },
  { id: "tags", label: "Tags" },
];

export const INQUIRY_DEFAULT_VISIBILITY: VisibilityState = {
  accountName: true,
  id: true,
  templateName: true,
  createdAt: true,
  status: true,
  referenceId: false,
  completedAt: false,
  tags: false,
};

// Verification columns

export const VERIFICATION_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "type", label: "Type" },
  { id: "id", label: "Verification ID" },
  { id: "inquiryId", label: "Inquiry ID" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "completedAt", label: "Completed at" },
];

export const VERIFICATION_DEFAULT_VISIBILITY: VisibilityState = {
  type: true,
  id: true,
  inquiryId: true,
  createdAt: true,
  status: true,
  completedAt: false,
};

// Report columns

export const REPORT_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "primaryInput", label: "Primary Input" },
  { id: "type", label: "Type" },
  { id: "id", label: "Report ID" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "templateName", label: "Template" },
  { id: "completedAt", label: "Completed at" },
  { id: "createdBy", label: "Created by" },
  { id: "matchCount", label: "Matches" },
  { id: "continuousMonitoring", label: "Monitoring" },
];

export const REPORT_DEFAULT_VISIBILITY: VisibilityState = {
  primaryInput: true,
  type: true,
  id: true,
  createdAt: true,
  status: true,
  templateName: false,
  completedAt: false,
  createdBy: false,
  matchCount: false,
  continuousMonitoring: false,
};

// Account columns

export const ACCOUNT_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Account ID" },
  { id: "type", label: "Type" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "updatedAt", label: "Updated at" },
  { id: "referenceId", label: "Reference ID" },
  { id: "inquiryCount", label: "Inquiries" },
  { id: "verificationCount", label: "Verifications" },
  { id: "reportCount", label: "Reports" },
];

export const ACCOUNT_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: true,
  type: true,
  createdAt: true,
  status: true,
  updatedAt: false,
  referenceId: false,
  inquiryCount: false,
  verificationCount: false,
  reportCount: false,
};
