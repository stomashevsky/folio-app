"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { VERIFICATION_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { INQUIRY_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  InquiryTemplate,
  InquiryTemplateStep,
  StepPassAction,
  StepFailAction,
  StepRetryAction,
  TemplateStatus,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Textarea } from "@plexui/ui/components/Textarea";
import { ArrowDownSm, ArrowUpSm, ChevronDownSm, Plus, Trash } from "@plexui/ui/components/Icon";

const PASS_OPTIONS: { value: StepPassAction; label: string }[] = [
  { value: "continue", label: "Continue to next step" },
  { value: "approve", label: "Approve inquiry" },
  { value: "skip_next", label: "Skip next step" },
];

const FAIL_OPTIONS: { value: StepFailAction; label: string }[] = [
  { value: "decline", label: "Decline inquiry" },
  { value: "needs_review", label: "Send to review" },
  { value: "skip", label: "Skip step" },
  { value: "continue", label: "Continue anyway" },
];

const RETRY_OPTIONS: { value: StepRetryAction; label: string }[] = [
  { value: "retry", label: "Retry step" },
  { value: "decline", label: "Decline inquiry" },
  { value: "needs_review", label: "Send to review" },
];

interface InquiryForm {
  name: string;
  description: string;
  status: TemplateStatus;
  lastPublishedAt?: string;
  steps: InquiryTemplateStep[];
  settings: {
    expiresInDays: number;
    redirectUrl: string;
  };
}

function defaultStep(): InquiryTemplateStep {
  return {
    verificationType: "document",
    required: false,
    onPass: "continue",
    onFail: "needs_review",
    onRetry: "retry",
    maxRetries: 2,
  };
}

const DEFAULT_FORM: InquiryForm = {
  name: "",
  description: "",
  status: "draft",
  steps: [{ verificationType: "government_id", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 }],
  settings: { expiresInDays: 30, redirectUrl: "" },
};

