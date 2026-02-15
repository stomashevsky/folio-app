"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import {
  InlineEmpty,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/shared";
import { mockInquiries } from "@/lib/data";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { EditPencil, Trash } from "@plexui/ui/components/Icon";

export default function TagsPage() {
  const initialTags = useMemo(() => {
    const counts = new Map<string, number>();
    mockInquiries.forEach((inq) =>
      inq.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)),
    );
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [tags, setTags] = useState(initialTags);

  // Rename modal state
  const [renaming, setRenaming] = useState<{
    name: string;
    draft: string;
  } | null>(null);

  // Delete modal state
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleRename = () => {
    if (!renaming || !renaming.draft.trim()) return;
    const trimmed = renaming.draft.trim();
    if (
      trimmed === renaming.name ||
      tags.some((t) => t.name === trimmed && t.name !== renaming.name)
    )
      return;
    setTags((prev) =>
      prev
        .map((t) =>
          t.name === renaming.name ? { ...t, name: trimmed } : t,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    setRenaming(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setTags((prev) => prev.filter((t) => t.name !== deleting));
    setDeleting(null);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Tags" />
      <div className="px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Tags help you organize and filter inquiries. Tags are created from
          individual inquiry pages and can be removed here.
        </p>

        {tags.length === 0 ? (
          <InlineEmpty>No tags have been created yet.</InlineEmpty>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-lg border border-[var(--color-border)] md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                      Tag
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                      Inquiries
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr
                      key={tag.name}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <Badge color="secondary" size="sm">
                          {tag.name}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {tag.count}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            uniform
                            onClick={() =>
                              setRenaming({ name: tag.name, draft: tag.name })
                            }
                          >
                            <EditPencil />
                          </Button>
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            uniform
                            onClick={() => setDeleting(tag.name)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="space-y-3 md:hidden">
              {tags.map((tag) => (
                <div
                  key={tag.name}
                  className="rounded-lg border border-[var(--color-border)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge color="secondary" size="sm">
                        {tag.name}
                      </Badge>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        {tag.count} inquiries
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        uniform
                        onClick={() =>
                          setRenaming({ name: tag.name, draft: tag.name })
                        }
                      >
                        <EditPencil />
                      </Button>
                      <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        uniform
                        onClick={() => setDeleting(tag.name)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rename tag modal */}
      <Modal
        open={renaming !== null}
        onOpenChange={(open) => {
          if (!open) setRenaming(null);
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">Rename tag</h2>
        </ModalHeader>
        <ModalBody>
          <Field label="Tag name" size="xl">
            <Input
              value={renaming?.draft ?? ""}
              onChange={(e) =>
                setRenaming((prev) =>
                  prev ? { ...prev, draft: e.target.value } : prev,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
              size="xl"
              autoFocus
              autoSelect
            />
          </Field>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => setRenaming(null)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="md"
            pill={false}
            onClick={handleRename}
            disabled={
              !renaming?.draft.trim() ||
              renaming.draft.trim() === renaming.name
            }
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete tag confirmation modal */}
      <Modal
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">Delete tag</h2>
        </ModalHeader>
        <ModalBody>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to delete the tag{" "}
            <Badge color="secondary" size="sm">
              {deleting}
            </Badge>
            ? This will remove it from all inquiries.
          </span>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => setDeleting(null)}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            size="md"
            pill={false}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
