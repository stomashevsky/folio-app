"use client";

import { useState, useCallback, useMemo } from "react";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { TagInput, type Tag } from "@plexui/ui/components/TagInput";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";

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
  const [draftTags, setDraftTags] = useState<Tag[]>(() =>
    tags.map((t) => ({ value: t, valid: true })),
  );

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

  return (
    <Modal key={tags.join(",")} open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <h2 className="heading-sm text-[var(--color-text)]">Update tags</h2>
      </ModalHeader>

      <ModalBody>
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
      </ModalBody>

      <ModalFooter>
        <Button
          color="secondary"
          variant="soft"
          size="md"
          pill={false}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="md"
          pill={false}
          onClick={handleSave}
        >
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
}
