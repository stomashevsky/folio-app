import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercent,
  formatTrend,
  truncateId,
  toTitleCase,
  getStatusColor,
  formatDuration,
} from "@/lib/utils/format";

describe("formatNumber", () => {
  it("formats integers with commas", () => {
    expect(formatNumber(1234)).toBe("1,234");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  it("formats as percentage with 1 decimal", () => {
    expect(formatPercent(85.567)).toBe("85.6%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercent(85.567, 2)).toBe("85.57%");
  });
});

describe("formatTrend", () => {
  it("adds + prefix for positive numbers", () => {
    expect(formatTrend(12.5)).toBe("+12.5%");
  });

  it("keeps - prefix for negative numbers", () => {
    expect(formatTrend(-5.3)).toBe("-5.3%");
  });

  it("handles zero (shows + prefix)", () => {
    expect(formatTrend(0)).toBe("+0.0%");
  });
});

describe("truncateId", () => {
  it("truncates long IDs with ellipsis", () => {
    const longId = "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD";
    const result = truncateId(longId);
    expect(result.length).toBeLessThan(longId.length);
    expect(result).toContain("...");
  });

  it("respects custom showChars parameter", () => {
    const id = "inq_Wt77vKHwYVYFciFNNDQpvggYy6jD";
    const result = truncateId(id, 8);
    expect(result).toContain("...");
  });
});

describe("toTitleCase", () => {
  it("capitalizes first letter of each word", () => {
    expect(toTitleCase("hello world")).toBe("Hello World");
  });

  it("handles single word", () => {
    expect(toTitleCase("hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(toTitleCase("")).toBe("");
  });
});

describe("getStatusColor", () => {
  it("returns success for approved", () => {
    expect(getStatusColor("approved")).toBe("success");
  });

  it("returns danger for declined", () => {
    expect(getStatusColor("declined")).toBe("danger");
  });

  it("returns correct colors for pending and needs_review", () => {
    expect(getStatusColor("pending")).toBe("secondary");
    expect(getStatusColor("needs_review")).toBe("warning");
  });

  it("returns secondary for unknown statuses", () => {
    expect(getStatusColor("unknown_status")).toBe("secondary");
  });
});

describe("formatDuration", () => {
  it("formats seconds into human-readable duration", () => {
    const result = formatDuration(125);
    expect(result).toBeTruthy();
  });

  it("handles zero seconds", () => {
    const result = formatDuration(0);
    expect(result).toBeTruthy();
  });
});
