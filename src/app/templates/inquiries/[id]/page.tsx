"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { useTemplateStore } from "@/lib/stores/template-store";
import {
  TEMPLATE_STATUS_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import type {
  InquiryTemplate,
  InquiryTemplateStep,
  TemplateStatus,
  VerificationType,
} from "@/lib/types";

import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Plus, Trash } from "@plexui/ui/components/Icon";

type InquiryTemplateForm = {
  name: string;
  description: string;
  status: TemplateStatus;
  lastPublishedAt?: string;
  steps: InquiryTemplateStep[];
  settings: {
    autoApprove: boolean;
    expiresInDays: number;
    maxRetries: number;
    redirectUrl: string;
  };
};

const DEFAULT_INQUIRY_FORM: InquiryTemplateForm = {
  name: "",
  description: "",
  status: "draft",
  lastPublishedAt: undefined,
  steps: [{ verificationType: "government_id", required: true }],
  settings: {
    autoApprove: false,
    expiresInDays: 30,
    maxRetries: 3,
    redirectUrl: "",
  },
};

function normalizeInquiryTemplate(template: InquiryTemplate): InquiryTemplateForm {
  return {
    name: template.name,
    description: template.description ?? "",
    status: template.status,
    lastPublishedAt: template.lastPublishedAt,
    steps: template.steps.length > 0 ? template.steps : DEFAULT_INQUIRY_FORM.steps,
    settings: {
      autoApprove: template.settings.autoApprove,
      expiresInDays: template.settings.expiresInDays,
      maxRetries: template.settings.maxRetries,
      redirectUrl: template.settings.redirectUrl ?? "",
    },
  };
}

export default function InquiryTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { inquiryTemplates } = useTemplateStore();

  const isCreateMode = id === "new";
  const existingTemplate = useMemo(
    () => (isCreateMode ? undefined : inquiryTemplates.getById(id)),
    [inquiryTemplates, isCreateMode, id],
  );

  const [form, setForm] = useState<InquiryTemplateForm>(
    isCreateMode || !existingTemplate
      ? DEFAULT_INQUIRY_FORM
      : normalizeInquiryTemplate(existingTemplate),
  );

  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setForm(
      isCreateMode || !existingTemplate
        ? DEFAULT_INQUIRY_FORM
        : normalizeInquiryTemplate(existingTemplate),
    );
  }

  if (!isCreateMode && !existingTemplate) {
    return (
      <NotFoundPage
        section="Inquiry Templates"
        backHref="/templates/inquiries"
        entity="Inquiry template"
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

  function addStep() {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { verificationType: "document", required: false }],
    }));
  }

  function updateStep(index: number, nextStep: InquiryTemplateStep) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? nextStep : step)),
    }));
  }

  function removeStep(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.length === 1 ? prev.steps : prev.steps.filter((_, i) => i !== index),
    }));
  }

  function saveTemplate() {
    const payload: Omit<InquiryTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      description: form.description.trim() || undefined,
      settings: {
        ...form.settings,
        redirectUrl: form.settings.redirectUrl.trim() || undefined,
      },
    };

    if (isCreateMode) {
      inquiryTemplates.create(payload);
    } else {
      inquiryTemplates.update(id, payload);
    }

    router.push("/templates/inquiries");
  }

  const title = isCreateMode ? "New Inquiry Template" : existingTemplate?.name ?? "Inquiry Template";
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={title}
        backHref="/templates/inquiries"
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

          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
            />
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
          {form.steps.map((step, index) => (
            <div key={`${step.verificationType}-${index}`} className="rounded-md border border-[var(--color-border)] p-3">
              <div className="mb-3 text-xs text-[var(--color-text-secondary)]">Step {index + 1}</div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                <Field label="Verification type">
                  <Select
                    options={VERIFICATION_TYPE_OPTIONS}
                    value={step.verificationType}
                    onChange={(option) => {
                      if (option) {
                        updateStep(index, {
                          ...step,
                          verificationType: option.value as VerificationType,
                        });
                      }
                    }}
                    pill={false}
                    block
                  />
                </Field>

                <Switch
                  label="Required"
                  checked={step.required}
                  onCheckedChange={(checked) =>
                    updateStep(index, {
                      ...step,
                      required: checked,
                    })
                  }
                />

                <Button
                  color="secondary"
                  variant="outline"
                  size="sm"
                  pill={false}
                  onClick={() => removeStep(index)}
                >
                  <Trash />
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button color="secondary" variant="outline" size="sm" pill={false} onClick={addStep}>
            <Plus />
            Add step
          </Button>
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="space-y-4">
          <Switch
            label="Auto-approve"
            checked={form.settings.autoApprove}
            onCheckedChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                settings: { ...prev.settings, autoApprove: checked },
              }))
            }
          />

          <Field label="Expires in days">
            <Input
              type="number"
              value={String(form.settings.expiresInDays)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    expiresInDays: Number(event.target.value) || 0,
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

          <Field label="Redirect URL">
            <Input
              value={form.settings.redirectUrl ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    redirectUrl: event.target.value,
                  },
                }))
              }
              placeholder="https://your-app.com/complete"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
