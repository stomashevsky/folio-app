"use client";

import {
  Sidebar,
  SidebarCard,
  SidebarCardContent,
  SidebarCardTitleLink,
  SidebarContent,
  SidebarFooter,
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

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/" }],
  },
  {
    label: "Inquiries",
    items: [
      { title: "All Inquiries", href: "/inquiries" },
      { title: "Analytics", href: "/inquiries/analytics" },
      { title: "Templates", href: "/inquiries/templates" },
    ],
  },
  {
    label: "Verifications",
    items: [
      { title: "All Verifications", href: "/verifications" },
      { title: "Templates", href: "/verifications/templates" },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "All Reports", href: "/reports" },
      { title: "Templates", href: "/reports/templates" },
    ],
  },
  {
    label: "Accounts",
    items: [
      { title: "All Accounts", href: "/accounts" },
      { title: "Types", href: "/accounts/types" },
    ],
  },
  {
    label: "Transactions",
    items: [
      { title: "All Transactions", href: "/transactions" },
      { title: "Analytics", href: "/transactions/analytics" },
      { title: "Types", href: "/transactions/types" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Sidebar>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel size="lg">{group.label}</SidebarGroupLabel>
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

      <SidebarFooter>
        <SidebarCard dismissible onDismiss={() => {}}>
          <SidebarCardTitleLink href="#" onClick={(e) => e.preventDefault()}>
            Sandbox Mode
          </SidebarCardTitleLink>
          <SidebarCardContent>
            You are using simulated data. Connect a live environment to see real
            results.
          </SidebarCardContent>
        </SidebarCard>
      </SidebarFooter>
    </Sidebar>
  );
}
