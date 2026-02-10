import { DateTime } from "luxon";

export function formatDate(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("LLL dd, yyyy");
}

export function formatDateTime(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("LLL dd, yyyy HH:mm");
}

export function formatDateShort(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("MM/dd/yyyy");
}

export function formatRelativeTime(isoDate: string): string {
  return DateTime.fromISO(isoDate).toRelative() ?? "";
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}s`;
  return `${minutes}m ${secs}s`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatTrend(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function truncateId(id: string, showChars = 12): string {
  if (id.length <= showChars + 4) return id;
  const prefix = id.split("_")[0];
  const rest = id.slice(prefix.length + 1);
  return `${prefix}_${rest.slice(0, showChars)}...`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Inquiry
    approved: "success",
    declined: "danger",
    needs_review: "warning",
    pending: "secondary",
    created: "secondary",
    completed: "info",
    expired: "secondary",
    // Verification
    passed: "success",
    failed: "danger",
    requires_retry: "caution",
    initiated: "secondary",
    submitted: "info",
    canceled: "secondary",
    // Report
    no_matches: "success",
    match: "danger",
    ready: "info",
    // Account
    active: "success",
    suspended: "warning",
    closed: "danger",
    default: "secondary",
  };
  return map[status] ?? "secondary";
}
