import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers/Providers";
import { SidebarProvider, SidebarInset, SidebarLayout } from "@plexui/ui/components/Sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

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
          <div className="flex h-dvh flex-col">
            <Navbar />
            <SidebarProvider collapsible="none" className="flex-1 overflow-hidden">
              <SidebarLayout className="flex-1 overflow-hidden">
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
              </SidebarLayout>
            </SidebarProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
