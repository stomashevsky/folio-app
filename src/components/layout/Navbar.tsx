"use client";

import { Avatar } from "@plexui/ui/components/Avatar";
import { Menu } from "@plexui/ui/components/Menu";
import { Sun, Moon, SystemMode } from "@plexui/ui/components/Icon";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { SidebarMobileMenuButton } from "@plexui/ui/components/Sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { navSections, isSectionActive } from "@/lib/constants/nav-config";
import { MOCK_USER } from "@/lib/constants/mock-user";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl
      value={theme ?? "system"}
      onChange={setTheme}
      aria-label="Theme"
      size="xs"
      pill={false}
    >
      <SegmentedControl.Tab value="light" icon={<Sun />} aria-label="Light" />
      <SegmentedControl.Tab value="dark" icon={<Moon />} aria-label="Dark" />
      <SegmentedControl.Tab
        value="system"
        icon={<SystemMode />}
        aria-label="System"
      />
    </SegmentedControl>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex h-[var(--navbar-height)] shrink-0 items-center justify-between bg-[var(--color-surface-tertiary)] px-2 md:grid md:grid-cols-[1fr_auto_1fr] md:px-4">
      {/* Left: Org button */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex h-8 items-center gap-2 rounded-lg py-0 pl-1.5 pr-2.5 text-sm font-medium text-[var(--color-text)]"
        >
          <Avatar name={MOCK_USER.organization} size={25} color="primary" variant="solid" />
          <span>{MOCK_USER.organization}</span>
        </Link>
      </div>

      {/* Center: Nav items (desktop) */}
      <nav className="hidden items-center gap-1 md:flex">
        {navSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-8 items-center rounded-lg px-3 text-sm transition-colors ${
                isSectionActive(pathname, item.href)
                  ? "bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
      </nav>

      {/* Right: Avatar (desktop) | Menu button (mobile) */}
      <div className="flex items-center justify-end">
        <div className="hidden md:block">
          <Menu>
            <Menu.Trigger asChild>
              <button type="button" className="cursor-pointer">
                <Avatar name={MOCK_USER.name} size={28} color={MOCK_USER.avatarColor} variant="solid" />
              </button>
            </Menu.Trigger>
            <Menu.Content align="end" sideOffset={8} minWidth={220}>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
              </div>
              <div className="px-3 pb-2">
                <ThemeSwitcher />
              </div>
              <Menu.Separator />
              <Menu.Item onSelect={() => router.push("/settings")}>Your profile</Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}}>Log out</Menu.Item>
            </Menu.Content>
          </Menu>
        </div>

        {/* Mobile: hamburger / X button */}
        <div className="md:hidden">
          <SidebarMobileMenuButton />
        </div>
      </div>
    </header>
  );
}
