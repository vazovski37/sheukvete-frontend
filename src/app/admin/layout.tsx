// src/app/admin/layout.tsx
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react"; // Ensured React is imported

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  // Your existing breadcrumb logic
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "admin"); 

  const breadcrumbLinks = pathSegments.map((segment, index) => {
    // Construct the href for the link.
    // Note: This assumes your admin sub-routes are directly under /admin/segment...
    // If your actual URLs are /segment (without /admin prefix for links), this needs adjustment.
    // Given pathSegments filters out "admin", the href should probably be prefixed with "/admin/"
    const subPath = pathSegments.slice(0, index + 1).join("/");
    const href = `/admin/${subPath}`; 
    const isLast = index === pathSegments.length - 1;
    // Capitalize first letter, replace hyphens with spaces
    const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    return (
      <React.Fragment key={href}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={href}>{formattedSegment}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
        {/* Sidebar */}
        <AppSidebar /> {/* This AppSidebar will be updated to use adminNavItems */}

        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center gap-2 px-4 border-b bg-card sticky top-0 z-30">
              <SidebarTrigger className="-ml-1" /> {/* Adjusted for md:hidden */}
              <Separator orientation="vertical" className="mr-2 h-4 md:hidden" /> {/* Adjusted for md:hidden */}

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/admin">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbLinks}
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <main className="flex-1 p-4 md:p-6 w-full"> {/* Added bg-muted/40 for content area */}
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}