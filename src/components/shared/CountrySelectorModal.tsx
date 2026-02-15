"use client";

import { useState, useMemo } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { COUNTRY_OPTIONS } from "@/lib/constants/countries";

import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Input } from "@plexui/ui/components/Input";
import { Search } from "@plexui/ui/components/Icon";

interface CountrySelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: string[];
  onSave: (codes: string[]) => void;
}

export function CountrySelectorModal({
  open,
  onOpenChange,
  selected,
  onSave,
}: CountrySelectorModalProps) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selected));
  const [search, setSearch] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && !prevOpen) {
    setLocalSelected(new Set(selected));
    setSearch("");
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const filteredAll = useMemo(() => {
    if (!search.trim()) return COUNTRY_OPTIONS;
    const q = search.toLowerCase();
    return COUNTRY_OPTIONS.filter((c) => c.label.toLowerCase().includes(q));
  }, [search]);

  const selectedCountries = useMemo(() => {
    const codes = localSelected;
    const items = COUNTRY_OPTIONS.filter((c) => codes.has(c.value));
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((c) => c.label.toLowerCase().includes(q));
  }, [localSelected, search]);

  function toggle(code: string, checked: boolean) {
    setLocalSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(code);
      else next.delete(code);
      return next;
    });
  }

  function handleSave() {
    onSave(Array.from(localSelected));
    onOpenChange(false);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <ModalHeader>
        <h2 className="heading-md">Select countries</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose which countries are allowed for this verification.
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            placeholder="Search countries..."
            startAdornment={<Search style={{ width: 16, height: 16 }} />}
            size="sm"
          />
        </div>

        <div className="max-h-96 overflow-y-auto -mx-5 px-5">
          {selectedCountries.length > 0 && (
            <>
              <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                Selected ({localSelected.size})
              </p>
              <div className="flex flex-col gap-0.5 mb-3">
                {selectedCountries.map((country) => (
                  <Checkbox
                    key={`sel-${country.value}`}
                    label={country.label}
                    checked={true}
                    onCheckedChange={() => toggle(country.value, false)}
                  />
                ))}
              </div>
              <div className="border-t border-[var(--color-border)] mb-3" />
            </>
          )}

          <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
            All countries
          </p>
          <div className="flex flex-col gap-0.5">
            {filteredAll.map((country) => (
              <Checkbox
                key={country.value}
                label={country.label}
                checked={localSelected.has(country.value)}
                onCheckedChange={(checked) => toggle(country.value, checked as boolean)}
              />
            ))}
          </div>

          {filteredAll.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--color-text-tertiary)]">
              No countries match your search.
            </p>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" variant="outline" size="sm" pill={false} onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="primary" size="sm" pill={false} onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}
