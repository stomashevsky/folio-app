import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers/Providers";
import { SidebarProvider, SidebarInset, SidebarLayout } from "@plexui/ui/components/Sidebar";
import { SidebarSwitch } from "@/components/layout/SidebarSwitch";
import { Navbar } from "@/components/layout/Navbar";
import { MobileLayoutWrapper } from "@/components/layout/MobileLayoutWrapper";
import { MobileMenuOverlay } from "@/components/layout/MobileSidebarContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Folio — Identity Verification Dashboard",
  description: "KYC/Identity Verification Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider collapsible="offcanvas" className="flex h-dvh flex-col">
            <MobileLayoutWrapper>
              <Navbar />
              <SidebarLayout className="flex-1 overflow-hidden">
                <SidebarSwitch />
                <SidebarInset className="max-md:!mt-0">
                  <MobileMenuOverlay>{children}</MobileMenuOverlay>
                </SidebarInset>
              </SidebarLayout>
            </MobileLayoutWrapper>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
