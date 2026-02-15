"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { TEMPLATE_STATUS_OPTIONS } from "@/lib/constants/filter-options";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { useTemplateStore } from "@/lib/stores/template-store";
import type {
  ReportTemplate,
  ReportType,
  TemplateStatus,
} from "@/lib/types";

import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Slider } from "@plexui/ui/components/Slider";
import { Switch } from "@plexui/ui/components/Switch";

type ReportTemplateForm = {
  name: string;
  type: ReportType;
  status: TemplateStatus;
  screeningSources: string[];
  settings: {
    matchThreshold: number;
    continuousMonitoring: boolean;
    monitoringFrequencyDays: number;
    enableFuzzyMatch: boolean;
  };
};

const REPORT_TYPE_OPTIONS = Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const DEFAULT_REPORT_FORM: ReportTemplateForm = {
  name: "",
  type: "watchlist",
  status: "draft",
  screeningSources: [],
  settings: {
    matchThreshold: 80,
    continuousMonitoring: false,
    monitoringFrequencyDays: 30,
    enableFuzzyMatch: true,
  },
};

function normalizeReportTemplate(template: ReportTemplate): ReportTemplateForm {
  return {
    name: template.name,
    type: template.type,
    status: template.status,
    screeningSources: template.screeningSources,
    settings: {
      matchThreshold: template.settings.matchThreshold,
      continuousMonitoring: template.settings.continuousMonitoring,
      monitoringFrequencyDays: template.settings.monitoringFrequencyDays,
      enableFuzzyMatch: template.settings.enableFuzzyMatch,
    },
  };
}

export default function ReportTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { reportTemplates } = useTemplateStore();

  const isCreateMode = id === "new";
  const allTemplates = reportTemplates.getAll();
  const existingTemplate = isCreateMode ? undefined : reportTemplates.getById(id);

  const availableSourcesByType = useMemo(() => {
    return allTemplates.reduce<Record<ReportType, string[]>>(
      (acc, template) => {
        template.screeningSources.forEach((source) => {
          if (!acc[template.type].includes(source)) {
            acc[template.type].push(source);
          }
        });
        return acc;
      },
      {
        watchlist: [],
        pep: [],
        adverse_media: [],
      },
    );
  }, [allTemplates]);

  const [form, setForm] = useState<ReportTemplateForm>(() => {
    if (isCreateMode || !existingTemplate) {
      return {
        ...DEFAULT_REPORT_FORM,
        screeningSources: availableSourcesByType.watchlist,
      };
    }
    return normalizeReportTemplate(existingTemplate);
  });

  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    if (isCreateMode || !existingTemplate) {
      setForm({
        ...DEFAULT_REPORT_FORM,
        screeningSources: availableSourcesByType.watchlist,
      });
    } else {
      setForm(normalizeReportTemplate(existingTemplate));
    }
  }

  if (!isCreateMode && !existingTemplate) {
    return (
      <NotFoundPage
        section="Report Templates"
        backHref="/templates/reports"
        entity="Report template"
      />
    );
  }

  function setStatus(status: TemplateStatus) {
    setForm((prev) => ({
      ...prev,
      status,
    }));
  }

  function toggleSource(source: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      screeningSources: checked
        ? [...prev.screeningSources, source]
        : prev.screeningSources.filter((item) => item !== source),
    }));
  }

  function saveTemplate() {
    const payload: Omit<ReportTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      name: form.name.trim() || "Untitled report template",
      screeningSources: form.screeningSources,
      settings: {
        ...form.settings,
        monitoringFrequencyDays: form.settings.continuousMonitoring
          ? form.settings.monitoringFrequencyDays
          : 30,
      },
    };

    if (isCreateMode) {
      reportTemplates.create(payload);
    } else {
      reportTemplates.update(id, payload);
    }

    router.push("/templates/reports");
  }

  const sourceOptions = availableSourcesByType[form.type];
  const title = isCreateMode ? "New Report Template" : existingTemplate?.name ?? "Report Template";
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={title}
        backHref="/templates/reports"
        actions={(
          <>
            <Button color="primary" size="sm" pill={false} onClick={saveTemplate}>
              Save
            </Button>
            {canPublish && (
              <Button
                color="secondary"
                variant="outline"
                size="sm"
                pill={false}
                onClick={() => setStatus("active")}
              >
                Publish
              </Button>
            )}
            {canArchive && (
              <Button
                color="secondary"
                variant="outline"
                size="sm"
                pill={false}
                onClick={() => setStatus("archived")}
              >
                Archive
              </Button>
            )}
          </>
        )}
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">General</SectionHeading>
        <div className="mb-8 space-y-4">
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Template name"
            />
          </Field>

          <Field label="Type">
            <div className="w-60">
              <Select
                options={REPORT_TYPE_OPTIONS}
                value={form.type}
                onChange={(option) => {
                  if (option) {
                    const nextType = option.value as ReportType;
                    setForm((prev) => ({
                      ...prev,
                      type: nextType,
                      screeningSources: availableSourcesByType[nextType],
                    }));
                  }
                }}
                pill={false}
                block
              />
            </div>
          </Field>

          <Field label="Status">
            <div className="w-48">
              <Select
                options={TEMPLATE_STATUS_OPTIONS}
                value={form.status}
                onChange={(option) => {
                  if (option) {
                    setStatus(option.value as TemplateStatus);
                  }
                }}
                pill={false}
                block
              />
            </div>
          </Field>
        </div>

        <SectionHeading size="xs">Configuration</SectionHeading>
        <div className="mb-8 rounded-lg border border-[var(--color-border)] p-4">
          <div className="space-y-3">
            {sourceOptions.map((source) => (
              <Checkbox
                key={source}
                label={source}
                checked={form.screeningSources.includes(source)}
                onCheckedChange={(checked) => toggleSource(source, checked)}
              />
            ))}
          </div>
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="space-y-5">
          <Field
            label="Match threshold"
            description={`Current threshold: ${form.settings.matchThreshold}`}
          >
            <Slider
              min={0}
              max={100}
              step={1}
              value={form.settings.matchThreshold}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    matchThreshold: value,
                  },
                }))
              }
            />
          </Field>

          <Switch
            label="Continuous monitoring"
            checked={form.settings.continuousMonitoring}
            onCheckedChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  continuousMonitoring: checked,
                },
              }))
            }
          />

          {form.settings.continuousMonitoring && (
            <Field label="Monitoring frequency (days)">
              <Input
                type="number"
                value={String(form.settings.monitoringFrequencyDays)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      monitoringFrequencyDays: Number(event.target.value) || 1,
                    },
                  }))
                }
              />
            </Field>
          )}

          <Switch
            label="Enable fuzzy match"
            checked={form.settings.enableFuzzyMatch}
            onCheckedChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  enableFuzzyMatch: checked,
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
