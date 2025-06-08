// app/dashboard/layout.js
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import { Inter } from "next/font/google";
import Toaster from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/store/providers";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "BluePrint - Dashbaord Professional Project Management",
  description: "Manage your projects, clients and team efficiently",
};
export default function DashboardLayout({ children }) {
  return (
    <html lang="en"  cz-shortcut-listen="true" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SidebarProvider
              style={{
                "--sidebar-width": "calc(var(--spacing) * 50)",
                "--header-height": "calc(var(--spacing) * 12)",
              }}
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                <main className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                      {children}
                    </div>
                  </div>
                </main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
    // <SidebarProvider
    //   style={{
    //     "--sidebar-width": "calc(var(--spacing) * 50)",
    //     "--header-height": "calc(var(--spacing) * 12)",
    //   }}
    // >
    //   <AppSidebar variant="inset" />
    //   <SidebarInset>
    //     <SiteHeader />
    //     <main className="flex flex-1 flex-col">
    //       <div className="@container/main flex flex-1 flex-col gap-2">
    //         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    //           {children}
    //         </div>
    //       </div>
    //     </main>
    //   </SidebarInset>
    // </SidebarProvider>
  );
}
