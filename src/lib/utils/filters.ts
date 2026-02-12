import type { Inquiry } from "@/lib/types";
import { DateTime } from "luxon";

export interface InquiryFilterValues {
  statuses: string[];
  templates: string[];
  tags: string[];
  dateFrom: DateTime | null;
  dateTo: DateTime | null;
  completedFrom: DateTime | null;
  completedTo: DateTime | null;
}

export function applyInquiryFilters(
  data: Inquiry[],
  filters: InquiryFilterValues
): Inquiry[] {
  const { statuses, templates, tags, dateFrom, dateTo, completedFrom, completedTo } = filters;

  const hasAny =
    statuses.length > 0 ||
    templates.length > 0 ||
    tags.length > 0 ||
    !!dateFrom ||
    !!completedFrom;

  if (!hasAny) return data;

  return data.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (templates.length && !templates.includes(item.templateName)) return false;
    if (tags.length && !tags.some((t) => item.tags.includes(t))) return false;
    if (dateFrom && dateTo) {
      const created = DateTime.fromISO(item.createdAt);
      if (created < dateFrom || created > dateTo) return false;
    }
    if (completedFrom && completedTo) {
      if (!item.completedAt) return false;
      const completed = DateTime.fromISO(item.completedAt);
      if (completed < completedFrom || completed > completedTo) return false;
    }
    return true;
  });
}
