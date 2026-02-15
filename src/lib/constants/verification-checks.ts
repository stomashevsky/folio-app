import type { CheckCategory, VerificationType } from "@/lib/types";

export interface AvailableCheck {
  name: string;
  category: CheckCategory;
  defaultRequired: boolean;
  defaultEnabled: boolean;
}

export const AVAILABLE_CHECKS: Record<VerificationType, AvailableCheck[]> = {
  government_id: [
    { name: "ID Document Authenticity", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "ID Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Barcode Detection", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "ID Tampering Detection", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "Face Clarity", category: "biometrics", defaultRequired: false, defaultEnabled: true },
    { name: "Country Supported", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Hologram Presence", category: "fraud", defaultRequired: false, defaultEnabled: false },
    { name: "Passport MRZ Validation", category: "validity", defaultRequired: false, defaultEnabled: false },
  ],
  selfie: [
    { name: "Liveness Detection", category: "biometrics", defaultRequired: true, defaultEnabled: true },
    { name: "Face Match to ID", category: "biometrics", defaultRequired: true, defaultEnabled: true },
    { name: "Face Clarity", category: "biometrics", defaultRequired: false, defaultEnabled: true },
    { name: "Glasses Detection", category: "biometrics", defaultRequired: false, defaultEnabled: false },
    { name: "Head Movement Challenge", category: "biometrics", defaultRequired: false, defaultEnabled: false },
  ],
  database: [
    { name: "Name Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Date of Birth Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Address Match", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "SSN/TIN Match", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Phone Ownership Match", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Carrier Risk Score", category: "fraud", defaultRequired: false, defaultEnabled: false },
  ],
  document: [
    { name: "Document Readable", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Document Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Document Tampering", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "Name Matches ID", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "Address Line Extraction", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Issue Date Window", category: "validity", defaultRequired: false, defaultEnabled: false },
  ],
};
