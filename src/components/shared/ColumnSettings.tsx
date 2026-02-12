"use client";

import { useState } from "react";
import type { VisibilityState } from "@tanstack/react-table";
import { Popover } from "@plexui/ui/components/Popover";
import { Switch } from "@plexui/ui/components/Switch";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { SettingsSlider, Search } from "@plexui/ui/components/Icon";

export interface ColumnConfig {
  id: string;
  label: string;
}

interface ColumnSettingsProps {
  columns: ColumnConfig[];
  visibility: VisibilityState;
  onVisibilityChange: (visibility: VisibilityState) => void;
}

export function ColumnSettings({
  columns,
  visibility,
  onVisibilityChange,
}: ColumnSettingsProps) {
  const [search, setSearch] = useState("");

  const filtered = columns.filter((col) =>
    col.label.toLowerCase().includes(search.toLowerCase())
  );

  const shown = filtered.filter((col) => visibility[col.id] !== false);
  const hidden = filtered.filter((col) => visibility[col.id] === false);

  function toggle(id: string) {
    onVisibilityChange({
      ...visibility,
      [id]: !visibility[id] ? true : visibility[id] === true ? false : true,
    });
  }

  return (
    <Popover>
      <Popover.Trigger>
        <Button
          color="secondary"
          variant="outline"
          size="sm"
          pill={false}
        >
          <SettingsSlider />
          Columns
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" width={280} minWidth={280}>
        {/* Search — sits above the scrollable list */}
        <div className="p-[6px]">
          <Input
            placeholder="Search by item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            startAdornment={<Search />}
            size="sm"
          />
        </div>

        {/* Options list — matches PlexUI Select .OptionsList padding */}
        <div className="max-h-[400px] overflow-auto p-[6px]">
          {/* Shown attributes */}
          {shown.length > 0 && (
            <>
              <div className="flex items-center px-2 py-1.5 text-sm text-[var(--color-text-secondary)]">
                Shown attributes
              </div>
              {shown.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5"
                >
                  <span className="text-sm text-[var(--color-text)]">
                    {col.label}
                  </span>
                  <Switch
                    checked={true}
                    onCheckedChange={() => toggle(col.id)}
                  />
                </div>
              ))}
            </>
          )}

          {/* Hidden attributes */}
          {hidden.length > 0 && (
            <>
              <div
                className={`flex items-center px-2 py-1.5 text-sm text-[var(--color-text-secondary)] ${
                  shown.length > 0 ? "mt-1.5" : ""
                }`}
              >
                Hidden attributes
              </div>
              {hidden.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5"
                >
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {col.label}
                  </span>
                  <Switch
                    checked={false}
                    onCheckedChange={() => toggle(col.id)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}
