"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
} from "@plexui/ui/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  title: string;
  href: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const settingsNavGroups: NavGroup[] = [
  {
    label: "",
    items: [{ title: "Your profile", href: "/settings" }],
  },
  {
    label: "Organization",
    items: [
      { title: "General", href: "/settings/organization" },
      { title: "API keys", href: "/settings/api-keys" },
      { title: "Team", href: "/settings/team" },
      { title: "Webhooks", href: "/settings/webhooks" },
    ],
  },
  {
    label: "Project",
    items: [
      { title: "General", href: "/settings/project" },
      { title: "Notifications", href: "/settings/notifications" },
      { title: "Tags", href: "/settings/tags" },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar>
      <SidebarContent>
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
                      isActive={isActive(item.href)}
                      onClick={() => router.push(item.href)}
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
    </Sidebar>
  );
}
