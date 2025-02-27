"use client";

import * as React from "react";
import {
  Coffee,
  DollarSign,
  Layers,
  LayoutDashboard,
  Users,
  PlusCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";

const sidebarData = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Waiters",
      url: "/admin/waiters",
      icon: Users,
      items: [
        {
          title: "All Waiters",
          url: "/admin/waiters",
        },
        {
          title: "Add Waiter",
          url: "/admin/waiters/add",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Tables",
      url: "/admin/tables",
      icon: Layers,
      items: [
        {
          title: "All Tables",
          url: "/admin/tables",
        },
        {
          title: "Add Table",
          url: "/admin/tables/add",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Food & Drinks",
      url: "/admin/foods",
      icon: Coffee,
      items: [
        {
          title: "All Items",
          url: "/admin/foods",
        },
        {
          title: "Add Item",
          url: "/admin/foods/add",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Layers,
      items: [
        {
          title: "All Categories",
          url: "/admin/categories",
        },
        {
          title: "Add Category",
          url: "/admin/categories/add",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Finances",
      url: "/admin/finances",
      icon: DollarSign,
      items: [
        {
          title: "Summary by Waiter",
          url: "/admin/finances",
        },
        {
          title: "Food Sales Report",
          url: "/admin/finances/food-sales",
        },
      ],
    },
  ],
};

export default function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider >
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="p-4 text-lg font-semibold">
          Admin Dashboard
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={sidebarData.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
