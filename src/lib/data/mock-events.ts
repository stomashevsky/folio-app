import type { TimelineEvent } from "@/lib/types";
import { mockInquiries } from "./mock-inquiries";
import { mockVerifications } from "./mock-verifications";
import { mockReports } from "./mock-reports";

/**
 * Generate realistic timeline events for an inquiry based on its status and verifications.
 */
function generateEventsForInquiry(inquiryId: string): TimelineEvent[] {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return [];

  const events: TimelineEvent[] = [];
  let eventIdx = 0;
  const eid = () => `evt_${inquiryId}_${eventIdx++}`;

  const createdDate = new Date(inquiry.createdAt);

  // 1. Inquiry created
  events.push({
    id: eid(),
    timestamp: inquiry.createdAt,
    type: "inquiry.created",
    level: "info",
    description: "Inquiry created",
  });

  // 2. Inquiry session started (3 seconds after creation)
  const sessionStart = new Date(createdDate.getTime() + 3000);
  events.push({
    id: eid(),
    timestamp: sessionStart.toISOString(),
    type: "session.started",
    level: "info",
    description: "Inquiry session started",
  });

  // If inquiry has no verifications (created/pending/expired), stop early
  const verifications = mockVerifications.filter(
    (v) => v.inquiryId === inquiryId
  );

  if (verifications.length === 0) {
    return events.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 3. Step changes and verification events
  const hasGovId = verifications.some((v) => v.type === "government_id");
  const hasSelfie = verifications.some((v) => v.type === "selfie");

  if (hasGovId) {
    // Country select step
    const countrySelectTime = new Date(sessionStart.getTime() + 5000);
    events.push({
      id: eid(),
      timestamp: countrySelectTime.toISOString(),
      type: "step.changed",
      level: "info",
      description:
        "Step changed from Start to Country select after 5s",
    });

    const govIdVer = verifications.find((v) => v.type === "government_id");
    if (govIdVer) {
      // Step to GovID
      const toGovId = new Date(
        new Date(govIdVer.createdAt).getTime() - 2000
      );
      events.push({
        id: eid(),
        timestamp: toGovId.toISOString(),
        type: "step.changed",
        level: "info",
        description:
          "Step changed from Country select to Government ID verification after " +
          formatTimeDiff(countrySelectTime, toGovId),
      });

      // GovID started
      events.push({
        id: eid(),
        timestamp: govIdVer.createdAt,
        type: "verification.started",
        level: "info",
        description: "Government ID verification started",
      });

      // GovID submitted
      if (govIdVer.completedAt) {
        const submittedAt = new Date(
          new Date(govIdVer.createdAt).getTime() + 1000
        );
        events.push({
          id: eid(),
          timestamp: submittedAt.toISOString(),
          type: "verification.submitted",
          level: "info",
          description: "Government ID verification submitted",
        });

        // GovID passed/failed
        events.push({
          id: eid(),
          timestamp: govIdVer.completedAt,
          type:
            govIdVer.status === "passed"
              ? "verification.passed"
              : "verification.failed",
          level: govIdVer.status === "passed" ? "success" : "error",
          description: `Government ID verification ${govIdVer.status}`,
        });

        // GovID flow routed
        events.push({
          id: eid(),
          timestamp: new Date(
            new Date(govIdVer.completedAt).getTime() + 1000
          ).toISOString(),
          type: "flow.routed",
          level: "info",
          description: `Government ID flow routed through the ${govIdVer.status} branch`,
        });
      }
    }
  }

  if (hasSelfie) {
    const selfieVer = verifications.find((v) => v.type === "selfie");
    const govIdVer = verifications.find((v) => v.type === "government_id");
    if (selfieVer) {
      // Step to selfie
      if (govIdVer?.completedAt) {
        const stepTime = new Date(
          new Date(govIdVer.completedAt).getTime() + 2000
        );
        events.push({
          id: eid(),
          timestamp: stepTime.toISOString(),
          type: "step.changed",
          level: "info",
          description:
            "Step changed from Government ID verification to Selfie verification after " +
            formatTimeDiff(new Date(govIdVer.createdAt), stepTime),
        });
      }

      // Selfie started
      events.push({
        id: eid(),
        timestamp: selfieVer.createdAt,
        type: "verification.started",
        level: "info",
        description: "Selfie verification started",
      });

      // Selfie submitted
      if (selfieVer.completedAt) {
        events.push({
          id: eid(),
          timestamp: new Date(
            new Date(selfieVer.createdAt).getTime() + 500
          ).toISOString(),
          type: "verification.submitted",
          level: "info",
          description: "Selfie verification submitted",
        });

        // Selfie passed/failed
        events.push({
          id: eid(),
          timestamp: selfieVer.completedAt,
          type:
            selfieVer.status === "passed"
              ? "verification.passed"
              : "verification.failed",
          level: selfieVer.status === "passed" ? "success" : "error",
          description: `Selfie verification ${selfieVer.status}`,
        });

        // Selfie flow routed
        events.push({
          id: eid(),
          timestamp: new Date(
            new Date(selfieVer.completedAt).getTime() + 500
          ).toISOString(),
          type: "flow.routed",
          level: "info",
          description: `Selfie flow routed through the ${selfieVer.status} branch`,
        });

        // Step to success
        events.push({
          id: eid(),
          timestamp: new Date(
            new Date(selfieVer.completedAt).getTime() + 1000
          ).toISOString(),
          type: "step.changed",
          level: "info",
          description: `Step changed from Selfie verification to Success after ${
            Math.round(
              (new Date(selfieVer.completedAt).getTime() -
                new Date(selfieVer.createdAt).getTime()) /
                1000
            )
          }s`,
        });
      }
    }
  }

  // 4. Inquiry completed
  if (inquiry.completedAt) {
    events.push({
      id: eid(),
      timestamp: inquiry.completedAt,
      type: "inquiry.completed",
      level: "success",
      description: "Inquiry completed",
    });
  }

  // 5. Workflow decision
  if (
    inquiry.status === "approved" ||
    inquiry.status === "declined" ||
    inquiry.status === "needs_review"
  ) {
    const workflowName = "KYC + AML: Inquiry Completed - Enrich and Decision";
    const decisionTime = inquiry.completedAt
      ? new Date(new Date(inquiry.completedAt).getTime() + 2000).toISOString()
      : inquiry.createdAt;

    events.push({
      id: eid(),
      timestamp: decisionTime,
      type: "workflow.triggered",
      level: "info",
      description: `${workflowName} workflow triggered by inquiry.completed event`,
      actor: "workflow",
    });

    events.push({
      id: eid(),
      timestamp: decisionTime,
      type: `inquiry.${inquiry.status}`,
      level:
        inquiry.status === "approved"
          ? "success"
          : inquiry.status === "declined"
            ? "error"
            : "warning",
      description: `Inquiry ${inquiry.status} by ${workflowName} workflow`,
      actor: "workflow",
    });
  }

  // Sort chronologically (newest first for display)
  return events.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

function formatTimeDiff(from: Date, to: Date): string {
  const diffMs = Math.abs(to.getTime() - from.getTime());
  const totalSeconds = Math.round(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

const eventCache = new Map<string, TimelineEvent[]>();

export function getEventsForInquiry(inquiryId: string): TimelineEvent[] {
  if (!eventCache.has(inquiryId)) {
    eventCache.set(inquiryId, generateEventsForInquiry(inquiryId));
  }
  return eventCache.get(inquiryId)!;
}

const accountEventCache = new Map<string, TimelineEvent[]>();

export function getEventsForAccount(accountId: string): TimelineEvent[] {
  if (!accountEventCache.has(accountId)) {
    const accountInquiries = mockInquiries.filter(
      (i) => i.accountId === accountId
    );
    const allEvents: TimelineEvent[] = [];
    for (const inquiry of accountInquiries) {
      allEvents.push(...getEventsForInquiry(inquiry.id));
    }
    allEvents.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    accountEventCache.set(accountId, allEvents);
  }
  return accountEventCache.get(accountId)!;
}

const reportEventCache = new Map<string, TimelineEvent[]>();

export function getEventsForReport(reportId: string): TimelineEvent[] {
  if (!reportEventCache.has(reportId)) {
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) {
      reportEventCache.set(reportId, []);
      return [];
    }

    const events: TimelineEvent[] = [];
    let idx = 0;
    const eid = () => `evt_rep_${reportId}_${idx++}`;

    events.push({
      id: eid(),
      timestamp: report.createdAt,
      type: "report.created",
      level: "info",
      description: `${report.type === "pep" ? "PEP" : "Watchlist"} report created`,
      actor: report.createdBy,
    });

    if (report.completedAt) {
      const completedDate = new Date(report.completedAt);

      events.push({
        id: eid(),
        timestamp: new Date(completedDate.getTime() - 500).toISOString(),
        type: "report.screening",
        level: "info",
        description: `Screening ${report.primaryInput} against databases`,
      });

      if (report.matchCount > 0) {
        events.push({
          id: eid(),
          timestamp: report.completedAt,
          type: "report.matches_found",
          level: "warning",
          description: `${report.matchCount} match${report.matchCount > 1 ? "es" : ""} identified — review required`,
        });
      } else {
        events.push({
          id: eid(),
          timestamp: report.completedAt,
          type: "report.clear",
          level: "success",
          description: "Screening complete — no matches found",
        });
      }

      if (report.continuousMonitoring) {
        events.push({
          id: eid(),
          timestamp: new Date(completedDate.getTime() + 500).toISOString(),
          type: "report.monitoring_enabled",
          level: "info",
          description: "Continuous monitoring enabled",
        });
      }
    }

    events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    reportEventCache.set(reportId, events);
  }
  return reportEventCache.get(reportId)!;
}
