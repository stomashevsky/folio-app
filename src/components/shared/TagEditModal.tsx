"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { TagInput, type Tag } from "@plexui/ui/components/TagInput";
import { X } from "@plexui/ui/components/Icon";

interface TagEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: string[];
  onSave: (tags: string[]) => void;
  /** All known tags across all inquiries, for suggestions */
  allTags: string[];
}

export function TagEditModal({
  open,
  onOpenChange,
  tags,
  onSave,
  allTags,
}: TagEditModalProps) {
  const [draftTags, setDraftTags] = useState<Tag[]>([]);

  // Sync draft with current tags when modal opens
  useEffect(() => {
    if (open) {
      setDraftTags(tags.map((t) => ({ value: t, valid: true })));
    }
  }, [open, tags]);

  // Suggestions: all known tags minus those already in the draft
  const suggestions = useMemo(() => {
    const current = new Set(draftTags.map((t) => t.value));
    return allTags.filter((t) => !current.has(t));
  }, [allTags, draftTags]);

  const addSuggestion = (tag: string) => {
    setDraftTags((prev) => [...prev, { value: tag, valid: true }]);
  };

  const handleSave = useCallback(() => {
    onSave(draftTags.map((t) => t.value));
    onOpenChange(false);
  }, [draftTags, onSave, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleCancel}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="heading-sm text-[var(--color-text)]">Update tags</h2>
          <button
            onClick={handleCancel}
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 px-5 pb-4">
          <Field label="Tags" size="xl">
            <TagInput
              value={draftTags}
              onChange={setDraftTags}
              placeholder="Type a tag and press Enter..."
              size="xl"
              rows={2}
              autoFocus
            />
          </Field>

          {suggestions.length > 0 && (
            <Field label="Select existing tags" size="xl">
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addSuggestion(tag)}
                    className="cursor-pointer"
                  >
                    <Badge color="secondary" size="sm">
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </Field>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] px-5 py-3">
          <Button
            color="secondary"
            variant="outline"
            size="sm"
            pill={false}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            pill={false}
            onClick={handleSave}
          >
            Update
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
