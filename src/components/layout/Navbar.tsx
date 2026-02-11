"use client";

import { Avatar } from "@plexui/ui/components/Avatar";
import { ChevronsUpDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  return (
    <header className="flex h-[54px] shrink-0 items-center justify-between bg-[var(--color-surface-tertiary)] px-3">
      {/* Left: Org / Project breadcrumb */}
      <div className="flex items-center">
        {/* Org selector */}
        <button
          type="button"
          className="relative flex h-8 items-center gap-2 rounded-lg py-0 pl-1.5 pr-2.5 text-sm font-medium text-[var(--color-text)] before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:transition-colors hover:before:bg-black/[0.08]"
        >
          <Avatar name="Folio" size={25} color="primary" variant="solid" />
          <span>Acme Corp</span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-[rgb(143,143,143)]" />
        </button>

        {/* Separator */}
        <span className="px-1 text-sm font-normal text-[rgb(143,143,143)]">
          /
        </span>

        {/* Project selector */}
        <button
          type="button"
          className="relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-[var(--color-text)] before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:transition-colors hover:before:bg-black/[0.08]"
        >
          <span>Default project</span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-[rgb(143,143,143)]" />
        </button>
      </div>

      {/* Right: Settings + Profile */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-text)] transition-colors hover:bg-black/[0.08]"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <Avatar name="Alex" size={28} color="primary" variant="solid" />
      </div>
    </header>
  );
}
