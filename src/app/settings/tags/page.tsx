"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { InlineEmpty } from "@/components/shared";
import { mockInquiries } from "@/lib/data";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
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
  const [confirming, setConfirming] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    name: string;
    draft: string;
  } | null>(null);

  const handleDelete = (name: string) => {
    setTags((prev) => prev.filter((t) => t.name !== name));
    setConfirming(null);
  };

  const handleRename = () => {
    if (!editing || !editing.draft.trim()) return;
    const trimmed = editing.draft.trim();
    // Don't rename if unchanged or conflicts with existing tag
    if (
      trimmed === editing.name ||
      tags.some((t) => t.name === trimmed && t.name !== editing.name)
    )
      return;
    setTags((prev) =>
      prev
        .map((t) =>
          t.name === editing.name ? { ...t, name: trimmed } : t,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    setEditing(null);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Tags" />
      <div className="px-6 py-8">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Tags help you organize and filter inquiries. Tags are created from
          individual inquiry pages and can be removed here.
        </p>

        {tags.length === 0 ? (
          <InlineEmpty>No tags have been created yet.</InlineEmpty>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Tag
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Inquiries
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
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
                      {editing?.name === tag.name ? (
                        <Input
                          size="sm"
                          value={editing.draft}
                          onChange={(e) =>
                            setEditing({ ...editing, draft: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename();
                            if (e.key === "Escape") setEditing(null);
                          }}
                          autoFocus
                          autoSelect
                        />
                      ) : (
                        <Badge color="secondary" size="sm">
                          {tag.name}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {tag.count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {confirming === tag.name ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirming(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            pill={false}
                            onClick={() => handleDelete(tag.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : editing?.name === tag.name ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            pill={false}
                            onClick={handleRename}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            uniform
                            onClick={() => {
                              setEditing({ name: tag.name, draft: tag.name });
                              setConfirming(null);
                            }}
                          >
                            <EditPencil />
                          </Button>
                          <Button
                            color="secondary"
                            variant="ghost"
                            size="sm"
                            uniform
                            onClick={() => {
                              setConfirming(tag.name);
                              setEditing(null);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