function buildFormFromPreset(presetParam: string): InquiryForm {
  const preset = INQUIRY_TEMPLATE_PRESETS.find((p) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  return {
    name: preset.defaults.name,
    description: preset.defaults.description,
    status: "draft",
    steps: preset.defaults.steps,
    settings: {
      expiresInDays: preset.defaults.settings.expiresInDays,
      redirectUrl: preset.defaults.settings.redirectUrl ?? "",
    },
  };
}

function toForm(t: InquiryTemplate): InquiryForm {
  return {
    name: t.name,
    description: t.description ?? "",
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    steps: t.steps.length > 0 ? t.steps : DEFAULT_FORM.steps,
    settings: {
      expiresInDays: t.settings.expiresInDays,
      redirectUrl: t.settings.redirectUrl ?? "",
    },
  };
}

export default function InquiryTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { inquiryTemplates } = useTemplateStore();

  const isNew = id === "new";
  const existing = isNew ? undefined : inquiryTemplates.getById(id);
  const presetId = isNew ? searchParams.get("preset") : null;

  const [form, setForm] = useState<InquiryForm>(() => {
    if (existing) return toForm(existing);
    if (presetId) return buildFormFromPreset(presetId);
    return DEFAULT_FORM;
  });
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setForm(existing ? toForm(existing) : DEFAULT_FORM);
  }

  if (!isNew && !existing) {
    return <NotFoundPage section="Inquiry Templates" backHref="/templates/inquiries" entity="Inquiry template" />;
  }

  function patch(p: Partial<InquiryForm>) {
    setForm((prev) => ({ ...prev, ...p }));
  }
  function patchSettings(p: Partial<InquiryForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function setStatus(s: TemplateStatus) {
    patch({ status: s, lastPublishedAt: s === "active" ? new Date().toISOString() : form.lastPublishedAt });
  }

  function addStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, defaultStep()] }));
  }
  function updateStep(i: number, next: InquiryTemplateStep) {
    setForm((prev) => ({ ...prev, steps: prev.steps.map((s, idx) => (idx === i ? next : s)) }));
  }
  function removeStep(i: number) {
    if (form.steps.length <= 1) return;
    setForm((prev) => ({ ...prev, steps: prev.steps.filter((_, idx) => idx !== i) }));
  }
  function moveStep(from: number, to: number) {
    setForm((prev) => {
      const next = [...prev.steps];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, steps: next };
    });
  }

  function save() {
    const payload: Omit<InquiryTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      description: form.description.trim() || undefined,
      settings: { ...form.settings, redirectUrl: form.settings.redirectUrl.trim() || undefined },
    };
    if (isNew) inquiryTemplates.create(payload);
    else inquiryTemplates.update(id, payload);
    router.push("/templates/inquiries");
  }

  function handleDelete() {
    if (!existing) return;
    inquiryTemplates.delete(id);
    router.push("/templates/inquiries");
  }

  const title = isNew ? "New inquiry template" : (existing?.name ?? "Inquiry template");
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={<span className="flex items-center gap-2">{title}{!isNew && <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">{form.status}</Badge>}</span>}
        backHref="/templates/inquiries"
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <Menu>
                <Menu.Trigger>
                  <Button color="secondary" variant="outline" size="sm" pill={false}>
                    More actions <ChevronDownSm />
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  {canPublish && (
                    <Menu.Item onClick={() => setStatus("active")}>Publish</Menu.Item>
                  )}
                  {canArchive && (
                    <Menu.Item onClick={() => setStatus("archived")}>Archive</Menu.Item>
                  )}
                  <Menu.Separator />
                  <Menu.Item onClick={handleDelete}>Delete</Menu.Item>
                </Menu.Content>
              </Menu>
            )}
            <Button color="primary" size="sm" pill={false} onClick={save}>Save</Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">General</SectionHeading>
        <div className="mb-6">
          <Field label="Name" description="A descriptive name for this inquiry template">
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. KYC + AML Standard" />
          </Field>
        </div>
        <div className="mb-8">
          <Field label="Description" description="Optional internal description visible to your team">
            <Textarea value={form.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
          </Field>
        </div>

        <SectionHeading size="xs" action={
          <Button color="secondary" variant="outline" size="sm" pill={false} onClick={addStep}><Plus /> Add step</Button>
        }>
          Steps
        </SectionHeading>
        <div className="mb-8 flex flex-col gap-3">
          {form.steps.map((step, i) => (
            <StepCard
              key={i}
              index={i}
              step={step}
              isOnly={form.steps.length <= 1}
              isFirst={i === 0}
              isLast={i === form.steps.length - 1}
              onChange={(next) => updateStep(i, next)}
              onRemove={() => removeStep(i)}
              onMoveUp={() => moveStep(i, i - 1)}
              onMoveDown={() => moveStep(i, i + 1)}
            />
          ))}
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="mb-6 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Expiration</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Days before an incomplete inquiry expires</p>
            </div>
            <div className="w-20 shrink-0">
              <Input type="number" value={String(form.settings.expiresInDays)} onChange={(e) => patchSettings({ expiresInDays: Number(e.target.value) || 0 })} />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <Field label="Redirect URL" description="Where to redirect the user after completing the inquiry flow">
            <Input value={form.settings.redirectUrl} onChange={(e) => patchSettings({ redirectUrl: e.target.value })} placeholder="https://your-app.com/complete" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  index,
  step,
  isOnly,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  step: InquiryTemplateStep;
  isOnly: boolean;
  isFirst: boolean;
  isLast: boolean;
  onChange: (next: InquiryTemplateStep) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)]">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex shrink-0 flex-col">
          <Button color="secondary" variant="ghost" size="xs" uniform onClick={onMoveUp} disabled={isFirst}>
            <ArrowUpSm />
          </Button>
          <Button color="secondary" variant="ghost" size="xs" uniform onClick={onMoveDown} disabled={isLast}>
            <ArrowDownSm />
          </Button>
        </div>
        <span className="w-14 shrink-0 text-xs text-[var(--color-text-tertiary)]">Step {index + 1}</span>
        <div className="min-w-0 flex-1">
          <Select
            options={VERIFICATION_TYPE_OPTIONS}
            value={step.verificationType}
            onChange={(o) => { if (o) onChange({ ...step, verificationType: o.value as VerificationType }); }}
            pill={false}
            block
          />
        </div>
        <Switch label="Required" checked={step.required} onCheckedChange={(c) => onChange({ ...step, required: c })} />
        <Button color="secondary" variant="ghost" size="sm" uniform onClick={onRemove} disabled={isOnly}>
          <Trash />
        </Button>
      </div>

      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="mb-1 text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">On pass</p>
            <Select
              options={PASS_OPTIONS}
              value={step.onPass}
              onChange={(o) => { if (o) onChange({ ...step, onPass: o.value as StepPassAction }); }}
              pill={false}
              block
              size="sm"
            />
          </div>
          <div>
            <p className="mb-1 text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">On fail</p>
            <Select
              options={FAIL_OPTIONS}
              value={step.onFail}
              onChange={(o) => { if (o) onChange({ ...step, onFail: o.value as StepFailAction }); }}
              pill={false}
              block
              size="sm"
            />
          </div>
          <div>
            <p className="mb-1 text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">On retry</p>
            <Select
              options={RETRY_OPTIONS}
              value={step.onRetry}
              onChange={(o) => { if (o) onChange({ ...step, onRetry: o.value as StepRetryAction }); }}
              pill={false}
              block
              size="sm"
            />
          </div>
          <div>
            <p className="mb-1 text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Max retries</p>
            <Input
              type="number"
              value={String(step.maxRetries)}
              onChange={(e) => onChange({ ...step, maxRetries: Math.max(0, Number(e.target.value) || 0) })}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
