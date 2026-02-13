"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
  useSidebar,
} from "@plexui/ui/components/Sidebar";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Menu } from "@plexui/ui/components/Menu";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Sun, Moon, SystemMode } from "@plexui/ui/components/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  type NavItem,
  dashboardNavItems,
  analyticsNavItems,
  templatesNavItems,
  settingsNavGroups,
  navSections,
  isRouteActive,
  isSectionActive,
} from "@/lib/constants/nav-config";
import { MOCK_USER } from "@/lib/constants/mock-user";

/** Return the flat sidebar items for the current section. */
function getItemsForSection(pathname: string): NavItem[] | null {
  if (pathname.startsWith("/analytics")) return analyticsNavItems;
  if (pathname.startsWith("/templates")) return templatesNavItems;
  if (pathname.startsWith("/settings")) return null; // grouped, handled separately
  return dashboardNavItems;
}

function MobileThemeSwitcher() {
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

/**
 * Mobile menu overlay — replaces page content with navigation when open.
 * Uses the PlexUI inline-replacement pattern (not SidebarMobile drawer).
 * On desktop, always renders children.
 */
export function MobileMenuOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  // Desktop: always render children, no mobile menu
  if (!isMobile) {
    return <>{children}</>;
  }

  const switchSection = (href: string) => {
    router.push(href);
  };

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  if (!openMobile) {
    return <>{children}</>;
  }

  const isSettings = pathname?.startsWith("/settings");
  const flatItems = getItemsForSection(pathname);

  // Menu is open — replace page content with navigation
  return (
    <div className="flex h-full flex-col p-3">
      {/* Section toggle: Dashboard / Analytics / Templates / Settings */}
      <div className="mb-3 flex gap-1">
        {navSections.map((section) => (
          <button
            key={section.href}
            type="button"
            onClick={() => switchSection(section.href)}
            className={`flex h-8 cursor-pointer items-center rounded-lg px-3 text-sm transition-colors ${
              isSectionActive(pathname, section.href)
                ? "bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Navigation items — scrollable */}
      <div className="flex-1 overflow-auto">
        {isSettings ? (
          /* Settings: grouped navigation */
          <SidebarContent className="!p-0 ![mask-image:none]">
            {settingsNavGroups.map((group) => (
              <SidebarGroup key={group.label || "top"}>
                {group.label && (
                  <SidebarGroupLabel size="lg">{group.label}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={isRouteActive(pathname, item.href)}
                          onClick={() => navigate(item.href)}
                        >
                          <SidebarMenuButtonLabel>
                            {item.title}
                          </SidebarMenuButtonLabel>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        ) : (
          /* Dashboard / Analytics / Templates: flat navigation */
          <SidebarContent className="!p-0 ![mask-image:none]">
            <SidebarMenu>
              {(flatItems ?? []).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isRouteActive(pathname, item.href)}
                    onClick={() => navigate(item.href)}
                  >
                    <SidebarMenuButtonLabel>
                      {item.title}
                    </SidebarMenuButtonLabel>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        )}
      </div>

      {/* Profile menu — pinned bottom */}
      <div className="shrink-0 border-t border-[var(--color-border)] pt-3">
        <Menu>
          <Menu.Trigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
            >
              <Avatar name={MOCK_USER.name} size={32} color={MOCK_USER.avatarColor} variant="solid" />
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
              </div>
            </button>
          </Menu.Trigger>
          <Menu.Content side="top" align="start" sideOffset={8} minWidth={260}>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
            </div>
            <div className="px-3 pb-2">
              <MobileThemeSwitcher />
            </div>
            <Menu.Separator />
            <Menu.Item onSelect={() => navigate("/settings")}>Your profile</Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={() => {}}>Log out</Menu.Item>
          </Menu.Content>
        </Menu>
      </div>
    </div>
  );
}
