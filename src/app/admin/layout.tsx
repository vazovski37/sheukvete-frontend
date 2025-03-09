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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current route
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "admin"); 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Sidebar */}
        <AppSidebar />

        {/* SidebarInset requires a single child → Wrap content in a div */}
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            {/* Header with Breadcrumbs */}
            <header className="flex h-16 items-center gap-2 px-4 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              {/* Sidebar Toggle Button */}
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />

              {/* Breadcrumbs Navigation */}
              <Breadcrumb>
                <BreadcrumbList>
                  {/* Home / Admin Link */}
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/admin">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {/* Dynamically Generated Breadcrumbs */}
                  {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const formattedSegment = segment.replace(/-/g, " ").toUpperCase();

                    return (
                      <span key={href} className="flex items-center">
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
                      </span>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-6 w-full">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
