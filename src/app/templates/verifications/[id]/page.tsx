"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import {
  TEMPLATE_STATUS_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import { useTemplateStore } from "@/lib/stores/template-store";
import type {
  CheckCategory,
  TemplateStatus,
  VerificationCheckConfig,
  VerificationTemplate,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Plus, Trash } from "@plexui/ui/components/Icon";

type VerificationTemplateForm = {
  name: string;
  type: VerificationType;
  status: TemplateStatus;
  lastPublishedAt?: string;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
};

const CAPTURE_METHOD_OPTIONS: { value: "auto" | "manual" | "both"; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CHECK_CATEGORY_OPTIONS: { value: CheckCategory; label: string }[] = [
  { value: "fraud", label: "Fraud" },
  { value: "validity", label: "Validity" },
  { value: "biometrics", label: "Biometrics" },
  { value: "user_action_required", label: "User action required" },
];

const CHECK_CATEGORY_BADGE: Record<CheckCategory, "danger" | "warning" | "info" | "secondary"> = {
  fraud: "danger",
  validity: "secondary",
  biometrics: "info",
  user_action_required: "warning",
};

const DEFAULT_VERIFICATION_FORM: VerificationTemplateForm = {
  name: "",
  type: "government_id",
  status: "draft",
  lastPublishedAt: undefined,
  checks: [
    { name: "Document Authenticity", category: "fraud", required: true, enabled: true },
  ],
  settings: {
    allowedCountries: ["US"],
    maxRetries: 2,
    captureMethod: "auto",
  },
};

function normalizeVerificationTemplate(template: VerificationTemplate): VerificationTemplateForm {
  return {
    name: template.name,
    type: template.type,
    status: template.status,
    lastPublishedAt: template.lastPublishedAt,
    checks: template.checks.length > 0 ? template.checks : DEFAULT_VERIFICATION_FORM.checks,
    settings: {
      allowedCountries: template.settings.allowedCountries,
      maxRetries: template.settings.maxRetries,
      captureMethod: template.settings.captureMethod,
    },
  };
}

function cloneChecks(checks: VerificationCheckConfig[]) {
  return checks.map((check) => ({ ...check }));
}

export default function VerificationTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();

  const isCreateMode = id === "new";
  const allTemplates = verificationTemplates.getAll();
  const existingTemplate = isCreateMode ? undefined : verificationTemplates.getById(id);

  const checksByType = useMemo(() => {
    return allTemplates.reduce<Record<VerificationType, VerificationCheckConfig[]>>(
      (acc, template) => {
        if (acc[template.type].length === 0) {
          acc[template.type] = cloneChecks(template.checks);
        }
        return acc;
      },
      {
        government_id: [],
        selfie: [],
        database: [],
        document: [],
      },
    );
  }, [allTemplates]);

  const [form, setForm] = useState<VerificationTemplateForm>(() => {
    if (isCreateMode || !existingTemplate) {
      return {
        ...DEFAULT_VERIFICATION_FORM,
        checks: checksByType.government_id.length > 0
          ? cloneChecks(checksByType.government_id)
          : cloneChecks(DEFAULT_VERIFICATION_FORM.checks),
      };
    }
    return normalizeVerificationTemplate(existingTemplate);
  });

  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    if (isCreateMode || !existingTemplate) {
      setForm({
        ...DEFAULT_VERIFICATION_FORM,
        checks: checksByType.government_id.length > 0
          ? cloneChecks(checksByType.government_id)
          : cloneChecks(DEFAULT_VERIFICATION_FORM.checks),
      });
    } else {
      setForm(normalizeVerificationTemplate(existingTemplate));
    }
  }

  if (!isCreateMode && !existingTemplate) {
    return (
      <NotFoundPage
        section="Verification Templates"
        backHref="/templates/verifications"
        entity="Verification template"
      />
    );
  }

  function setStatus(status: TemplateStatus) {
    const isPublished = status === "active";
    setForm((prev) => ({
      ...prev,
      status,
      lastPublishedAt: isPublished ? new Date().toISOString() : prev.lastPublishedAt,
    }));
  }

  function updateCheck(index: number, next: VerificationCheckConfig) {
    setForm((prev) => ({
      ...prev,
      checks: prev.checks.map((check, i) => (i === index ? next : check)),
    }));
  }

  function addCheck() {
    setForm((prev) => ({
      ...prev,
      checks: [
        ...prev.checks,
        { name: "New Check", category: "validity", required: false, enabled: true },
      ],
    }));
  }

  function removeCheck(index: number) {
    setForm((prev) => ({
      ...prev,
      checks: prev.checks.length === 1 ? prev.checks : prev.checks.filter((_, i) => i !== index),
    }));
  }

  function saveTemplate() {
    const payload: Omit<VerificationTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      name: form.name.trim() || "Untitled verification template",
      checks: form.checks.map((check) => ({
        ...check,
        name: check.name.trim() || "Unnamed check",
      })),
      settings: {
        ...form.settings,
        allowedCountries: form.settings.allowedCountries
          .map((country) => country.trim().toUpperCase())
          .filter(Boolean),
      },
    };

    if (isCreateMode) {
      verificationTemplates.create(payload);
    } else {
      verificationTemplates.update(id, payload);
    }

    router.push("/templates/verifications");
  }

  const title = isCreateMode ? "New Verification Template" : existingTemplate?.name ?? "Verification Template";
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={title}
        backHref="/templates/verifications"
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
            <div className="w-56">
              <Select
                options={VERIFICATION_TYPE_OPTIONS}
                value={form.type}
                onChange={(option) => {
                  if (option) {
                    const nextType = option.value as VerificationType;
                    setForm((prev) => ({
                      ...prev,
                      type: nextType,
                      checks: checksByType[nextType].length > 0
                        ? cloneChecks(checksByType[nextType])
                        : prev.checks,
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
        <div className="mb-8 space-y-3 rounded-lg border border-[var(--color-border)] p-4">
          {form.checks.map((check, index) => (
            <div key={`${check.name}-${index}`} className="rounded-md border border-[var(--color-border)] p-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                <Field label="Check name">
                  <Input
                    value={check.name}
                    onChange={(event) =>
                      updateCheck(index, {
                        ...check,
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Category">
                  <div className="flex items-center gap-2">
                    <div className="w-44">
                      <Select
                        options={CHECK_CATEGORY_OPTIONS}
                        value={check.category}
                        onChange={(option) => {
                          if (option) {
                            updateCheck(index, {
                              ...check,
                              category: option.value as CheckCategory,
                            });
                          }
                        }}
                        pill={false}
                        block
                      />
                    </div>
                    <Badge color={CHECK_CATEGORY_BADGE[check.category]} size="sm">
                      {CHECK_CATEGORY_OPTIONS.find((option) => option.value === check.category)?.label ?? check.category}
                    </Badge>
                  </div>
                </Field>

                <Button
                  color="secondary"
                  variant="outline"
                  size="sm"
                  pill={false}
                  onClick={() => removeCheck(index)}
                >
                  <Trash />
                  Remove
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Switch
                  label="Required"
                  checked={check.required}
                  onCheckedChange={(checked) =>
                    updateCheck(index, {
                      ...check,
                      required: checked,
                    })
                  }
                />
                <Switch
                  label="Enabled"
                  checked={check.enabled}
                  onCheckedChange={(checked) =>
                    updateCheck(index, {
                      ...check,
                      enabled: checked,
                    })
                  }
                />
              </div>
            </div>
          ))}

          <Button color="secondary" variant="outline" size="sm" pill={false} onClick={addCheck}>
            <Plus />
            Add check
          </Button>
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="space-y-4">
          <Field label="Allowed countries" description="Comma-separated ISO country codes (example: US, CA, GB)">
            <Input
              value={form.settings.allowedCountries.join(", ")}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    allowedCountries: event.target.value.split(","),
                  },
                }))
              }
            />
          </Field>

          <Field label="Max retries">
            <Input
              type="number"
              value={String(form.settings.maxRetries)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    maxRetries: Number(event.target.value) || 0,
                  },
                }))
              }
            />
          </Field>

          <Field label="Capture method">
            <div className="w-48">
              <Select
                options={CAPTURE_METHOD_OPTIONS}
                value={form.settings.captureMethod}
                onChange={(option) => {
                  if (option) {
                    setForm((prev) => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        captureMethod: option.value as "auto" | "manual" | "both",
                      },
                    }));
                  }
                }}
                pill={false}
                block
              />
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
