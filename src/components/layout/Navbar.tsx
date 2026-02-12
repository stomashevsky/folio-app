"use client";

import { Avatar } from "@plexui/ui/components/Avatar";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Settings", href: "/settings" },
];

export function Navbar() {
  const pathname = usePathname();

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

      {/* Right: Nav items + Profile */}
      <div className="flex items-center gap-1">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || (!pathname.startsWith("/settings"))
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-8 items-center rounded-lg px-3 text-sm transition-colors ${
                  isActive
                    ? "bg-black/[0.08] font-medium text-[var(--color-text)] dark:bg-white/[0.08]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-3">
          <Avatar name="Alex" size={28} color="primary" variant="solid" />
        </div>
      </div>
    </header>
  );
}
