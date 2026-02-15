"use client";

import { useState, useMemo } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Search } from "@plexui/ui/components/Icon";

interface TemplatePresetOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface TemplatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  presets: TemplatePresetOption[];
  onSelect: (presetId: string) => void;
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  title,
  presets,
  onSelect,
}: TemplatePickerModalProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return presets;
    const q = search.toLowerCase();
    return presets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [presets, search]);

  function handleSelect(id: string) {
    setSearch("");
    onSelect(id);
    onOpenChange(false);
  }

  function handleClose(next: boolean) {
    if (!next) setSearch("");
    onOpenChange(next);
  }

  return (
    <Modal open={open} onOpenChange={handleClose} maxWidth="max-w-lg">
      <ModalHeader>
        <h2 className="heading-md">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose a template to get started with pre-configured defaults.
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            placeholder="Search templates..."
            startAdornment={<Search style={{ width: 16, height: 16 }} />}
            size="sm"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {filtered.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-nav-hover-bg)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-solid-bg)]"
            >
              <span className="text-xl leading-none mt-0.5">{preset.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {preset.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--color-text-tertiary)]">
              No templates match your search.
            </p>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          color="secondary"
          variant="outline"
          size="sm"
          pill={false}
          onClick={() => handleClose(false)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
