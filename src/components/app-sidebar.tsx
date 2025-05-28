// src/components/app-sidebar.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  // Example icons from your original AppSidebar data structure
  GalleryVerticalEnd, 
  AudioWaveform,
  Command,
  // Import LucideIcon type for strong typing
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main"; // Your existing NavMain component
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Import the admin navigation items and their specific types
import { ADMIN_NAV_ITEMS, type AdminNavItem, type AdminSubNavItem } from "@/features/admin/layout/adminNavItems";

// Sample data for non-admin parts of the sidebar (adjust or make dynamic as needed)
const sampleUserData = {
  name: "Admin User", // Replace with actual user data from context or props
  email: "admin@sheukvete.com",
  avatar: "/avatars/shadcn.jpg", // Placeholder, use actual user avatar
};

const sampleTeamSwitcherData = [
  { name: "Sheukvete Restaurant", logo: GalleryVerticalEnd, plan: "Admin Panel" },
  // { name: "Other Team", logo: AudioWaveform, plan: "Some Plan" },
];

// This interface should precisely match the item structure NavMain expects
interface NavMainDisplayItem {
  title: string;
  url: string;
  icon?: LucideIcon; // Correctly typed as LucideIcon
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[]; // Sub-items also need to match NavMain
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Map ADMIN_NAV_ITEMS to the structure NavMain expects, and set isActive
  const navMainItems: NavMainDisplayItem[] = ADMIN_NAV_ITEMS.map(
    (item: AdminNavItem): NavMainDisplayItem => {
      // Determine if the current item or one of its sub-items is active
      let isActive = pathname === item.url;
      if (!isActive && item.items) {
        isActive = item.items.some(subItem => pathname === subItem.url || pathname.startsWith(subItem.url + "/"));
      }
      // A more precise check for parent active state
      if (!isActive && item.url !== "/admin" && pathname.startsWith(item.url + "/")) {
          isActive = true;
      }
       // Special case for exact match of /admin for dashboard
      if (item.url === "/admin" && pathname !== "/admin" && pathname.startsWith("/admin/")) {
        isActive = false; // Dashboard is only active if path is exactly /admin
      }
       if (item.url === "/admin" && pathname === "/admin" ) {
        isActive = true; 
      }


      return {
        title: item.title,
        url: item.url,
        icon: item.icon, // item.icon is already LucideIcon | undefined from AdminNavItem
        isActive: isActive,
        items: item.items?.map((subItem: AdminSubNavItem) => ({
          title: subItem.title,
          url: subItem.url,
          isActive: pathname === subItem.url || pathname.startsWith(subItem.url + "/"),
        })),
      };
    }
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sampleTeamSwitcherData} />
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the processed (and correctly typed) admin navigation items to NavMain */}
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sampleUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}